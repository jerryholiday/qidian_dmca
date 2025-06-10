import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GoogleDMCALinkEntity } from '../entities/googledmcalink.entity';

@Injectable()
export class GoogleDMCALinkRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<GoogleDMCALinkEntity>(
      GoogleDMCALinkEntity,
    );
  }

  insertSkipErrors(
    data: Pick<GoogleDMCALinkEntity, 'bookId' | 'title' | 'url'>[],
  ) {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(GoogleDMCALinkEntity)
      .values(data)
      .orIgnore()
      .execute();
  }
}
