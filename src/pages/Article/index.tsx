import React, { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Tag, Space, message, Drawer, Modal, Tooltip, Card, Select, Badge } from 'antd';
import MDEditor from '@uiw/react-md-editor';
import {
  queryArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  updateArticleStatus,
  queryAllCategories,
  queryTagSuggestions,
} from '@/services/ant-design-pro/api';
import ArticleEditor from './Editor';
import type { Article, Category } from '@/types/blog';


const ArticleList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState<boolean>(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [searchingTags, setSearchingTags] = useState(false);
  const categoriesLoadedRef = useRef(false);
  const initialDataLoadedRef = useRef(false);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await queryAllCategories();
      const categoryData = response?.data || [];
      setCategories(categoryData);
      categoriesLoadedRef.current = true;
    } catch (error) {
      console.error('加载分类列表失败:', error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoriesLoadedRef.current && !initialDataLoadedRef.current && actionRef.current) {
      initialDataLoadedRef.current = true;
      actionRef.current.reload();
    }
  }, [categoriesLoadedRef.current]);

  const handleCreate = async (values: Article) => {
    try {
      await createArticle(values);
      message.success('创建成功');
      setCreateModalOpen(false);
      actionRef.current?.reload();
    } catch (error: any) {
      console.error('创建文章失败:', error);
      const errorMsg = error?.message || error?.description || '创建失败，请稍后重试';
      message.error(errorMsg);
    }
  };

  const handleUpdate = async (values: Article) => {
    if (!currentArticle) return;
    try {
      await updateArticle(currentArticle.id, values);
      message.success('更新成功');
      setEditModalOpen(false);
      actionRef.current?.reload();
    } catch (error: any) {
      console.error('更新文章失败:', error);
      const errorMsg = error?.message || error?.description || '更新失败，请稍后重试';
      message.error(errorMsg);
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
        } catch (error: any) {
          console.error('删除文章失败:', error);
          const errorMsg = error?.message || error?.description || '删除失败，请稍后重试';
          message.error(errorMsg);
        }
      },
    });
  };

  const handleStatusChange = async (id: number, status: number) => {
    try {
      await updateArticleStatus(id, status);
      message.success('状态更新成功');
      actionRef.current?.reload();
    } catch (error: any) {
      console.error('更新文章状态失败:', error);
      const errorMsg = error?.message || error?.description || '状态更新失败，请稍后重试';
      message.error(errorMsg);
    }
  };

  const handlePreview = (record: Article) => {
    setCurrentArticle(record);
    setPreviewDrawerOpen(true);
  };

  const handleEdit = (record: Article) => {
    setCurrentArticle(record);
    // 确保内容是字符串
    setEditorContent(record.content || '');
    setEditModalOpen(true);
  };

  // 加载标签搜索建议
  const fetchTagSuggestions = async (keyword: string) => {
    if (!keyword || keyword.trim().length === 0) {
      setTagSuggestions([]);
      return;
    }

    setSearchingTags(true);
    try {
      const response = await queryTagSuggestions(keyword.trim());
      setTagSuggestions(response.data || []);
    } catch (error) {
      console.error('加载标签建议失败:', error);
      setTagSuggestions([]);
    } finally {
      setSearchingTags(false);
    }
  };

  const columns: ProColumns<Article>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
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
  render: (_, record) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'draft': { color: 'default', text: '草稿' },
      'published': { color: 'success', text: '已发布' },
      'unpublished': { color: 'error', text: '已下架' },
    };
    const config = statusMap[record.status] || { color: 'default', text: '未知' };
    return (
      <Badge status={config.color as any} text={config.text} />
    );
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
          {/* <TableDropdown
            onSelect={(key) => {
              if (key === 'publish') {
                handleStatusChange(record.id, 1);
              } else if (key === 'draft') {
                handleStatusChange(record.id, 0);
              } else if (key === 'unpublish') {
                handleStatusChange(record.id, 2);
              }
            }}
            menu={{
              items: [
                { key: 'publish', label: '发布' },
                { key: 'draft', label: '设为草稿' },
                { key: 'unpublish', label: '下架' },
              ],
            }}
          /> */}
        </Space>
      ),
    },
  ];
const debouncedFetchTags = useRef(
  debounce((value: string) => fetchTagSuggestions(value), 300)
).current;

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
          render: (_: any, __: any, type: string) => {
            if (type === 'simple') {
              return (
                <>
                  <Select
                    style={{ width: 200, marginRight: 16 }}
                    placeholder="选择分类"
                    allowClear
                    showSearch
                    options={categories.map(cat => ({
                      label: cat.name,
                      value: cat.id,
                    }))}
                    onChange={(value) => {
                      _.setFieldsValue({ categoryId: value });
                    }}
                  />
                  <Select
                    mode="tags"
                    style={{ width: 300, marginRight: 16 }}
                    placeholder="输入标签"
                    allowClear
                    showSearch
                    filterOption={false}
                   onSearch={(value) => debouncedFetchTags(value)}
                    notFoundContent={searchingTags ? <span>搜索中...</span> : null}
                    options={tagSuggestions.map(tag => ({
                      label: tag,
                      value: tag,
                    }))}
                    onChange={(value) => {
                      _.setFieldsValue({ tags: value });
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => {
                      _.submit();
                    }}
                  >
                    搜索
                  </Button>
                </>
              );
            }
            return null;
          },
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
        request={async (params, sort, filter) => {
          if (!categoriesLoadedRef.current) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          const response = await queryArticles(params);
          const articles = response?.records || [];
          const transformedArticles = articles.map((article: any) => {
            const category = categories.find((cat) => cat.id === article.categoryId);
            const categoryName = category ? category.name : '未分类';
            return {
              ...article,
              status: article.status,
              tags: JSON.parse(article.tags) || [],
              createTime: article.createdAt || article.createTime,
              updateTime: article.updatedAt || article.updateTime,
              authorName: article.authorName || '未知',
              category: categoryName,
            };
          });
          return {
            data: transformedArticles,
            total: response?.total || response?.size || 0,
            success: true,
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
