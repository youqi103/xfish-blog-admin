import React, { useState, useRef } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Tag, Space, message, Drawer, Modal, Tooltip, Card } from 'antd';
import { MDEditor } from '@uiw/react-md-editor';
import {
  queryArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  updateArticleStatus,
} from '@/services/blog-api';
import ArticleEditor from './Editor';
import type { Article } from '@/types/blog';

const ArticleList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState<boolean>(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [editorContent, setEditorContent] = useState('');

  const handleCreate = async (values: Article) => {
    try {
      await createArticle(values);
      message.success('创建成功');
      setCreateModalOpen(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleUpdate = async (values: Article) => {
    if (!currentArticle) return;
    try {
      await updateArticle(currentArticle.id, values);
      message.success('更新成功');
      setEditModalOpen(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await deleteArticle(id);
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
      await updateArticleStatus(id, status);
      message.success('状态更新成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handlePreview = (record: Article) => {
    setCurrentArticle(record);
    setPreviewDrawerOpen(true);
  };

  const handleEdit = (record: Article) => {
    setCurrentArticle(record);
    setEditorContent(record.content || '');
    setEditModalOpen(true);
  };

  const columns: ProColumns<Article>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: '标题',
      dataIndex: 'title',
      fixed: 'left',
      width: 200,
      render: (_, record) => <a onClick={() => handlePreview(record)}>{record.title}</a>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      render: (_, record) => (
        <Space wrap>
          {record.tags?.map((tag: string) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        0: { text: '草稿', status: 'default' },
        1: { text: '已发布', status: 'success' },
        2: { text: '已下架', status: 'error' },
      },
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      width: 80,
      sorter: true,
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      width: 80,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="预览">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handlePreview(record)} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
          <TableDropdown
            onSelect={(key) => {
              if (key === 'publish') {
                handleStatusChange(record.id, 1);
              } else if (key === 'draft') {
                handleStatusChange(record.id, 0);
              } else if (key === 'unpublish') {
                handleStatusChange(record.id, 2);
              }
            }}
            menus={[
              { key: 'publish', label: '发布' },
              { key: 'draft', label: '设为草稿' },
              { key: 'unpublish', label: '下架' },
            ]}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<Article>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        cardBordered
        headerTitle="文章管理"
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
              setCurrentArticle(null);
              setEditorContent('');
              setCreateModalOpen(true);
            }}
          >
            新建文章
          </Button>,
        ]}
        request={async (params) => {
          const response = await queryArticles(params);
          return {
            data: response.data || [],
            total: response.total || 0,
            success: response.code === 0,
          };
        }}
        scroll={{ x: 1400 }}
      />

      <ArticleEditor
        open={createModalOpen}
        article={null}
        initialContent={editorContent}
        onSubmit={handleCreate}
        onCancel={() => {
          setCreateModalOpen(false);
          setEditorContent('');
        }}
      />

      <ArticleEditor
        open={editModalOpen}
        article={currentArticle}
        initialContent={editorContent}
        onSubmit={handleUpdate}
        onCancel={() => {
          setEditModalOpen(false);
          setCurrentArticle(null);
          setEditorContent('');
        }}
      />

      <Drawer
        title="文章预览"
        width={800}
        open={previewDrawerOpen}
        onClose={() => {
          setPreviewDrawerOpen(false);
          setCurrentArticle(null);
        }}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setPreviewDrawerOpen(false)}>关闭</Button>
          </Space>
        }
      >
        {currentArticle && (
          <div>
            <Card bordered={false} style={{ marginBottom: 16 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>{currentArticle.title}</h1>
              <Space style={{ margin: '16px 0' }}>
                <Tag color="blue">{currentArticle.category}</Tag>
                {currentArticle.tags?.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
                <Tag color="green">{currentArticle.viewCount || 0} 浏览</Tag>
                <Tag color="red">{currentArticle.likeCount || 0} 点赞</Tag>
                <Tag color="orange">{currentArticle.commentCount || 0} 评论</Tag>
              </Space>
              <div style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
                <span>作者：{currentArticle.authorName || '未知'}</span>
                <span style={{ margin: '0 8px' }}>|</span>
                <span>创建时间：{currentArticle.createTime}</span>
                {currentArticle.updateTime && (
                  <>
                    <span style={{ margin: '0 8px' }}>|</span>
                    <span>更新时间：{currentArticle.updateTime}</span>
                  </>
                )}
              </div>
            </Card>
            <Card title="文章内容" bordered={false}>
              <div data-color-mode="light">
                <MDEditor.Markdown
                  source={currentArticle.content || ''}
                  style={{
                    padding: '16px',
                    minHeight: '300px',
                  }}
                />
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default ArticleList;
