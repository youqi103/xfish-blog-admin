// 博客相关类型定义

// 通用响应类型
export interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
  description?: string;
}

// 分页参数
export interface PageParams {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}

// 分类类型
export interface Category {
  id: number;
  name: string;
  description?: string;
  articleCount?: number;
  createTime?: string;
  updateTime?: string;
}

// 分类列表响应
export interface CategoryListResponse {
  data: Category[];
  total: number;
  success: boolean;
}

// 文章类型
export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  categoryId?: number;
  category?: string;
  tags?: string[]; // 支持字符串（后端）和数组（前端）
  status: string | number; // 支持字符串（后端）和数字（前端）
  isMarkdown?: number;
  authorId?: number;
  authorName?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  publishTime?: string;
  publishedAt?: string;
  createTime?: string;
  createdAt?: string;
  updateTime?: string;
  updatedAt?: string;
  allowComment?: number;
  isTop?: number;
  [key: string]: any;
}

// 文章列表响应
export interface ArticleListResponse {
  records: Article[];
  total: number;
  size: number;
  current: number;
  success: boolean;
}

// 评论类型
// 修复类型定义 - 添加 userName 别名以兼容旧代码
export interface Comment {
  id: number;
  articleId: number;
  articleTitle?: string;
  parentId?: number;
  content: string;
  authorName: string;
  authorEmail?: string;
  authorWebsite?: string;
  authorAvatar?: string;
  status: number; // 0-待审核 1-已通过 2-已拒绝 3-已删除
  ipAddress?: string;
  userAgent?: string;
  likeCount?: number;
  createTime?: string;
  updateTime?: string;
  children?: Comment[];
  reportCount?: number;
  userName?: string; // 兼容字段，与 authorName 相同
  replyCount?: number;
  [key: string]: any;
}

// 评论列表响应
export interface CommentListResponse {
  data: Comment[];
  total: number;
  success: boolean;
}

// 统计参数
export interface StatisticsParams {
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

// 访问来源数据
export interface VisitSource {
  source: string;
  count: number;
  percentage?: number;
}

// 访问统计响应
export interface VisitStatisticsResponse {
  data: Array<{
    date: string;
    visits: number;
  }>;
  totalVisits: number;
  sources?: VisitSource[];
  success: boolean;
}

// 访问来源统计响应
export interface VisitSourceResponse {
  data: VisitSource[];
  total: number;
  success: boolean;
}
export interface Tag {
  id: number;
  name: string;
  description?: string;
  articleCount?: number;
  createTime?: string;
  updateTime?: string;
}
// 点赞统计响应
export interface LikeStatisticsResponse {
  data: Array<{
    date: string;
    likes: number;
  }>;
  totalLikes: number;
  success: boolean;
}

// 评论统计响应
export interface CommentStatisticsResponse {
  data: Array<{
    date: string;
    comments: number;
  }>;
  totalComments: number;
  success: boolean;
}

// 概览统计响应
export interface OverviewResponse {
  data: OverviewData;
  success: boolean;
}

export interface OverviewData {
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
}

// 评论统计
export interface CommentStats {
  date: string;
  comments: number;
  dailyAverage?: number;
  participationRate?: number;
  avgReplies?: number;
  heatIndex?: number;
  weeklyTrend?: Array<{ date: string; comments: number }>;
  monthlyTrend?: Array<{ month: string; comments: number }>;
  topArticles?: Array<{ id: number; title: string; commentCount: number }>;
  hourDistribution?: Array<{ hour: number; count: number }>;
}

// 点赞数据
export interface LikeItem {
  date: string;
  likes: number;
  id?: number;
  title?: string;
  rank?: number;
}

// 用户类型
export interface User {
  id: number;
  username: string;
  userAccount: string;
  nickname?: string;
  gender?: number;
  phone?: string;
  email?: string;
  status: number; // 0-禁用 1-启用
  avatarUrl?: string;
  roleId?: number;
  role?: number; // 兼容role属性，与roleId同义
  roleName?: string;
  createTime?: string;
  updateTime?: string;
  // 添加密码字段，用于创建用户
  password?: string;
  [key: string]: any;
}
// 基于代码使用场景推断的 UserLog 类型（可补充到 typing.d.ts 中）
export interface UserLog {
  id: number;
  userId: number;
  action: string;
  details?: string;
  content?: string;
  ipAddress?: string;
  ip?: string;
  userAgent?: string;
  createdAt?: string;
  createTime?: string;
}
// 用户列表响应
export interface UserListResponse {
  data: User[];
  total: number;
  success: boolean;
}

// 日志列表响应
export interface LogListResponse {
  data: Array<{
    id: number;
    userId: number;
    username: string;
    action: string;
    content: string;
    ipAddress: string;
    userAgent: string;
    createTime: string;
  }>;
  total: number;
  success: boolean;
}

// 角色类型
export interface Role {
  id: number;
  name: string;
  description?: string;
  status: number;
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 角色列表响应
export interface RoleListResponse {
  data: Role[];
  total: number;
  success: boolean;
}

// 菜单项类型（修复MenuItems类型问题）
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  [key: string]: any;
}

// 通用状态类型
export enum StatusEnum {
  DRAFT = 0,
  PUBLISHED = 1,
  HIDDEN = 2,
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
  DELETED = 3,
  DISABLED = 0,
  ENABLED = 1,
}
