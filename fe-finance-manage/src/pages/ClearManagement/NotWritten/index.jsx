import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { Table, Space, Select, Modal, Breadcrumb, Pagination, DatePicker, Button } from 'antd'
import { getWritterOffList, unWriteoff } from '@api/writterOff.js'
import moment from 'moment';
import writeOffSearch from '../../../enumeration/notWritten'
export default function WriteQuery(props) {
  //日期选择器事件
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
  const [written, setWritten] = useState(props.location.query)
  const [tabdata, setTabdata] = useState()
  const [total, setTotal] = useState()
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [beginTime, setBeginTime] = useState(moment(initDate))//开始日期   
  const [endTimes, setEndTime] = useState(moment(initDate))//结束日期
  const [payMent, setPayMent] = useState()//通道
  const [payMentAc, setPaymentAction] = useState()
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
      title: '通道名称',
      dataIndex: 'payWayCode',
      key: 'payWayCode',
      render: (t, r, i) => {
        return writeOffSearch(t, 'payWayCode')
      }
    },
    {
      title: '金额',
      key: 'actualReceiveAmount',
      dataIndex: 'actualReceiveAmount',
      render: (t, r, i) => {
        return <span>{(r.actualReceiveAmount).toFixed(2)}</span>
      }
    },

  ];

  useEffect(() => {
    writterOfflist(pageNum, pageSize)
  }, [])
  //未对平数据列表
  const writterOfflist = async (pageNum, pageSize) => {
    const params = {
      beginTime: beginTime.format('YYYY-MM-DD'),
      endTimes: endTimes.format('YYYY-MM-DD'),
      payWayCode: payMentAc,
      pageNum: pageNum,
      pageSize: pageSize
    }
    const res = await unWriteoff(params)
    setTotal(res.pageInfo.total)
    setTabdata(res.result)
  }
  //查询
  const Abb = () => {
    writterOfflist(pageNum, pageSize)
  }
  //重置
  const Xia = () => {
    setBeginTime(moment(initDate))
    setEndTime(moment(initDate))
    setPayMent('请选择:')
    setPaymentAction()
  }

  //日期选择器onChange事件
  const changestartDate = (moment, string,) => {
    setBeginTime(moment)
  }
  const changeendDate = (moment, string) => {
    setEndTime(moment)
  }
  //弹框确认
  const handleOk = async () => {
    setIsModalVisible(false);
  };
  //弹框取消
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //通道
  const paymentChannelSel = (o, v) => {
    setPaymentAction(o.key)
    setPayMent(v.children)
    if (v.children === '支付宝提现') {
      setPaymentAction('ALI_PAY')
    } else if (v.children === '快钱提现') {
      setPaymentAction('KUAIQIAN_PAY')
    } else if (v.children === '京东提现') {
      setPaymentAction('JINGDONG_PAY')
    }
  }
  //分页变化
  const pagechange = async (pageNum, pageSize) => {
    setPageNum(pageNum)
    setPageSize(pageSize)
    await writterOfflist(pageNum, pageSize)
  }
  return (
    <div className={styles.box}>
      <div className={styles.proTableSearch}>
        <Breadcrumb separator=">" style={{ width: '330px', height: '95px', fontSize: '22px', lineHeight: '95px', marginLeft: '35px' }}>
          <Breadcrumb.Item href="WriteQuery" style={{ width: '132px', height: '30px', fontFamily: 'PingFangSC-Regular', fontWeight: '400' }}>核销信息列表</Breadcrumb.Item>
          <Breadcrumb.Item href="NotWritten" style={{ width: '154px', height: '30px', fontFamily: 'PingFangSC-Medium', fontWeight: '500', color: '#262626', }}>未对平提现记录</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.writtenmiddle}>
          <p>日期:</p>
          <Space direction="vertical">
            <DatePicker
              value={beginTime}
              onChange={changestartDate}
              style={{ width: '150px', marginLeft: '5px', height: '39px', borderRadius: '4px' }} />
          </Space>
          <Space direction="vertical">
            <DatePicker defaultValue={moment().subtract(1, 'days').endOf('day')}
              value={endTimes}
              onChange={changeendDate}
              style={{ width: '150px', marginLeft: '7px', height: '39px', borderRadius: '4px' }} />
          </Space>
          <p style={{ fontSize: '18px', color: 'black', textIndent: "18px" }}>支付通道:</p>
          <Select placeholder='请选择' size='middle'
            style={{ width: '100px', height: '35px', paddingRight: '4px', marginLeft: '10px', borderRadius: '5px' }} showArrow={true}
            value={payMent}
            onSelect={paymentChannelSel}>
            <Select.Option value="支付宝提现" style={{ height: '30px', }}>支付宝提现</Select.Option>
            <Select.Option value="快钱提现" style={{ height: '30px' }}>快钱提现</Select.Option>
            <Select.Option value="京东提现" style={{ height: '30px' }}>京东提现</Select.Option>
          </Select>
          <div>
            <Button onClick={() => Abb()} type="primary" style={{ width: '90px', height: '40px', fontSize: '18px', marginLeft: "250px" }}
            >确认</Button>
            <Button onClick={() => Xia()} style={{ width: '90px', height: '40px', fontSize: '18px', marginLeft: "30px" }}>重置</Button>
          </div>
        </div>
      </div>
      <div className={styles.table}>
        <Table columns={columns} dataSource={tabdata} pagination={false} rowKey="id" />
        <div className={styles.pagination}>
          <Pagination
            total={total}
            showTotal={(total) => `第1-${total}条/总共 ${total} 条`}
            defaultPageSize={pageSize}
            defaultCurrent={pageNum}
            showSizeChanger={true}
            pageSizeOptions={[10, 20, 50, 100]}
            onChange={(pageNum, pageSize) => pagechange(pageNum, pageSize)}
          />
        </div>
      </div>
      <Modal title="核销" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={400}>
        <div>确定要核销吗？</div>
      </Modal>
    </div>
  )
}
