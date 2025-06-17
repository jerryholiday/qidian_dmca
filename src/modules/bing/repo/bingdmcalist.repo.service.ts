import { Injectable } from '@nestjs/common';
import { BingDMCAListEntity } from '../entities/bingdmcalist.entity';
import { DataSource, FindOneOptions } from 'typeorm';

@Injectable()
export class BingDMCAListRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<BingDMCAListEntity>(
      BingDMCAListEntity,
    );
  }

  insert(data: Omit<BingDMCAListEntity, 'id' | 'createTime' | 'updateTime'>) {
    return this.repo.insert(data);
  }

  selectOne(condition: FindOneOptions<BingDMCAListEntity>['where']) {
    return this.repo.findOne({ where: condition });
  }

  update(id: string, data: Partial<BingDMCAListEntity>) {
    return this.repo
      .createQueryBuilder()
      .update(BingDMCAListEntity)
      .set(data)
      .where({ id })
      .execute();
  }
}
