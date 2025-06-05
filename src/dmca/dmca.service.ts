import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { BookEntity } from './entities/book.entity';
import { BookRepoService } from './repo/book.repo.service';

@Injectable()
export class DmcaService {
  constructor(
    private readonly httpService: HttpService,
    public readonly bookRepo: BookRepoService,
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

  submitBookHref(cbid: string, hrefs: string[]) {}
}
