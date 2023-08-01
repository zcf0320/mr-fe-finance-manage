const turnWmsStatus = (code)=> {
  let type;
  switch (code){
    case 11:
      type ='待仓库收货';
      break;
    case 12 :
      type ='仓库已收货';
      break;
    case 13 :
      type ='仓库审核完成';
      break;
    default:
      type ='入库取消';
  } 
  return type
}
export const returnList =[
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
    title: '供应商名称',
    dataIndex: 'supplierName',
    key: 'supplierName',
  },
  {
    title: '商品分类',
    dataIndex: 'goodsKind',
    key: 'goodsKind',
  },
  {
    title: '售价',
    dataIndex: 'goodsRetailPrice',
    key: 'goodsRetailPrice',
  },
  {
    title: '退货数量',
    dataIndex: 'refundGoodsNum',
    key: 'refundGoodsNum',
  },
  {
    title: '总价',
    dataIndex: 'goodsTotalAmount',
    key: 'goodsTotalAmount',
  },
]
export const discountList =[
  {
    title: '优惠类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '优惠活动id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '优惠金额',
    dataIndex: 'price',
    key: 'price',
  },
]
export const warehousingList=[
  {
    title: '入库单号',
    dataIndex: 'wmsOrderNo',
    key: 'wmsOrderNo',
  },
  {
    title: '入库类型',
    dataIndex: 'wmsType',
    key: 'wmsType',
    render:(dom,record)=><span>{ record.wmsType ==1 ? '出库' : '入库'}</span>
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
    title: '入库单状态',
    dataIndex: 'wmsStatus',
    key: 'wmsStatus',
    render:(dom,record)=><span>{turnWmsStatus(record.wmsStatus)}</span>
  },
  {
    title: '应入数量',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: '实录入数量',
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
    title: '入库时间',
    dataIndex: 'wmsFinishTime',
    key: 'wmsFinishTime',
  },
 
]