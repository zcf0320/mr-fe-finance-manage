import React, { useState, useEffect } from 'react';
import { Modal,Timeline,message} from 'antd';
import {logisticsList} from '../../../api/orderManage'

const titleStyle={display: 'flex', flexWrap: 'wrap', fontWeight: 500, marginBottom: '20px' }
export default props => {
  //父组件传过来的数值
  const {code,invoice } = props.list
  const {alterID}=props
  const [showList,setShowList] = useState({}) //运单号和状态
  const [resList,setResList] = useState([]) //物流详细信息
  const [show,setShow] = useState(false) 

  useEffect(()=>{
    getList()

  },[code,invoice ])


  const getList= async ()=>{
    if(code && invoice){
      const hide= message.loading('加载中...',0);
      const data={
        companyCode:code,
        expressNo:invoice
      }
      const res= await logisticsList({...data})
      if (res.status===200 && res.data!==null ) {
        hide()
        setShowList(res.data)
        setResList(res.data.resVoList)
        setShow(true)
      }else{
        message.error(res.message);
        alterID()
        hide()
      } 
    }
  }
  const cancel=()=>{
    alterID()
    setShow(false)
  }
  return (
      <Modal visible={show} centered footer={null} onCancel={cancel} width={800}>
        <div>
          <div style={{...titleStyle}}>
            <span style={{ marginRight: '30px' }}>运单号：{showList.expressNo}</span>
            <span>状态：{showList.deliveryStateStr}</span>
          </div>
          <Timeline>
            {
              resList.map((item,index)=>{
                if (index===0) {
                  return <Timeline.Item key={index}>{item.ftime}<br/>{item.context}</Timeline.Item>
                }else{
                  return <Timeline.Item color="gray" key={index} style={{color:'gray'}}>{item.ftime}<br/>{item.context}</Timeline.Item>
                }
              })
            }
          </Timeline>
        </div>
      </Modal>
  )
}