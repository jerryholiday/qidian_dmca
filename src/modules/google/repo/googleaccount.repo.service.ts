import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GoogleAccountEntity } from '../entities/googleaccount.entity';

@Injectable()
export class GoogleAccountRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<GoogleAccountEntity>(
      GoogleAccountEntity,
    );
  }

  selectOne() {
    return this.repo.findOne({ where: { isDeprecated: 0 } });
  }
}
