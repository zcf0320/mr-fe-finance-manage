import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { Table, Space, DatePicker, Select, Pagination, Spin, Modal, notification } from 'antd'
import { useHistory } from 'react-router-dom'
import { getWritterOffList, manualWriteoff } from '@api/writterOff'
import writeOffSearch from '../../../enumeration/writeOffSearch'
import moment from 'moment';
export default function WriteQuery() {
  let history = useHistory()
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
  const [tabdata, setTabdata] = useState()
  const [total, setTotal] = useState()
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)
  const [beginTime, setBeginTime] = useState(moment(initDate))//开始日期   
  const [endTime, setEndTime] = useState(moment(initDate))//结束日期
  const [paymentType, setPaymentType] = useState()//支付通道
  const [paymentlist, setPaymentList] = useState()
  const [bank, setBank] = useState()//银行
  const [bankList, setBankList] = useState()
  const [writeType, setWriteType] = useState()//核销状态
  const [writeTypeList, setWriteTypeList] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id, setId] = useState()
  const columns = [
    {
      title: '序号',
      dataIndex: 'idx',
      key: 'id',
      render: (t, r, i) => {
        return i = i * 1 + 1
      }
    },
    {
      title: '日期',
      dataIndex: 'accountDate',
      key: 'accountDate',
    },
    {
      title: '银行名称',
      dataIndex: 'thBankType',
      key: 'thBankType',
      render: (t, r, i) => {
        return writeOffSearch(t, 'thBankType')
      }
    },
    {
      title: '出金/入金',
      key: 'inOutFlag',
      dataIndex: 'inOutFlag',
      render: (t, r, i) => {
        return writeOffSearch(t, 'inOutFlag')
      }
    },
    {
      title: '金额',
      key: 'withdrawAmount',
      dataIndex: 'withdrawAmount',
      render: (t, r, i) => {
        return <span>{(r.withdrawAmount).toFixed(2)}</span>
      }
    },
    {
      title: '费用',
      key: 'withdrawFee',
      dataIndex: 'withdrawFee',
      render: (t, r, i) => {
        return <span>{(r.withdrawFee).toFixed(2)}</span>
      }
    },
    {
      title: '余额',
      key: 'accountBalance',
      dataIndex: 'accountBalance',
      render: (t, r, i) => {
        return <span>{(r.accountBalance).toFixed(2)}</span>
      }
    },
    {
      title: '对方账号',
      key: 'oppositeAccount',
      dataIndex: 'oppositeAccount',
    },
    {
      title: '对方账户名称',
      dataIndex: 'oppositeAccountName',
      key: 'oppositeAccountName',

    },
    {
      title: '对账状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
    },
    {
      title: '核销状态',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      render: (t, r, i) => {
        return writeOffSearch(t, 'verificationStatus')
      }
    }, {
      title: '核销错误码',
      dataIndex: 'verificationCode',
      key: 'verificationCode',
    }, {
      title: '核销结果',
      dataIndex: 'verificationMsg',
      key: 'verificationMsg',
    }, {
      title: '会计日期',
      dataIndex: 'accountZwDate',
      key: 'accountZwDate',
    }, {
      title: '会计流水号',
      dataIndex: 'accountZwNo',
      key: 'accountZwNo',
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => { look(record.id) }}>核销</a>
        </Space>
      ),
    }
  ];
  useEffect(() => {
    setLoading(true)
    writterList(pageNum, pageSize)
  }, [])
  //核销结果查询
  const writterList = async (pageNum, pageSize) => {
    let params = {
      beginTime: beginTime ? beginTime.format('YYYY-MM-DD') : null,
      endTime: endTime ? endTime.format('YYYY-MM-DD') : null,
      channelType: paymentType,
      thBankType: bank,
      verificationStatus: writeType,
      pageNum: pageNum,
      pageSize: pageSize
    }
    setTimeout(() => {
      setLoading(false)
    }, 1000)
    const res = await getWritterOffList(params)
    setTotal(res.pageInfo.total)
    setTabdata(res.result)
  }
  const look = (id) => {
    setId(id)
    setIsModalVisible(true);
  };
  //弹框确认
  const handleOk = async () => {
    let params = {
      id: id
    }
    let res = await manualWriteoff(params)
    writterList(pageNum, pageSize)
    if (res.success) {
      openNotification('核销成功')
    } else {
      openNotification(res.errorMsg)
    }
    setIsModalVisible(false);
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

  //开始日期
  const changstartDate = (moment, string) => {
    setBeginTime(moment)
  }
  //结束日期
  const changendDate = (moment, string) => {
    setEndTime(moment)
  }
  //支付通道
  const paymentTypeSel = (v, o) => {
    setPaymentList(o.children)
    if (o.children === '支付宝') {
      setPaymentType(writeOffSearch(o.children, 'paymentType'))
    } else if (o.children === '快钱') {
      setPaymentType(writeOffSearch(o.children, 'paymentType'))
    } else if (o.children === '京东支付') {
      setPaymentType(writeOffSearch(o.children, 'paymentType'))
    }
  }
  //银行
  const changeBankSel = (v, o) => {
    setBankList(o.children)
    if (o.children === '招商银行') {
      setBank('CMBChina')
    } else if (o.children === '工商银行') {
      setBank('ICBC')
    }
  }
  //核销状态
  const writeTypeSel = (v, o) => {
    setWriteTypeList(o.children)
    if (o.children === '未核销') {
      setWriteType('1')
    } else if (o.children === '已核销') {
      setWriteType('2')
    } else if (o.children === '核销失败') {
      setWriteType('3')
    }
  }
  //查询按钮
  const searchBtn = () => {
    setLoading(true)
    writterList(pageNum, pageSize)
  }
  //重置按钮
  const inputreset = () => {
    setBeginTime(moment(initDate))
    setEndTime(moment(initDate))
    setPaymentType()
    setPaymentList('请选择')
    setBank()
    setBankList('请选择')
    setWriteType()
    setWriteTypeList('请选择')
  }
  //分页变化
  const pagechange = async (pageNum, pageSize) => {
    setPageNum(pageNum)
    setPageSize(pageSize)
    writterList(pageNum, pageSize);
  }
  return (
    <div className={styles.box}>
      <div className={styles.proTableSearch}>
        <div className={styles.proTableHead}>
          <span style={{ fontSize: '18px' }}>日期:</span>
          <Space direction="vertical">
            <DatePicker value={beginTime}
              onChange={changstartDate} style={{ width: '150px', marginLeft: '5px', height: '39px', borderRadius: '4px' }} />
          </Space>
          至
          <Space direction="vertical">
            <DatePicker value={endTime}
              onChange={changendDate} style={{ width: '150px', marginLeft: '7px', height: '39px', borderRadius: '4px' }} />
          </Space>

          <span style={{ marginLeft: '19px', fontSize: '18px' }}>支付通道:</span>
          <Select placeholder='请选择' size='middle' onSelect={paymentTypeSel} value={paymentlist} style={{ width: '100px', height: '35px', paddingRight: '4px', marginLeft: '10px' }} showArrow={true}>
            <Select.Option key={1} style={{ height: '30px', }}>支付宝</Select.Option>
            <Select.Option key={2} style={{ height: '30px' }}>快钱</Select.Option>
            <Select.Option key={3} style={{ height: '30px' }}>京东支付</Select.Option>
          </Select>

          <span style={{ marginLeft: '19px', fontSize: '18px' }}>银行:</span>
          <Select placeholder='请选择' size='middle' onSelect={changeBankSel} value={bankList} style={{ width: '100px', height: '35px', paddingRight: '4px', marginLeft: '10px' }} showArrow={true}>
            <Select.Option value="工商银行" style={{ height: '30px', }}>工商银行</Select.Option>
            <Select.Option value="招商银行" style={{ height: '30px' }}>招商银行</Select.Option>
          </Select>

          <span style={{ marginLeft: '19px', fontSize: '18px' }}>核销状态:</span>
          <Select placeholder='请选择' size='middle' onSelect={writeTypeSel} value={writeTypeList} style={{ width: '100px', height: '35px', paddingRight: '4px', marginLeft: '10px' }} showArrow={true}>
            <Select.Option value="aaa" style={{ height: '30px', }}>已核销</Select.Option>
            <Select.Option value="bbb" style={{ height: '30px' }}>未核销</Select.Option>
            <Select.Option value="ccc" style={{ height: '30px' }}>核销失败</Select.Option>
          </Select>
        </div>
        <div className={styles.proTables}>
          <button className={styles.reset} onClick={inputreset}>重置</button>
          <button className={styles.searchBtn} onClick={searchBtn}>查询</button>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.mixing}>
          <b>核销信息列表</b>
        </div>
        <div className={styles.cardTop}>
          <div className={styles.table}>
            <Spin spinning={loading}>
              <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }} />
            </Spin>
            <div className={styles.pagination}>
              <Pagination
                total={total}
                current={pageNum}
                showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                defaultPageSize={pageSize}
                defaultCurrent={pageNum}
                showSizeChanger={true}
                pageSizeOptions={[10, 20, 50, 100]}
                onChange={(pageNum, pageSize) => pagechange(pageNum, pageSize)}
              />
            </div>
          </div>
        </div>

      </div>
      <Modal title='核销' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div>
          确定进行核销吗？
        </div>
      </Modal>
    </div>
  )
}
