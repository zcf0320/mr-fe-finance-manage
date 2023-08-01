import React, { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import {otherLogistics} from '../listColumns.js';
// import LogisticMessage from '../../component/logisticMessage';

const titleStyle = { color: '#1890ff', margin: 0, padding: 0, paddingBottom: '10px' };
export default props =>{
  const { list } =props;
  const [logisticId,setLogisticId] =useState(null);

  const goodsLogistics =[
    ...otherLogistics,
    // {
    //   title:'操作',
    //   dataIndex: 'action',
    //   key: 'action',
    //   align: 'center',
    //   render:(text,record)=>{
    //     return [
    //       <Button key="chufang" type="link" onClick={(record)=>showLogistic(record)}>
    //        查看物流信息
    //       </Button>,
    //        <Button key="chufang" type="link">
    //        修改物流信息
    //       </Button>,
    //       ]
    //   }
    // }
  ]
  const showLogistic =(id)=>{
    setLogisticId(id);
  }

 return(
  <div style={{marginTop:14}}>
    <p style={{...titleStyle}}>订单物流信息</p>
    <Table size="small" pagination={false} columns={goodsLogistics} dataSource={list} rowKey="index" />
    {/* <LogisticMessage  id={logisticId} showLogistic={showLogistic}/> */}
  </div>
 )
}
