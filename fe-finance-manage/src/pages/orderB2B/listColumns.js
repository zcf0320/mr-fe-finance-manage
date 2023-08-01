import { Switch } from 'antd';
import moment from 'moment';

export const orderColumns = [
  {
    title: '订单编号',
    hideInTable: false,
    dataIndex: 'orderNo',
    key: 'orderNo',
    width:200,
    fieldProps: { allowClear: false},
    // hideInSearch: true,
  },
  {
    title: '订单状态',
    hideInTable: false,
    dataIndex: 'status',
    key: 'status',
    width:100,
    fieldProps: { allowClear: false},
    initialValue:'',
    valueEnum: {
      '': {
        text: '全部',
      },
      0: {
        text: '草稿'
      },
      1: {
        text: '待出库',
      },
      2: {
        text: '出库中',
      },
      3: {
        text: '已出库',
      },
      4: {
        text: '已取消',
      },
      6: {
        text: '部分出库',
      },
    },
  },
  {
    title: '出库类型',
    hideInTable: false,
    hideInSearch: true,
    dataIndex: 'exwarehouseType',
    key: 'exwarehouseType',
    width:100,
    fieldProps: { allowClear: false},
    valueEnum: {
      1: {
        text: '销售出库',
      },
      2: {
        text: '领用出库',
      },
      3: {
        text: '其他出库',
      },
    },
  },
  {
    title: '所属机构',
    hideInTable: true,
    dataIndex: 'orgCode',
    key: 'orgCode',
    width:140,
    fieldProps: { allowClear: false},
    initialValue:'',
    valueEnum: {
      '': {
        text: '全部',
      },
      'fxjk': {
        text: '云药房',
      },
      'fxyjk': {
        text: '云健康',
      },
    },
  },
  {
    title: '异常标识',
    hideInTable: false,
    dataIndex: 'exceptionFlag',
    key: 'exceptionFlag',
    width:100,
    initialValue:'',
    fieldProps: { allowClear: false},
    valueEnum: {
      '': { text: '全部' },
      0: { text: ' ' },
      1: {
        text: '正常',
      },
      2: {
        text: '状态异常',
      },
      3: {
        text: '同步物流异常',
      },
      4: {
        text: '暂停',
      },
      5: {
        text: '物料编码缺失',
      },
      6: {
        text: '发货调用失败',
      },
      7: {
        text: '出库调用失败',
      },
    },
  },
  {
    title: '订单总额',
    hideInTable: false,
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    hideInSearch: true,
    fieldProps: { allowClear: false},
    width:80,
  },
  {
    title: '客户名称',
    hideInTable: false,
    dataIndex: 'buyerName',
    key: 'buyerName',
    width:140,
    fieldProps: { allowClear: false},
  },
  {
    title: '联系人',
    hideInTable: false,
    dataIndex: 'receiverName',
    hideInSearch: true,
    key: 'receiverName',
    fieldProps: { allowClear: false},
    width:120,
  },
  {
    title: '联系人电话',
    hideInTable: false,
    dataIndex: 'receiverTel',  
    hideInSearch: true,
    key: 'receiverTel',
    fieldProps: { allowClear: false},
    width:120,
  },
  {
    title: '收货地址',
    hideInTable: false,
    dataIndex: 'receiverAddress',
    key: 'receiverAddress',
    hideInSearch: true,
    fieldProps: { allowClear: false},
    width:200,
  },
  {
    title: '所属机构',
    hideInTable: false,
    hideInSearch: true,
    dataIndex: 'orgCode',
    key: 'orgCode',
    width:140,
    fieldProps: { allowClear: false},
    initialValue:'',
    valueEnum: {
      '': {
        text: '全部',
      },
      'fxjk': {
        text: '云药房',
      },
      'fxyjk': {
        text: '云健康',
      },
    },
  },
  {
    title: '仓库id',
    hideInTable: false,
    dataIndex: 'warehouseId',
    key: 'warehouseId',
    hideInSearch: true,
    fieldProps: { allowClear: false},
    width:100,
  },
  {
    title: '发货方式',
    hideInTable: false,
    dataIndex: 'deliveryFlag',
    key: 'deliveryFlag',
    width:100,
    initialValue:'',
    fieldProps: { allowClear: false},
    valueEnum: {
      '': { text: '全部' },
      1: {
        text: '物流快递',
      },
      4: {
        text: '自提',
      },
    },
  },
  {
    title: '付款方式',
    hideInTable: false,
    hideInSearch: true,
    dataIndex: 'payType',
    key: 'payType',
    width:100,
    valueEnum: {
      1: {
        text: '现结',
      },
      2: {
        text: '货到付款',
      },
    },
  },
  {
    title: '创建订单时间',
    hideInTable: false,
    // hideInSearch: true,
    valueType: 'dateRange',
    dataIndex: 'createTime',
    key: 'createTime',
    width:200,
    initialValue: [moment().subtract(1, 'M'), moment()],
    fieldProps: { allowClear: false},
    render:(node,record)=><span>{record.createTime}</span>
  },
]

// 订单详情页面显示
export const detailColumns = [
  {
    title: '机构',
    dataIndex: 'orgName',
    key: 'orgName',
    fixed: 'left',
  },
  {
    title: '发货仓库id',
    dataIndex: 'warehouseId',
    key: 'warehouseId',
  },
  {
    title: '物料名称',
    dataIndex: 'outSkuName',
    key: 'outSkuName',
  },
  {
      title: '物料编码',
      dataIndex: 'outSkuId',
      key: 'outSkuId',
    },
    {
      title: 'WMS批次号',
      dataIndex: 'wmsBatchNo',
      key: 'wmsBatchNo',
    },
    {
      title: '有效期止',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '生产批号',
      dataIndex: 'productBatchNo',
      key: 'productBatchNo',
    },
    {
      title: '库存数量',
      dataIndex: 'stockNum',
      key: 'stockNum',
    },
    {
      title: '成本价格',
      dataIndex: 'costPrice',
      key: 'costPrice',
    },
    {
      title: '销售价格',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
    },
    {
      title: '期望出库数量',
      dataIndex: 'outStockNum',
      key: 'outStockNum',
    },
    {
      title: '出库单号',
      dataIndex: 'wmsOrderNo',
      key: 'wmsOrderNo',
    },
    {
      title: '出库状态',
      dataIndex: 'wmsStatus',
      key: 'wmsStatus',
    },
    {
      title: '实际出库数量',
      dataIndex: 'realQuantity',
      key: 'realQuantity',
    },
    {
      title: '物流公司',
      dataIndex: 'expressCompany',
      key: 'expressCompany',
    },
    {
      title: '物流单号',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
    },
];

// 新建订单页面显示
export const addColumns = [
  {
    title: '机构',
    dataIndex: 'orgName',
    key: 'orgName',
    fixed: 'left',
  },
  {
    title: '发货仓库id',
    dataIndex: 'warehouseId',
    key: 'warehouseId',
  },
  {
    title: '物料名称',
    dataIndex: 'outSkuName',
    key: 'outSkuName',
  },
  {
      title: '物料编码',
      dataIndex: 'outSkuId',
      key: 'outSkuId',
    },
    {
      title: 'WMS批次号',
      dataIndex: 'wmsBatchNo',
      key: 'wmsBatchNo',
    },
    {
      title: '有效期止',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '生产批号',
      dataIndex: 'productBatchNo',
      key: 'productBatchNo',
    },
    {
      title: '库存数量',
      dataIndex: 'stockNum',
      key: 'stockNum',
    },
    {
      title: '成本价格',
      dataIndex: 'costPrice',
      key: 'costPrice',
    },
];