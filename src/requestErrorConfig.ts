import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

interface ResponseStructure {
  code: number;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  message?: string;
  description?: string;
  timestamp?: string;
  path?: string;
  showType?: ErrorShowType;
}

export const errorConfig: RequestConfig = {
  errorThrower: (res) => {
    const { code, data, errorCode, errorMessage, message: msg, description } = res as unknown as ResponseStructure;
    // 后端返回 code === 0 表示成功
    if (code !== 0) {
      const error: any = new Error(errorMessage || msg || description);
      error.name = 'BizError';
      error.info = { errorCode, errorMessage: errorMessage || msg || description, data };
      throw error;
    }
  },
  errorHandler: (error: any, opts: any) => {
    if (opts?.skipErrorHandler) throw error;
    if (error.name === 'BizError') {
      const errorInfo: ResponseStructure | undefined = error.info;
      if (errorInfo) {
        const { errorMessage } = errorInfo;
        message.error(errorMessage || '请求失败');
      }
    } else if (error.response) {
      message.error(`Response status: ${error.response.status}`);
    } else if (error.request) {
      message.error('None response! Please retry.');
    } else {
      message.error('Request error, please retry.');
    }
  },

  requestInterceptors: [
    (config: RequestOptions) => {
      return { ...config };
    },
  ],

  responseInterceptors: [
    (response) => {
      // 直接检查 response 中的 code，而不是 data 中的 code
      const res = response as unknown as ResponseStructure;
      if (res.code !== 0) {
        message.error(res.message || res.description || '请求失败！');
      }
      return response;
    },
  ],
};
