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
  name: 'qidian_general_query',
  comment: '起点DMCA 泛化 query列表',
})
export class GeneralQueryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '自增长 ID' })
  id: string;

  @Index('unq_general_query', { unique: true })
  @Column('varchar', { name: 'general_query', comment: '泛化 query' })
  generalQuery: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
