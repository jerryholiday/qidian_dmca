import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, FindOneOptions } from 'typeorm';
import { BingDMCALinkEntity } from '../entities/bingdmcalink.entity';

@Injectable()
export class BingDMCALinkRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<BingDMCALinkEntity>(
      BingDMCALinkEntity,
    );
  }

  selectOne(condition: FindOneOptions<BingDMCALinkEntity>['where']) {
    return this.repo.findOne({ where: condition });
  }

  bulkSelect(
    condition: FindManyOptions<BingDMCALinkEntity>['where'],
    selection?: FindManyOptions<BingDMCALinkEntity>['select'],
  ) {
    const options: FindManyOptions<BingDMCALinkEntity> = {
      where: condition,
    };
    if (selection) {
      options.select = selection;
    }
    return this.repo.find(options);
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
