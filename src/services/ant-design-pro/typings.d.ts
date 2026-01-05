// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    id: number;
    username: string;
    nickname?: string;
    email?: string;
    avatar?: string;
    role: string;
    status: string;
    registeredAt?: string;
    lastLoginAt?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type BaseResponse<T = any> = {
    code: number;
    data: T;
    message: string;
    description?: string;
  };

  type LoginResult = BaseResponse<CurrentUser>;

  type RegistertResult = number;

  type PageParams = {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    userAccount?: string;
    userPassword?: string;
    autoLogin?: boolean;
    type?: string;
  };
  type RegisterParams = {
    userAccount?: string;
    userPassword?: string;
    checkPassword?: string;
    email?: string;
    phone?: string;
    nickname?: string;
    type?: string;
  };
  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };
  // 用户列表响应（分页格式）
  type SearchUserResponse = BaseResponse<{
    records: CurrentUser[];
    total: number;
    current: number;
    pageSize: number;
  }>;

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  // 以下是博客系统相关类型定义
  type Article = {
    id: number;
    title: string;
    content: string;
    summary?: string;
    categoryId?: number;
    tags?: string[];
    status: number; // 0-草稿 1-发布 2-隐藏
    authorId?: number;
    authorName?: string;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    publishTime?: string;
    createTime?: string;
    updateTime?: string;
    [key: string]: any;
  };

  type ArticleListResponse = {
    data: Article[];
    total: number;
    success: boolean;
  };

  type Comment = {
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
    [key: string]: any;
  };

  type CommentListResponse = {
    data: Comment[];
    total: number;
    success: boolean;
  };

  type StatisticsParams = {
    startDate?: string;
    endDate?: string;
    [key: string]: any;
  };

  type VisitStatisticsResponse = {
    data: Array<{
      date: string;
      visits: number;
    }>;
    totalVisits: number;
    success: boolean;
  };

  type LikeStatisticsResponse = {
    data: Array<{
      date: string;
      likes: number;
    }>;
    totalLikes: number;
    success: boolean;
  };

  type CommentStatisticsResponse = {
    data: Array<{
      date: string;
      comments: number;
    }>;
    totalComments: number;
    success: boolean;
  };

  type OverviewResponse = {
    data: OverviewData;
    success: boolean;
  };

  type OverviewData = {
    articleCount: number;
    commentCount: number;
    viewCount: number;
    userCount: number;
  };

  type User = {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  nickname: string;
  avatar?: string; // 可选（允许为 undefined 或 null）
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'banned';
  registeredAt: string;
  lastLoginAt?: string; // 可选（从未登录时可能为 null/undefined）
  createdAt: string;
  updatedAt: string;
};

  type UserListResponse = {
    data: User[];
    total: number;
    success: boolean;
  };

  type LogListResponse = {
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
  };

  type Role = {
    id: number;
    name: string;
    description?: string;
    status: number;
    createTime?: string;
    updateTime?: string;
    [key: string]: any;
  };

  type RoleListResponse = {
    data: Role[];
    total: number;
    success: boolean;
  };

  type MenuItem = {
    key: string;
    label: string;
    icon?: React.ReactNode;
    children?: MenuItem[];
    [key: string]: any;
  };
}
