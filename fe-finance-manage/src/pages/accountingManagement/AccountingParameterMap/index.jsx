import React, { useState, useEffect } from 'react';
import { Space, Modal, Input, Form, Row, Col, notification, Table, Pagination, Button, Card, Select, Spin } from 'antd'
import { parameterMapList, FinParamSapIsNullList, SapParamByIdList, changeFinParam, changeSapParamList } from '@api/parameterMap'
import accountMain from '../../../enumeration/accountMain'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
const queryParameterMap = (props) => {
    const { cacheUser, userInfo } = props;
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState('修改映射关系');
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [record, setRecord] = useState()
    const [requestData, setRequestData] = useState()
    const [requestTotal, setRequestTotal] = useState()
    const [requestPageNum, setRequestPageNum] = useState(1)
    const [requestPageSize, setRequestPageSize] = useState(20)
    const [tabData, setTabData] = useState()
    const [searchBtn, setSearchBtn] = useState(1)
    const [loading, setLoading] = useState(false)//数据懒加载
    const [paramType, setParamType] = useState()//参数类型
    const [finParamId, setFinParamId] = useState()//参数编号
    const [finParamName, setFinParamName] = useState()//参数名称
    const [paramTypeValue, setParamTypeValue] = useState()
    const [finParamIdValue, setFinParamIdValue] = useState()
    const [finParamNameValue, setFinParamNameValue] = useState()
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRow, setSelectedRow] = useState()
    const [sapParameterName, setsapParameterName] = useState()//SAP参数名称
    const [sapParamType, setsapParamType] = useState()//sap参数类型
    const [sapPageNum, setsapPageNum] = useState(1)
    const [sapPageSize, setsapPageSize] = useState(20)//sap修改默认页数
    const [sapTotal, setsapTotal] = useState()
    const columns = [
        {
            title: '业财参数ID',
            dataIndex: 'finParamId',
            key: 'finParamId',
            searcDatah: false,
        }, {
            title: '业财参数名称',
            dataIndex: 'finParamName',
            key: 'finParamName',
            searcDatah: false,
        }, {
            title: '业财机构号',
            dataIndex: 'orgNo',
            key: 'orgNo',
            searcDatah: false,
        }, {
            title: 'SAP公司代码',
            dataIndex: 'sapCompanyId',
            key: 'sapCompanyId',
            searcDatah: false,
        }, {
            title: 'SAP参数ID',
            dataIndex: 'sapParamId',
            key: 'sapParamId',
            searcDatah: false,
        }, {
            title: '参数类型',
            dataIndex: 'paramType',
            key: 'paramType',
            render: (t, r, i) => {
                return accountMain(t,'paramType')
            },
        }, {
            title: '同步日期',
            dataIndex: 'syncDate',
            key: 'syncDate',
            searcDatah: false,
        }, {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
            searcDatah: false,
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => { updateLocale(record) }}>修改</a>
                </Space >
            ),
        }
    ];
    const tabColumns = [
        {
            title: 'SAP参数ID',
            dataIndex: 'sapParamId',
            key: 'sapParamId',
        }, {
            title: 'SAP参数名称',
            dataIndex: 'sapParamName',
            key: 'sapParamName',
        }, {
            title: 'SAP公司代码',
            dataIndex: 'companyId',
            key: 'companyId',
        }, {
            title: '参数类型',
            dataIndex: 'paramType',
            key: 'paramType',
            render: (t, r, i) => {
                return accountMain(t, 'paramType')
            },
        }, {
            title: '同步日期',
            dataIndex: 'syncDate',
            key: 'syncDate',
        },
    ];
    useEffect(() => {
        setLoading(true)
        getParameterMapList(requestPageSize, requestPageNum)
        getSapParameterList(requestPageSize, requestPageNum)
    }, [])
    //查询数据列表
    const getParameterMapList = async (requestPageSize, requestPageNum) => {
        let postData = {
            tellerNo: tellerNo,
            pageNum: requestPageNum,
            pageSize: requestPageSize,
            paramType: paramType,
            finParamId: finParamId,
            finParamName: finParamName
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        const res = await parameterMapList(postData);
        if (res.success) {
            setRequestTotal(res.pageInfo.total)
            setRequestPageNum(res.pageInfo.pageNum)
            setRequestPageSize(res.pageInfo.pageSize)
            setRequestData(res.result)
        }
    }
    // 修改页面查询数据列表
    const getSapParameterList = async (requestPageSize, requestPageNum) => {
        let postData = {
            tellerNo: tellerNo,
            sapParamName: sapParameterName,
            paramType: sapParamType,
            pageNum: requestPageNum,
            pageSize: requestPageSize,
        }
        const res = await changeSapParamList(postData);
        if (res.success) {
            setTabData(res.result);
            setsapTotal(res.pageInfo.total);
            setsapPageSize(res.pageInfo.pageSize);
            setsapPageNum(res.pageInfo.pageNum);
        }
    }
    //修改
    const updateLocale = (record) => {
        setSelectedRowKeys(false)
        setIsModalVisible(true);
        setRecord(record)
        changeList(record)
        form.setFieldsValue({
            finParamId: record.finParamId,//业财参数ID
            finParamName: record.finParamName,//业财参数名称
            orgNo: record.orgNo,//业财机构号
            sapCompanyId: record.sapCompanyId,//SAP公司代码
            sapParamId: record.sapParamId,//SAP参数ID
            paramType: accountMain(record.paramType, 'paramType'),//参数类型
        })
        setsapParamType(record.paramType)
    }
    const changeList = async (record) => {
        let params = {
            tellerNo: tellerNo,
            companyId: record.sapCompanyId,
            paramType: record.paramType,
        }
        let res = await SapParamByIdList(params);
        if (res.success) {
            setTabData(res.result);
            setsapTotal(res.pageInfo.total);
            setsapPageSize(res.pageInfo.pageSize);
            setsapPageNum(res.pageInfo.pageNum);
        }
    }
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
        setTabData([])
        setsapParameterName()
        setsapParamType()
    };
    //修改映射
    const handleOk = async () => {
        if (selectedRowKeys[0]) {
            let params = {
                tellerNo: tellerNo,
                id: record.id,
                sapParamId: selectedRow.sapParamId,
                companyId: selectedRow.companyId
            }
            let res = await changeFinParam(params)
            if (res.success) {
                openNotification("修改成功")
                setIsModalVisible(false);
                setSelectedRowKeys([])
                setTabData([])
                if (searchBtn) {
                    await getParameterMapList(requestPageSize, requestPageNum)
                } else {
                    await unmatched(requestPageSize, requestPageNum)
                }
            } else {
                openNotification("修改失败")
                setIsModalVisible(false);
                setSelectedRowKeys([])
                setTabData([])
                if (searchBtn) {
                    await getParameterMapList(requestPageSize, requestPageNum)
                } else {
                    await unmatched(requestPageSize, requestPageNum)
                }
            }
            setIsModalVisible(false);
        } else {
            setIsModalVisible(true);
            openNotification("未选中不可提交且不可选多条")
        }
    }
    //错误弹框
    const openNotification = (errorvalue) => {
        notification.open({
            duration: 5,
            description:
                errorvalue
        });
    }
    //查询
    const searchData = (requestPageSize, requestPageNum) => {
        setSearchBtn(1)
        setRequestPageNum(requestPageNum);
        setRequestPageSize(requestPageSize)
        getParameterMapList(requestPageSize, requestPageNum)
        setLoading(true)
    }
    //重置
    const reset = () => {
        setParamType()
        setFinParamId()
        setFinParamName()
        setParamTypeValue()
        setFinParamIdValue()
        setFinParamNameValue()
    }
    //未匹配参数
    const unmatched = async (requestPageSize, requestPageNum) => {
        setLoading(true)
        setSearchBtn(0)
        setRequestPageNum(requestPageNum);
        setRequestPageSize(requestPageSize)
        getUnmatched(requestPageSize, requestPageNum)
    }
    const getUnmatched = async (requestPageSize, requestPageNum) => {
        let params = {
            tellerNo: tellerNo,
            pageNum: requestPageNum,
            pageSize: requestPageSize,
            paramType: paramType,
            finParamId: finParamId,
            finParamName: finParamName
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        const res = await FinParamSapIsNullList(params);
        if (res.success) {
            setRequestTotal(res.pageInfo.total)
            setRequestPageNum(res.pageInfo.pageNum)
            setRequestPageSize(res.pageInfo.pageSize)
            setRequestData(res.result)
        }
    }
    //参数类型
    const changeParamType = (e) => {
        setParamType(e)
        setParamTypeValue(e)
    }
    //参数编号
    const changefinParamId = (e) => {
        setFinParamId(e.target.value)
        setFinParamIdValue(e.target.value)
    }
    //参数名称
    const changefinParamName = (e) => {
        setFinParamName(e.target.value)
        setFinParamNameValue(e.target.value)
    }
    // sap参数名称
    const changesapParameterName = (e) => {
        setsapParameterName(e.target.value)
    }
    // 修改页面查询
    const searchsapData = (sapPageSize, sapPageNum) => {
        setsapPageSize(sapPageSize);
        setsapPageNum(sapPageNum);
        getSapParameterList(sapPageSize, sapPageNum)
    }
    // 修改重置
    const sapreset = () => {
        setsapParameterName()
        setsapParamType()
    }
    //单选
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys([...selectedRowKeys])
            setSelectedRow(...selectedRows)
        },
        getCheckboxProps: (record) => ({
            id: record.id,
        }),

    };
    const rendermodal = () => {
        return <Form form={form}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <Form.Item label="SAP参数名称" style={{ width: '30%' }}>
                        <Input placeholder='请输入' onChange={(e) => changesapParameterName(e)} value={sapParameterName} />
            </Form.Item>
            <div style={{ width: '25%', display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => sapreset()}>重置</Button>
                    <Button type="primary" onClick={() => searchsapData(20, 1)}>查询</Button>
            </div>
            </div>
            <Row gutter={[24, 24]}>
                <Col span={8}>
                    <Form.Item name='finParamId' label="业财参数ID">
                        <Input disabled={true} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='finParamName' label="业财参数名称">
                        <Input disabled={true} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='orgNo' label="业财机构号">
                        <Input disabled={true} />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item name='sapCompanyId' label="SAP公司代码">
                        <Input disabled={true} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='sapParamId' label="SAP参数ID">
                        <Input disabled={true} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='paramType' label="参数类型">
                        <Input disabled={true} />
                    </Form.Item>
                </Col>
                <div>
                <Table dataSource={tabData} columns={tabColumns} rowKey="id" rowSelection={{
                    type: "radio",
                    ...rowSelection,
                }} pagination={false} />
                 <div style={{ marginTop: '20px', float: 'right' }}>
                    <Pagination
                        total={sapTotal}
                        current={sapPageNum}
                        rowKey="id"
                        showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                        defaultPageSize={sapPageSize}
                        defaultCurrent={sapPageNum}
                        showSizeChanger={true}
                        hideOnSinglePage={true}
                        pageSizeOptions={[10, 20, 30, 40, 50]}
                        onChange={(pageNum, pageSize) => sapQueryPage(pageNum, pageSize)}
                    />
                </div>
                </div>
         
            </Row>
        </Form>
    }
    // 修改页面分页器
    const sapQueryPage = async (pageNum, pageSize) =>{
        setsapPageNum (pageNum)
        setsapPageSize(pageSize)
        getSapParameterList(pageSize,pageNum)
    }
    //分页器
    const requestQueryPage = async (pageNum, pageSize) => {
        setRequestPageNum(pageNum);
        setRequestPageSize(pageSize)
        if (searchBtn) {
            await getParameterMapList(pageSize, pageNum)
        } else {
            await unmatched(pageSize, pageNum)
        }
    }
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Card bodyStyle={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Form style={{ width: '70%', display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Item label="参数类型" style={{ width: '30%' }} >
                        <Select placeholder="请选择" onChange={(e) => changeParamType(e)} value={paramTypeValue}>
                            <Select.Option value="1">客户编码</Select.Option>
                            <Select.Option value="2">供应商编码</Select.Option>
                            <Select.Option value="3">科目</Select.Option>
                            <Select.Option value="4">成本部门</Select.Option>
                            <Select.Option value="5">成本中心</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="参数编号" style={{ width: '30%' }}>
                        <Input placeholder='请输入' onChange={(e) => changefinParamId(e)} value={finParamIdValue} />
                    </Form.Item>
                    <Form.Item label="参数名称" style={{ width: '30%' }}>
                        <Input placeholder='请输入' onChange={(e) => changefinParamName(e)} value={finParamNameValue} />
                    </Form.Item>
                </Form>
                <div style={{ width: '25%', display: 'flex', justifyContent: 'space-between' }}>
                    <Button type="primary" onClick={() => unmatched(20, 1)}>未匹配参数</Button>
                    <Button onClick={() => reset()}>重置</Button>
                    <Button type="primary" onClick={() => searchData(20, 1)}>查询</Button>
                </div>
            </Card>
            <div style={{ marginTop: '30px', padding: '20px', background: '#FFFFFF' }}>
                <Spin spinning={loading}>
                    <Table columns={columns} dataSource={requestData} pagination={false} rowKey="id" />
                </Spin>
                <div style={{ marginTop: '20px', float: 'right' }}>
                    <Pagination
                        total={requestTotal}
                        current={requestPageNum}
                        rowKey="id"
                        showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                        defaultPageSize={requestPageSize}
                        defaultCurrent={requestPageNum}
                        showSizeChanger={true}
                        hideOnSinglePage={true}
                        pageSizeOptions={[10, 20, 30, 40, 50]}
                        onChange={(pageNum, pageSize) => requestQueryPage(pageNum, pageSize)}
                    />
                </div>
            </div>
            <Modal title={operation} visible={isModalVisible} width="50%" keyboard={true} onCancel={handleCancel} onOk={handleOk} okText="修改映射" >
                {rendermodal()}
            </Modal>
        </div>
    )
}
const mapStateToProps = (state) => ({
    userInfo: state.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
    cacheUser(user) {
        dispatch(cacheUserInfo(user));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(queryParameterMap);