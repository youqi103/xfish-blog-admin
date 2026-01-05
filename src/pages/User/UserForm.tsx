import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import type { User } from '@/types/blog';

interface UserFormProps {
  open: boolean;
  user: User | null;
  onSubmit: (values: User) => Promise<void>;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ open, user, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (user) {
        form.setFieldsValue({
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 1, role: 0 });
      }
    }
  }, [open, user, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSubmit(values);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('请完善表单信息');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={user ? '编辑用户' : '新建用户'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
      width={500}
    >
      <Form form={form} layout="vertical">
        {!user && (
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为3-20个字符' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
        )}

        {user && (
          <Form.Item label="用户名">
            <Input value={user.username} disabled />
          </Form.Item>
        )}

        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
          <Input placeholder="请输入昵称" />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        {!user && (
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少为6位' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        <Form.Item name="role" label="角色">
          <Select
            options={[
              { label: '普通用户', value: 0 },
              { label: '管理员', value: 1 },
              { label: '超级管理员', value: 2 },
            ]}
          />
        </Form.Item>

        <Form.Item name="status" label="账户状态">
          <Select
            options={[
              { label: '正常', value: 1 },
              { label: '冻结', value: 0 },
              { label: '待审核', value: 2 },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
