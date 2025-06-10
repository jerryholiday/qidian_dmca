import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, FindOneOptions } from 'typeorm';
import { BookEntity } from '../entities/book.entity';

@Injectable()
export class BookRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<BookEntity>(BookEntity);
  }

  selectOne(condition: FindOneOptions<BookEntity>['where']) {
    return this.repo.findOne({ where: condition });
  }

  select(
    pageNum = 1,
    pageSize = 10,
    condition: FindManyOptions<BookEntity>['where'] = {},
    selection?: FindManyOptions<BookEntity>['select'],
  ) {
    const options: FindManyOptions<BookEntity> = {
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      where: condition,
    };
    if (selection) {
      options.select = selection;
    }
    return this.repo.find(options);
  }
}
