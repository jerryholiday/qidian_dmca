import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DMCAListEntity } from '../entities/dmcalist.entity';

@Injectable()
export class DMCAListRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<DMCAListEntity>(DMCAListEntity);
  }

  insertSkipErrors(data: Pick<DMCAListEntity, 'cbid' | 'title' | 'url'>[]) {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(DMCAListEntity)
      .values(data)
      .orIgnore()
      .execute();
  }
}
