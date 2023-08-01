import React, { useState } from 'react';
import {Table,Button} from 'antd';
import {otherOutStock} from '../listColumns.js';
import LogisticMessage from '../../component/logisticMessage';

const titleStyle = { color: '#1890ff', margin: 0, padding: 0, paddingBottom: '10px' };

export default props =>{
  const { list } =props;
  const [logisticList,setLogisticList] =useState({});
  const  goodsOutStock=[
    ...otherOutStock,
    {
      title:'操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render:(_,record)=>{
        return (record.invoiceNo && <Button key="chufang" type="link" onClick={()=>showLogistic(record)}>查看物流</Button>)
      }
    }
  ]
  const showLogistic =(record)=>{
    const list={
      code:record.expressCode,
      invoice:record.invoiceNo,
    }
    setLogisticList({...list})
  }
  const changeID=()=>{
    setLogisticList({})
  }
 return(
  <div>
    <p style={{...titleStyle}}>订单出库明细</p>
    <Table size="small" pagination={false} columns={goodsOutStock} dataSource={list} rowKey={(record)=>record.orderNo} />
    <LogisticMessage alterID={changeID}  list={logisticList} />
  </div>
 )
}
