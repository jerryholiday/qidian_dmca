import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DMCALinkEntity } from '../entities/dmcalink.entity';

@Injectable()
export class DMCALinkRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<DMCALinkEntity>(DMCALinkEntity);
  }

  insertSkipErrors(data: Pick<DMCALinkEntity, 'bookId' | 'title' | 'url'>[]) {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(DMCALinkEntity)
      .values(data)
      .orIgnore()
      .execute();
  }
}
