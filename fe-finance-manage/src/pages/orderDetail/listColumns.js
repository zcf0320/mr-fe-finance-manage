function judgeGoodsClass(code) {
  let type;
  switch (code) {
    case 1:
      type = '大健康药品';
      break;
    case 2:
      type = 'OTC药品';
      break;
    case 3:
      type = '医疗器械';
      break;
    default:
      type = '处方药品';
  }
  return type;
}

export const otherOrderList = [
  {
    title: 'SKUID',
    dataIndex: 'skuId',
    key: 'skuId',
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
  },
  {
    title: '商品分类',
    dataIndex: 'goodsKind',
    key: 'goodsKind',
    render: (text, record) => <span>{judgeGoodsClass(record.goodsKind)}</span>,
  },
  {
    title: '商品条码',
    dataIndex: 'outBarCode',
    key: 'outBarCode',
  },
  {
    title: '购买数量',
    dataIndex: 'goodsNum',
    key: 'goodsNum',
  },
  {
    title: '复星单价',
    dataIndex: 'retailPrice',
    key: 'retailPrice',
  },
  {
    title: '平台单价',
    dataIndex: 'thirdRetailPrice',
    key: 'thirdRetailPrice',
  },
  {
    title: '商品实付',
    dataIndex: 'itemTotalAmount',
    key: 'itemTotalAmount',
  },
];

export const otherOutStock = [
  {
    title: '出库单号',
    dataIndex: 'wmsOrderNo',
    key: 'wmsOrderNo',
  },
  {
    title: '出库类型',
    dataIndex: 'wmsType',
    key: 'wmsType',
    render: (dom, record) => <span>{record.wmsType == 1 ? '出库' : '入库'}</span>,
  },
  {
    title: '仓库id',
    dataIndex: 'wmsWarehouseId',
    key: 'wmsWarehouseId',
  },
  {
    title: 'SKUID',
    dataIndex: 'skuId',
    key: 'skuId',
  },
  {
    title: '物料编码',
    dataIndex: 'outSkuId',
    key: 'outSkuId',
  },
  {
    title: '出库单状态',
    dataIndex: 'wmsStatusDesc',
    key: 'wmsStatusDesc',
  },
  {
    title: '应发数量',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: '实发数量',
    dataIndex: 'realQuantity',
    key: 'realQuantity',
  },
  {
    title: '发货物流',
    dataIndex: 'expressCompany',
    key: 'expressCompany',
  },
  {
    title: '物流编号',
    dataIndex: 'invoiceNo',
    key: 'invoiceNo',
  },
  {
    title: '出库时间',
    dataIndex: 'wmsFinishTime',
    key: 'wmsFinishTime',
  },
];

export const otherLogistics = [
  {
    title: 'SKUID',
    dataIndex: 'skuId',
    key: 'skuId',
  },
  {
    title: '发货数量',
    dataIndex: 'goodsNum',
    key: 'goodsNum',
  },
  {
    title: '物流公司',
    dataIndex: 'expressCompany',
    key: 'expressCompany',
  },
  {
    title: '物流编号',
    dataIndex: 'invoiceNo',
    key: 'invoiceNo',
  },
  {
    title: '发货时间',
    dataIndex: 'deliveryTime',
    key: 'deliveryTime',
  },
  {
    title: '是否收货',
    dataIndex: 'getGoods',
    key: 'getGoods',
    render: (text, record) => <span>{receiverTime ? '是' : '否'}</span>,
  },
  {
    title: '收货时间',
    dataIndex: 'receiverTime',
    key: 'receiverTime',
  },
];

const turnInvoiceStatus = (code) => {
  let type;
  switch (code) {
    case 1:
      type = '待开票';
      break;
    case 2:
      type = '开票中';
      break;
    case 3:
      type = '开票成功';
      break;
    case 4:
      type = '开票失败';
      break;
    case 5:
      type = '已冲红';
      break;
    default:
      type = '';
  }
  return type;
};
export const orderInvoicingList = [
  {
    title: '开票订单号',
    dataIndex: 'invoiceNo',
    key: 'invoiceNo',
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    key: 'orderType',
    render: (text, record) => <span>{record.orderType == 1 ? '蓝票' : '红票'}</span>,
  },
  {
    title: '抬头类型',
    dataIndex: 'invoiceTitle',
    key: 'invoiceTitle',
    render: (text, record) => <span>{record.invoiceTitle == 1 ? '个人' : '企业'}</span>,
  },
  {
    title: '购方抬头',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: '购方税号',
    dataIndex: 'customerCode',
    key: 'customerCode',
  },
  {
    title: '接收邮箱',
    dataIndex: 'customerEmail',
    key: 'customerEmail',
  },
  {
    title: '开票状态',
    dataIndex: 'invoiceStatus',
    key: 'invoiceStatus',
    render: (text, record) => <span>{turnInvoiceStatus(record.invoiceStatus)}</span>,
  },
];
