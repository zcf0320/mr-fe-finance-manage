import React, { useState, useRef, useEffect } from 'react';
import {Modal, message,Form, Input } from 'antd';
import {auditOrder} from '../../../api/orderManage';

export default props => {
  const {materialVisible,setMaterialVisible,skuidsList,id,successCallback} =props;
  const [form] = Form.useForm();
  const onFinish =(fieldsValue)=>{
    console.log(fieldsValue)
  }
 const onOk =()=>{
    form.validateFields().then(async values =>{
      const arr=[];
      for (let key in values){
        let obj ={};
        obj.skuId =key;
        obj.outSkuId=values[key];
        arr.push(obj);
      }
      try{
        const res =await auditOrder({id:id,omsOrderItemSkuRespList:arr});
        if(res.status ==200){
          message.success('审核成功');
          successCallback();
          setMaterialVisible(false);
        }else{
          message.error(res.message);
        }
      }catch(e){
        message.error(e.error);
      }
    })
  }
  return (
    <Modal 
      visible ={materialVisible}
      onCancel ={()=>setMaterialVisible(false)}
      onOk={onOk}
      destroyOnClose={true}
    >
      <Form  
        form={form} 
        name="order-express-modal" 
        // labelCol={{ span: 4, offset: 4 }} 
        // wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        preserve={false} 
        >
        {skuidsList.map((item,index)=> {
          return(
            <div style={{display:'flex'}} key={index}>
              <div style={{height:32,lineHeight:'32px',marginRight:'24px'}}>SKUID:{item}</div>
              <Form.Item
                label="物料编码："
                name={item}
                rules={[
                  {
                    required: true,
                    message: '请输入1111',
                    type: 'string',
                  },
                ]}
              > 
                <Input />
              </Form.Item>
            </div>
          )
        })}
      </Form>
    </Modal>
  )
}