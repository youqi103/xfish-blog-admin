import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, Radio, message } from 'antd';
import type { Comment } from '@/types/blog';

interface AuditModalProps {
  open: boolean;
  comment: Comment | null;
  onSubmit: (record: Comment, handleType: number, reason?: string, notifyUser?: boolean) => Promise<void>;
  onCancel: () => void;
}

const AuditModal: React.FC<AuditModalProps> = ({ open, comment, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [handleType, setHandleType] = useState<number>(1);
  const [notifyUser, setNotifyUser] = useState<boolean>(true);

  // 重置表单当 open 状态变化时
  useEffect(() => {
    if (open) {
      setHandleType(1);
      setNotifyUser(true);
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (comment) {
        await onSubmit(comment, handleType, values.reason, notifyUser);
      }

      setLoading(false);
      form.resetFields();
      onCancel();
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        message.error('请完善表单信息');
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="处理举报"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
      okText="确认处理"
      cancelText="取消"
    >
      {comment && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: '#fff2f0',
            borderRadius: 4,
            border: '1px solid #ffccc7',
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <strong>被举报评论：</strong>
          </div>
          <div style={{ marginBottom: 4 }}>评论内容：{comment.content}</div>
          <div style={{ marginBottom: 4 }}>评论用户：{comment.authorName || comment.userName}</div>
          <div>举报数量：{comment.reportCount || 0} 次</div>
        </div>
      )}

      <Form form={form} layout="vertical">
        <Form.Item
          label="处理方式"
          name="handleType"
          rules={[{ required: true, message: '请选择处理方式' }]}
          initialValue={1}
        >
          <Radio.Group
            value={handleType}
            onChange={(e) => setHandleType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value={1}>忽略举报（评论正常）</Radio.Button>
            <Radio.Button value={2}>删除评论</Radio.Button>
            <Radio.Button value={3}>警告用户</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {handleType !== 1 && (
          <Form.Item
            label="处理原因"
            name="reason"
            rules={[{ required: true, message: '请输入处理原因' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="请输入处理原因（将记录在案）"
              maxLength={500}
              showCount
            />
          </Form.Item>
        )}

        <Form.Item label="通知用户">
          <Select
            value={notifyUser ? 'true' : 'false'}
            onChange={(value) => setNotifyUser(value === 'true')}
            options={[
              { label: '是，通过站内信通知用户处理结果', value: 'true' },
              { label: '否，不通知用户', value: 'false' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuditModal;
