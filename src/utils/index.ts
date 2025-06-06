import { createHash } from 'node:crypto';

export const md5 = (str: string) => {
  const hash = createHash('md5');
  hash.update(str);
  return hash.digest('hex');
};
