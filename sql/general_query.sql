CREATE TABLE `qidian_general_query` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增长 ID',
  `general_query` varchar(255) NOT NULL COMMENT '泛化 query',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_general_query` (`general_query`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='起点DMCA 泛化 query列表';

INSERT INTO `qidian_general_query` (`general_query`) VALUES('笔趣阁'), ('小说'), ('txt下载'), ('免费阅读'), ('txt'), ('在线阅读'), ('笔趣阁无弹窗'), ('小说免费阅读'), ('全文免费阅读');