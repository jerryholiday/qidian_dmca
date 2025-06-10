import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  database: 'dmca',
  name: 'qidian_dmca_google_account',
  comment: '起点 DMCA Google账号',
})
export class GoogleAccountEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '自增长 ID' })
  id: string;

  @Index('unq_account', { unique: true })
  @Column('varchar', { comment: '账号' })
  account: string;

  @Column('varchar', { length: 500, comment: '密码' })
  password: string;

  @Index('dix_isdeprecated')
  @Column('tinyint', { comment: '是否过期', default: 0 })
  isDeprecated: number;

  @Column('datetime', { comment: '上次使用时间', nullable: true })
  lastUsedTime: Date;

  @Column('datetime', { comment: '上次检查时间', nullable: true })
  lastCheckTime: Date;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
