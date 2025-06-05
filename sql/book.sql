CREATE TABLE `qidian_book` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增长 ID',
  `cbid` bigint NOT NULL COMMENT 'CBID',
  `title` varchar(255) NOT NULL COMMENT '作品名称',
  `qdbid` bigint NOT NULL COMMENT '起点 BID',
  `csbid` bigint NOT NULL COMMENT 'QQ阅读 BID',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_cbid` (`cbid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

insert into qidian_book (cbid, title, qdbid, csbid) values('30464307003329507', '捞尸人', '1041637443', '51637401'),
('30947308603255608', '没钱修什么仙？', '1042256511', '52256497'),
('29874241704035808', '夜无疆', '1040765595', '50765373'),
('28977257404805604', '吞噬星空2起源大陆', '1039391177', '49391084'),
('29384463707267604', '大道之上', '1039994731', '49994699'),
('15610037104915904', '绍宋', '1017281778', '27281778');