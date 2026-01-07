import React, { useState } from 'react';
import { Modal, message, Input, Button, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { resetUserPassword } from '@/services/blog-api';

interface ResetPasswordModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  userId: number;
  username?: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  userId,
  username,
}) => {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState<string>('');

  const handleReset = async () => {
    try {
      setLoading(true);
      const response = await resetUserPassword(userId);

      // 假设后端返回的新密码在 response.data 中
      const password = response.data || '123456'; // 默认密码
      setNewPassword(password);
      message.success('密码重置成功');
      onSuccess();
    } catch (error) {
      console.error('重置密码失败:', error);
      message.error('重置密码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword);
      message.success('密码已复制到剪贴板');
    }
  };

  const handleOk = () => {
    if (newPassword) {
      handleCopyPassword();
      setNewPassword('');
      onCancel();
    } else {
      handleReset();
    }
  };

  const handleCancel = () => {
    setNewPassword('');
    onCancel();
  };

  return (
    <Modal
      title={`重置密码 - ${username || '用户'}`}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
      width={500}
      okText={newPassword ? '复制并关闭' : '确认重置'}
    >
      {!newPassword ? (
        <div>
          <p style={{ marginBottom: 16, color: '#666' }}>
            确定要重置该用户的密码吗？此操作将生成一个新的随机密码。
          </p>
          <div style={{ padding: '12px', background: '#fff7e6', borderRadius: 4, border: '1px solid #ffd591' }}>
            <strong>⚠️ 注意事项：</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#666' }}>
              <li>重置后原密码将失效</li>
              <li>新密码将在重置成功后显示</li>
              <li>建议通知用户及时修改密码</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: 16, color: '#666' }}>
            密码重置成功！新密码如下：
          </p>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input.Password
              value={newPassword}
              readOnly
              size="large"
              style={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 2 }}
            />
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleCopyPassword}
              block
            >
              复制密码
            </Button>
          </Space>
          <div style={{ marginTop: 16, padding: '12px', background: '#f0f9ff', borderRadius: 4, border: '1px solid #91d5ff' }}>
            <strong>💡 提示：</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#666' }}>
              <li>请妥善保管新密码</li>
              <li>建议通过安全渠道通知用户</li>
              <li>用户首次登录后建议修改密码</li>
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ResetPasswordModal;
