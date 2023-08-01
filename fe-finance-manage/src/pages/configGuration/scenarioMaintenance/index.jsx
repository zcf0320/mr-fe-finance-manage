import React, { useEffect, useState, useRef } from 'react';
import { Space, Button, Modal, Select, Row, Col, Form, notification, Checkbox } from 'antd';
import { getScenarioMainList, addScenarioMainList, changeScenarioMainList, scenarioMainDetail, scenarioMainRemove } from '@api/scenarioMaintance'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';

const scenarioMaintance = (props) => {
    const { cacheUser, userInfo } = props;
    const actionRef = useRef();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState();
    const [a, setA] = useState("0")
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [tabDetail, settabDetail] = useState()
    const [tabId, setTabId] = useState()
    const [accountSceneNo, setAccountSceneNo] = useState()
    //添加
    const [addOpenaccountSceneNo, setAddOpenaccountSceneNo] = useState()//开户场景编号
    const [addSceneName, setAddSceneName] = useState()//场景名称
    const [addElementType1, setAddElementType1] = useState()//要素1
    const [addElementType2, setAddElementType2] = useState()//要素2
    const [addElementType3, setAddElementType3] = useState()//要素3
    //修改
    const [form] = Form.useForm();
    const [record, setRecord] = useState()
    const [changeOpenaccountSceneNo, setChangeOpenaccountSceneNo] = useState()//开户场景编号
    const [changeSceneName, setChangeSceneName] = useState()//场景名称
    const [changeElementType1, setChangeElementType1] = useState()//要素1
    const [changeElementType2, setChangeElementType2] = useState()//要素2
    const [changeElementType3, setChangeElementType3] = useState()//要素3

    //表格数据
    const columns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            search: false,
            width: 170,
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        },
        {
            title: '开户场景编号',
            dataIndex: 'openaccountSceneNo',
            key: 'openaccountSceneNo',
            width: 150,
        },
        {
            title: '场景名称',
            dataIndex: 'sceneName',
            key: 'sceneName',
            width: 150,
        },
        {
            title: '要素类型1',
            dataIndex: 'elementType1',
            key: 'elementType1',
            search: false,
            width: 150,
        },
        {
            title: '要素类型2',
            dataIndex: 'elementType2',
            key: 'elementType2',
            search: false,
            width: 150,
        },
        {
            title: '要素类型3',
            dataIndex: 'elementType3',
            key: 'elementType3',
            search: false,
            width: 150,
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: 'action',
            search: false,
            width: 150,
            fixed: 'right',
            render: (text, record, index) => (
                <Space size="middle">
                    <a onClick={() => { scenarioMainchang(record), look('2') }}>修改</ a>
                    <a onClick={() => { scenarioMainlook(record.id), look('3') }}>查看</ a>
                    <a onClick={() => { scenarioMaindel(record), look('4') }}>删除</ a>
                </Space>
            ),
        },
    ];
    //修改回显
    const scenarioMainchang = (record) => {
        setRecord(record)
        setChangeOpenaccountSceneNo(record.openaccountSceneNo)
        setChangeSceneName(record.sceneName)
        setChangeElementType1(record.elementType1)
        setChangeElementType1(record.elementType2)
        setChangeElementType1(record.elementType3)
        form.setFieldsValue({
            openaccountSceneNo: record.openaccountSceneNo,
            sceneName: record.sceneName,
            elementType1: record.elementType1,
            elementType2: record.elementType2,
            elementType3: record.elementType3,
        })
    }
    //查看
    const scenarioMainlook = async (id) => {
        let params = { id: id,tellerNo: tellerNo, }
        const res = await scenarioMainDetail(params)
        settabDetail(res.result)
    }
    //删除
    const scenarioMaindel = async (record) => {
        setTabId(record.id)
        setAccountSceneNo(record.openaccountSceneNo)
    }
    //添加开户场景编号
    const addOpenaccountSceneNoInp = (e) => {
        setAddOpenaccountSceneNo(e.target.value)
    }
    //添加场景名称
    const addSceneNameInp = (e) => {
        setAddSceneName(e.target.value)
    }
    //添加要素类型1
    const addElementType1Inp = (e) => {
        setAddElementType1(e.target.value)
    }
    //添加要素类型2
    const addElementType2Inp = (e) => {
        setAddElementType2(e.target.value)
    }
    //添加要素类型3
    const addElementType3Inp = (e) => {
        setAddElementType3(e.target.value)
    }

    //修改开户场景编号
    const changeOpenaccountSceneNoInp = (e) => {
        setChangeOpenaccountSceneNo(e.target.value)
    }
    //修改场景名称
    const changeSceneNameInp = (e) => {
        setChangeSceneName(e.target.value)
    }
    //修改要素类型1
    const changeElementType1Inp = (e) => {
        setChangeElementType1(e.target.value)
    }
    //修改要素类型2
    const changeElementType2Inp = (e) => {
        setChangeElementType2(e.target.value)
    }
    //修改要素类型3
    const changeElementType3Inp = (e) => {
        setChangeElementType3(e.target.value)
    }
    //弹框判断
    const look = (a) => {
        if (a === "1") {
            setOperation("新增场景规则维护列表信息");
            setA(a)
        } else if (a === "2") {
            setOperation("修改场景规则维护列表信息");
            setA(a)
        } else if (a === "3") {
            setOperation("查看场景规则维护列表信息");
            setA(a)
        } else if (a === "4") {
            setOperation("删除场景规则维护列表信息")
            setA(a)
        }
        setIsModalVisible(true);
    };
    //弹框确定
    const handleOk = async () => {
        if (a === '3') {
            setIsModalVisible(false);
        } else if (a === '4') {
            let params = { id: tabId, openaccountSceneNo: accountSceneNo,tellerNo: tellerNo, }
            const res = await scenarioMainRemove(params)
            actionRef.current.reload()
            if (res.success) {
                openNotification('删除成功')
                setIsModalVisible(false);
            } else {
                openNotification(res.errorMsg)
                setIsModalVisible(false)
            }
        }
    };
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    //表单提交成功
    const onFinish = async () => {
        if (a === '1') {
            let params = {
                tellerNo: tellerNo,
                openaccountSceneNo: addOpenaccountSceneNo,
                sceneName: addSceneName,
                elementType1: addElementType1,
                elementType2: addElementType2,
                elementType3: addElementType3,
            }
            const res = await addScenarioMainList(params)
            actionRef.current.reload()
            if (res.success) {
                openNotification('添加成功')
                setIsModalVisible(false);
            } else {
                openNotification(res.errorMsg)
                setIsModalVisible(false)
            }
        } else if (a === '2') {
            let params = {
                tellerNo: tellerNo,
                id: record.id,
                openaccountSceneNo: changeOpenaccountSceneNo,
                sceneName: changeSceneName,
                elementType1: changeElementType1,
                elementType2: changeElementType2,
                elementType3: changeElementType3,
            }
            const res = await changeScenarioMainList(params)
            actionRef.current.reload()
            if (res.success) {
                openNotification('修改成功')
                setIsModalVisible(false);
            } else {
                openNotification(res.errorMsg)
                setIsModalVisible(false);
            }
        }

    };
    //表单提交失败
    const onFinishFailed = (e) => {
        setIsModalVisible(true);
    };

    const rendermodal = (a) => {
        if (a === '1') {
            return <Form onFinishFailed={onFinishFailed} onFinish={onFinish}>
                <Row>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="开户场景编号" label="开户场景编号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="number"  style={{ width: '100%' }} placeholder="请输入" onChange={addOpenaccountSceneNoInp} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="场景名称" label="场景名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addSceneNameInp} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="要素类型1" label="要素类型1" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addElementType1Inp} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="要素类型2" label="要素类型2" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addElementType2Inp} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="要素类型3" label="要素类型3" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addElementType3Inp} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    wrapperCol={{
                        offset: 16,
                        span: 16,
                    }}
                    style={{ marginTop: '20px' }}
                >
                    <Button type="primary" onClick={handleCancel} width="650px" style={{ marginRight: '20px' }}>取消</Button>
                    <Button type="primary" onClick={handleOk} htmlType="submit" width="650px">
                        确定
                    </Button>
                </Form.Item>
            </Form >
        } else if (a === '2') {
            return <Form form={form} onFinishFailed={onFinishFailed} onFinish={onFinish}
                initialValues={{
                    openaccountSceneNo: record.openaccountSceneNo,
                    sceneName: record.sceneName,
                    elementType1: record.elementType1,
                    elementType2: record.elementType2,
                    elementType3: record.elementType3,
                }}>
                <Row>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="openaccountSceneNo" label="开户场景编号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changeOpenaccountSceneNoInp} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="sceneName" label="场景名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changeSceneNameInp} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="elementType1" label="要素类型1" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changeElementType1Inp} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="elementType2" label="要素类型2" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changeElementType2Inp} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="elementType3" label="要素类型3" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changeElementType3Inp} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    wrapperCol={{
                        offset: 16,
                        span: 16,
                    }}
                    style={{ marginTop: '20px' }}
                >
                    <Button type="primary" onClick={handleCancel} width="650px" style={{ marginRight: '20px' }}>取消</Button>
                    <Button type="primary" onClick={handleOk} htmlType="submit" width="650px">
                        确定
                    </Button>
                </Form.Item>
            </Form>
        } else if (a === '3') {
            return <Form >
                <Row gutter={24} align={'middle'} style={{ marginBottom: '10px' }}>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>开户场景编号:</span><span>{tabDetail ? tabDetail.openaccountSceneNo : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>场景名称:</span><span>{tabDetail ? tabDetail.sceneName : ''}</span>
                    </Col>
                </Row>
                <Row gutter={24} align={'middle'} style={{ marginBottom: '10px' }}>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>要素类型1:</span><span>{tabDetail ? tabDetail.elementType1 : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>要素类型2:</span><span>{tabDetail ? tabDetail.elementType2 : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>要素类型3:</span><span>{tabDetail ? tabDetail.elementType3 : ''}</span>
                    </Col>
                </Row>



                <Form.Item
                    wrapperCol={{
                        offset: 16,
                        span: 16,
                    }}
                    style={{ marginTop: '20px' }}
                >
                    <Button type="primary" onClick={handleCancel} width="650px" style={{ marginRight: '20px' }}>取消</Button>
                    <Button type="primary" onClick={handleOk} htmlType="submit" width="650px">
                        确定
                    </Button>
                </Form.Item>

            </Form>
        } else if (a === '4') {
            return <Form>
                <p style={{ textAlign: 'center' }}>确定删除该条信息吗？</p>
                <Form.Item wrapperCol={{
                    offset: 16,
                    span: 16,
                }}
                    style={{ marginTop: '20px' }}>
                    <Button type="primary" onClick={handleCancel} width="650px" style={{ marginRight: '20px' }}>取消</Button>
                    <Button type="primary" onClick={handleOk} htmlType="submit" width="650px">
                        确定
                    </Button>
                </Form.Item>
            </Form>
        }
    }
    //添加修改错误弹框
    const openNotification = (errorvalue) => {
        notification.open({
            duration: 5,
            description:
                errorvalue
        });
    }
    return (
        <div>
            <ProTable
                scroll={{ x: 1500 }}
                columns={columns}
                request={async (params, sort, filter) => {
                    let postData = {
                        pageNum: params.current,
                        pageSize: params.pageSize,
                        openaccountSceneNo: params.openaccountSceneNo,
                        sceneName: params.sceneName,
                        tellerNo: tellerNo,
                    }
                    try {
                        const res = await getScenarioMainList(postData);
                        return Promise.resolve({
                            data: res.result,
                            size: res.pageInfo.pageSize,
                            current: res.pageInfo.pageNum,
                            total: res.pageInfo.total,
                        })
                    } catch {
                        return {
                            data: [],
                            size: 0,
                            current: 0,
                            total: 0,
                        }
                    }
                }}
                actionRef={actionRef}
                rowKey="id"
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                }}
                search={{
                    labelWidth: 'auto',
                }}
                form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        return values;
                    },
                }} pagination={{
                    pageSize: 20,
                }} dateFormatter="string" headerTitle="科目规则维护列表信息" toolBarRender={() => [
                    <Button key="button" onClick={() => look('1')} icon={<PlusOutlined />} type="primary">
                        新建
                    </Button>
                ]} />

            <Modal title={operation} visible={isModalVisible} width="50%" footer={null} keyboard={true}

                onCancel={handleCancel} getContainer={false} maskClosable={false}>
                {rendermodal(a)}
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

export default connect(mapStateToProps, mapDispatchToProps)(scenarioMaintance);