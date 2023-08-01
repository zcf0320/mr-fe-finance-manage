import React, { useState, useRef, useEffect } from 'react';
import { Space, message, Button } from 'antd';
import * as _ from 'lodash';
import GoodList from './goodsList';
import OutStockList from './outStockList';
import LogisticsList from './logisticList';
import OrderInvoicing from './orderInvoicing';
import { fetchOrderDetail } from '../../api/orderManage';
import OrderLog from './orderLog';

const titleStyle = { color: '#1890ff', margin: 0, padding: 0, paddingBottom: '10px' };
export default props => {

  const { location: { state: { id } } } = props
  const [size, setSize] = useState(50);
  const [detailData, setDetailData] = useState({});
  const [showLog, setShowLog] = useState(false)

  useEffect(async () => {
    await getDetail();
  }, [])
  const getDetail = async () => {
    try {
      const res = await fetchOrderDetail(id);
      if (res.status == 200) {
        setDetailData(res.data);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div
      style={{
        width: '100%',
        color: '#222222',
        background: '#fff',
        padding: '20px 50px 20px 20px',
      }}>
      <div>
        <div>
          <p style={{ ...titleStyle }}>订单信息</p>
          <div>
            <Space size={size} style={{ display: 'flex', flexWrap: 'wrap' }}>
              <p>订单编号：{detailData.orderNo}</p>
              <p>平台：{detailData.thirdPlatformDesc}</p>
              <p>平台订单号：{detailData.thirdOrderNo}</p>
              <p>订单状态：{detailData.statusDesc}</p>
              <p>下单时间：{detailData.paymentDate}</p>
              <p hidden={!detailData.cancelReason}>取消原因：{decodeURI(detailData.cancelReason).trim()}</p>
            </Space>
          </div>
        </div>
        <GoodList getDetail={getDetail} orderNo={detailData.orderNo} list={detailData.omsOrderItemInfoRespList} />
      </div>
      <div style={{ marginTop: 14 }}>
        <p style={{ ...titleStyle }}>订单支付信息</p>
        <div>
          <Space size={size} style={{ display: 'flex', flexWrap: 'wrap' }}>
            <p>订单总额：{detailData.totalAmount}</p>
            <p>商品金额：{detailData.goodsAmount}</p>
            <p>运费：{detailData.carriageAmount}</p>
            <p>订单优惠金额：{detailData.discountAmount}</p>
            <p>订单支付金额：{detailData.paymentAmount}</p>
            <p>支付时间：{detailData.paymentDate}</p>
            <p>支付方式：{detailData.payWayName}</p>
          </Space>
        </div>
      </div>
      <div>
        <p style={{ ...titleStyle }}>收货人信息</p>
        <div>
          <Space size={size} style={{ display: 'flex', flexWrap: 'wrap' }}>
            <p>收货人：{detailData.receiverName}</p>
            <p>收货人手机号：{detailData.receiverTel}</p>
            <p>收货地址：{detailData.address}</p>
          </Space>
        </div>
      </div>
      {!_.isNil(detailData.display) &&
        (detailData.display ?
          <OutStockList list={detailData.omsOrderWMSRespList || []} />
          :
          <LogisticsList list={detailData.omsOrderExpressRespList || []} />
        )
      }
      <OrderInvoicing
        reflesh={getDetail}
        detailData={detailData}
      />
      <Button 
        type="primary"
        style={{margin: '16px 0'}}
        onClick={()=> setShowLog(true)}
      >
        查看订单日志
      </Button>
      {
        showLog && ( 
          <OrderLog 
            onCancel={()=> setShowLog(false)}
            orderNo={detailData.orderNo}
          />
        )
      }
    </div>
  )
}