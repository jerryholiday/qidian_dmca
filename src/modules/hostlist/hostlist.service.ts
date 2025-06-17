import { Injectable } from '@nestjs/common';
import { HostlistRepoService } from './repo/hostlist.repo.service';
import { md5 } from 'src/utils';
import { stringify } from 'querystring';
import { HttpService } from '@nestjs/axios';
import { UrlIsPiratedTypeEnum } from 'src/constants';
import { lastValueFrom, map } from 'rxjs';
import { uniq } from 'lodash';
import { HrefObj } from 'src/interfaces';

@Injectable()
export class HostlistService {
  constructor(
    private readonly httpService: HttpService,
    public readonly hostlistRepo: HostlistRepoService,
  ) {}

  /**
   * 检查 hrefList 对象列表中盗版链接
   * @param hrefList
   */
  async checkPiratedURLList(
    cbid: string,
    title: string,
    hrefList: (HrefObj & { hostname: string })[],
  ) {
    // 检查数据库里的 domainlist 是否有
    const domains = await this.hostlistRepo.bulkSelect(
      uniq(hrefList.map((item) => item.hostname)),
    );

    // 已知盗版链接
    const piratedHrefList = hrefList.filter((hrefObj) =>
      domains.some(
        (item) => item.hostname === hrefObj.hostname && item.isPirated === 1,
      ),
    );

    // 未知链接
    const unkonwHrefList = hrefList.filter(
      (hrefObj) => !domains.some((item) => item.hostname === hrefObj.hostname),
    );

    if (unkonwHrefList.length) {
      // 请求防盗接口判断是否盗版
      const tasks = unkonwHrefList.map(async (hrefObj) => {
        const piratedCode = await this.checkIsPirated(
          hrefObj.href,
          hrefObj.title,
          title,
          cbid,
        );
        return { ...hrefObj, piratedCode };
      });
      const list = await Promise.all(tasks);

      // 非盗版存到白名单中
      const notPiratedHostnames = list
        .filter((item) => item.piratedCode === UrlIsPiratedTypeEnum.NOT_PIRATED)
        .map((item) => item.hostname);
      if (notPiratedHostnames.length) {
        await this.hostlistRepo.insertSkipErrors(
          notPiratedHostnames.map((hostname) => ({ hostname, isPirated: 0 })),
        );
      }

      // 盗版存到黑名单中
      const piratedHostnames = list
        .filter((item) => item.piratedCode === UrlIsPiratedTypeEnum.PIRATED)
        .map((item) => item.hostname);
      if (piratedHostnames.length) {
        await this.hostlistRepo.insertSkipErrors(
          piratedHostnames.map((hostname) => ({ hostname, isPirated: 1 })),
        );
      }

      // 返回所有的盗版链接
      return piratedHrefList.concat(
        list.filter(
          (item) => item.piratedCode === UrlIsPiratedTypeEnum.PIRATED,
        ),
      );
    }

    return piratedHrefList;
  }

  /**
   * 检查链接是否盗版
   * @param webUrl
   * @param title
   * @param bookName
   * @param cbid
   * @param authorName
   * @returns
   */
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

    return res.code;
  }
}
