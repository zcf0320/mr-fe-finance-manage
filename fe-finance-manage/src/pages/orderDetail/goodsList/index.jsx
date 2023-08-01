import React, { useState, useRef, useEffect } from 'react';
import { Button,Form,message, Space, Table, Modal, Input } from 'antd';
import {otherOrderList} from '../listColumns.js';
import {returnCommodity } from '../../../api/orderManage';

const titleStyle = { color: '#1890ff', margin: 0, padding: 0, paddingBottom: '10px' };
export default props =>{
  const {orderNo,list,getDetail} =props;

  const [item,setItem]=useState(null);
  const [form] = Form.useForm();
  const [returnVisible,setReturnVisible] =useState(false);
  const showReturnModal=(record)=>{
    setItem(record);
    setReturnVisible(true);
  }
  const onOk=()=>{
    form.validateFields().then(async values => {
      try {
        const params ={orderNo,...values,refundType:1,skuId:item.skuId,goodsNum:item.goodsNum,itemId:item.goodsId}
        const res =await returnCommodity(params);
        if(res.status ==200){
          getDetail();
          message.success('退货成功');
          setReturnVisible(false);
        }else{
          message.warn(res.message);
        }
      } catch (error) {}
      }).catch(errorInfo => {});
    
  }
  const onCancel=()=>{
    setReturnVisible(false);
  }
  const goodsList =[
    ...otherOrderList,
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => {
        return [
          <Button disabled={!record.refundFlag} key="chufang" type="link" onClick={()=>showReturnModal(record)}>
            退货
          </Button>
        ];
      },
    },
  ]
  return(
    <div>
      <div style={{...titleStyle,display:'flex',justifyContent:'space-between'}}>
        <span>订单商品信息</span>
      </div>
      <Table size="small" pagination={false} columns={goodsList} dataSource={list} rowKey="skuId" />
      <Modal 
        visible={returnVisible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form style={{marginTop:'16px'}} form={form} name="return-goods-modal" labelCol={{ span: 4, offset: 4 }} wrapperCol={{ span: 12 }}>
          <Form.Item
            label="退款单号："
            name="thirdRefundNo"
            rules={[
              {
                required: true,
                message: '请输入退款单号',
                // pattern: /^[a-zA-Z0-9]+$/,
                // max: 20,
                type: 'string',
              },
            ]}
          >
            <Input placeholder="请输入退款单号" />
          </Form.Item>
        </Form>
      </Modal>
  </div>
  )
}
