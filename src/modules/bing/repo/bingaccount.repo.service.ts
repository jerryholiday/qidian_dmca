import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BingAccountEntity } from '../entities/bingaccount.entity';

@Injectable()
export class BingAccountRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<BingAccountEntity>(BingAccountEntity);
  }

  selectOne() {
    return this.repo.findOne({ where: { isDeprecated: 0 } });
  }
}
