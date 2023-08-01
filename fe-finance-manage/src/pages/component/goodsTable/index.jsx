import React, { Component, useEffect, useRef, useState } from 'react'
import { Table, Form, Input, Button, message } from 'antd'
import { getWmsStockInfo, getDetailOrderB2B } from '../../../api/orderB2B';

export const GoodsTable = ({columns, isAddPage, orgCode, orgOption, orderId}) => {
    const titleStyle = { marginTop: 20, fontSize: 18, fontWeight: 'bold' };
    const [tableData, setTableData] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [dataLoading, setDataLoading] = useState(false);

    const statusType = {
        1: '待出库',
        2: '出库中',
        3: '已出库',
        4: '出库取消',
        11: '待仓库收货',
        12: '仓库已收货',
        13: '仓库审核完成',
        14: '入库取消'
    }

    useEffect(() => {
        !isAddPage && fetchList();
    }, [])

    useEffect(() => {
        setTableData([]);
        setInputValue("");
    }, [orgCode])

    const fetchList = async () => {
        try{
            let result = await getDetailOrderB2B(orderId);
            if(result.status === 200){
                result.data.omsB2bOrderDetailItemVos?.map(v => {
                    v.wmsStatus = statusType[v.wmsStatus];
                })
                setTableData(result.data.omsB2bOrderDetailItemVos);
            }
        }catch(err){
            console.log(err);
        }
    }

    const queryInfo = async () => {
        let result, orgData;
        orgOption?.map(i => {
            if(orgCode === i.name){
                orgData = i.code
            }
        })
        let params = {
            outSkuId: inputValue,
            orgCode: orgData,
        }
        if(!params.outSkuId || !params.orgCode || params.outSkuId === ''){
            message.warning('请选择发货机构并填写物料编码！');
            return;
        }
        try{
            setDataLoading(true);
            result = await getWmsStockInfo(params);
            if(result.status === 200){
                result.data.map(v => {
                    orgOption.map(i => {
                        if(v.orgCode === i.code)
                        v.orgName = i.name;
                    })
                })
                setTableData(result.data)
            }
            setInputValue("");
        }catch(err){
            console.log(err)
        }
        setDataLoading(false);
    }

    return <>
        <p style={{ ...titleStyle }}>出库商品信息</p>
        {isAddPage && <Form.Item name="searchCode" label="物料编码">
            <Input placeholder="请输入" style={{width: 300, marginRight: 10}} value={inputValue} onChange={e => setInputValue(e.target.value)} />
            <Button type="primary" onClick={queryInfo}>查询</Button>
        </Form.Item>}
        <Table
            loading={dataLoading}
            columns={columns}
            dataSource={tableData}
            bordered
            scroll={{ x: 2000 }}
            pagination={!isAddPage}
            style={{marginBottom: 50}}
        />
    </>
}