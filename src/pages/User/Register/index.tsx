import { Footer } from '@/components';
import { register } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { SYSTEM_LOGO } from '@/constants';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, useModel, Helmet } from '@umijs/max';
import { message, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});



const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.RegisterParams) => {
    const { userPassword, checkPassword } = values;
    if (userPassword !== checkPassword) {
      message.error('两次输入的密码不一致！');
      return;
    }

    try {
      // 直接传递values给register函数，api.ts中会处理参数转换
      const response = await register(values);
      // 后端 code 判断，成功时跳转
      if (response) {
        message.success('注册成功！');
        // 更新用户信息
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      // 如果 response 为 null 或 undefined，说明被拦截器处理了错误，不需要重复提示
    } catch (error: any) {
      // 只显示网络错误，注册失败的错误已在拦截器中处理
      if (!error.info?.errorMessage) {
        message.error('网络错误，请稍后重试');
      }
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>&apos;登录页&apos; - {Settings.title}</title>
      </Helmet>

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="小鱼博客后台管理中心"
          subTitle={
            <a href="https://www.xfishblog.cn/" target="_blank" rel="noreferrer">
              欢迎注册小鱼博客后台管理中心
            </a>
          }
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码注册',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入账号"
                rules={[
                  {
                    required: true,
                    message: '请输入账号!',
                  },
                ]}
              />
              <ProFormText
                name="nickname"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入昵称"
                rules={[
                  {
                    required: false,
                    message: '请输入昵称!',
                  },
                ]}
              />
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入邮箱"
                rules={[
                  {
                    type: 'email',
                    message: '请输入有效的邮箱地址!',
                  },
                ]}
              />
              <ProFormText
                name="phone"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入手机号"
                rules={[
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入有效的手机号!',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                  {
                    type: 'string',
                    min: 4,
                    message: '密码长度不能小于4位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder="请再次输入密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                  {
                    type: 'string',
                    min: 4,
                    message: '密码长度不能小于4位！',
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
