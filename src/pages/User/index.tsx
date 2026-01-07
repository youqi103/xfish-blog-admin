import { searchUser } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { message } from 'antd'; // 导入消息提示组件

// 表格列配置（完全保留你的原有配置）
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
        alwaysShowAlert: false,
        getCheckboxProps: (record) => ({
          disabled: !record,
        }),
        onChange: () => {}, // 兜底空函数，避免警告
      }}
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
            // 修正：先判断 startTime/endTime 存在，再传递 created_at
            const returnValues = { ...values };
            if (values.startTime || values.endTime) {
              returnValues.created_at = [values.startTime, values.endTime];
            }
            // 删除冗余的 startTime/endTime，避免重复传参
            delete returnValues.startTime;
            delete returnValues.endTime;
            return returnValues;
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
