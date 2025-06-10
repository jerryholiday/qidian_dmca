import { createHash } from 'node:crypto';
import axios from 'axios';

export const md5 = (str: string) => {
  const hash = createHash('md5');
  hash.update(str);
  return hash.digest('hex');
};

export const sendMkNotification = (webhook: string, md: string) => {
  return axios({
    url: webhook,
    method: 'POST',
    data: {
      msgtype: 'markdown',
      markdown: { content: md },
    },
  });
};

export const sendTextNotification = (webhook: string, text: string) => {
  return axios({
    url: webhook,
    method: 'POST',
    data: {
      msgtype: 'text',
      text: { content: text },
    },
  });
};
