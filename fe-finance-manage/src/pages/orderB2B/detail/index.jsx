import React, { useState, useRef, useEffect } from 'react';
import { Space, message, Table, Alert, Row, Col } from 'antd';

import {
    InfoCircleTwoTone,
} from '@ant-design/icons'
import { detailColumns } from '../listColumns';
import { GoodsTable } from '../../component/goodsTable';
import { getDetailOrderB2B } from '../../../api/orderB2B';

const titleStyle = { marginTop: 20, fontSize: 18, fontWeight: 'bold' };
export default props => {

  const { location: { state: { orderId } } } = props
  const [detailData, setDetailData] = useState({});

  const statusType = {
    0: '草稿',
    1: '待出库',
    2: '出库中',
    3: '已出库',
    4: '已取消',
    6: '部分出库',
  }
  const exwarehouseType = {
    1: '销售出库',
    2: '领用出库',
    3: '其他出库',
  }
  const deliveryType = {
    1: '物流快递',
    4: '自提',
  }
  const payType = {
    1: '现结',
    2: '货到付款',
  }


  useEffect(() => {
    getDetail();
  }, [])

  const getDetail = async () => {
    try {
      const res = await getDetailOrderB2B(orderId);
      
      if (res.status == 200) {
        setDetailData(res.data);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log(err)
    }
  }
  

  return <div
    style={{
        width: '100%',
        color: '#222222',
        background: '#fff',
        padding: '20px 50px 20px 20px',
    }}
  >
            <div style={{fontSize: 18}}><InfoCircleTwoTone /> 订单状态：{statusType[detailData.status]}</div>
            <div>
                <p style={{ ...titleStyle }}>基本信息</p>
                <Row gutter={24}>
                  <Col span={6}><p>发货机构：{detailData.orgName}</p></Col>
                  <Col span={6}><p>发货仓库id：{detailData.warehouseId}</p></Col>
                  <Col span={6}><p>出库类型：{exwarehouseType[detailData.exwarehouseType]}</p></Col>
                  <Col span={6}><p>成本部门：{`${detailData.costDepartmentName?detailData.costDepartmentName:''}${detailData.costUnitName?detailData.costUnitName:''}`}</p></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={6}><p>客户名称：{detailData.buyerName}</p></Col>
                  <Col span={6}><p>收货人：{detailData.receiverName}</p></Col>
                  <Col span={6}><p>联系电话：{detailData.receiverTel}</p></Col>
                  <Col span={6}><p>收货地址：{`${detailData.province}${detailData.city}${detailData.area}${detailData.address}`}</p></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={6}><p>发货方式：{deliveryType[detailData.deliveryFlag]}</p></Col>
                  <Col span={6}><p>订单创建时间：{detailData.createTime}</p></Col>
                  <Col span={6}><p>创建人：{detailData.createName}</p></Col>
                  <Col span={6}><p>备注：{detailData.postscript}</p></Col>
                </Row>
            </div>
            <div>
                <p style={{ ...titleStyle }}>付款信息</p>
                <Row gutter={24}>
                  <Col span={6}><p>商品总额：{detailData.goodsTotalAmount}</p></Col>
                  <Col span={6}><p>运费金额：{detailData.carriageAmount}</p></Col>
                  <Col span={6}><p>订单总额：{detailData.totalAmount}</p></Col>
                  <Col span={6}><p>付款方式：{payType[detailData.payType]}</p></Col>
                </Row>
            </div>
            <GoodsTable columns={detailColumns} orderId={orderId} isAddPage={false} />
          
    </div>
}