export enum UrlIsPiratedTypeEnum {
  REQUEST_MD5_ERROR = -3, // 请求链接异常
  REQUEST_ERROR = -2, // 请求异常请重试,
  DISABLED = -1, // 错误链接，提取域名失败！
  NOT_PIRATED = 0, // 非盗版链接
  INDETERMINACY = 1, // 暂不确定是否是盗版链接,
  PIRATED = 2, // 是盗版链接
}
