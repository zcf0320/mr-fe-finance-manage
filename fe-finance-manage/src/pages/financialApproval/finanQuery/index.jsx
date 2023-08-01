import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, Modal, Input, Form, Row, Col, notification, Divider } from 'antd'
import moment from 'moment';
import { batchQueryList, sumbitPayStatement,cancelPayStatement } from '@api/specialMedicine'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
const finanQuery = (props) => {
    const { cacheUser, userInfo } = props;
    const actionRef = useRef();
    //日期选择器事件
    const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    const Y = date.getFullYear()
    const appendZero = (obj) => {
        if (obj < 10) {
            return '0' + obj
        } else {
            return obj
        }
    }
    const M = appendZero(date.getMonth() + 1)
    const D = appendZero(date.getDate())
    const initDate = Y + "-" + M + "-" + D
    const newDate=new Date(new Date().getTime())
    const endDate=moment(newDate)
    const { TextArea } = Input;
    const [orderForm] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState();
    const [a, setA] = useState("0")
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    //存放弹出订单确认数据
    const [orderFormObj, setOrderFormObj] = useState({});
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const columns = [
        {
            title: '开始时间',
            dataIndex: 'beginTime',
            key: 'beginTime',
            width: 150,
            hideInTable: true,
            valueType: 'date',
            initialValue: initDate,
        }, {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            width: 150,
            hideInTable: true,
            valueType: 'date',
            initialValue: endDate,
        },
        {
            title: '批次号',
            dataIndex: 'approveBatchNo',
            key: 'approveBatchNo',
            width: 110,
        },
        {
            title: '提交明细笔数',
            dataIndex: 'submitNumber',
            key: 'submitNumber',
            width: 120,
            search: false,
        },
        {
            title: '付款成功笔数',
            dataIndex: 'paymentSuccess',
            key: 'paymentSuccess',
            width: 120,
            search: false,
        },
        {
            title: '付款失败笔数',
            dataIndex: 'paymentError',
            key: 'paymentError',
            width: 120,
            search: false,
        },
        {
            title: '提交结算金额',
            key: 'submitAmount',
            dataIndex: 'submitAmount',
            width: 120,
            search: false,
        },
        {
            title: '提交成功金额',
            key: 'amountSuccess',
            dataIndex: 'amountSuccess',
            width: 120,
            search: false,
        },
        {
            title: '订单状态',
            key: 'paymentStatus',
            dataIndex: 'paymentStatus',
            width: 120,
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                '2': '待付款',
                '3': '付款中',
                '4': '付款成功',
                '5': '付款失败',
                '6': '付款取消',
                '8': '付款异常'
            },
        },
        {
            title: '结算单状态',
            key: 'paymentStatus',
            dataIndex: 'paymentStatus',
            width: 120,
            search: false,
            render: (t, r, i) => {
                if (t === '0') {
                    return '未付款'
                } else if (t === '1') {
                    return '已申请'
                } else if (t === '2') {
                    return '待付款'
                } else if (t === '3') {
                    return '付款中'
                } else if (t === '4') {
                    return '付款成功'
                } else if (t === '5') {
                    return '付款失败'
                } else if (t === '6') {
                    return '付款取消'
                } else if (t === '7') {
                    return '审批驳回'
                } else if (t === '8') {
                    return '付款异常'
                }
            }
        }, {
            title: '生成时间',
            key: 'approveAt',
            dataIndex: 'approveAt',
            width: 120,
            search: false,
            render: (t, r, i) => {
                return <span>{t && t.substr(0, 10)}</span>
            },
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            search: false,
            render: (text, record) => (
                <Space size="middle">
                    {
                        record.paymentStatus === '2' ?
                            <>
                                <a onClick={() => { finanAction(record) }}>查看明细</a>
                                <a onClick={() => { finanCancelPayment(record) }}>取消付款</a>
                                <a onClick={() => { finanPayment(record) }}>付款</a>
                            </> :
                            <>
                                <a onClick={() => { finanAction(record) }}>查看明细</a>
                            </>
                    }
                </Space >
            ),
        }
    ];
    const finanAction = (record) => {
        props.history.push({
            pathname: '/financial/financialQueryDetail',
            query: record,
        })
    }

    //弹框判断
    const look = (a) => {
        if (a === "1") {
            setOperation("付款确认");
            setA(a)
        } else if (a === "2") {
            setOperation("取消付款确认");
            setA(a)
        } else if (a === "3") {
            setOperation("付款确认");
            setA(a)
        } else if (a === "4") {
            setOperation("")
            setA(a)
        }
        setIsModalVisible(true);
    };
    const rendermodal = (a) => {
        if (a === '1') {
            return <div>
                <Form
                    layout={'vertical'}
                    initialValues={orderFormObj}
                    form={orderForm}
                >
                    <Form.Item name='approveBatchNo' label="批次号" style={{ display: 'none' }}>
                        <Input disabled />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name='orderSum' label="订单数据">
                                <Input disabled type='number' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='orderCount' label="总数量明细">
                                <Input disabled type='number' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='orderAmount' label="付款金额">
                                <Input disabled type='number' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider dashed />
                    <Form.Item label="填写用途"
                        rules={[{ required: true, message: '请输入用途' }]}
                        required
                        name='bizUsage' >
                        <TextArea rows={6} placeholder="请输入用途" />
                    </Form.Item>
                    <Form.Item label="填写摘要" name='digest'>
                        <TextArea rows={6} placeholder="请输入摘要" />
                    </Form.Item>
                    <Divider />
                    <div>
                        <Button type="" onClick={handleCancel} style={{ marginRight: '20px' }}>取消</Button>
                        <Button type="primary" onClick={submitPayment} htmlType="submit" width="650px">
                            确定
                        </Button>
                    </div>
                </Form>
            </div>
        } else if (a === '2') {
            return <div>
                <Form
                    layout={'vertical'}
                    initialValues={orderFormObj}
                    form={orderForm}
                >
                    <Form.Item name='approveBatchNo' label="批次号" style={{ display: 'none' }}>
                        <Input disabled />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name='orderSum' label="订单数据">
                                <Input disabled type='number' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='orderCount' label="总数量明细">
                                <Input disabled type='number' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='orderAmount' label="驳回结算金额">
                                <Input disabled type='number' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div>
                        <Button type="" onClick={handleCancel} style={{ marginRight: '20px' }}>取消</Button>
                        <Button type="primary" onClick={cancelPayment} htmlType="submit" width="650px">
                            确定
                        </Button>
                    </div>
                </Form>
            </div>
        }
    }
    //付款
    const finanPayment = (record) => {
        handleSetPaymentForm(record)
        look('1')
    }
    //取消付款
    const finanCancelPayment = (record) => {
        handleSetPaymentForm(record)
        look('2')
    }
    const handleSetPaymentForm = (record) => {
        setOrderFormObj({
            approveBatchNo: record.approveBatchNo,  // 批次号  todo 待确认是否是payStatement 要的id
            orderSum: record.submitNumber,  // 订单数量就是提交明细笔数
            orderCount: record.orderCount,    // 总数量明细  todo 待后端接口返回确定
            orderAmount: record.submitAmount,
        })
    }
    //提交付款
    const submitPayment = () => {
        orderForm.validateFields(['bizUsage']).then(() => {
            let _orderForm = orderForm.getFieldsValue();
            let params = {
                tellerNo: tellerNo,
                id: _orderForm.approveBatchNo,  //todo 待确认是否是payStatement 要的id
                bizUsage: _orderForm.bizUsage,
                digest: _orderForm.digest || "",
            }
            // 如果后端是为空不需要传的情况  可以把上面的   digest:_orderForm.digest || "",删除掉
            if (_orderForm.digest) {
                params.digest = _orderForm.digest
            }
            handleConfirmTips('是否确认付款？', async () => {
                let res = await sumbitPayStatement(params)
                if (res.success) {
                    openNotification('success', '付款成功')
                } else {
                    openNotification('error', res.errorMsg ? res.errorMsg : '付款失败')
                }
                setIsModalVisible(false);
                setOrderFormObj({});
            })
        }).catch(() => { })
    }
    //取消付款
    const cancelPayment = () => {
        orderForm.validateFields(['bizUsage']).then(() => {
            let _orderForm = orderForm.getFieldsValue();
            let params = {
                tellerNo: tellerNo,
                id: _orderForm.approveBatchNo,  //todo 待确认是否是payStatement 要的id
                // bizUsage: _orderForm.bizUsage,
                // digest: _orderForm.digest || "",
                bizUsage: "1",
                digest: "1",
            }
            // 如果后端是为空不需要传的情况  可以把上面的   digest:_orderForm.digest || "",删除掉
            // if (_orderForm.digest) {
            //     params.digest = _orderForm.digest
            // }
            handleConfirmTips('是否取消付款？', async () => {
                let res = await cancelPayStatement(params) //此处是取消付款的接口
                if (res.success) {
                    openNotification('success', '取消付款成功')
                } else {
                    openNotification('error', res.errorMsg ? res.errorMsg : '取消付款失败')
                }
                setIsModalVisible(false);
                setOrderFormObj({});
            })
        }).catch(() => { })
    }
    //错误弹框
    const openNotification = (type, errorMsg) => {
        notification[type]({
            duration: 3,
            description: errorMsg
        });
    }
    // 确认弹框
    const handleConfirmTips = (message, cbOk) => {
        Modal.confirm({
            title: message,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                if (cbOk) {
                    cbOk();
                }
            }
        })
    }

    return (
        <div>
            <ProTable
                scroll={{ x: 1500 }}
                columns={columns}
                request={async (params, sort, filter) => {
                    let postData = {
                        tellerNo: tellerNo,
                        pageNum: params.current,
                        pageSize: params.pageSize,
                        beginTime: params.beginTime,
                        endTime: params.endTime,
                        approveBatchNo: params.approveBatchNo,
                        paymentStatus: params.paymentStatus,

                    }
                    try {
                        const res = await batchQueryList(postData);
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
                    syncToUrl: (values, type) => {
                        return values;
                    },
                }} pagination={{
                    pageSize: 20,
                }} dateFormatter="string" headerTitle="批次查询列表"
                toolBarRender={() => [

                ]}
            />
            <Modal title={operation} visible={isModalVisible} width="50%" footer={null} keyboard={true} onCancel={handleCancel} getContainer={false} maskClosable={false}>
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

export default connect(mapStateToProps, mapDispatchToProps)(finanQuery);