import { Injectable } from '@nestjs/common';
import { BookRepoService } from './repo/book.repo.service';
import { GeneralQueryRepoService } from './repo/generalQuery.repo.service';
import { FindManyOptions } from 'typeorm';
import { BookEntity } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    public readonly bookRepo: BookRepoService,
    public readonly generalQueryRepo: GeneralQueryRepoService,
  ) {}

  /**
   * 分页查询书单列表
   * @param pageNum
   * @param pageSize
   * @param cbid
   * @param title
   * @returns
   */
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

  /**
   * 分页查询泛化query列表
   * @param pageNum
   * @param pageSize
   * @returns
   */
  queryGeneralQueries(pageNum = 1, pageSize = 10) {
    return this.generalQueryRepo.select(pageNum, pageSize);
  }
}
