import { Injectable } from '@nestjs/common';
import { BingDMCAListEntity } from '../entities/bingdmcalist.entity';
import { DataSource } from 'typeorm';

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
}
