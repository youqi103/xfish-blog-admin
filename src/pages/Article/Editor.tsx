import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Modal, Form, Input, Select, message } from 'antd';
import { queryCategories, queryTags } from '@/services/ant-design-pro/api';
import { migrateTags} from '@/constants';
import type { Article, Category,Tag } from '@/types/blog';

interface ArticleEditorProps {
  open: boolean;
  article: Article | null;
  initialContent: string;
  onSubmit: (values: Article) => Promise<void>;
  onCancel: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  open,
  article,
  initialContent,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);

  // 获取分类列表
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await queryCategories();
      console.log('获取分类列表成功:', response);

      setCategories(response.data || []);
    } catch (error: any) {
      console.error('获取分类列表失败:', error);
      const errorMsg = error?.message || error?.description || '获取分类列表失败';
      message.error(errorMsg);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // 获取标签列表
  const fetchTags = async () => {
    setTagsLoading(true);
    try {
      const response = await queryTags();
      setTags(response.data || []);
    } catch (error: any) {
      console.error('获取标签列表失败:', error);
      const errorMsg = error?.message || error?.description || '获取标签列表失败';
      message.error(errorMsg);
      setTags([]);
    } finally {
      setTagsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setContent(initialContent || '');
      fetchCategories();
      fetchTags();
      if (article) {
        const tagsArray = migrateTags(article.tags);
        form.setFieldsValue({
          title: article.title,
          categoryId: article.categoryId,
          tags: tagsArray,
          summary: article.summary,
          status: article.status ? parseInt(String(article.status)) : 0,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, article, initialContent, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const articleData: Article = {
        id: article?.id || 0,
        title: values.title,
        content: content,
        summary: values.summary || '',
        categoryId: values.categoryId,
        tags: values.tags || [],
        status: values.status !== undefined ? String(values.status) : '0',
      };

      await onSubmit(articleData);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error('提交文章失败:', error);
      if (error?.errorFields) {
        message.error('请完善表单信息');
      } else {
        const errorMsg = error?.message || error?.description || '提交失败，请稍后重试';
        message.error(errorMsg);
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setContent('');
    onCancel();
  };

  return (
    <Modal
      title={article ? '编辑文章' : '新建文章'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ status: 0 }}>
        <Form.Item
          name="title"
          label="文章标题"
          rules={[{ required: true, message: '请输入文章标题' }]}
        >
          <Input placeholder="请输入文章标题" />
        </Form.Item>

        <Form.Item name="categoryId" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
          <Select
            placeholder="请选择分类"
            loading={categoriesLoading}
            options={categories.map(category => ({
              label: category.name,
              value: category.id
            }))}
            allowClear
          />
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Select
            mode="tags"
            placeholder="请选择或输入标签"
            style={{ width: '100%' }}
            loading={tagsLoading}
            options={tags.map(tag => ({
              label: tag.name,
              value: tag.name
            }))}
          />
        </Form.Item>

        <Form.Item name="summary" label="文章摘要">
          <Input.TextArea rows={3} placeholder="请输入文章摘要（可选）" maxLength={200} showCount />
        </Form.Item>

        <Form.Item name="status" label="发布状态">
          <Select
            options={[
              { label: '草稿', value: 0 },
              { label: '立即发布', value: 1 },
            ]}
          />
        </Form.Item>

        <Form.Item label="文章内容" required>
          <div data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={400}
              preview="edit"
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArticleEditor;
