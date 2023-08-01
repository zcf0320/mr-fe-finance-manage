import React, { useState, useRef, useEffect } from 'react';
import {Table} from 'antd';
import {discountList} from '../listColumns.js';

const titleStyle = { color: '#1890ff', margin: 0, padding: 0, paddingBottom: '10px' };
export default props =>{
 
 return(
  <div>
  <div style={titleStyle}>优惠抵扣明细</div>
  <Table size="small" columns={discountList} dataSource={ []} rowKey="index" />
  
</div>
 )
}
