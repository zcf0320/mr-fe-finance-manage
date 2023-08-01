import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss'
import { Space, Modal, notification, Button } from 'antd'
import moment from 'moment';
import { LiquidationList, ManualSettles } from '@api/liquiManage'
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import fetch from '@utils/request';
import writeOffSearch from '../../../enumeration/clearDes'
const ClearDetails = (props) => {
  const { cacheUser, userInfo } = props;
  const actionRef = useRef();
  //时间选择
  const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  const appendZero = (obj) => {
    if (obj < 10) {
      return '0' + obj
    } else {
      return obj
    }
  }
  const Y = date.getFullYear()
  const M = appendZero(date.getMonth() + 1)
  const D = appendZero(date.getDate())
  const initDate = Y + "-" + M + "-" + D
  const [beginTime, setBeginTime] = useState(moment(initDate))//开始日期   
  const [endTime, setEndTime] = useState(moment(initDate))//结束日期
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operation, setOperation] = useState();
  const [a, setA] = useState("0")
  const [id, setId] = useState()
  const [tellerNo, setTellerNo] = useState(userInfo.username)
  const [DownloadBeginTime, setDownloadBeginTime] = useState()
  const [DownloadEndTime, setDownloadEndTime] = useState()
  const [DownloadTradeType, setDownLoadTradeType] = useState()
  const [DownloadClearStatus, setDownLoadClearStatus] = useState()
  const [DownloadChannelType, setDownLoadChannelType] = useState()
  // 订单号
  const [Downloadordernumber,setDownLoadorderNumber] = useState()
  // 三方订单号
  const [Downloadpaymentordernumber,setDownloadPaymentorderNumber] = useState()
  const [oposData, setOposDate] = useState(props.location.query)
  const [serialNumber, setSerialNumber] = useState(oposData ? oposData.clearJournalNo : null)
  const [matchDate, setMatchDate] = useState(props.location.query ? moment(props.location.query.matchAccountDate) : moment(initDate))//日期
  const [passageway, setpassAgeway] = useState(oposData ? oposData.channelType : null)
  const [tradeway, setTradeway] = useState(oposData ? oposData.tradeType : null)
  //清算
  const clearDes = async (id) => {
    setId(id)
  }

  const rendermodal = (a) => {
    if (a === '1') {
      return <div>
        确定进行清算吗？
      </div>
    } else if (a === '2') {
      return <div>
        确定导出吗?
      </div>
    }
  }
  //弹框判断
  const look = (a) => {
    if (a === "1") {
      setOperation("清算");
      setA(a)
    } else if (a === "2") {
      setOperation("导出");
      setA(a)
    }
    setIsModalVisible(true);
  };
  //弹框确认
  const handleOk = async () => {

    if (a === '1') {
      let params = {
        id: id
      }
      let res = await ManualSettles(params)
      if (res.success) {
        openNotification('清算成功')
        actionRef.current.reload()
      } else {
        openNotification(res.errorMsg)
      }
      setIsModalVisible(false);
    } else if (a === '2') {
      const params = {
        tellerNo: tellerNo,
        beginDate: DownloadBeginTime,
        endDate: DownloadEndTime,
        tradeType: DownloadTradeType ? DownloadTradeType : null,
        clearStatus: DownloadClearStatus ? DownloadClearStatus : null,
        channelType: DownloadChannelType ? DownloadChannelType : null,
        body: {
          exportNum: "1",
          fileName: "清算结果明细文件" + DownloadBeginTime + '-' + DownloadEndTime + ".csv",
        },
      }
      setIsModalVisible(false);
      let res = await fetch.post('/api/finance-settle/api/checkClearManage/export', params, { responseType: 'arraybuffer' }).then(res => {
        let blob = new Blob([res]);
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = params.body.fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
      })
    }

  };
  //错误弹框
  const openNotification = (errorMsg) => {
    notification.open({
      duration: 3,
      description: errorMsg
    });
  }
  //弹框取消
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'idx',
      key: 'idx',
      search: false,
      render: (t, r, i) => {
        return i = i * 1 + 1
      }
    },
    {
      title: '支付日期',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 100,
      search: false,
    },
    {
      title: '结算日期',
      dataIndex: 'accountDate',
      key: 'accountDate',
      search: false,
      width: 100,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      key: 'beginTime',
      width: 150,
      hideInTable: true,
      valueType: 'date',
      initialValue: matchDate,
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
      hideInTable: true,
      valueType: 'date',
      initialValue: matchDate,
    }, {
      title: '通道',
      dataIndex: 'channelType',
      key: 'channelType',
      valueType: 'select',
      initialValue: passageway,
      width: 50,
      valueEnum: {
        'ALI_PAY': '支付宝',
        'KUAIQIAN_PAY': '快钱',
        'JINGDONG_PAY': '京东支付',
        "PDD_PAY":"拼多多"
      },
    }, 
    {
      title: '订单号',
      dataIndex:'orderNo',
      key:'orderNo',
      width: 150,
    },
    {
      title: '三方订单号',
      dataIndex:'orderTransactionNumber',
      key:'orderTransactionNumber',
      width: 150,
    },
    {
      title:'三方账号',
      dataIndex:'accountName',
      key:'accountName',
      search: false,
      width:100,
    },
    {
      title:'对账状态',
      dataIndex:'checkResult',
      key:'checkResult',
      search: false,
      width:100,
      render: (t, r, i) => {
        return writeOffSearch(t, 'checkResult')
      }
    },
    {
      title: '店铺',
      key: 'supplierName',
      dataIndex: 'supplierName',
      search: false,
      width:150,
    }, {
      title: '交易类型',
      key: 'tradeType',
      dataIndex: 'tradeType',
      valueType: 'select',
      initialValue: tradeway,
      valueEnum: {
        'CONSUME': '消费',
        'REFUND': '退款',
        'WITHDRAW': '提现'
      },
    }, {
      title: '金额',
      key: 'paymentAmount',
      dataIndex: 'paymentAmount',
      search: false,
      width:80,
      render: (t, r, i) => {
        return <span>{(r.paymentAmount).toFixed(2)}</span>
      }
    }, {
      title: '费用',
      key: 'feeAmount',
      dataIndex: 'feeAmount',
      search: false,
      width:80,
      render: (t, r, i) => {
        return <span>{(r.feeAmount).toFixed(2)}</span>
      }
    }, {
      title: '发生额',
      key: 'sum',
      dataIndex: 'sum',
      search: false,
      width:80,
      render: (t, r, i) => {
        return <span>{(r.paymentAmount - r.feeAmount).toFixed(2)}</span>
      }
    }, {
      title: '清算状态',
      key: 'clearStatus',
      dataIndex: 'clearStatus',
      valueType: 'select',
      width:80,
      valueEnum: {
        '1': '待清算',
        '2': '已清算',
        '3': '清算失败'
      },
    }, {
      title: '清算结果',
      key: 'clearMsg',
      dataIndex: 'clearMsg',
      search: false,
      width:80,
    }, {
      title: '会计日期',
      key: 'accountZwDate',
      dataIndex: 'accountZwDate',
      search: false,
      width:100,
    }, {
      title: '会计流水号',
      key: 'accountZwNo',
      dataIndex: 'accountZwNo',
      search: false,
      width:150,
    },
    {
      title: '结算流水号',
      dataIndex: 'clearJournalNo',
      key: 'clearJournalNo',
      width: 150,
      initialValue: serialNumber,
    }, {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      fixed: 'right',
      search: false,
      render: (text, record) => (
        <Space size="middle">
          {record.clearStatus === '2' ? <a disabled={true} >清算</ a> : <a onClick={() => { look('1'), clearDes(record.id) }}>清算</ a>}
        </Space>
      ),
    }
  ];
  return (
    <div className={styles.box}>
      <ProTable
        onReset={() => { setMatchDate(), setpassAgeway() }}
        scroll={{ x: 2100 }}
        columns={columns}
        request={async (params, sort, filter) => {
          setDownloadBeginTime(params.beginTime)
          setDownloadEndTime(params.endTime)
          setDownLoadTradeType(params.tradeType)
          setDownLoadClearStatus(params.clearStatus)
          setDownLoadChannelType(params.channelType)
          setDownLoadorderNumber(params.orderNo)
          setDownloadPaymentorderNumber(params.orderTransactionNumber)
          let postData = {
            pageNum: params.current,
            pageSize: params.pageSize,
            beginTime: params.beginTime,
            endTime: params.endTime,
            tradeType: params.tradeType,
            clearStatus: params.clearStatus,
            channelType: params.channelType,
            clearJournalNo: params.clearJournalNo,
            orderNo:params.orderNo,
            orderTransactionNumber:params.orderTransactionNumber,
          }
          try {
            const res = await LiquidationList(postData);
            return Promise.resolve({
              data: res.result,
              size: res.pageInfo.pageSize,
              current: res.pageInfo.pageNum,
              total: res.pageInfo.total,
            })
          } catch {
            return {
              data: [],
              size: 0,
              current: 0,
              total: 0,
            }
          }
        }}
        actionRef={actionRef}
        rowKey="id"
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        search={{
          labelWidth: 'auto',
        }}
        form={{
          syncToUrl: (values, type) => {
            return values;
          },
        }} pagination={{
          pageSize: 20,
        }} dateFormatter="string" headerTitle="清算信息列表"
        toolBarRender={() => [
          <Button key="button" onClick={() => look('2')} type="primary">
            导出
          </Button>
        ]}
      />
      <Modal title={operation} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {rendermodal(a)}
      </Modal>
    </div>
  )
}
const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  cacheUser(user) {
    dispatch(cacheUserInfo(user));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ClearDetails);