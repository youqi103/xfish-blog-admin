import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, Table, Tag } from 'antd';
import {
  ArrowUpOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import {
  getVisitStatistics,
  getLikeStatistics,
  getCommentStatistics,
  getOverviewStatistics,
  getVisitSources,
} from '@/services/ant-design-pro/api';
import type { VisitData, LikeItem, CommentStats, OverviewData, VisitSource } from '@/types/blog';

const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [visitSources, setVisitSources] = useState<VisitSource[]>([]);
  const [likeData, setLikeData] = useState<LikeItem[]>([]);
  const [commentStats, setCommentStats] = useState<CommentStats | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, visitRes, visitSourceRes, likeRes, commentRes] = await Promise.all([
        getOverviewStatistics(),
        getVisitStatistics({ range: timeRange }),
        getVisitSources({ range: timeRange }),
        getLikeStatistics(),
        getCommentStatistics(),
      ]);

      setOverview(overviewRes.data);
      setVisitData(visitRes.data || []);
      setVisitSources(visitSourceRes.data || []);
      setLikeData(likeRes.data || []);
      setCommentStats(commentRes.data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // 统一图表主题配置
  const chartTheme = {
    colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
    axis: {
      label: { style: { fill: '#666' } },
      tickLine: { style: { stroke: '#e8e8e8' } },
      line: { style: { stroke: '#e8e8e8' } },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      textStyle: { color: '#fff' },
      padding: [8, 12],
      borderRadius: 4,
    },
  };

  // 访问量趋势图配置
  const visitChartConfig = {
    data: visitData,
    xField: 'date',
    yField: 'visits',
    smooth: true,
    color: chartTheme.colors[0],
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: chartTheme.colors[0],
        stroke: '#fff',
        lineWidth: 2,
      },
    },
    area: {
      style: {
        fill: `l(270) 0:#ffffff 1:${chartTheme.colors[0]}20`
      }
    },
    xAxis: {
      label: {
        style: { fill: chartTheme.axis.label.style.fill },
      },
      tickLine: {
        style: chartTheme.axis.tickLine.style,
      },
      line: {
        style: chartTheme.axis.line.style,
      },
    },
    yAxis: {
      label: {
        style: { fill: chartTheme.axis.label.style.fill },
      },
      tickLine: {
        style: chartTheme.axis.tickLine.style,
      },
      line: {
        style: chartTheme.axis.line.style,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.date,
          value: `${datum.visits} 次访问`,
        };
      },
      backgroundColor: chartTheme.tooltip.backgroundColor,
      textStyle: chartTheme.tooltip.textStyle,
      padding: chartTheme.tooltip.padding,
      borderRadius: chartTheme.tooltip.borderRadius,
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 800,
      },
    },
  };

  // 评论状态分布饼图配置
  const commentPieConfig = {
    data: commentStats?.distribution || [
      { type: '已发布', value: 60 },
      { type: '待审核', value: 20 },
      { type: '已拒绝', value: 10 },
      { type: '已删除', value: 10 },
    ],
    angleField: 'value',
    colorField: 'type',
    color: chartTheme.colors,
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
      style: {
        fill: '#666',
        fontSize: 12,
      },
    },
    legend: {
      position: 'bottom',
      itemName: {
        style: { fill: '#666' },
        fontSize: 12,
      },
    },
    statistic: {
      title: {
        content: '评论总数',
        style: { fontSize: 14, color: '#666' },
      },
      value: {
        style: { fontSize: 24, fontWeight: 'bold' },
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.value} 条 (${datum.percentage})`,
        };
      },
      backgroundColor: chartTheme.tooltip.backgroundColor,
      textStyle: chartTheme.tooltip.textStyle,
      padding: chartTheme.tooltip.padding,
      borderRadius: chartTheme.tooltip.borderRadius,
    },
    animation: {
      appear: {
        animation: 'scale-in',
        duration: 600,
      },
    },
  };

  // 访问来源饼图配置
  const visitSourcePieConfig = {
    data: visitSources.map(source => ({
      type: source.source,
      value: source.count,
    })) || [
      { type: '直接访问', value: 50 },
      { type: '搜索引擎', value: 30 },
      { type: '外部链接', value: 20 },
    ],
    angleField: 'value',
    colorField: 'type',
    color: chartTheme.colors,
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
      style: {
        fill: '#666',
        fontSize: 12,
      },
    },
    legend: {
      position: 'bottom',
      itemName: {
        style: { fill: '#666' },
        fontSize: 12,
      },
    },
    statistic: {
      title: {
        content: '访问来源',
        style: { fontSize: 14, color: '#666' },
      },
      value: {
        style: { fontSize: 24, fontWeight: 'bold' },
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.value} 次访问 (${datum.percentage})`,
        };
      },
      backgroundColor: chartTheme.tooltip.backgroundColor,
      textStyle: chartTheme.tooltip.textStyle,
      padding: chartTheme.tooltip.padding,
      borderRadius: chartTheme.tooltip.borderRadius,
    },
    animation: {
      appear: {
        animation: 'scale-in',
        duration: 600,
      },
    },
  };

  const likeColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 60,
      render: (_, record, index) => <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>,
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '点赞数',
      dataIndex: 'count',
      width: 100,
      sorter: (a: LikeItem, b: LikeItem) => b.count - a.count,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{ marginBottom: 24 }}
        extra={
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 150 }}
            options={[
              { label: '最近7天', value: '7days' },
              { label: '最近30天', value: '30days' },
              { label: '最近90天', value: '90days' },
            ]}
          />
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ background: '#e6f7ff' }}>
              <Statistic
                title="今日访问量"
                value={overview?.todayVisits || 0}
                prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
                suffix="次"
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                <ArrowUpOutlined /> 较昨日 +{overview?.visitsGrowth || 0}%
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ background: '#f6ffed' }}>
              <Statistic
                title="总点赞数"
                value={overview?.totalLikes || 0}
                prefix={<LikeOutlined style={{ color: '#52c41a' }} />}
                suffix="次"
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                <ArrowUpOutlined /> 较昨日 +{overview?.likesGrowth || 0}%
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ background: '#fff7e6' }}>
              <Statistic
                title="总评论数"
                value={overview?.totalComments || 0}
                prefix={<MessageOutlined style={{ color: '#fa8c16' }} />}
                suffix="条"
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                <ArrowUpOutlined /> 较昨日 +{overview?.commentsGrowth || 0}%
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ background: '#f9f0ff' }}>
              <Statistic
                title="活跃用户数"
                value={overview?.activeUsers || 0}
                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
                suffix="人"
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                <ArrowUpOutlined /> 较昨日 +{overview?.usersGrowth || 0}%
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="访问量趋势" bordered={false} loading={loading}>
            <div style={{ height: 350 }}>
              <Line {...visitChartConfig} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="点赞趋势" bordered={false} loading={loading}>
            <div style={{ height: 350 }}>
              <Line
                data={likeData.map(item => ({
                  date: item.date,
                  likes: item.likes,
                })) || [
                  { date: '2023-01-01', likes: 10 },
                  { date: '2023-01-02', likes: 20 },
                  { date: '2023-01-03', likes: 15 },
                  { date: '2023-01-04', likes: 25 },
                  { date: '2023-01-05', likes: 30 },
                  { date: '2023-01-06', likes: 28 },
                  { date: '2023-01-07', likes: 35 },
                ]}
                xField="date"
                yField="likes"
                smooth
                color={chartTheme.colors[3]}
                point={{
                  size: 3,
                  shape: 'circle',
                  style: {
                    fill: chartTheme.colors[3],
                    stroke: '#fff',
                    lineWidth: 2,
                  },
                }}
                area={{
                  style: {
                    fill: `l(270) 0:#ffffff 1:${chartTheme.colors[3]}20`
                  }
                }}
                xAxis={{
                  label: {
                    style: { fill: chartTheme.axis.label.style.fill },
                  },
                  tickLine: {
                    style: chartTheme.axis.tickLine.style,
                  },
                  line: {
                    style: chartTheme.axis.line.style,
                  },
                }}
                yAxis={{
                  label: {
                    style: { fill: chartTheme.axis.label.style.fill },
                  },
                  tickLine: {
                    style: chartTheme.axis.tickLine.style,
                  },
                  line: {
                    style: chartTheme.axis.line.style,
                  },
                }}
                tooltip={{
                  formatter: (datum: any) => {
                    return {
                      name: datum.date,
                      value: `${datum.likes} 个点赞`,
                    };
                  },
                  backgroundColor: chartTheme.tooltip.backgroundColor,
                  textStyle: chartTheme.tooltip.textStyle,
                  padding: chartTheme.tooltip.padding,
                  borderRadius: chartTheme.tooltip.borderRadius,
                }}
                animation={{
                  appear: {
                    animation: 'path-in',
                    duration: 800,
                  },
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={24}>
          <Card title="评论状态分布" bordered={false} loading={loading}>
            <div style={{ height: 350 }}>
              <Pie {...commentPieConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="热门文章点赞排行" bordered={false} loading={loading}>
            <Table<LikeItem>
              columns={likeColumns}
              dataSource={likeData}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="访问来源分析" bordered={false} loading={loading}>
            <div style={{ height: 300 }}>
              <Pie {...visitSourcePieConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="评论活跃度分析" bordered={false} loading={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="日均评论数"
                  value={commentStats?.dailyAverage || 0}
                  suffix="条"
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="评论参与率"
                  value={commentStats?.participationRate || 0}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="平均回复数"
                  value={commentStats?.avgReplies || 0}
                  suffix="条"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="评论热度指数"
                  value={commentStats?.heatIndex || 0}
                  suffix="分"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col xs={24} lg={12}>
                <h4 style={{ marginBottom: 16 }}>小时分布</h4>
                <div style={{ height: 250 }}>
                  <Column
                  data={
                    commentStats?.hourDistribution || Array.from({ length: 24 }, (_, i) => ({
                      hour: i,
                      count: Math.floor(Math.random() * 50) + 10,
                    }))
                  }
                  xField="hour"
                  yField="count"
                  color={chartTheme.colors[2]}
                  barSize={20}
                  xAxis={{
                    label: {
                      style: { fill: chartTheme.axis.label.style.fill },
                      formatter: (value: number) => `${value}:00`,
                    },
                    tickLine: {
                      style: chartTheme.axis.tickLine.style,
                    },
                    line: {
                      style: chartTheme.axis.line.style,
                    },
                    tickCount: 12,
                  }}
                  yAxis={{
                    label: {
                      style: { fill: chartTheme.axis.label.style.fill },
                    },
                    tickLine: {
                      style: chartTheme.axis.tickLine.style,
                    },
                    line: {
                      style: chartTheme.axis.line.style,
                    },
                  }}
                  tooltip={{
                    formatter: (datum: any) => {
                      return {
                        name: `${datum.hour}:00`,
                        value: `${datum.count} 条评论`,
                      };
                    },
                    backgroundColor: chartTheme.tooltip.backgroundColor,
                    textStyle: chartTheme.tooltip.textStyle,
                    padding: chartTheme.tooltip.padding,
                    borderRadius: chartTheme.tooltip.borderRadius,
                  }}
                  animation={{
                    appear: {
                      animation: 'scale-in-y',
                      duration: 800,
                    },
                  }}
                />
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <h4 style={{ marginBottom: 16 }}>热门评论文章</h4>
                <Table
                  columns={[
                    {
                      title: '排名',
                      dataIndex: 'rank',
                      width: 60,
                      render: (_, record, index) => (
                        <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>
                      ),
                    },
                    {
                      title: '文章标题',
                      dataIndex: 'title',
                      ellipsis: true,
                    },
                    {
                      title: '评论数',
                      dataIndex: 'commentCount',
                      width: 100,
                      sorter: (a: any, b: any) => b.commentCount - a.commentCount,
                    },
                  ]}
                  dataSource={
                    commentStats?.topArticles || Array.from({ length: 5 }, (_, i) => ({
                      id: i + 1,
                      title: `测试文章 ${i + 1}`,
                      commentCount: Math.floor(Math.random() * 100) + 10,
                    }))
                  }
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
