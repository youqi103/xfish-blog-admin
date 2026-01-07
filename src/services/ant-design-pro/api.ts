// @ts-ignore
/* eslint-disable */
import request from '@/plugin/GlobalRequest';

// 文章列表响应
type ArticleListResponse = {
  records: any[];
  total: number;
  current: number;
  size: number;
};

// 分类列表响应
type CategoryListResponse = {
  data: any[];
  total: number;
  success: boolean;
};

// 标签列表响应
type TagListResponse = {
  data: any[];
  total: number;
  success: boolean;
};

// 概览统计响应
type OverviewStatisticsResponse = {
  data: {
    articleCount: number;
    commentCount: number;
    viewCount: number;
    userCount: number;
    visitsGrowth?: number;
    totalLikes?: number;
    likesGrowth?: number;
    totalComments?: number;
    commentsGrowth?: number;
    activeUsers?: number;
    usersGrowth?: number;
  };
  success: boolean;
};

// 访问来源响应
type VisitSourcesResponse = {
  data: Array<{
    source: string;
    count: number;
    percentage?: number;
  }>;
  total: number;
  success: boolean;
};
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
  return request<API.LoginResult>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
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
  return request<API.UserPageData>('/api/user/list', {
    method: 'GET',
    params,
  });
}
/** 创建用户 POST /api/user/add */
export async function createUser(body: {
  username: string;
  password: string;
  nickname: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
}) {
  return request<API.BaseResponse<number>>('/api/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/** 更新用户密码 PUT /api/user/password */
export async function updateUserPassword(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/user/password', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 获取用户详情 GET /api/user/get */
export async function getUser(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser>>('/api/user/get', {
    method: 'GET',
    params: { id },
    ...(options || {}),
  });
}

/** 更新用户 POST /api/user/update */
export async function updateUser(
  body: {
    username: string;
    nickname?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role?: string;
    status?: string;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 POST /api/user/delete */
export async function deleteUser(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/user/delete', {
    method: 'POST',
    params: { id },
    ...(options || {}),
  });
}

/** 更新用户角色 POST /api/user/update/role */
export async function updateUserRole(id: number, role: string, options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/user/update/role', {
    method: 'POST',
    params: { id, role },
    ...(options || {}),
  });
}

/** 禁用用户 POST /api/user/disable */
export async function disableUser(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/user/disable', {
    method: 'POST',
    params: { id },
    ...(options || {}),
  });
}

/** 启用用户 POST /api/user/enable */
export async function enableUser(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/user/enable', {
    method: 'POST',
    params: { id },
    ...(options || {}),
  });
}

/** 获取用户日志 GET /api/operation-log/list */
export async function getUserLogs(
  params?: {
    userId?: number;
    current?: number;
    pageSize?: number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<
    API.BaseResponse<{ records: any[]; total: number; current: number; size: number }>
  >('/api/operation-log/list', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 查询文章列表 GET /api/article/list */
export async function queryArticles(
  params?: {
    current?: number;
    pageSize?: number;
    title?: string;
    status?: number;
    categoryId?: number;
    categoryName?: string;
    tags?: string[];
    tagName?: string;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<ArticleListResponse>('/api/article/list', {
    method: 'GET',
    params: {
      current: params?.current || 1,
      pageSize: params?.pageSize || 10,
      title: params?.title,
      status: params?.status !== undefined ? String(params.status) : undefined,
      categoryId: params?.categoryId,
      categoryName: params?.categoryName,
      tags: Array.isArray(params?.tags) ? params.tags.join(',') : params?.tags,
      tagName: params?.tagName,
    },
    ...(options || {}),
  });
}

/** 创建文章 POST /api/article/add */
export async function createArticle(
  body: {
    title: string;
    content: string;
    summary?: string;
    categoryId?: number;
    tags?: string | string[];
    status?: string | number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  // 转换参数为后端期望的格式
  const transformedBody = {
    title: body.title,
    content: body.content,
    summary: body.summary || '',
    categoryId: body.categoryId,
    tags: Array.isArray(body.tags) ? body.tags.join(',') : body.tags,
    status: body.status !== undefined ? String(body.status) : '0',
  };
  return request<API.BaseResponse<number>>('/api/article/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: transformedBody,
    ...(options || {}),
  });
}

/** 更新文章 POST /api/article/update */
export async function updateArticle(
  id: number,
  body: {
    title?: string;
    content?: string;
    summary?: string;
    categoryId?: number;
    tags?: string | string[];
    status?: string | number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  // 转换参数为后端期望的格式
  const transformedBody: any = {};
  if (body.title !== undefined) transformedBody.title = body.title;
  if (body.content !== undefined) transformedBody.content = body.content;
  if (body.summary !== undefined) transformedBody.summary = body.summary;
  if (body.categoryId !== undefined) transformedBody.categoryId = body.categoryId;
  if (body.tags !== undefined) {
    transformedBody.tags = Array.isArray(body.tags) ? body.tags.join(',') : body.tags;
  }
  if (body.status !== undefined) {
    transformedBody.status = String(body.status);
  }

  return request<API.BaseResponse>('/api/article/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { id },
    data: transformedBody,
    ...(options || {}),
  });
}

/** 删除文章 POST /api/article/delete */
export async function deleteArticle(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/article/delete', {
    method: 'POST',
    params: { id },
    ...(options || {}),
  });
}

/** 发布文章 POST /api/article/publish */
export async function publishArticle(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/article/publish', {
    method: 'POST',
    params: { id },
    ...(options || {}),
  });
}

/** 下线文章 POST /api/article/offline */
export async function offlineArticle(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/article/offline', {
    method: 'POST',
    params: { id },
    ...(options || {}),
  });
}

/** 更新文章状态 POST /api/article/update */
export async function updateArticleStatus(
  id: number,
  status: number,
  options?: { [key: string]: any },
) {
  // 根据状态调用不同的接口
  if (status === 1) {
    // 发布
    return publishArticle(id, options);
  } else if (status === 2) {
    // 下架
    return offlineArticle(id, options);
  } else {
    // 草稿状态 - 使用更新接口
    return request<API.BaseResponse>('/api/article/update', {
      method: 'POST',
      params: { id },
      data: { status: '0' },
      ...(options || {}),
    });
  }
}

/** 查询分类列表 GET /api/category/list */
export async function queryCategoriesList(
  params?: {
    current?: number;
    pageSize?: number;
    name?: string;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<CategoryListResponse>('/api/category/list', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 查询所有分类 GET /api/category/all */
export async function queryAllCategories(options?: { [key: string]: any }) {
  const response = await request<any>('/api/category/all', {
    method: 'GET',
    ...(options || {}),
  });
  if (response) {
    const data = Array.isArray(response) ? response : response.data || response.result || [];
    return {
      data: data,
      total: data.length || 0,
      success: response.success !== false,
    };
  }
  return {
    data: [],
    total: 0,
    success: false,
  };
}

/** 查询标签列表 GET /api/tag/list */
export async function queryTagsList(
  params?: {
    current?: number;
    pageSize?: number;
    name?: string;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<TagListResponse>('/api/tag/list', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 查询热门标签 GET /api/tag/hot */
export async function queryHotTags(limit?: number, options?: { [key: string]: any }) {
  return request<TagListResponse>('/api/tag/hot', {
    method: 'GET',
    params: { limit },
    ...(options || {}),
  });
}

/** 查询标签搜索建议 GET /api/tag/suggest */
export async function queryTagSuggestions(keyword: string, options?: { [key: string]: any }) {
  return request<API.BaseResponse<string[]>>('/api/tag/suggest', {
    method: 'GET',
    params: { keyword },
    ...(options || {}),
  });
}

/** 查询分类列表 GET /api/category/all */
export async function queryCategories(options?: { [key: string]: any }) {
  const response = await request<any>('/api/category/all', {
    method: 'GET',
    ...(options || {}),
  });
  if (response) {
    return {
      data: response,
      total: response.length || 0,
      success: true,
    };
  }
  return {
    data: [],
    total: 0,
    success: false,
  };
}

/** 查询标签列表 GET /api/tag/list */
export async function queryTags(options?: { [key: string]: any }) {
  const response = await request<any>('/api/tag/list', {
    method: 'GET',
    params: {
      current: 1,
      pageSize: 100,
    },
    ...(options || {}),
  });
  // 处理后端返回的MyBatis Plus分页格式
  const tags = response?.records || response?.data || [];
  return {
    data: tags,
    total: response?.total || tags.length || 0,
    success: true,
  };
}

/** 查询评论列表 GET /api/comment/list */
export async function queryComments(
  params?: {
    current?: number;
    pageSize?: number;
    articleId?: number;
    status?: number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  const response = await request<any>('/api/comment/list', {
    method: 'GET',
    params: {
      current: params?.current || 1,
      pageSize: params?.pageSize || 10,
      articleId: params?.articleId,
      status: params?.status !== undefined ? String(params.status) : undefined,
    },
    ...(options || {}),
  });

  // 处理后端返回的MyBatis Plus分页格式
  const comments = response?.records || response?.data || [];
  return {
    data: comments,
    total: response?.total || comments.length || 0,
    success: response?.code === 0 || true,
  };
}

/** 更新评论状态 POST /api/comment/status */
export async function updateCommentStatus(
  body: {
    id: number;
    status: number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  // 转换参数为后端期望的格式
  const transformedBody = {
    commentId: body.id,
    auditStatus: body.status,
  };
  return request<API.BaseResponse>('/api/comment/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: transformedBody,
    ...(options || {}),
  });
}

/** 删除评论 DELETE /api/comment/{id} */
export async function deleteComment(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse>(`/api/comment/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 处理举报 PUT /api/comment/report */
export async function handleReport(
  body: {
    id: number;
    handleType?: number;
    handleResult: string;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  // 转换参数为后端期望的格式
  // handleType: 1-忽略举报, 2-删除评论, 3-警告用户
  // 后端auditStatus: 1-忽略, 2-删除, 3-警告
  const transformedBody = {
    commentId: body.id,
    auditStatus: body.handleType || 1,
    auditRemark: body.handleResult,
  };
  return request<API.BaseResponse>('/api/comment/report', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: transformedBody,
    ...(options || {}),
  });
}

/** 回复评论 POST /api/comment/reply */
export async function replyComment(
  body: {
    commentId: number;
    articleId?: number;
    content: string;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  // 转换参数为后端期望的格式
  const transformedBody = {
    articleId: body.articleId || 0,
    parentId: body.commentId,
    content: body.content,
    userNickname: '管理员',
    userEmail: 'admin@example.com',
  };
  return request<API.BaseResponse<number>>('/api/comment/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: transformedBody,
    ...(options || {}),
  });
}

/** 获取访问量统计 GET /api/statistics/visit */
export async function getVisitStatistics(
  params?: {
    range?: string;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<API.VisitStatisticsResponse>('/api/statistics/visit', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 获取点赞统计 GET /api/statistics/like */
export async function getLikeStatistics(options?: { [key: string]: any }) {
  return request<API.LikeStatisticsResponse>('/api/statistics/like', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取评论统计 GET /api/statistics/comment */
export async function getCommentStatistics(options?: { [key: string]: any }) {
  return request<API.CommentStatisticsResponse>('/api/statistics/comment', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取概览统计 GET /api/statistics/overview */
export async function getOverviewStatistics(options?: { [key: string]: any }) {
  return request<OverviewStatisticsResponse>('/api/statistics/overview', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取访问来源 GET /api/statistics/visit-sources */
export async function getVisitSources(
  params?: {
    range?: string;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<VisitSourcesResponse>('/api/statistics/visit-sources', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 查询角色列表 GET /api/role/list */
export async function queryRoles(options?: { [key: string]: any }) {
  return request<API.RoleListResponse>('/api/role/list', {
    method: 'GET',
    ...(options || {}),
  });
}
