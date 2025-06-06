1. http 拉取书单
2. http 拉取泛化 query 列表
3. 两层循环， 书名+泛化 query 作为搜索词，打开 google 搜索
4. 爬取前 3 页链接
5. [服务处理前三页链接]： checklist 里检查是否存在，不存的链接请求盗版服务判断，更新 checklist，盗版链接存入 dmcalist
6. [zoonopost]: 拉取 dmcalist 中未处理的链接投诉，更新状态
