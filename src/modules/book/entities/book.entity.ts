import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'dmca', name: 'qidian_book', comment: '起点 DMCA 书单' })
export class BookEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '自增长 ID' })
  id: string;

  @Index('unq_cbid', { unique: true })
  @Column('bigint', { comment: 'CBID' })
  cbid: string;

  @Column('varchar', { comment: '作品名称' })
  title: string;

  @Column('bigint', { comment: '起点 BID' })
  qdbid: string;

  @Column('bigint', { comment: 'QQ阅读 BID' })
  csbid: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
