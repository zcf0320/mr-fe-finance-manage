import React, { useState, useRef, useEffect } from 'react';
import { Space ,message} from 'antd';
import ReturnGoodsList from './returnGoodsList';
// import DiscountList from './discountList';
import WarehousingList from './warehousingList';
import { fetchAfterSaleDeatil } from '../../api/afterSaleManage';
import _ from 'lodash';
import basicData from '@utils/basicData';

const titleStyle = { color: '#1890ff', margin: 0, padding: 0, paddingBottom: '10px' };
export default props => {
  const {location:{state:{id}}} =props;
  const [size, setSize] = useState(50);
  const [detail,setDetail] =useState({});
  const [goodsList,setGoodsList]=useState([]);

  useEffect(async ()=>{
    try{
      const res =await fetchAfterSaleDeatil({refundNo:id});
      if(res.status ==200){
        const data =res.data;
        setDetail(data);
        const gooodsId =['skuId','goodsName','supplierName','goodsKind','prescription','goodsRetailPrice','refundGoodsNum','goodsTotalAmount'];
        const goodsObj={};
        gooodsId.forEach(item=>{
          goodsObj[item] = data[item];
        });
        if(!_.isEmpty(goodsObj)){
          const goodsMes =[];
          goodsMes.push(goodsObj);
          setGoodsList(goodsMes);
        }
      }else{
        message.error(res.message);
      }
    }catch(e){console.log(e)}
  },[])
  const turnPlatform=(code)=>{
    return basicData.getPlatForm()[code] || "无";
  }
  const turnSaleStatus=(code)=>{
    let type;
    switch (code){
      case 1:
        type='待填退货物流';
        break
      case 2:
        type='待仓库收货';
        break
      case 3:
        type='仓库已收货';
        break
      case 4:
        type='仓库收货完成';
        break
      case 5:
        type='退货取消';
        break
      default:
        type='';
    }
    return type
  }
  return (
    <div
      style={{
      width: '100%',
      color: '#222222',
      background: 'white',
      width: '100%',
      padding: '20px 50px 20px 20px',
    }}
    >
      <div>
        <Space size={size} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <p>订单编号：{detail.orderNo}</p>
          <p>订单平台：{turnPlatform(detail.thirdPlatformId)}</p>
          <p>平台订单编号：{detail.thirdOrderNo}</p>
          <p>平台退单编号：{detail.thirdRefundNo}</p>
          <p>售后单编号：{detail.refundNo}</p>
          <p>售后单创建时间：{detail.createTime}</p>
          <p>售后状态：{turnSaleStatus(detail.status)}</p>
        </Space>
      </div>
      <ReturnGoodsList  goodsList={goodsList}/>
      <div style={{marginTop:14}}>
        <p style={titleStyle}>订单支付信息</p>
        <div>
          <Space size={size} style={{ display: 'flex', flexWrap: 'wrap' }}>
            <p>退单总额：{detail.refundAmount}</p>
            <p>订单总额：{detail.totalAmount}</p>
            <p>订单实付金额：{detail.orderPaymentAmount}</p>
            <p>支付渠道：{detail.orderPayWayName}</p>
            <p>支付时间：{detail.orderPaymentDate}</p>
          </Space>
        </div>
      </div>
      {/* <DiscountList /> */}
      <div style={{marginTop:14}}>
        <p style={titleStyle}>订单收货信息</p>
        <div>
          <Space size={size} style={{ display: 'flex', flexWrap: 'wrap' }}>
            <p>收货人：{detail.receiverName}</p>
            <p>手机号：{detail.receiverTel}</p>
            <p>收货地址：{detail.address}</p>
          </Space>
        </div>
      </div>
      <WarehousingList data={detail.getOmsRefundInboundDetailResps || []}/>
    </div>
  )
}