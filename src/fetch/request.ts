import { request } from 'umi'

export default function fetch(url, Options) {
  return request(url, Options).then(res => {
    return res;
  })
}