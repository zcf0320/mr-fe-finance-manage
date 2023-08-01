import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss'
import { Space, Modal, notification, Button } from 'antd'
import moment from 'moment';
import { SettlementList, ManualSettle } from '@api/liquiManage'
import writeOffSearch from '../../../enumeration/clearDe'
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import fetch from '@utils/request';
const CloseDetail = (props) => {
  const { cacheUser, userInfo } = props;
  const actionRef = useRef();
  //时间选择
  const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  const Y = date.getFullYear()
  const appendZero = (obj) => {
    if (obj < 10) {
      return '0' + obj
    } else {
      return obj
    }
  }
  const M = appendZero(date.getMonth() + 1)
  const D = appendZero(date.getDate())
  const initDate = Y + "-" + M + "-" + D
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operation, setOperation] = useState();
  const [a, setA] = useState("0")
  const [clearJournalNo, setClearJournalno] = useState()
  const [tellerNo, setTellerNo] = useState(userInfo.username)
  const [DownloadBeginTime, setDownloadBeginTime] = useState()
  const [DownloadEndTime, setDownloadEndTime] = useState()
  const [DownloadTradeType, setDownLoadTradeType] = useState()
  const [DownloadSettleStatus, setDownLoadSettleStatus] = useState()
  const [DownloadChannelType, setDownLoadChannelType] = useState()
  //结算
  const settleDes = async (clearJournalNo) => {
    setClearJournalno(clearJournalNo)
  }

  const rendermodal = (a) => {
    if (a === '1') {
      return <div>
        确定进行结算吗？
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
      setOperation("结算");
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
        clearJournalNo: clearJournalNo
      }
      let res = await ManualSettle(params)
      if (res.success) {
        openNotification('结算成功')
        actionRef.current.reload()
      } else {
        openNotification(res.errorMsg)
      }
      setIsModalVisible(false);
    } else if (a === '2') {
      const params = {
        beginTime: DownloadBeginTime,
        endTime: DownloadEndTime,
        tradeType: DownloadTradeType ? DownloadTradeType : null,
        settleStatus: DownloadSettleStatus ? DownloadSettleStatus : null,
        channelType: DownloadChannelType ? DownloadChannelType : null,
        body: {
          exportNum: "1",
          fileName: "结算结果明细文件" + DownloadBeginTime + '-' + DownloadEndTime + ".csv",
        },
      }
      setIsModalVisible(false);
      let res = await fetch.post('/api/finance-settle/api/checkClearManage/exportSettle', params, { responseType: 'arraybuffer' }).then(res => {
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
    setIsModalVisible(false);
  };
  //错误弹框
  const openNotification = (errorMsg) => {
    notification.open({
      duration: 4.5,
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
      width: 160,
      search: false,
      render: (t, r, i) => {
        return i = i * 1 + 1
      }
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      key: 'beginTime',
      width: 160,
      hideInTable: true,
      valueType: 'date',
      initialValue: initDate,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
      hideInTable: true,
      valueType: 'date',
      initialValue: initDate,
    },
    {
      title: '日期',
      dataIndex: 'matchAccountDate',
      key: 'matchAccountDate',
      search: false,
      width: 150,
    },
    {
      title: '通道',
      dataIndex: 'channelType',
      key: 'channelType',
      width: 150,
      valueType: 'select',
      valueEnum: {
        "ALI_PAY": "支付宝",
        "KUAIQIAN_PAY": "快钱",
        "JINGDONG_PAY": "京东支付",
        "PDD_PAY":"拼多多"
      },
    },
    {
      title: '店铺',
      key: 'supplierName',
      dataIndex: 'supplierName',
      width: 150,
      search: false,
    },
    {
      title: '店铺ID',
      dataIndex: 'supplierId',
      key: 'supplierId',
      width: 150,
      search: false,
    },
    {
      title: '结算类型',
      key: 'tradeType',
      dataIndex: 'tradeType',
      valueEnum: {
        "CONSUME": "消费",
        "REFUND": "退款",
        "WITHDRAW": "提现",
      },
      valueType: 'select',
      width: 150,
    },
    {
      title: '订单金额',
      key: 'clearAmount',
      dataIndex: 'clearAmount',
      width: 150,
      search: false,
      render: (t, r, i) => {
        return <span>{(r.clearAmount).toFixed(2)}</span>
      }
    },
    {
      title: '费用',
      key: 'feeAmount',
      dataIndex: 'feeAmount',
      width: 150,
      search: false,
      render: (t, r, i) => {
        return <span>{(r.feeAmount).toFixed(2)}</span>
      }
    },
    {
      title: '发生额',
      key: 'tags',
      dataIndex: 'tags',
      width: 150,
      search: false,
      render: (t, r, i) => {
        return <span>{(r.clearAmount - r.feeAmount).toFixed(2)}</span>
      }
    }, {
      title: '结算状态',
      key: 'settleStatus',
      dataIndex: 'settleStatus',
      valueEnum: {
        "1": "待结算",
        "2": "已结算",
        "3": "结算失败",
      },
      valueType: 'select',
      width: 150,
    },
    {
      title: '结算结果',
      key: 'settleMsg',
      dataIndex: 'settleMsg',
      width: 150,
      search: false,
    },
    {
      title: '会计日期',
      key: 'accountZwDate',
      dataIndex: 'accountZwDate',
      width: 150,
      search: false,
    }, {
      title: '会计流水号',
      key: 'accountZwNo',
      dataIndex: 'accountZwNo',
      width: 150,
      search: false,
    },
    {
      title: '结算流水号',
      dataIndex: 'clearJournalNo',
      key: 'clearJournalNo',
      width: 150,
      search: false,
    }, {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      fixed: 'right',
      width: 150,
      search: false,
      render: (text, record) => (
        <Space size="middle">
          {record.settleStatus === '2' ? <a disabled={true}>结算</ a> : <a onClick={() => { look('1'), settleDes(record.clearJournalNo) }}>结算</ a>}
          <a onClick={() => lookAction(record)}>查看明细</a>
        </Space>
      ),
    }
  ];
  //页面跳转
  const lookAction = (record) => {
    //传参
    props.history.push({
      pathname: 'clearDetails',
      query: record,
    })
  }
  return (
    <div className={styles.box}>
      <ProTable
        scroll={{ x: 1500 }}
        columns={columns}
        request={async (params, sort, filter) => {

          setDownloadBeginTime(params.beginTime)
          setDownloadEndTime(params.endTime)
          setDownLoadTradeType(params.tradeType)
          setDownLoadSettleStatus(params.settleStatus)
          setDownLoadChannelType(params.channelType)
          let postData = {
            pageNum: params.current,
            pageSize: params.pageSize,
            beginTime: params.beginTime,
            endTime: params.endTime,
            channelType: params.channelType,
            settleStatus: params.settleStatus,
            tradeType: params.tradeType,
          }
          try {
            const res = await SettlementList(postData);
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
        }} dateFormatter="string" headerTitle="信息列表"
        toolBarRender={() => [
          <Button key="button" onClick={() => look('2')} type="primary">
            导出
          </Button>
        ]} />

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

export default connect(mapStateToProps, mapDispatchToProps)(CloseDetail);




