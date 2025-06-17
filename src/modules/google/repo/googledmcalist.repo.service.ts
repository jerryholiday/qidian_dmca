import { Injectable } from '@nestjs/common';
import { GoogleDMCAListEntity } from '../entities/googledmcalist.entity';
import { DataSource, FindOneOptions } from 'typeorm';

@Injectable()
export class GoogleDMCAListRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<GoogleDMCAListEntity>(
      GoogleDMCAListEntity,
    );
  }

  insert(data: Omit<GoogleDMCAListEntity, 'id' | 'createTime' | 'updateTime'>) {
    return this.repo.insert(data);
  }

  selectOne(condition: FindOneOptions<GoogleDMCAListEntity>['where']) {
    return this.repo.findOne({ where: condition });
  }

  update(id: string, data: Partial<GoogleDMCAListEntity>) {
    return this.repo
      .createQueryBuilder()
      .update(GoogleDMCAListEntity)
      .set(data)
      .where({ id })
      .execute();
  }
}
