import { searchUser } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';

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
      frozen: { text: '冻结', status: 'error' },
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
    title: '注册时间',
    dataIndex: 'registeredAt',
    valueType: 'dateTime',
    sorter: true,
    render: (_, entity) => {
      if (!entity.registeredAt) return '-';
      return new Date(entity.registeredAt).toLocaleString('zh-CN');
    },
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
];

export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      rowSelection={{
        // 复选框配置
        alwaysShowAlert: false,
        // 全选配置
        getCheckboxProps: (record) => ({
          disabled: !record, // 只禁用空记录
        }),
      }}
      request={async (params = {}, sort = {}) => {
        try {
          // 提取搜索参数，排除分页和排序参数
          const { current, pageSize, ...searchParams } = params;

          // 构建查询参数
          const queryParams: Record<string, any> = {
            ...searchParams,
            // 处理排序参数
            sortField: Object.keys(sort)[0] || '',
            sortOrder: sort[Object.keys(sort)[0]] || '',
          };

          // 只有在明确传递时才添加分页参数
          if (current) queryParams.current = current;
          if (pageSize) queryParams.pageSize = pageSize;

          const userList: API.SearchUserResponse = await searchUser(queryParams);

          // 错误处理
          if (userList.code !== 0) {
            return {
              data: [],
              total: 0,
              success: false,
            };
          }

          // 处理数据记录
          const records = userList.data?.records || [];
          const processedRecords = records.map(record => ({
            ...record,
            // 确保所有时间戳字段都有值
            registeredAt: record.registeredAt || record.createdAt || '',
            lastLoginAt: record.lastLoginAt || '',
            createdAt: record.createdAt || record.createdAt || '',
            updatedAt: record.updatedAt || record.updatedAt || '',
          }));

          return {
            data: processedRecords,
            total: userList.data?.total || records.length,
            success: true,
            current: userList.data?.current || current || 1,
            pageSize: userList.data?.pageSize || pageSize || 10,
          };
        } catch (error) {
          console.error('获取用户列表失败:', error);
          return {
            data: [],
            total: 0,
            success: false,
          };
        }
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
      }}
      dateFormatter="string"
      headerTitle="当前用户列表"
    />
  );
};
