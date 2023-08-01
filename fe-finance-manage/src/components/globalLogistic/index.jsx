import React, { useState, useEffect } from 'react';
import { Modal, Steps } from 'antd';

const { Step } = Steps;
export default props => {

  useEffect(() => {
    if (props.id) {
     
    }
  }, [props.id]);

  const onCancel=()=>{
    
  }
  return(
    // id存在则弹窗打开，否则关闭
    <Modal visible={props.id ? true :false} centered footer={null} onCancel={onCancel} width={800}>
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', fontWeight: 500, marginBottom: '20px' }}>
          <span>{`运单号：${''}`}</span>
          <span style={{ marginLeft: '30px' }}>{`状态：${''}`}</span>
        </div>
        <Steps progressDot direction="vertical" current={0}>
          {[].map((item, index) => {
            return <Step key={index} title={item.ftime || ''} description={item.context || ''} />;
          })}
        </Steps>
      </div>
    </Modal>
  )  
}