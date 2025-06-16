import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { uniq, uniqBy } from 'lodash';
import * as json2md from 'json2md';
import { lastValueFrom, map } from 'rxjs';
import { md5, sendMkNotification } from 'src/utils';
import { UrlIsPiratedTypeEnum } from 'src/constants';
import { HrefObj } from 'src/interfaces';
import { GoogleDMCALinkRepoService } from './repo/googledmcalink.repo.service';
import { GoogleDMCAListRepoService } from './repo/googledmcalist.repo.service';
import { BookService } from '../book/book.service';
import { HostlistService } from '../hostlist/hostlist.service';
import { GoogleAccountRepoService } from './repo/googleaccount.repo.service';

@Injectable()
export class GoogleDMCAService {
  constructor(
    private readonly httpService: HttpService,
    private readonly bookService: BookService,
    private readonly hostlistService: HostlistService,
    public readonly accountRepo: GoogleAccountRepoService,
    public readonly dmcaLinkRepo: GoogleDMCALinkRepoService,
    public readonly dmcaListRepo: GoogleDMCAListRepoService,
  ) {}

  /**
   * 获取一个可用的账号
   * @returns
   */
  getAccount() {
    return this.accountRepo.selectOne();
  }

  /**
   * 提交盗版链接
   * @param cbid
   * @param title
   * @param hrefs
   * @returns
   */
  async submitBookHref(cbid: string, title: string, hrefs: HrefObj[]) {
    const book = await this.bookService.bookRepo.selectOne({ cbid });
    if (!book) return;

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
    const domains = await this.hostlistService.hostlistRepo.bulkSelect(
      uniq(hrefList.map((item) => item.hostname)),
    );

    // 盗版链接对象列表
    const piratedHrefList = hrefList.filter((hrefObj) =>
      domains.some(
        (item) => item.hostname === hrefObj.hostname && item.isPirated === 1,
      ),
    );

    console.log(`盗版链接数量： ${piratedHrefList.length}`);
    if (piratedHrefList.length) {
      // 先插入数据库
      await this.dmcaLinkRepo.insertSkipErrors(
        piratedHrefList.map((hrefObj) => ({
          bookId: book.qdbid,
          url: hrefObj.href,
          title: hrefObj.title,
        })),
      );
      await this.dmcaListRepo.insert({
        bookId: book.qdbid,
        originalURL: `https://www.qidian.com/book/${book.qdbid}/`,
        infringingURLs: piratedHrefList.map((item) => item.href).join('\n'),
        isFinish: 0,
        dateTime: new Date(),
      });

      await sendMkNotification(
        'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=a159eb04-dfe9-41f0-abd5-7280d5ef9bfe',
        json2md([
          { h1: `[Google]《${book.title}》提交盗版链接` },
          { blockquote: `盗版链接数: ${piratedHrefList.length}` },
          {
            blockquote: `盗版链接(前10个): ${piratedHrefList
              .slice(0, 10)
              .map((item) => item.href)
              .join()}`,
          },
        ]),
      );
    }

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
        book.qdbid,
      );
      return { ...hrefObj, isPirated };
    });
    const list = await Promise.all(tasks);

    await this.hostlistService.hostlistRepo.insertSkipErrors(
      uniqBy(list, (item) => item.hostname).map((item) => ({
        hostname: item.hostname,
        isPirated: item.isPirated ? 1 : 0,
      })),
    );

    await this.dmcaLinkRepo.insertSkipErrors(
      list
        .filter((item) => item.isPirated)
        .map((item) => ({
          bookId: book.qdbid,
          url: item.href,
          title: item.title,
        })),
    );
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
    return res.code === UrlIsPiratedTypeEnum.PIRATED;
  }
}
