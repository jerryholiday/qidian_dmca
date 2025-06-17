import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions } from 'typeorm';
import { GoogleDMCALinkEntity } from '../entities/googledmcalink.entity';

@Injectable()
export class GoogleDMCALinkRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<GoogleDMCALinkEntity>(
      GoogleDMCALinkEntity,
    );
  }

  bulkSelect(
    condition: FindManyOptions<GoogleDMCALinkEntity>['where'],
    selection?: FindManyOptions<GoogleDMCALinkEntity>['select'],
  ) {
    const options: FindManyOptions<GoogleDMCALinkEntity> = {
      where: condition,
    };
    if (selection) {
      options.select = selection;
    }
    return this.repo.find(options);
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
