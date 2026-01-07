import React, { useState, useRef } from 'react';
import { PlusOutlined} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button,  message, Modal, Drawer, Timeline } from 'antd';
import {
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  disableUser,
  enableUser,
  getUserLogs,
  getUser,
} from '@/services/ant-design-pro/api';
import UserForm from './UserForm';
import RoleModal from './RoleModal';
import type {  UserLog } from '@/types/blog';
import { searchUser } from '@/services/ant-design-pro/api';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [logDrawerOpen, setLogDrawerOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<API.CurrentUser | null>(null);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [logLoading, setLogLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);

  const handleCreate = async (values: Partial<API.CurrentUser> & { password?: string | undefined; }) => {
    try {
      let res = await createUser({
        username: values.username || '',
        password: values.password || '',
        nickname: values.nickname || '',
        email: values.email || '',
        avatar: values.avatar || '',
        role: String(values.role || 'user'),
        status: String(values.status || 'active')
      });
      if(res)message.success('创建成功');
      setCreateModalOpen(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleUpdate = async (values: Partial<API.CurrentUser>) => {
    if (!currentUser) return;
    try {
      // 后端使用username查找用户，所以需要传递username
      await updateUser({ username: currentUser.username, ...values } as any);
      message.success('更新成功');
      setEditModalOpen(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

const handleStatusChange = async (id: number, currentStatus: string) => {
  // 根据当前状态调用不同的接口
  try {
    if (currentStatus === 'active') {
      // 当前是正常状态，调用禁用接口
      await disableUser(id);
      message.success('用户已禁用');
    } else {
      // 当前是禁用或未激活状态，调用启用接口
      await enableUser(id);
      message.success('用户已启用');
    }
    actionRef.current?.reload();
  } catch (error) {
    message.error('状态更新失败');
  }
};

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await updateUserRole(id, role);
      message.success('角色分配成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('角色分配失败');
    }
  };

const handleViewLogs = async (record: API.CurrentUser) => {
  setCurrentUser(record);
  setLogDrawerOpen(true);
  setLogLoading(true);
  try {
    const response = await getUserLogs({ userId: record.id });
    // 后端返回的是BaseResponse结构，需要从data中获取records
    const logs = response.data?.records || [];
    // 转换日志数据格式以匹配前端显示需求
    const formattedLogs = logs.map((log: any) => ({
      userId: log.userId,
      id: log.id,
      action: log.action,
      detail: log.details || log.content || '',
      ip: log.ipAddress || log.ip || '',
      createTime: log.createdAt || new Date().toLocaleString('zh-CN'),
    }));
    setUserLogs(formattedLogs);
  } catch (error) {
    message.error('获取日志失败');
    setUserLogs([]);
  } finally {
    setLogLoading(false);
  }
};

const handleEdit = async (record: API.CurrentUser) => {
  setCurrentUser(record);
  setEditLoading(true);
  setEditModalOpen(true);
  try {
    // getUser 现在返回 BaseResponse<CurrentUser> 结构
    const response = await getUser(record.id);
    const userData = response.data as API.CurrentUser;
    if (userData) {
      setCurrentUser(userData);
    }
  } catch (error) {
    message.error('获取用户信息失败，将使用缓存数据');
    console.error('获取用户详情失败:', error);
  } finally {
    setEditLoading(false);
  }
};

const handleRole = (record: API.CurrentUser) => {
  setCurrentUser(record);
  setRoleModalOpen(true);
};

  // getStatusTag 和 getRoleTag 函数已移除，状态和角色通过 columns 的 valueEnum 显示

 const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true,
  },
  {
    title: '用户角色',
    dataIndex: 'role',
    valueEnum: {
      admin: { text: '管理员', status: 'success' },
      user: { text: '普通用户', status: 'processing' },
    },
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname',
    copyable: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    copyable: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      active: { text: '正常', status: 'success' },
      inactive: { text: '未激活', status: 'warning' },
      banned: { text: '已封禁', status: 'error' },
    },
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    render: (_, entity) => (
      <img
        src={entity.avatar || '/default-avatar.png'}
        alt="avatar"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
        }}
      />
    ),
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastLoginAt',
    valueType: 'dateTime',
    sorter: true,
    render: (_, entity) => {
      if (!entity.lastLoginAt) return '-';
      return new Date(entity.lastLoginAt).toLocaleString('zh-CN');
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
    sorter: true,
    render: (_, entity) => {
      if (!entity.createdAt) return '-';
      return new Date(entity.createdAt).toLocaleString('zh-CN');
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    valueType: 'dateTime',
    sorter: true,
    render: (_, entity) => {
      if (!entity.updatedAt) return '-';
      return new Date(entity.updatedAt).toLocaleString('zh-CN');
    },
  },
  {
    title: '操作',
    valueType: 'option',
    render: (_, record) => [
      <a
        key="edit"
        onClick={() => handleEdit(record)}
      >
        编辑
      </a>,
      <a
        key="role"
        onClick={() => handleRole(record)}
      >
        角色
      </a>,
      <a
        key="status"
        onClick={() => handleStatusChange(record.id, String(record.status))}
      >
        {record.status === 'active' ? '禁用' : '启用'}
      </a>,
      <a
        key="logs"
        onClick={() => handleViewLogs(record)}
      >
        日志
      </a>,
      <a
        key="delete"
        onClick={() => handleDelete(record.id)}
        style={{ color: '#ff4d4f' }}
      >
        删除
      </a>,
    ],
  },
];

  return (
    <>
     <ProTable<API.CurrentUser>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        cardBordered
        headerTitle="用户管理"
        search={{
          labelWidth: 'auto',
          span: 6,
        }}
        form={{
          syncToUrl: (values) => values,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentUser(null);
              setCreateModalOpen(true);
            }}
          >
            新建用户
          </Button>,
        ]}
         request={async (params = {}, sort = {}, filter = {}) => {
        try {
          const { current, pageSize, ...searchParams } = params;

          const sortKey = Object.keys(sort)[0] || '';
          const sortOrder = sort[sortKey] || '';

          // 时间字段映射（前端字段名 -> 后端字段名）
          const fieldMapping: Record<string, string> = {
            registeredAt: 'registered_at',
            lastLoginAt: 'last_login_at',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
          };

          // 构建查询参数
          const queryParams: Record<string, any> = {
            ...searchParams,
            ...filter,
            sortField: fieldMapping[sortKey] || sortKey,
            sortOrder: sortOrder,
          };

          // 按需添加分页参数
          if (current !== undefined && current !== null) {
            queryParams.current = current;
          }
          if (pageSize !== undefined && pageSize !== null) {
            queryParams.pageSize = pageSize;
          }

          // 发起请求
          const userList: API.UserPageData = await searchUser(queryParams);
          console.log('userList', userList);
          if (!userList || !Array.isArray(userList.records)) {
            const errorMsg = '获取用户列表失败:接口未返回有效数据';
            message.warning(errorMsg);
            return {
              data: [],
              total: 0,
              success: false,
            };
          }

          // 优化：增加类型断言，提升TS提示精准度
         const processedRecords = userList.records.map(record => ({
            ...record,
            registeredAt: record.registeredAt || '',
            lastLoginAt: record.lastLoginAt || '',
            createdAt: record.createdAt || '',
            updatedAt: record.updatedAt || '',
            }));

          // 修复：使用实际数据长度作为 total，避免后端返回 total: 0 导致的问题
          const totalCount = userList.total || processedRecords.length;

          // 返回 Pro Table 所需格式
          return {
            data: processedRecords,
            total: totalCount,
            success: true,
            current: userList.current || current || 1,
            pageSize: userList.size || pageSize || 10,
          };
        } catch (error) {
          const errorMsg = '获取用户列表失败:网络异常';
          message.error(errorMsg);
          console.error(errorMsg, error);
          return {
            data: [],
            total: 0,
            success: false,
          };
        }
      }}
        scroll={{ x: 1500 }}
      />

      <UserForm
        open={createModalOpen}
        user={null}
        onSubmit={handleCreate}
        onCancel={() => {
          setCreateModalOpen(false);
        }}
      />

      <UserForm
        open={editModalOpen}
        user={currentUser}
        onSubmit={handleUpdate}
        onCancel={() => {
          setEditModalOpen(false);
          setCurrentUser(null);
        }}
      />

      <RoleModal
        open={roleModalOpen}
        user={currentUser}
        onSubmit={handleRoleChange}
        onCancel={() => {
          setRoleModalOpen(false);
          setCurrentUser(null);
        }}
      />

      <Drawer
        title={`用户操作日志 - ${currentUser?.username}`}
        width={600}
        open={logDrawerOpen}
        onClose={() => {
          setLogDrawerOpen(false);
          setCurrentUser(null);
          setUserLogs([]);
        }}
      >
        {logLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            加载中...
          </div>
        ) : (
          <Timeline
            mode="left"
            items={userLogs.map((log) => ({
              color: log.action?.includes('登录')
                ? 'green'
                : log.action?.includes('删除')
                ? 'red'
                : 'blue',
              label: log.createTime,
              children: (
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{log.action}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>{log.details}</div>
                  <div style={{ color: '#999', fontSize: 12 }}>IP: {log.ip}</div>
                </div>
              ),
            }))}
          />
        )}
      </Drawer>
    </>
  );
};

export default UserList;



