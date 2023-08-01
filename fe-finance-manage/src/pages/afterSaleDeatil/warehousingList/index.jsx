import React, { useState} from 'react';
import { Button,Table} from 'antd';
import {warehousingList} from '../listColumns.js';
import LogisticMessage from '../../component/logisticMessage';

const titleStyle = { color: '#1890ff', margin: 0, padding: 0, paddingBottom: '10px' };
export default props =>{
  const {data} = props
  const [logisticList,setLogisticList] =useState({});
  const cloumsList =[
    ...warehousingList,
    {
      title:'操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render:(_,record)=>{
        return [
          <Button key="chufang" type="link" onClick={()=>showLogistic(record)}>
            查看物流信息
          </Button>,
          ]
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
    <div style={titleStyle}>订单入库明细</div>
    <Table size="small" pagination={false} columns={cloumsList} dataSource={data} rowKey="index" />
    <LogisticMessage alterID={changeID}  list={logisticList} />
</div>
 )
}
