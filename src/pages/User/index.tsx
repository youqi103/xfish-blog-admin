import React, { useState, useRef } from 'react';
import { PlusOutlined, EditOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, message, Modal, Drawer, Timeline, Avatar, Tooltip, Tag, Badge } from 'antd';
import {
  queryUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserStatus,
  getUserLogs,
} from '@/services/blog-api';
import UserForm from './UserForm';
import RoleModal from './RoleModal';
import type { User, UserLog } from '@/types/blog';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [logDrawerOpen, setLogDrawerOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);

  const handleCreate = async (values: User) => {
    try {
      await createUser(values);
      message.success('创建成功');
      setCreateModalOpen(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleUpdate = async (values: User) => {
    if (!currentUser) return;
    try {
      await updateUser(currentUser.id, values);
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

  const handleStatusChange = async (id: number, status: number) => {
    try {
      await updateUserStatus(id, status);
      message.success('状态更新成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleRoleChange = async (id: number, roleId: number) => {
    try {
      await updateUserRole(id, roleId);
      message.success('角色分配成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('角色分配失败');
    }
  };

  const handleViewLogs = async (record: User) => {
    setCurrentUser(record);
    setLogDrawerOpen(true);
    setLogLoading(true);
    try {
      const response = await getUserLogs(record.id);
      setUserLogs(response.data || []);
    } catch (error) {
      message.error('获取日志失败');
    } finally {
      setLogLoading(false);
    }
  };

  const handleEdit = (record: User) => {
    setCurrentUser(record);
    setEditModalOpen(true);
  };

  const handleRole = (record: User) => {
    setCurrentUser(record);
    setRoleModalOpen(true);
  };

  const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Badge status="error" text="已冻结" />;
      case 1:
        return <Badge status="success" text="正常" />;
      case 2:
        return <Badge status="warning" text="待审核" />;
      default:
        return <Tag>未知</Tag>;
    }
  };

  const getRoleTag = (role: number) => {
    switch (role) {
      case 0:
        return <Tag color="default">普通用户</Tag>;
      case 1:
        return <Tag color="gold">管理员</Tag>;
      case 2:
        return <Tag color="purple">超级管理员</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  const columns: ProColumns<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      width: 60,
      fixed: 'left',
      render: (_, record) => <Avatar src={record.avatarUrl} icon={<UserOutlined />} size="small" />,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <span>{record.username}</span>
          {record.vipLevel > 0 && (
            <Tag color="gold" style={{ margin: 0 }}>
              VIP{record.vipLevel}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      valueEnum: {
        0: { text: '普通用户', color: 'default' },
        1: { text: '管理员', color: 'gold' },
        2: { text: '超级管理员', color: 'purple' },
      },
      render: (_, record) => getRoleTag(record.role),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => getStatusTag(record.status),
    },
    {
      title: '积分',
      dataIndex: 'points',
      width: 80,
      sorter: true,
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      width: 180,
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      width: 180,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="分配角色">
            <Button type="text" icon={<LockOutlined />} onClick={() => handleRole(record)} />
          </Tooltip>
          <Tooltip title="操作日志">
            <Button type="text" onClick={() => handleViewLogs(record)}>
              日志
            </Button>
          </Tooltip>
          <TableDropdown
            onSelect={(key) => {
              if (key === 'freeze') {
                handleStatusChange(record.id, 0);
              } else if (key === 'activate') {
                handleStatusChange(record.id, 1);
              } else if (key === 'delete') {
                handleDelete(record.id);
              }
            }}
            menus={[
              { key: 'freeze', label: '冻结账户' },
              { key: 'activate', label: '激活账户' },
              { key: 'delete', label: '删除用户' },
            ]}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<User>
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
        request={async (params) => {
          const response = await queryUsers(params);
          return {
            data: response.data || [],
            total: response.total || 0,
            success: response.code === 0,
          };
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
                <div style={{ color: '#666', fontSize: 12 }}>{log.detail}</div>
                <div style={{ color: '#999', fontSize: 12 }}>IP: {log.ip}</div>
              </div>
            ),
          }))}
        />
      </Drawer>
    </>
  );
};

export default UserList;
