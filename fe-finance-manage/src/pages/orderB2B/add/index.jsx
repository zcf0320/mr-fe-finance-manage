import React, { useState, useRef, useEffect,  } from 'react';
import moment from 'moment';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Modal, message, Input, Table, Select, Space, Form, Row, Col } from 'antd';
import * as _ from 'lodash';
import '@ant-design/pro-table/dist/table.css';
import { addColumns } from '../listColumns.js';
import { GoodsTable } from '../../component/goodsTable';
import TableEditableForm from '../../component/TableEditableForm';
import { getOrgInfo, getCostRelationDetail, getExpressCompanies, getCity, addOrderB2B, addDraftOrderB2B, getDetailOrderB2B } from '../../../api/orderB2B.js';

export default props => {
  const {history} = props;
  const { location: { state: { orderId } } } = props
  const [form] = Form.useForm();
  const [deliveryMode, setDeliveryMode] = useState(null);
  const [deliveryDisabled, setDeliveryDisabled] = useState(false)
  const [goodsList, setGoodsList] = useState([]);
  const [wmsData, setWmsData] = useState(null);

  const [orgOption, setOrgOption] = useState(null);
  const [selectOrgName, setSelectOrgName] = useState(null);
  const [departmentOption, setDepartmentOption] = useState(null);
  const [unitsOption, setUnitsOption] = useState(null);
  const [wmsOption, setWmsOption] = useState(null);
  const [provinceOption, setProvinceOption] = useState(null);
  const [cityOption, setCityOption] = useState(null);
  const [areaOption, setAreaOption] = useState(null);
  const [detailInfo, setDetailInfo] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);


  const titleStyle = { marginTop: 20, fontSize: 18, fontWeight: 'bold' };

  useEffect(() => {
    if(deliveryMode === 1){
        setDeliveryDisabled(false);
    }else{
        setDeliveryDisabled(true);
        form.setFieldsValue({
            expressCompany: ''
        });
    }
  }, [deliveryMode, deliveryDisabled])

  useEffect(() => {
    let org = orgOption?.filter(v => v.name === selectOrgName)[0]?.code;
    let newDate = wmsData?.filter(v => v.orgCode === org)[0]?.omsExpressCompanyResps;
    setWmsOption(newDate);
  }, [selectOrgName, orgOption])

  useEffect(() => {
    fetchSelectOptions();
    let department = {
        ...form.getFieldsValue().department,
        costDepartment: 0,
        costUnit: 0,
    }
    form.setFieldsValue({department})
    orderId && fetchFormDetail();
  },[])

//   获取选框信息
  const fetchSelectOptions = async () => {
      let orgData, departmentsData, expressData, provinceData;
      try{
        orgData = await getOrgInfo();
        departmentsData = await getCostRelationDetail();
        expressData = await getExpressCompanies();
        provinceData = await getCity();

        setOrgOption(orgData.data);
        setDepartmentOption(departmentsData.data.details);
        setWmsData(expressData.data);
        setProvinceOption(provinceData.data);

      }catch(err){
          console.log(err);
      }
  }

//   获取订单详情信息
  const fetchFormDetail = async () => {
      let result, expressData;
      try{
        result = await getDetailOrderB2B(orderId);
        expressData = await getExpressCompanies();
        setDetailInfo(result.data);
        setDeliveryMode(result.data.deliveryFlag);
        setSelectOrgName(result.data.orgName);
        setWmsData(expressData.data);

        let department = {
            costDepartment: result.data.costDepartment === 0 ? 0 : result.data.costDepartmentName,
            costUnit: result.data.costUnit === 0 ? 0 : result.data.costUnitName,
        }

        let receiverAddress = {
            province: result.data.province,
            city: result.data.city,
            area: result.data.area,
            address: result.data.address,
        }

        let exwarehouseType = result.data.exwarehouseType === 0 ? null : result.data.exwarehouseType;

        let receiverTel = result.data.receiverTel === '0' ? null : result.data.receiverTel;
        
        form.setFieldsValue({
            ...result.data,
            receiverAddress,
            department,
            exwarehouseType,
            receiverTel
        })

        result.data.omsB2bOrderDetailItemVos && setGoodsList(result.data.omsB2bOrderDetailItemVos)
      }catch(err){
        console.log(err);
      }
  }

//   出库商品信息栏
  const listColumns = [
      ...addColumns,
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        fixed: 'right',
        render: (text, record) => [
            <Button size='small' type='link' onClick={() => addItem(record)}>
            选择添加
            </Button>
        ],
      },
  ];

//   已选商品信息栏
  const goodsColumns = [
      ...addColumns,
      {
        title: '销售价格',
        key: 'retailPrice',
        dataIndex: 'retailPrice',
        editable: true,
      },
      {
        title: '出库数量',
        key: 'outStockNum',
        dataIndex: 'outStockNum',
        editable: true,
      },
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        fixed: 'right',
        render: (text, record) => [
            <Button size='small' type='link' onClick={() => deleteItem(record)}>
            删除
            </Button>
        ],
      },
  ]

//   添加出库商品
  const addItem = (record) => {
     let recordKey = record.outSkuId + record.wmsBatchNo;
     let arr = [...goodsList];
     arr.map(v => {v.key = v.outSkuId + v.wmsBatchNo});
     if(arr.length !== 0 && arr.some(i => i.key === recordKey)){
        message.warning('该商品已添加！');
        return;
     }
     record.key = recordKey;
     arr = [...goodsList, record];
     console.log(arr, form.getFieldsValue());
     setGoodsList(arr);
  }

//   删除已选商品
  const deleteItem = (record) => {
    console.log(record);
    Modal.confirm({
        title: '操作提示',
        content: '确认删除该商品？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
            let list = goodsList.filter(v =>  v.key ? v.key !== record.key : v.id !== record.id);
            setGoodsList(list);
        },
      });
  };

// 获取选项列表
const handleOptions = (value, tag) => {
    if(tag === 'units'){
        let options = departmentOption?.filter(i => i.costDepartmentId === value);
        setUnitsOption(options[0]?.units || []);
        setIsChanged(true);
        let department = {
            ...form.getFieldsValue().department,
            costUnit: 0,
        }
        form.setFieldsValue({department})
    }else if(tag === 'province'){
        let options = provinceOption?.filter(i => i.name == value);
        setCityOption(options[0]?.childs)
        let receiverAddress = {
            ...form.getFieldsValue().receiverAddress,
            city: '',
            area: '',
        }
        form.setFieldsValue({receiverAddress})
    }else if(tag === 'city'){
        let options = cityOption?.filter(i => i.name == value);
        setAreaOption(options[0]?.childs)
        let receiverAddress = {
            ...form.getFieldsValue().receiverAddress,
            area: '',
        }
        form.setFieldsValue({receiverAddress})
    }else if(tag === 'org'){
        let obj = {'云药房': 121001, '云健康': 123001};
        setSelectOrgName(value);
        setGoodsList([]);
        form.setFieldsValue({
            warehouseId: obj[value],
            expressCompany: ''
        })
    }
}

// 创建草稿或订单
  const saveDraft = async (tag) => {
    tag === 'draft' ? setDraftLoading(true) : setOrderLoading(true);
    let departmentObj = form.getFieldsValue().department;
    let addressObj = form.getFieldsValue().receiverAddress;
    let orgCode, costDepartmentName, costUnitName, expressCode;
    let omsB2bOrderItemDetailVoList = [...goodsList];

    orgOption?.map(i => {
        if(i.name === form.getFieldsValue().orgName){
            orgCode = i.code;
        }
    });
    departmentOption?.map(i => {
        if(i.costDepartmentId === departmentObj?.costDepartment){
            costDepartmentName = i.departmentName;
            i.units.map(v => {
                if(v.costBusinessUnitId == departmentObj.costUnit){
                    costUnitName = v.businessUintName;
                }
            })
        }
    })
    wmsOption?.map(i => {
        if(i.expressCompany == form.getFieldsValue().expressCompany) expressCode = i.expressCodeWms;
    });
    console.log(form.getFieldsValue().expressCompany);
    omsB2bOrderItemDetailVoList?.map(val => {
        val.retailPrice = val.retailPrice ? Number(val.retailPrice) : 0;
        val.outStockNum = val.outStockNum ? Number(val.outStockNum) : 0;
    })

    let params = {
        ...form.getFieldsValue(),
        id: orderId,
        orgCode,
        costDepartment: orderId && !isChanged ? detailInfo.costDepartment : departmentObj?.costDepartment,
        costUnit: orderId && !isChanged ? detailInfo.costUnit : departmentObj?.costUnit,
        costDepartmentName: orderId && !isChanged ? detailInfo.costDepartmentName : costDepartmentName,
        costUnitName: orderId && !isChanged ? detailInfo.costUnitName : costUnitName,
        province: addressObj?.province,
        city: addressObj?.city,
        area: addressObj?.area,
        address: addressObj?.address,
        expressCode,
        omsB2bOrderItemDetailVoList,
    };

    console.log(params);
    
    try{
        let result = tag === 'draft'? await addDraftOrderB2B(params) : await addOrderB2B(params);
        if(result.status === 200){
            message.success(result.message);
            history.push(`/oms-orderB2B/manage`);
        }else{
            message.error(result.message);
        }
    }catch(err){
        console.log(err);
    }
    setDraftLoading(false);
    setOrderLoading(false);
  }

//   编辑保存
const handleTableSave = (data) => {
    setGoodsList(data)
}

  return (
    <div
        style={{
            width: '100%',
            color: '#222222',
            background: '#fff',
            padding: '20px 50px 20px 20px',
        }}
    >
        <Form form={form}>
            <p style={{ ...titleStyle }}>基本信息</p>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        name="orgName"
                        label="发货机构"
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Select placeholder="请选择" onChange={val => handleOptions(val, 'org')}>
                            {orgOption?.map(i => <Select.Option key={i.code} value={i.name}>{i.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="warehouseId"
                        label="发货仓库"
                    >
                        <Input placeholder="请输入" disabled/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="exwarehouseType"
                        label="出库类型"
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Select placeholder="请选择">
                            <Select.Option value={1}>销售出库</Select.Option>
                            <Select.Option value={2}>领用出库</Select.Option>
                            <Select.Option value={3}>其他出库</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        name="department"
                        label="成本部门"
                        rules={[{ required: true, message: '此项为必填项'}]}
                    >
                        <Input.Group compact>
                            <Form.Item
                                name={['department', 'costDepartment']}
                                noStyle
                                // rules={[{ required: true, message: '此项为必填项'}]}
                            >
                                <Select placeholder="请选择" style={{width: '50%'}} onChange={v => handleOptions(v, 'units')}>
                                    <Select.Option key={0} value={0}>无</Select.Option>
                                    {departmentOption?.map(i => <Select.Option key={i.costDepartmentId} value={i.costDepartmentId}>{i.departmentName}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={['department', 'costUnit']}
                                noStyle
                                // rules={[{ required: true, message: '此项为必填项' }]}
                            >
                                <Select placeholder="请选择" style={{width: '50%'}}>
                                    <Select.Option key={0} value={0}>无</Select.Option>
                                    {unitsOption?.map(i => <Select.Option key={i.costBusinessUnitId} value={i.costBusinessUnitId}>{i.businessUintName}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="buyerName"
                        label="客户名称"
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="receiverName"
                        label="收货人"
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        name="receiverTel"
                        label="收货人电话"
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item
                        name="receiverAddress"
                        label="收货人地址"
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Input.Group compact>
                            <Form.Item
                                name={['receiverAddress', 'province']}
                                noStyle
                                // rules={[{ required: true, message: '此项为必填项' }]}
                            >
                                <Select placeholder="选择省" style={{width: '15%'}} onChange={v => handleOptions(v, 'province')}>
                                    {provinceOption?.map(i => <Select.Option key={i.code} value={i.name}>{i.name}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={['receiverAddress', 'city']}
                                noStyle
                                // rules={[{ required: true, message: '此项为必填项' }]}
                            >
                                <Select placeholder="选择市" style={{width: '15%'}} onChange={v => handleOptions(v, 'city')} >
                                    {cityOption?.map(i => <Select.Option key={i.code} value={i.name}>{i.name}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={['receiverAddress', 'area']}
                                noStyle
                            >
                                <Select placeholder="选择区" style={{width: '15%'}} >
                                    {areaOption?.map(i => <Select.Option key={i.code} value={i.name}>{i.name}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={['receiverAddress', 'address']}
                                noStyle
                                // rules={[{ required: true, message: '此项为必填项' }]}
                            >
                                <Input style={{ width: '55%' }} placeholder="请输入详细地址" />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        name="deliveryFlag"
                        label="发货方式"
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Select placeholder="请选择" onChange={val => setDeliveryMode(val)}>
                            <Select.Option key={0} value={1}>物流快递</Select.Option>
                            <Select.Option key={1} value={4}>自提</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="expressCompany"
                        label="物流公司"
                        rules={[{ required: !deliveryDisabled, message: '此项为必填项', }]}
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Select placeholder="请选择" 
                            disabled={deliveryDisabled}
                        >
                            {wmsOption?.map(i => <Select.Option key={i.expressCode} value={i.expressCompany}>{i.expressCompany}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="carriageAmount"
                        label="运费金额"
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        name="payType"
                        label="付款方式"
                        rules={[{ required: true, message: '此项为必填项', }]}
                    >
                        <Select placeholder="请选择">
                            <Select.Option value={1}>现结</Select.Option>
                            <Select.Option value={2}>货到付款</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="postscript"
                        label="备注"
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
            </Row>
            <GoodsTable columns={listColumns} isAddPage={true} orgCode={selectOrgName} orgOption={orgOption} />
            
            <p style={{ ...titleStyle }}>已选商品</p>
            <TableEditableForm 
                columns={goodsColumns}
                dataSource={goodsList}
                onSave={handleTableSave}
             />
            <Space size={20}>
                <Button onClick={() => {history.push(`/oms-orderB2B/manage`)}}>取消</Button>
                <Button type="primary" loading={draftLoading} onClick={()=>saveDraft('draft')}>保存草稿</Button>
                <Button type="primary" loading={orderLoading} onClick={()=>saveDraft('order')}>保存并创建订单</Button>
            </Space>
        </Form>
    </div>
  );
}