import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { Button, Table, Tag, Space, DatePicker, Select, Modal, Input, Form, Row, Col , Breadcrumb } from 'antd'
export default function WriteQuery() {
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tabdata, setTabdata] = useState()
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
      dataIndex: 'paymentChannel',
      key: 'paymentChannel',
    },
    {
      title: '金额',
      key: 'accountBalance',
      dataIndex: 'accountBalance',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => writeOff()}>核销</a>
        </Space>
      ),
    }
  ];
  //弹框确认
  const handleOk = async () => {
    setIsModalVisible(false);
  };
  //弹框取消
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  //核销
  const writeOff = () => {
    setIsModalVisible(true);
  }
  return (
    <div className={styles.box}>
      <div className={styles.proTableSearch}>
      <Breadcrumb separator=">" style={{width:'300px',height: '95px',fontSize: '22px',lineHeight:'95px',marginLeft:'35px'}}>
          <Breadcrumb.Item href="WriteQuery" style={{width: '132px',height: '30px',fontFamily: 'PingFangSC-Regular',fontWeight: '400'}}>核销信息列表</Breadcrumb.Item>
          <Breadcrumb.Item href="WrittenDetail" style={{width:'132px',height:'30px',fontFamily:'PingFangSC-Medium',fontWeight: '500',color:'#262626',}}>核销明细流水</Breadcrumb.Item>
        </Breadcrumb>

        <div className={styles.proTableMiddle}>
          <p>日期:</p><span>1</span>
          <p>银行名称:</p> <span>1</span>
          <p>出金/入金:</p><span>1</span>
          <p>总金额:</p><span>1</span>
        </div>
      </div>

      <div className={styles.table}>
        <Table columns={columns} dataSource={tabdata} pagination={false}/>
        <div className={styles.pagination}>
        </div>
      </div>
      <Modal title="核销" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={400}>
        <div>确定要核销吗？</div>
      </Modal>
    </div>
  )
}
