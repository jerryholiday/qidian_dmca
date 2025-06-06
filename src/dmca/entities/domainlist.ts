import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'dmca', name: 'domain_list', comment: '域名列表' })
export class DomainListEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '自增长 ID' })
  id: string;

  @Index('unq_hostname', { unique: true })
  @Column('varchar', { length: 255, comment: '域名' })
  hostname: string;

  @Column('tinyint', { name: 'is_pirated', comment: '是否盗版;0:否 1：是' })
  isPirated: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
