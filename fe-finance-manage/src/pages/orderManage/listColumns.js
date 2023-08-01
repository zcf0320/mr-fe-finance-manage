import moment from 'moment';
import basicData from '@utils/basicData';

export const getOrderColumns = ({
  viewReason,
  basicOrgs
}) => (
  [
    {
      title: '订单编号',
      hideInTable: false,
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 200,
      fieldProps: { allowClear: false },
      // hideInSearch: true,
      order: 15
    },
    {
      title: '订单状态',
      hideInTable: false,
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fieldProps: { allowClear: false },
      initialValue: '',
      valueEnum: {
        '': {
          text: '全部',
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
        5: {
          text: '已完成',
        },
        6: {
          text: '部分出库',
        },
      },
      order: 14
    },
    {
      title: '订单类型',
      hideInTable: false,
      dataIndex: 'orderType',
      key: 'orderType',
      width: 100,
      fieldProps: { allowClear: false },
      valueEnum: {
        0: {
          text: '默认',
        },
        1: {
          text: '全球购',
        },
        2: {
          text: '权益包',
        },
        3: {
          text: '疫苗',
        },
        4: {
          text: 'o2o',
        },
        5: {
          text: '连锁',
        },
        6: {
          text: '云药房',
        },
      },
      order: 13
    },
    {
      title: '发货标识',
      hideInTable: false,
      dataIndex: 'deliveryFlag',
      key: 'deliveryFlag',
      width: 140,
      fieldProps: { allowClear: false },
      initialValue: '',
      valueEnum: {
        '': {
          text: '全部',
        },
        0: {
          text: '平台自处理',
        },
        1: {
          text: 'WMS',
        },
        2: {
          text: '供应商api',
        },
        3: {
          text: '供应商线下',
        },
        4: {
          text: '自提',
        },
      },
      order: 12
    },
    {
      title: '平台',
      hideInTable: false,
      dataIndex: 'thirdPlatformId',
      key: 'thirdPlatformId',
      width: 100,
      fieldProps: { allowClear: false },
      initialValue: '',
      valueEnum: {
        '': { text: '全部' },
        ...basicData.getPlatForm()
      },
      order: 11
    },
    {
      title: '平台订单号',
      hideInTable: false,
      dataIndex: 'thirdOrderNo',
      key: 'thirdOrderNo',
      fieldProps: { allowClear: false },
      width: 200,
      // hideInSearch: true,
      order: 10
    },
    {
      title: '平台订单状态',
      hideInTable: false,
      dataIndex: 'thirdStatusDesc',
      key: 'thirdStatusDesc',
      hideInSearch: true,
      fieldProps: { allowClear: false },
      width: 100,
    },
    {
      title: '店铺',
      hideInTable: false,
      dataIndex: 'supplierName',
      key: 'supplierName',
      hideInSearch: true,
      fieldProps: { allowClear: false },
      width: 100,
    },
    {
      title: '异常标识',
      hideInTable: false,
      dataIndex: 'exceptionFlag',
      key: 'exceptionFlag',
      width: 100,
      initialValue: '',
      fieldProps: { allowClear: false },
      valueEnum: {
        '': { text: '全部' },
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
      order: 9
    },
    {
      title: '订单审核状态',
      hideInTable: false,
      dataIndex: 'checkStatus',
      key: 'checkStatus',
      width: 100,
      initialValue: '',
      fieldProps: { allowClear: false },
      valueEnum: {
        '': {
          text: '全部',
        },
        0: {
          text: '无需审核',
        },
        1: {
          text: '待审核',
        },
        2: {
          text: '已审核',
        },
        3: {
          text: '待中宝审核',
        },
      },
      order: 8
    }, {
      title: '处方审核平台',
      dataIndex: "inquiryTwiceCheckPlatform",
      initialValue: '',
      width: 110,
      valueEnum: {
        0: "无二审",
        1: "平台二审",
        2: "中宝二审",
        3: "国大二审",
        '': '全部'
      },
      order: 1,
      render: (_, { inquiryTwiceCheckPlatformDesc }) => inquiryTwiceCheckPlatformDesc
    }, {
      title: '处方审核状态',
      dataIndex: 'inquiryTwiceCheckStatus',
      initialValue: '',
      width: 110,
      valueEnum: {
        0: "待审核",
        1: "成功",
        "-1": "失败",
        2: "审核中",
        3: "调用接口失败",
        '': '全部'
      },
      order: 0,
      render: (_, { inquiryTwiceCheckStatusDesc, ...r }) => (
        <>
          {inquiryTwiceCheckStatusDesc}
          <br />
          {
            (r.inquiryTwiceCheckStatus == -1) && (
              <a onClick={viewReason(r)}>查看原因</a>
            )
          }
        </>
      )
    }, {
      title: '订单总额',
      hideInTable: false,
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      hideInSearch: true,
      fieldProps: { allowClear: false },
      width: 80,
    },
    {
      title: '订单实付金额',
      hideInTable: false,
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      hideInSearch: true,
      fieldProps: { allowClear: false },
      width: 100,
    },
    {
      title: '下单时间',
      hideInTable: false,
      valueType: 'dateRange',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      initialValue: [moment().subtract(1, 'M'), moment()],
      fieldProps: { allowClear: false },
      render: (node, record) => <span>{record.createTime}</span>,
      order: 7
    },
    {
      title: '收货地址',
      hideInTable: false,
      dataIndex: 'wholeAddress',
      key: 'wholeAddress',
      hideInSearch: true,
      fieldProps: { allowClear: false },
      width: 200,
    },
    {
      title: '收货人手机号',
      hideInTable: true,
      dataIndex: 'buyerTel',
      // hideInSearch: true,
      key: 'buyerTel',
      fieldProps: { allowClear: false },
      order: 6
    },
    {
      title: '订单创建方式',
      hideInTable: true,
      dataIndex: 'offlineImportFlag',
      key: 'offlineImportFlag',
      initialValue: '',
      fieldProps: { allowClear: false },
      valueEnum: {
        '': {
          text: '全部',
        },
        0: {
          text: '平台同步',
        },
        1: {
          text: '线下导入',
        }
      },
      order: 5
    }, {
      title: 'skuid',
      hideInTable: true,
      dataIndex: 'skuId',
      order: 4
    }, {
      title: '商品条码',
      hideInTable: true,
      dataIndex: 'outBarCode',
      order: 3
    }, {
      title: '所属机构',
      dataIndex: 'orgCode',
      initialValue: '',
      width: 120,
      valueEnum: {
        ...basicOrgs,
        '': '全部'
      },
      order: 2,
      render: (t, d) => d.orgName
    }, {
      title: '仓库id',
      hideInSearch: true,
      dataIndex: 'warehouseId',
      width: 100,
    }
  ]
)
