
import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
import { Button, Modal, message } from 'antd';
import* as _ from'lodash';
import moment from 'moment';
import {afterSaleColumns} from './listColumns';
import { fetchAfterSaleList,cancelOrder } from '../../api/afterSaleManage';
import ShipModal from '../component/shipModal';

const { confirm } = Modal;
export default props => {
  const [id,setId] =useState(null);
  const [shipVisible,setShipVisible] =useState(false); //发货
  const actionRef = useRef();
  const formRef = useRef();
 
  const { history }  =props;
  const jumpToDetail =(record)=>{
   history.push({pathname:'/oms-after-sale/manage/detail',state:{id:record.refundNo}});
  }
  const returnGoods=(record)=>{
    setShipVisible(true);
    setId(record.refundNo);
  }
  const cancel =(record)=>{
    confirm({
      title: '确认取消？',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return cancelDone(record.refundNo);
      },
    });
  }
  const cancelDone =async (refundNo)=>{
    try{
      const res =await cancelOrder({refundNo});
      if(res.status ==200){
        actionRef.current.reload();
        message.success('操作成功');
      }else{
        message.error(res.message);
      }
    }catch(e){
      console.log(e);
    }
  }
  const tempColumns = [
    ...afterSaleColumns,
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (text, record, _, action) => [
        <div key="1">
          <div style={{ display: 'flex' }}>
            {record.operationalButtons?.includes(1) &&
            <Button size="small" type="link" onClick={() => jumpToDetail(record)}>
              详情
            </Button> 
            }
            {record.operationalButtons?.includes(2) &&
            <Button size="small" type="link" onClick={() => returnGoods(record)}>
              退货
            </Button>
            }
            {record.operationalButtons?.includes(3) && 
            <Button size="small" type="link" onClick={() => cancel(record)}>
              取消
            </Button>
            }
          </div>
        </div>,
      ],
    },
  ];

  const fetchList =async (params)=>{
    const obj ={...params};
    obj.createTimeBegin =obj.createTime[0];
    obj.createTimeEnd =obj.createTime[1];
    obj.pageNum=obj.current;
    const newParams =_.omit(obj,['createTime','current']);
    let result;
    try{
      result=  await  fetchAfterSaleList(newParams);
    }catch (error) {}
    return  {
      data: result.data.list ||[], 
      size: result.data.pageSize,
      current: result.data.pageNum,
      total: result.data.total,
      success: true,
    };
  }
 
  return(
    <div>
      <ProTable 
        columns={tempColumns}
        actionRef={actionRef}
        request={fetchList}
        scroll={{ x: 1300 }}
        rowKey="index"
        formRef={formRef}
        search={{ defaultCollapsed: false ,labelWidth:100}}
        manualRequest={false}
        toolBarRender={() => {
          return []
        }}
      ></ProTable>
      <ShipModal 
      shipVisible ={shipVisible}
      setShipVisible={setShipVisible}
      id={id}
      isReturn={true}
      successCallback={() =>actionRef.current.reload()}
      />
    </div>
  ) 
}
