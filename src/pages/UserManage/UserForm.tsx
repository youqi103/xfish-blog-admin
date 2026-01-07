import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Upload } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';

interface UserFormProps {
  open: boolean;
  user:  API.CurrentUser| null;
  // 使用Partial<User>，因为表单提交的数据可能不包含所有必填字段
  onSubmit: (values: Partial<API.CurrentUser> & { password?: string | undefined; }) => Promise<void>;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ open, user, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    if (open) {
      if (user) {
        const avatar = user.avatar || '';
        setAvatarUrl(avatar);
        form.setFieldsValue({
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          phone: user.phone,
          avatar: avatar,
          role: user.role || 'user',
          status: user.status,
        });
      } else {
        form.resetFields();
        setAvatarUrl('');
        form.setFieldsValue({ status: 'active', role: 'user' });
      }
    }
  }, [open, user, form]);

  // 处理图片上传
  const handleUpload = (file: File) => {
    setUploading(true);

    // 模拟上传，实际项目中需要调用后端上传接口
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarUrl(result);
      form.setFieldsValue({ avatar: result });
      setUploading(false);
      message.success('图片上传成功');
    };
    reader.onerror = () => {
      setUploading(false);
      message.error('图片上传失败');
    };
    reader.readAsDataURL(file);

    return false; // 阻止默认上传行为
  };

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
    setAvatarUrl('');
    onCancel();
  };

  // 上传按钮
  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

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
              { min: 4, message: '密码长度至少为4位' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        {/* 头像上传 */}
        <Form.Item
          name="avatar"
          label="头像"
          rules={[{ required: false, message: '' }]}
          extra="支持 JPG/PNG 格式，建议尺寸 200x200"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleUpload}
              accept="image/*"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
              ) : (
                uploadButton
              )}
            </Upload>

            {/* URL输入框作为备选 */}
            <Form.Item name="avatar" noStyle>
              <Input
                placeholder="或直接输入头像URL"
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value);
                }}
              />
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item name="role" label="角色">
          <Select
            options={[
              { label: '普通用户', value: 'user' },
              { label: '管理员', value: 'admin' },
            ]}
          />
        </Form.Item>

        <Form.Item name="status" label="账户状态">
          <Select
            options={[
              { label: '正常', value: 'active' },
              { label: '未激活', value: 'inactive' },
              { label: '已封禁', value: 'banned' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
