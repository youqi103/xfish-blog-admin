import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { updateUserPassword } from '@/services/ant-design-pro/api';

interface PasswordModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  userId: number;
}

// 密码强度校验函数
const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: '密码不能为空' };
  }
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少为6位' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密码必须包含大写字母' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密码必须包含小写字母' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密码必须包含数字' };
  }
  return { valid: true };
};

const PasswordModal: React.FC<PasswordModalProps> = ({ visible, onCancel, onSuccess, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // 校验新密码强度
      const passwordCheck = validatePasswordStrength(values.newPassword);
      if (!passwordCheck.valid) {
        message.error(passwordCheck.message);
        return;
      }

      setLoading(true);
      await updateUserPassword(userId, values.oldPassword, values.newPassword);
      message.success('密码修改成功');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('修改密码失败:', error);
      message.error('修改密码失败，请检查旧密码是否正确');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="修改密码"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="oldPassword"
          label="旧密码"
          rules={[
            { required: true, message: '请输入旧密码' },
          ]}
        >
          <Input.Password placeholder="请输入旧密码" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 4, message: '密码长度至少为4位' },
          ]}
        >
          <Input.Password placeholder="请输入新密码（至少4位，包含大小写字母和数字）" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>

        <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: 4, fontSize: 12, color: '#666' }}>
          <strong>密码要求：</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
            <li>长度至少为4位</li>
            <li>必须包含大写字母</li>
            <li>必须包含小写字母</li>
            <li>必须包含数字</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
