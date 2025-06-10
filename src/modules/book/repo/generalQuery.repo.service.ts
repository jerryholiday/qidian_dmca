import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GeneralQueryEntity } from '../entities/generalQuery.entity';

@Injectable()
export class GeneralQueryRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<GeneralQueryEntity>(
      GeneralQueryEntity,
    );
  }

  select(pageNum = 1, pageSize = 10) {
    return this.repo.find({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
  }
}
