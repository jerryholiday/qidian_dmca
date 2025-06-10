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
  name: 'qidian_dmca_google_list',
  comment: '起点 DMCA Google投诉列表',
})
export class GoogleDMCAListEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '自增长 ID' })
  id: string;

  @Column('bigint', { comment: 'QDBID' })
  bookId: string;

  @Column('longtext', { comment: '链接' })
  infringingURLs: string;

  @Index('idx_isfinish')
  @Column('tinyint', { comment: '是否完成', default: 0 })
  isFinish: number;

  @Column('varchar', { length: 500, comment: '起点正版链接' })
  originalURL: string;

  @Column('varchar', { length: 500, comment: '操作账号', nullable: true })
  operator?: string | null;

  @Column('varchar', { length: 500, comment: '链接', nullable: true })
  notice_id?: string | null;

  @Column('date', { comment: '日期时间' })
  dateTime: Date;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
