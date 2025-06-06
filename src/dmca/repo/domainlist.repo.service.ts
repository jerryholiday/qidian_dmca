import { Injectable } from '@nestjs/common';
import { DomainListEntity } from '../entities/domainlist';
import { DataSource, In } from 'typeorm';

@Injectable()
export class DomainlistRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<DomainListEntity>(DomainListEntity);
  }

  bulkSelect(hostnames: string[]) {
    return this.repo.find({ where: { hostname: In(hostnames) } });
  }

  insertSkipErrors(data: Pick<DomainListEntity, 'hostname' | 'isPirated'>[]) {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(DomainListEntity)
      .values(data)
      .orIgnore()
      .execute();
  }
}
