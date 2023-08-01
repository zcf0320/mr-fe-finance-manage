import moment from 'moment';
import { Form, Select } from 'antd';

export const BillColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    hideInSearch: true,
  },
  {
    title: '活动名称',
    dataIndex: 'activityName',
  },
  {
    title: '活动类型',
    dataIndex: 'activityType',
    valueEnum: {
      1: {
        text: '特价',
      },
      2: {
        text: '秒杀',
      },
      3: {
        text: '满减',
      },
      4: {
        text: '满折',
      },
      5: {
        text: '买赠',
      },
      6: {
        text: '加购',
      },
      7: {
        text: '分销',
      },
      8: {
        text: '积分',
      },
      9: {
        text: '自定义',
      }
    },
  },
  {
    title: '活动时间',
    dataIndex: 'settleTime',
    key: 'settleTime1',
    valueType: 'dateRange',
    hideInTable: true,
    fieldProps: {
      defaultValue: [moment().subtract(1, 'M'), moment()],
      disabledDate: (current) => {
        if (current && current > moment().endOf('day')) return true;
        if (current && current < moment().subtract(180, 'days')) return true;
        return false;
      },
    },
  },
  {
    title: '生效时间',
    dataIndex: 'beginTime',
    hideInSearch: true,
  },
  // 发票抬头类型1:个人2:企业
  {
    title: '失效时间',
    dataIndex: 'endTime',
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    hideInSearch: true,
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    hideInSearch: true,
  },
  {
    title: '状态',
    dataIndex: 'activityStatus',
    valueEnum: {
      1: {
        text: '未开始',
      },
      2: {
        text: '进行中',
      },
      3: {
        text: '已结束',
      },
      4: {
        text: '未启用',
      },
    },
  },
  {
    title: 'SKUID',
    dataIndex: 'skuid',
    hideInTable: true,
  }
];

//活动类型
export const activityTypeList = [
    {
      key: 1,
      value: '特价',
      type: 1,
      status: 1,
    },{
      key: 2,
      value: '秒杀',
      type: 1,
      status: 1,
    },{
      key: 3,
      value: '满减',
      type: 3,
      status: 1,
    },{
      key: 4,
      value: '满折',
      type: 4,
      status: 1,
    },{
      key: 5,
      value: '买赠',
      type: 5,
      status: 1,
    },{
      key: 6,
      value: '加购',
      type: 2,
      status: 1,
    },{
      key: 7,
      value: '分销',
      type: '',
      status: 0,
    },{
      key: 8,
      value: '积分',
      type: '',
      status: 0,
    }, {
      key: 9,
      value: '自定义',
      type: '',
      status: 0,
    }
]


//活动类型
export const activityPlatformList = [
  {
    key: 1,
    value: '复星健康云商城',
    status: 1,
  },{
    key: 3,
    value: '邦甸园商城',
    status: 1,
  }
]

