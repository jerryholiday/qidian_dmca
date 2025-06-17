import { Injectable } from '@nestjs/common';
import * as json2md from 'json2md';
import { sendMkNotification } from 'src/utils';
import { HrefObj } from 'src/interfaces';
import { GoogleDMCALinkRepoService } from './repo/googledmcalink.repo.service';
import { GoogleDMCAListRepoService } from './repo/googledmcalist.repo.service';
import { BookService } from '../book/book.service';
import { HostlistService } from '../hostlist/hostlist.service';
import { GoogleAccountRepoService } from './repo/googleaccount.repo.service';
import { In } from 'typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class GoogleDMCAService {
  private readonly EACH_DMCA_LIST_MAX_COUNT = 100;
  private readonly WEBHOOK =
    'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=a159eb04-dfe9-41f0-abd5-7280d5ef9bfe';

  constructor(
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
   * @param hrefs
   * @returns
   */
  async submitBookHref(cbid: string, hrefs: HrefObj[]) {
    const book = await this.bookService.bookRepo.selectOne({ cbid });
    if (!book) return;

    // 盗版链接
    let piratedHrefList: (HrefObj & { hostname: string })[] = [];
    // 新增盗版链接数
    let newPiratedHrefList: (HrefObj & { hostname: string })[] = [];
    // 异常
    let errmsg = '';

    try {
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

      // 盗版链接
      piratedHrefList = await this.hostlistService.checkPiratedURLList(
        book.cbid,
        book.title,
        hrefList,
      );

      console.log(
        `提交数: ${hrefs.length}; 盗版链接数： ${piratedHrefList.length}`,
      );

      if (piratedHrefList.length) {
        // 先查是否有重复数据
        const alreadyExistedLink = await this.dmcaLinkRepo.bulkSelect(
          {
            url: In(piratedHrefList.map((item) => item.href)),
          },
          ['url'],
        );

        // 新增的盗版链接
        newPiratedHrefList = piratedHrefList.filter(
          (item) => !alreadyExistedLink.some((a) => a.url === item.href),
        );
        if (!newPiratedHrefList.length) return;

        await this.dmcaLinkRepo.insertSkipErrors(
          newPiratedHrefList.map((hrefObj) => ({
            bookId: book.qdbid,
            url: hrefObj.href,
            title: hrefObj.title,
          })),
        );

        // 未完成的 dmcaList
        const unfinishedDmcaList = await this.dmcaListRepo.selectOne({
          bookId: book.qdbid,
          isFinish: 0,
        });
        if (
          unfinishedDmcaList &&
          unfinishedDmcaList.infringingURLCount < this.EACH_DMCA_LIST_MAX_COUNT
        ) {
          const infringingURLs = unfinishedDmcaList.infringingURLs
            // TODO: 和 bing 数据结构不同
            .split('\n')
            .concat(
              newPiratedHrefList
                .slice(
                  0,
                  this.EACH_DMCA_LIST_MAX_COUNT -
                    unfinishedDmcaList.infringingURLCount,
                )
                .map((item) => item.href),
            );
          // 更新盗版链接
          await this.dmcaListRepo.update(unfinishedDmcaList.id, {
            infringingURLs: infringingURLs.join('\n'),
            infringingURLCount: infringingURLs.length,
          });

          // 剩下的盗版链接新存一条数据
          const leftNewPiratedHrefList = newPiratedHrefList.slice(
            this.EACH_DMCA_LIST_MAX_COUNT -
              unfinishedDmcaList.infringingURLCount,
          );
          if (leftNewPiratedHrefList.length) {
            await this.dmcaListRepo.insert({
              bookId: book.qdbid,
              originalURL: `https://www.qidian.com/book/${book.qdbid}/`,
              // TODO: 和 bing 数据库不同的地方
              infringingURLs: leftNewPiratedHrefList
                .map((item) => item.href)
                .join('\n'),
              infringingURLCount: newPiratedHrefList.length,
              isFinish: 0,
              dateTime: new Date(),
            });
          }
        } else {
          await this.dmcaListRepo.insert({
            bookId: book.qdbid,
            originalURL: `https://www.qidian.com/book/${book.qdbid}/`,
            // TODO: 和 bing 数据库不同的地方
            infringingURLs: newPiratedHrefList
              .map((item) => item.href)
              .join('\n'),
            infringingURLCount: newPiratedHrefList.length,
            isFinish: 0,
            dateTime: new Date(),
          });
        }
      }
    } catch (e) {
      errmsg = (e as Error).message;
    } finally {
      await sendMkNotification(
        'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=a159eb04-dfe9-41f0-abd5-7280d5ef9bfe',
        json2md([
          { h1: `[Google]《${book.title}》提交盗版链接` },
          { blockquote: `爬取链接数: ${hrefs.length}` },
          { blockquote: `盗版链接数: ${piratedHrefList.length}` },
          { blockquote: `新增盗版链接数: ${newPiratedHrefList.length}` },
          {
            blockquote: `新增盗版链接(前10个): ${newPiratedHrefList
              .slice(0, 10)
              .map((item) => item.href)
              .join()}`,
          },
          {
            blockquote: `异常: ${errmsg}`,
          },
        ]),
      );
    }
  }

  /**
   * 投诉后的回调
   * @param dmcaListId
   */
  async complaintCallback(
    dmcaListId: string,
    operator: string,
    noticeId: string,
  ) {
    const dmcaList = await this.dmcaListRepo.selectOne({ id: dmcaListId });
    if (!dmcaList) return;

    await this.dmcaListRepo.update(dmcaListId, {
      isFinish: 1,
      operator,
      noticeId,
      dateTime: new Date(),
    });

    await sendMkNotification(
      this.WEBHOOK,
      json2md([
        { h1: `[Bing DMCA] 投诉成功` },
        { blockquote: `报告ID: ${noticeId}` },
        { blockquote: `投诉账号: ${operator}` },
        { blockquote: `时间: ${dayjs().format('YYYY-MM-DD HH:mm')}` },
      ]),
    );
  }
}
