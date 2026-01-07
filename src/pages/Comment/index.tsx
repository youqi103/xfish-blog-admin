import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Badge, Button, Tag, Space, message, Modal, Drawer, Input, Tooltip, Checkbox, Select } from 'antd';
import {
  queryComments,
  updateCommentStatus,
  deleteComment,
  handleReport,
  replyComment,
} from '@/services/ant-design-pro/api';
import AuditModal from './AuditModal';
import type { Comment } from '@/types/blog';

const { TextArea = Input.TextArea } = Input;

const CommentList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [auditModalOpen, setAuditModalOpen] = useState<boolean>(false);
  const [replyDrawerOpen, setReplyDrawerOpen] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<Comment[]>([]);

  useEffect(() => {
    return () => {
      setCurrentComment(null);
      setReplyContent('');
    };
  }, []);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleAudit = (record: Comment, status: number) => {
    Modal.confirm({
      title: status === 1 ? '通过审核' : '拒绝审核',
      content: status === 1 ? '确定通过这条评论的审核吗？' : '确定拒绝这条评论吗？',
      onOk: async () => {
        try {
          await updateCommentStatus({ id: record.id, status });
          message.success('审核操作成功');
          refreshTable();
        } catch (error) {
          message.error('审核操作失败');
        }
      },
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条评论吗？',
      onOk: async () => {
        try {
          await deleteComment(id);
          message.success('删除成功');
          refreshTable();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleBatchAudit = (status: number) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要审核的评论');
      return;
    }
    Modal.confirm({
      title: '批量审核',
      content: `确定要批量${status === 1 ? '通过' : '拒绝'}选中的 ${
        selectedRowKeys.length
      } 条评论吗？`,
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map(id => updateCommentStatus({ id: Number(id), status }))
          );
          message.success('批量审核成功');
          setSelectedRowKeys([]);
          refreshTable();
        } catch (error) {
          message.error('批量审核失败');
        }
      },
    });
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的评论');
      return;
    }
    Modal.confirm({
      title: '批量删除评论',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条评论吗？此操作不可恢复。`,
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map(id => deleteComment(Number(id)))
          );
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          refreshTable();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  const handleReportHandle = async (
    record: Comment,
    handleType: number,
    reason?: string,
    notifyUser?: boolean
  ) => {
    try {
      // 转换参数为后端期望的格式
      // handleType: 1-忽略举报, 2-删除评论, 3-警告用户
      // 后端auditStatus: 1-忽略, 2-删除, 3-警告
      await handleReport({
        id: record.id,
        handleType: handleType, // 添加handleType参数
        handleResult: reason || ''
      });
      message.success('举报处理成功');
      refreshTable();
    } catch (error) {
      message.error('举报处理失败');
    }
  };

  const handleReply = (record: Comment) => {
    setCurrentComment(record);
    setReplyDrawerOpen(true);
  };

  const submitReply = async () => {
    if (!currentComment || !replyContent.trim()) {
      message.warning('请输入回复内容');
      return;
    }
    try {
      await replyComment({
        commentId: currentComment.id,
        articleId: currentComment.articleId, // 添加文章ID
        content: replyContent
      });
      message.success('回复成功');
      setReplyDrawerOpen(false);
      setReplyContent('');
      setCurrentComment(null);
      refreshTable();
    } catch (error) {
      message.error('回复失败');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(tableData.map((item) => item.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectRow = (record: Comment, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys([...selectedRowKeys, record.id]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
    }
  };

  const isAllSelected = tableData.length > 0 && selectedRowKeys.length === tableData.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < tableData.length;

  const columns: ProColumns<Comment>[] = [
    {
      title: (
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      dataIndex: 'checkbox',
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => handleSelectRow(record, e.target.checked)}
        />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 80,
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      width: 250,
      ellipsis: true,
    },
    {
      title: '评论文章',
      dataIndex: 'articleTitle',
      width: 150,
      ellipsis: true,
    },
    {
      title: '评论用户',
      dataIndex: 'userName',
      width: 100,
      render: (_, record) => record.userName || record.authorName || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        0: { text: '待审核', status: 'warning' },
        1: { text: '已通过', status: 'success' },
        2: { text: '已拒绝', status: 'error' },
        3: { text: '已删除', status: 'default' },
      },
      render: (_, record) => (
        <Space>
          {record.status === 0 && <Badge status="warning" text="待审核" />}
          {record.status === 1 && <Badge status="success" text="已通过" />}
          {record.status === 2 && <Badge status="error" text="已拒绝" />}
          {record.status === 3 && <Badge status="default" text="已删除" />}
          {(record.reportCount ?? 0) > 0 && (
            <Tooltip title={`${record.reportCount}条举报`}>
              <Badge count={record.reportCount} size="small" />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      width: 80,
      sorter: true,
      search: false,
    },
    {
      title: '回复数',
      dataIndex: 'replyCount',
      width: 80,
      search: false,
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
      width: 180,
      valueType: 'dateTimeRange',
      sorter: true,
      render: (_, record) => {
        if (!record.createTime) return '-';
        return new Date(record.createTime).toLocaleString('zh-CN');
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          {record.status === 0 && (
            <>
              <Tooltip title="通过">
                <Button
                  type="text"
                  icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  onClick={() => handleAudit(record, 1)}
                />
              </Tooltip>
              <Tooltip title="拒绝">
                <Button
                  type="text"
                  icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                  onClick={() => handleAudit(record, 2)}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="回复">
            <Button type="text" icon={<MessageOutlined />} onClick={() => handleReply(record)} />
          </Tooltip>
          {(record.reportCount ?? 0) > 0 && (
            <Tooltip title="处理举报">
              <Button
                type="text"
                icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
                onClick={() => {
                  setCurrentComment(record);
                  setAuditModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
      search: false,
    },
  ];

  return (
    <>
      <ProTable<Comment>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        cardBordered
        headerTitle="评论管理"
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
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
        toolBarRender={() => [
          <Button
            key="batch-pass"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleBatchAudit(1)}
            disabled={selectedRowKeys.length === 0}
          >
            批量通过
          </Button>,
          <Button
            key="batch-reject"
            icon={<CloseCircleOutlined />}
            onClick={() => handleBatchAudit(2)}
            disabled={selectedRowKeys.length === 0}
          >
            批量拒绝
          </Button>,
          <Button
            key="batch-delete"
            icon={<DeleteOutlined />}
            danger
            onClick={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
          >
            批量删除
          </Button>,
        ]}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
        }}
        request={async (params) => {
          const response = await queryComments(params);
          const data = response.data || [];
          setTableData(data);
          return {
            data,
            total: response.total || 0,
            success: true,
          };
        }}
        scroll={{ x: 1400 }}
      />

      <AuditModal
        open={auditModalOpen}
        comment={currentComment}
        onSubmit={handleReportHandle}
        onCancel={() => {
          setAuditModalOpen(false);
          setCurrentComment(null);
        }}
      />

      <Drawer
        title="回复评论"
        width={500}
        open={replyDrawerOpen}
        onClose={() => {
          setReplyDrawerOpen(false);
          setReplyContent('');
          setCurrentComment(null);
        }}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setReplyDrawerOpen(false)}>取消</Button>
            <Button type="primary" onClick={submitReply}>
              发送回复
            </Button>
          </Space>
        }
      >
        {currentComment && (
          <div>
            <div
              style={{ marginBottom: 16, padding: '12px', background: '#f5f5f5', borderRadius: 4 }}
            >
              <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>
                原文评论：{currentComment.userName || currentComment.authorName || '匿名用户'}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>{currentComment.content}</div>
            </div>
            <TextArea
              rows={4}
              placeholder="请输入回复内容"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              maxLength={1000}
              showCount
            />
          </div>
        )}
      </Drawer>
    </>
  );
};

export default CommentList;
