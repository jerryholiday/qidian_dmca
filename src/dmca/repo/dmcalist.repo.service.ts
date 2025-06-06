import { Injectable } from '@nestjs/common';
import { DMCAListEntity } from '../entities/dmcalist.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class DMCAListRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<DMCAListEntity>(DMCAListEntity);
  }

  insert(data: Omit<DMCAListEntity, 'id' | 'createTime' | 'updateTime'>) {
    return this.repo.insert(data);
  }
}
