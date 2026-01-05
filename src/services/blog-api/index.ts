/* eslint-disable */
/* eslint-disable */
import request from '@/plugin/GlobalRequest';

export async function queryArticles(params?: API.PageParams) {
  return request<API.ArticleListResponse>('/articles', {
    method: 'GET',
    params,
  });
}

export async function getArticle(id: number) {
  return request<API.Article>('/articles/' + id, {
    method: 'GET',
  });
}

export async function createArticle(data: API.Article) {
  return request<API.Article>('/articles', {
    method: 'POST',
    data,
  });
}

export async function updateArticle(id: number, data: Partial<API.Article>) {
  return request<API.Article>('/articles/' + id, {
    method: 'PUT',
    data,
  });
}

export async function deleteArticle(id: number) {
  return request('/articles/' + id, {
    method: 'DELETE',
  });
}

export async function updateArticleStatus(id: number, status: number) {
  return request('/articles/' + id + '/status', {
    method: 'PUT',
    data: { status },
  });
}

// 分类相关接口
export async function queryCategories(params?: API.PageParams) {
  return request<API.CategoryListResponse>('/categories', {
    method: 'GET',
    params,
  });
}

export async function createCategory(data: API.Category) {
  return request<API.Category>('/categories', {
    method: 'POST',
    data,
  });
}

export async function updateCategory(id: number, data: Partial<API.Category>) {
  return request<API.Category>('/categories/' + id, {
    method: 'PUT',
    data,
  });
}

export async function deleteCategory(id: number) {
  return request('/categories/' + id, {
    method: 'DELETE',
  });
}

export async function getCategory(id: number) {
  return request<API.Category>('/categories/' + id, {
    method: 'GET',
  });
}

// 标签相关接口
export async function queryTags(params?: API.PageParams) {
  return request<API.TagListResponse>('/tags', {
    method: 'GET',
    params,
  });
}

export async function createTag(data: API.Tag) {
  return request<API.Tag>('/tags', {
    method: 'POST',
    data,
  });
}

export async function updateTag(id: number, data: Partial<API.Tag>) {
  return request<API.Tag>('/tags/' + id, {
    method: 'PUT',
    data,
  });
}

export async function deleteTag(id: number) {
  return request('/tags/' + id, {
    method: 'DELETE',
  });
}

export async function getTag(id: number) {
  return request<API.Tag>('/tags/' + id, {
    method: 'GET',
  });
}

export async function queryComments(params?: API.PageParams) {
  return request<API.CommentListResponse>('/comments', {
    method: 'GET',
    params,
  });
}

export async function getComment(id: number) {
  return request<API.Comment>('/comments/' + id, {
    method: 'GET',
  });
}

export async function createComment(data: API.Comment) {
  return request<API.Comment>('/comments', {
    method: 'POST',
    data,
  });
}

export async function updateCommentStatus(id: number, status: number) {
  return request<API.Comment>('/comments/' + id + '/status', {
    method: 'PUT',
    data: { status },
  });
}

export async function handleReport(id: number, handleType: number, reason?: string) {
  return request('/comments/' + id + '/report', {
    method: 'PUT',
    data: { handleType, reason },
  });
}

export async function deleteComment(id: number) {
  return request('/comments/' + id, {
    method: 'DELETE',
  });
}

// 评论回复接口
export async function replyComment(id: number, data: { content: string }) {
  return request('/comments/' + id + '/reply', {
    method: 'POST',
    data,
  });
}

export async function getVisitStatistics(params?: API.StatisticsParams) {
  return request<API.VisitStatisticsResponse>('/statistics/visits', {
    method: 'GET',
    params,
  });
}

// 获取访问来源统计
export async function getVisitSources(params?: API.StatisticsParams) {
  return request<API.VisitSourceResponse>('/statistics/visit-sources', {
    method: 'GET',
    params,
  });
}

export async function getLikeStatistics() {
  return request<API.LikeStatisticsResponse>('/statistics/likes', {
    method: 'GET',
  });
}

export async function getCommentStatistics() {
  return request<API.CommentStatisticsResponse>('/statistics/comments', {
    method: 'GET',
  });
}

export async function getOverviewStatistics() {
  return request<API.OverviewResponse>('/statistics/overview', {
    method: 'GET',
  });
}

export async function queryUsers(params?: API.PageParams) {
  return request<API.UserListResponse>('/users', {
    method: 'GET',
    params,
  });
}

export async function getUser(id: number) {
  return request<API.User>('/users/' + id, {
    method: 'GET',
  });
}

export async function createUser(data: API.User) {
  return request<API.User>('/users', {
    method: 'POST',
    data,
  });
}

export async function updateUser(id: number, data: Partial<API.User>) {
  return request<API.User>('/users/' + id, {
    method: 'PUT',
    data,
  });
}

export async function deleteUser(id: number) {
  return request('/users/' + id, {
    method: 'DELETE',
  });
}

export async function updateUserRole(id: number, roleId: number) {
  return request('/users/' + id + '/role', {
    method: 'PUT',
    data: { roleId },
  });
}

export async function getUserLogs(id: number) {
  return request<API.LogListResponse>('/users/' + id + '/logs', {
    method: 'GET',
  });
}

export async function updateUserStatus(id: number, status: number) {
  return request('/users/' + id + '/status', {
    method: 'PUT',
    data: { status },
  });
}

export async function queryRoles() {
  return request<API.RoleListResponse>('/roles', {
    method: 'GET',
  });
}

export async function createRole(data: API.Role) {
  return request<API.Role>('/roles', {
    method: 'POST',
    data,
  });
}

export async function updateRole(id: number, data: Partial<API.Role>) {
  return request<API.Role>('/roles/' + id, {
    method: 'PUT',
    data,
  });
}

export async function deleteRole(id: number) {
  return request('/roles/' + id, {
    method: 'DELETE',
  });
}
