import { Injectable } from '@nestjs/common';
import { GoogleDMCAListEntity } from '../entities/googledmcalist.entity';
import { DataSource } from 'typeorm';

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
}
