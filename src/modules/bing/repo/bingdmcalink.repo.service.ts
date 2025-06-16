import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BingDMCALinkEntity } from '../entities/bingdmcalink.entity';

@Injectable()
export class BingDMCALinkRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<BingDMCALinkEntity>(
      BingDMCALinkEntity,
    );
  }

  insertSkipErrors(
    data: Pick<BingDMCALinkEntity, 'bookId' | 'title' | 'url'>[],
  ) {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(BingDMCALinkEntity)
      .values(data)
      .orIgnore()
      .execute();
  }
}
