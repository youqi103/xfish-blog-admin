import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, message } from 'antd';
import type { User } from '@/types/blog';
import { queryRoles } from '@/services/blog-api';

interface RoleModalProps {
  open: boolean;
  user: User | null;
  onSubmit: (id: number, roleId: number) => Promise<void>;
  onCancel: () => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ open, user, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([]);

  const fetchRoles = async () => {
    try {
      const response = await queryRoles();
      const options = (response.data || []).map((role: any) => ({
        label: role.name,
        value: role.id,
      }));
      setRoleOptions(options);
    } catch (error) {
      console.error('获取角色列表失败');
      // 如果获取角色列表失败，使用默认选项
      setRoleOptions([
        { label: '普通用户', value: 0 },
        { label: '管理员', value: 1 },
        { label: '超级管理员', value: 2 },
      ]);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRoles();
      if (user) {
        form.setFieldsValue({
          role: user.roleId,
        });
      }
    }
  }, [open, user, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (user) {
        await onSubmit(user.id, values.role);
      }

      setLoading(false);
      form.resetFields();
      onCancel();
    } catch (error) {
      setLoading(false);
      message.error('请选择角色');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`分配角色 - ${user?.username}`}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="role" label="选择角色" rules={[{ required: true, message: '请选择角色' }]}>
          <Select placeholder="请选择角色" options={roleOptions} />
        </Form.Item>

        <Form.Item label="权限预览">
          <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: 4 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>普通用户权限：</strong>
              <div style={{ color: '#666', fontSize: 12 }}>浏览文章、发表评论、点赞</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>管理员权限：</strong>
              <div style={{ color: '#666', fontSize: 12 }}>文章管理、评论审核、统计数据</div>
            </div>
            <div>
              <strong>超级管理员权限：</strong>
              <div style={{ color: '#666', fontSize: 12 }}>用户管理、系统配置、所有权限</div>
            </div>
          </div>
        </Form.Item>

        <Form.Item label="通知用户">
          <Select
            defaultValue="true"
            options={[
              { label: '是，通过站内信通知用户角色变更', value: 'true' },
              { label: '否，不通知用户', value: 'false' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleModal;
