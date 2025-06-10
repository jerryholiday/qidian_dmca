import { Injectable } from '@nestjs/common';
import { HostlistEntity } from '../entities/hostlist.entity';
import { DataSource, In } from 'typeorm';

@Injectable()
export class HostlistRepoService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository<HostlistEntity>(HostlistEntity);
  }

  bulkSelect(hostnames: string[]) {
    return this.repo.find({ where: { hostname: In(hostnames) } });
  }

  insertSkipErrors(data: Pick<HostlistEntity, 'hostname' | 'isPirated'>[]) {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(HostlistEntity)
      .values(data)
      .orIgnore()
      .execute();
  }
}
