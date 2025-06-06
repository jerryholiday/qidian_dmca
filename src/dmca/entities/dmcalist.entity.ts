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
  name: 'qidian_dmca_list',
  comment: '起点 DMCA 投诉链接列表',
})
export class DMCAListEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '自增长 ID' })
  id: string;

  @Index('idx_cbid')
  @Column('bigint', { comment: 'CBID' })
  cbid: string;

  @Index('idx_url', { unique: true })
  @Column('varchar', { length: 500, comment: '链接' })
  url: string;

  @Column('varchar', { length: 255, comment: '页面名称' })
  title: string;

  @Index('idx_status')
  @Column('tinyint', { comment: '是否投诉 0：未投诉；1：已投诉', default: 0 })
  status: 0 | 1;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
