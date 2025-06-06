import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { stringify } from 'querystring';
import { uniq, uniqBy } from 'lodash';
import { BookEntity } from './entities/book.entity';
import { BookRepoService } from './repo/book.repo.service';
import { GeneralQueryRepoService } from './repo/generalQuery.repo.service';
import { lastValueFrom, map } from 'rxjs';
import { md5 } from 'src/utils';
import { UrlIsPiratedTypeEnum } from 'src/constants';
import { DomainlistRepoService } from './repo/domainlist.repo.service';
import { DMCAListRepoService } from './repo/dmcalist.repo.service';
import { HrefObj } from 'src/interfaces';

@Injectable()
export class DmcaService {
  constructor(
    private readonly httpService: HttpService,
    public readonly bookRepo: BookRepoService,
    public readonly generalQueryRepo: GeneralQueryRepoService,
    public readonly domainlistRepo: DomainlistRepoService,
    public readonly dmcalistRepo: DMCAListRepoService,
  ) {}

  queryBooks(pageNum = 1, pageSize = 10, cbid?: string, title?: string) {
    const condition: FindManyOptions<BookEntity>['where'] = {};
    if (cbid) {
      condition.cbid = cbid;
    }
    if (title) {
      condition.title = title;
    }
    return this.bookRepo.select(pageNum, pageSize, condition);
  }

  queryGeneralQueries(pageNum = 1, pageSize = 10) {
    return this.generalQueryRepo.select(pageNum, pageSize);
  }

  async submitBookHref(cbid: string, title: string, hrefs: HrefObj[]) {
    const hrefList = hrefs
      .map((href) => {
        try {
          const urlObj = new URL(href.href);
          return {
            ...href,
            hostname: urlObj.hostname,
          };
        } catch {
          console.error(`URL不合法： ${href.href}`);
          return null;
        }
      })
      .filter((item) => item !== null);

    // 检查数据库里的 domainlist 是否有
    const domains = await this.domainlistRepo.bulkSelect(
      uniq(hrefList.map((item) => item.hostname)),
    );

    // 盗版链接对象列表
    const piratedHrefList = hrefList.filter((hrefObj) =>
      domains.some(
        (item) => item.hostname === hrefObj.hostname && item.isPirated === 1,
      ),
    );

    // 先插入数据库
    await this.dmcalistRepo.insertSkipErrors(
      piratedHrefList.map((hrefObj) => ({
        cbid,
        url: hrefObj.href,
        title: hrefObj.title,
      })),
    );

    // 需要调用接口判断是否盗版
    const needToCheckHrefList = hrefList.filter(
      (hrefObj) => !domains.some((item) => item.hostname === hrefObj.hostname),
    );

    if (!needToCheckHrefList.length) return;

    const tasks = needToCheckHrefList.map(async (hrefObj) => {
      const isPirated = await this.checkIsPirated(
        hrefObj.href,
        hrefObj.title,
        title,
        cbid,
      );
      return { ...hrefObj, isPirated };
    });
    const list = await Promise.all(tasks);

    await this.domainlistRepo.insertSkipErrors(
      uniqBy(list, (item) => item.hostname).map((item) => ({
        hostname: item.hostname,
        isPirated: item.isPirated ? 1 : 0,
      })),
    );

    await this.dmcalistRepo.insertSkipErrors(
      list
        .filter((item) => item.isPirated)
        .map((item) => ({
          cbid,
          url: item.href,
          title: item.title,
        })),
    );
  }

  private async checkIsPirated(
    webUrl: string,
    title: string,
    bookName: string,
    cbid: string,
    authorName = '',
  ) {
    const timestamp = Date.now();
    const sign = md5(
      'kk%9$k6d@z' + webUrl + bookName + title + authorName + cbid + timestamp,
    );

    const querystring = stringify({
      webUrl,
      bookName,
      title,
      authorName,
      cbid,
      timestamp,
      sign,
    });
    const requestUrl = `https://openapi-watchman.yuewen.com/api/url/checkIsPirated?${querystring}`;

    const res$ = this.httpService
      .get<{ code: UrlIsPiratedTypeEnum }>(requestUrl)
      .pipe(map((response) => response.data));

    const res = await lastValueFrom(res$);
    return res.code === UrlIsPiratedTypeEnum.PIRATED;
  }
}
