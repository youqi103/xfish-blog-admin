import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Modal, Form, Input, Select, message } from 'antd';
import { queryCategories, queryTags } from '@/services/blog-api';
import type { Article, Category, Tag } from '@/types/blog';

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
      setCategories(response.data || []);
    } catch (error) {
      message.error('获取分类列表失败');
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
    } catch (error) {
      message.error('获取标签列表失败');
    } finally {
      setTagsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setContent(initialContent || '');
      // 加载分类和标签列表
      fetchCategories();
      fetchTags();
      if (article) {
        form.setFieldsValue({
          title: article.title,
          category: article.category,
          tags: article.tags,
          summary: article.summary,
          status: article.status,
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
        ...values,
        content: content,
        contentHtml: content,
        status: values.status || 0,
      };

      await onSubmit(articleData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('请完善表单信息');
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

        <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
          <Select
            placeholder="请选择分类"
            loading={categoriesLoading}
            options={categories.map(category => ({
              label: category.name,
              value: category.name
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
