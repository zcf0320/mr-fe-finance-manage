import React, { useState, useRef, useEffect } from 'react';
import {Table} from 'antd';
import {returnList} from '../listColumns.js';

const titleStyle = { color: '#1890ff', margin: 0, padding: 0, paddingBottom: '10px' };
export default props =>{
 const {goodsList} =props;
 return(
  <div>
    <div style={titleStyle}>退货商品信息</div>
    <Table size="small" pagination={false} columns={returnList} dataSource={goodsList} rowKey="skuId" />
  </div>
 )
}
