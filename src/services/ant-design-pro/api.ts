// @ts-ignore
/* eslint-disable */
import request from '@/plugin/GlobalRequest';
/** 获取当前的用户 GET /api/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
export async function login(
  body: {
    userAccount: string;
    userPassword: string;
  },
  options?: { [key: string]: any },
) {
  // 转换参数为后端期望的格式
  const transformedBody = {
    username: body.userAccount,
    password: body.userPassword,
  };
  return request<API.LoginResult>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: transformedBody,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/user/register */
export async function register(
  body: {
    userAccount: string;
    userPassword: string;
    checkPassword: string;
    email?: string;
    phone?: string;
    nickname: string;
  },
  options?: { [key: string]: any },
) {
  // 转换参数为后端期望的格式
  const transformedBody = {
    username: body.userAccount,
    password: body.userPassword,
    confirmPassword: body.checkPassword,
    email: body.email || '',
    phone: body.phone || '',
    nickname: body.nickname,
  };
  return request<API.LoginResult>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: transformedBody,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 搜索用户接口 GET /api/user/list*/
export async function searchUser(params?: { [key: string]: any }) {
  return request<API.SearchUserResponse>('/api/user/list', {
    method: 'GET',
    params,
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
