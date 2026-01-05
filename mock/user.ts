import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        success: true,
      });
      return;
    }
    res.send({
      success: true,
      data: {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        access: getAccess(),
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
      },
    });
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/user/login': async (req: Request, res: Response) => {
    const { userPassword, userAccount, type } = req.body;
    await waitTime(2000);
    if (userPassword === 'ant.design' && userAccount === 'admin') {
      res.send({
        code: 0,
        data: {
          id: 1,
          userRole: 0,
          username: '管理员',
          userAccount: userAccount,
          status: 1,
          planetCode: 123,
          createTime: new Date(),
        },
        message: '登录成功',
      });
      access = 'admin';
      return;
    }
    if (userPassword === 'ant.design' && userAccount === 'user') {
      res.send({
        code: 0,
        data: {
          id: 2,
          userRole: 1,
          username: '普通用户',
          userAccount: userAccount,
          status: 1,
          planetCode: 456,
          createTime: new Date(),
        },
        message: '登录成功',
      });
      access = 'user';
      return;
    }

    res.send({
      code: 1,
      message: '账号或密码错误',
    });
    access = 'guest';
  },
  'POST /api/login/outLogin': (req: Request, res: Response) => {
    access = '';
    res.send({ data: {}, success: true });
  },
  'POST /api/user/register': (req: Request, res: Response) => {
    res.send({
      code: 0,
      data: {
        id: Date.now(),
        userRole: 1,
        username: '新用户',
        userAccount: req.body.userAccount,
        status: 1,
        planetCode: req.body.planetCode,
        createTime: new Date(),
      },
      message: '注册成功',
    });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,

  // 用户列表接口
  'GET /api/user/list': (req: Request, res: Response) => {
    const { current = 1, pageSize = 10 } = req.query;

    // 模拟用户数据
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        nickname: '超级管理员',
        email: 'admin@xfishblog.cn',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        role: 'admin',
        status: 'active',
        registeredAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        username: 'test_user',
        nickname: '测试用户',
        email: 'test@xfishblog.cn',
        avatar: '',
        role: 'user',
        status: 'active',
        registeredAt: '2024-02-15T10:30:00.000Z',
        lastLoginAt: '2024-03-10T08:45:00.000Z',
        createdAt: '2024-02-15T10:30:00.000Z',
        updatedAt: '2024-03-10T08:45:00.000Z',
      },
      {
        id: 3,
        username: 'editor_01',
        nickname: '编辑小张',
        email: 'editor@xfishblog.cn',
        avatar: '',
        role: 'user',
        status: 'active',
        registeredAt: '2024-03-01T14:20:00.000Z',
        lastLoginAt: '2024-03-12T16:30:00.000Z',
        createdAt: '2024-03-01T14:20:00.000Z',
        updatedAt: '2024-03-12T16:30:00.000Z',
      },
      {
        id: 4,
        username: 'visitor_01',
        nickname: '游客一号',
        email: 'visitor@xfishblog.cn',
        avatar: '',
        role: 'user',
        status: 'frozen',
        registeredAt: '2024-03-05T09:15:00.000Z',
        lastLoginAt: '2024-03-08T11:20:00.000Z',
        createdAt: '2024-03-05T09:15:00.000Z',
        updatedAt: '2024-03-08T11:20:00.000Z',
      },
      {
        id: 5,
        username: 'moderator',
        nickname: '版主小李',
        email: 'moderator@xfishblog.cn',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/LlqpZjnUYp/BiazfanxmamNRoxxVxka.png',
        role: 'user',
        status: 'active',
        registeredAt: '2024-02-20T08:00:00.000Z',
        lastLoginAt: '2024-03-13T07:30:00.000Z',
        createdAt: '2024-02-20T08:00:00.000Z',
        updatedAt: '2024-03-13T07:30:00.000Z',
      },
    ];

    // 分页处理
    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const records = mockUsers.slice(start, end);

    res.send({
      code: 0,
      data: {
        records: records,
        total: mockUsers.length,
        current: Number(current),
        size: Number(pageSize),
      },
      message: '查询成功',
    });
  },
};
