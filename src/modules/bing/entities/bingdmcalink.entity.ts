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
  name: 'qidian_dmca_bing_link',
  comment: '起点 DMCA Bing投诉链接列表',
})
export class BingDMCALinkEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '自增长 ID' })
  id: string;

  @Index('idx_bookid')
  @Column('bigint', { name: 'book_id', comment: 'QDBID' })
  bookId: string;

  @Index('idx_url', { unique: true })
  @Column('varchar', { length: 500, comment: '链接' })
  url: string;

  @Column('varchar', { length: 255, comment: '页面名称' })
  title: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
