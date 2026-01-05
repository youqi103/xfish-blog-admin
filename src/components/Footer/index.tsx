import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      copyright="XFishBlog"
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'deepseek',
          title: 'deepseek',
          href: 'https://chat.deepseek.com/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined /> 忧戚 GitHub
            </>
          ),
          href: 'https://github.com/youqi333',
          blankTarget: true,
        },
        {
          key: 'chat-gpt',
          title: 'chat-gpt',
          href: 'https://chatgpt.com/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
