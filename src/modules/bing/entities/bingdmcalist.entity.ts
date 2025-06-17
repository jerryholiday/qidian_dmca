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
  name: 'qidian_dmca_bing_list',
  comment: '起点 DMCA Bing投诉列表',
})
export class BingDMCAListEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '自增长 ID' })
  id: string;

  @Column('bigint', { comment: 'QDBID' })
  bookId: string;

  @Column('json', { comment: '盗版链接列表' })
  infringingURLs: string[];

  @Column('int', { comment: '链接数量', default: 0 })
  infringingURLCount: number;

  @Index('idx_isfinish')
  @Column('tinyint', { comment: '是否完成', default: 0 })
  isFinish: number;

  @Column('varchar', { length: 500, comment: '起点正版链接' })
  originalURL: string;

  @Column('varchar', { length: 500, comment: '操作账号', nullable: true })
  operator?: string | null;

  @Column('varchar', {
    name: 'notice_id',
    length: 500,
    comment: '报告ID',
    nullable: true,
  })
  noticeId?: string | null;

  @Column('date', { comment: '日期时间' })
  dateTime: Date;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
