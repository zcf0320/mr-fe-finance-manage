import { Switch } from 'antd';
import moment from 'moment';
import basicData from '@utils/basicData';

export const afterSaleColumns = [
  {
    title: '售后单编号',
    hideInTable: false,
    dataIndex: 'refundNo',
    key: 'refundNo',
    fieldProps: { allowClear: false},
    width:200,
    // hideInSearch: true,
  },
  {
    title: '平台退单编号',
    hideInTable: false,
    dataIndex: 'thirdRefundNo',
    key: 'thirdRefundNo',
    fieldProps: { allowClear: false},
    width:200,
    // hideInSearch: true,
  },
  {
    title: '订单平台',
    hideInTable: false,
    dataIndex: 'thirdPlatformId',
    key: 'thirdPlatformId',
    width:100,
    initialValue:'',
    fieldProps: { allowClear: false, placeholder: '请选择' },
    valueEnum: {
      '': { text: '全部' },
      ...basicData.getPlatForm()
    },
  },
  {
    title: '平台订单编号',
    hideInTable: false,
    dataIndex: 'thirdOrderNo',
    key: 'thirdOrderNo',
    fieldProps: { allowClear: false},
    width:200,
    // hideInSearch: true,
  },
  {
    title: '订单编号',
    hideInTable: false,
    dataIndex: 'orderNo',
    key: 'orderNo',
    fieldProps: { allowClear: false},
    width:200,
    // hideInSearch: true,
  },
  {
    title: '店铺名称',
    hideInTable: false,
    dataIndex: 'supplierName',
    key: 'supplierName',
    fieldProps: { allowClear: false},
    width:100,
    // hideInSearch: true,
  },
  {
    title: '售后类型',
    hideInTable: false,
    dataIndex: 'refundType',
    key: 'refundType',
    hideInSearch: true,
    width:80,
    initialValue:'',
    fieldProps: { allowClear: false},
    valueEnum: {
      '': { text: '全部' },
      1: {
        text: '退货',
      }
    },
  },
  {
    title: '售后状态',
    hideInTable: false,
    dataIndex: 'status',
    key: 'status',
    width:140,
    initialValue:'',
    fieldProps: { allowClear: false},
    valueEnum: {
      '': { text: '全部' },
      1: {
        text: '待填退货物流',
      },
      2: {
        text: '待仓库收货',
      },
      3: {
        text: '仓库已收货',
      },
      4: {
        text: '仓库收货完成',
      },
      5: {
        text: '退货取消',
      },
    },
    hideInSearch: false,
  },
  {
    title: '收货人手机号',
    hideInTable: false,
    dataIndex: 'buyerTel',
    key: 'buyerTel',
    width:120,
    fieldProps: { allowClear: false},
    hideInSearch: false
  },
  {
    title: '收货地址',
    hideInTable: false,
    dataIndex: 'address',
    key: 'address',
    fieldProps: { allowClear: false},
    hideInSearch: true,
    width:200,
  },
  {
    title: '订单实付',
    hideInTable: false,
    dataIndex: 'orderPaymentAmount',
    key: 'orderPaymentAmount',
    hideInSearch: true,
    fieldProps: { allowClear: false},
    width:100,
  },
  {
    title: '退款金额',
    hideInTable: false,
    dataIndex: 'refundAmount',
    key: 'refundAmount',
    hideInSearch: true,
    fieldProps: { allowClear: false},
    width:100,
  },
  {
    title: '创建时间',
    hideInTable: false,
    valueType: 'dateRange',
    dataIndex: 'createTime',
    key: 'createTime',
    width:160,
    initialValue:[moment().subtract(1, 'M'), moment()],
    fieldProps: { allowClear: false, initialValue: [moment().subtract(1, 'M'), moment()] },
    hideInSearch: false,
    render:(node,record)=><span>{record.createTime}</span>
  },
]