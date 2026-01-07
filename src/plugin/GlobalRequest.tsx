import { history } from '@umijs/max';
import { message } from 'antd';
import { extend } from 'umi-request';

const request = extend({
  credentials: 'include',
  prefix: process.env.NODE_ENV === 'production' ? 'http://user-backend.cn' : undefined,
});

request.interceptors.request.use((url, options) => {
  console.log('do request url={}', url);
  return {
    url,
    options: {
      ...options,
    },
    interceptors: true,
  };
});

request.interceptors.response.use(async (response) => {
  const res = await response.clone().json();
  // 后端返回格式: { code: 0, data: any, message: string }
  // code === 0 表示成功
  if (res.code === 0) {
    return res.data;
  }
  // 未登录或登录过期
  if (res.code === 40100) {
    message.error(res.message || '请先登录');
    history.push('/user/login');
  } else {
    message.error(res.message || res.description || '请求失败');
  }
  // 抛出错误，让调用者能够捕获
  throw new Error(res.message || res.description || '请求失败');
});

export default request;
