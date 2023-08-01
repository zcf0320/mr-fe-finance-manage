import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { message, Table, Space, DatePicker, Select, Pagination, Spin, Modal, notification, Button, Input, Tabs, Form, Row, Col, Divider } from 'antd'
import { useHistory } from 'react-router-dom'
const { TextArea } = Input;
import { summaryList, summaryDetail, approveOrder } from '@api/specialMedicine'
import finanMain from '../../../enumeration/finanMain'
import moment from 'moment';
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';

const finanMaintenance = (props) => {
    let history = useHistory()
    const { cacheUser, userInfo } = props;
    //时间选择
    // const date = new Date('2022-04-18')//new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)//日期要求默认当前日期前一天
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
    const [tabdata, setTabdata] = useState()

    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [total, setTotal] = useState()
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [loading, setLoading] = useState(false)
    //店铺日期
    const [accDate, setAccountDate] = useState(moment(initDate))
    //店铺名称
    const [voucherValue, setVoucherValue] = useState()
    const [rejectForm] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState();
    const [a, setA] = useState("0")
    //存放选择保存
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    //存放弹出驳回订单确认数据
    const [rejectFormObj, setRejectFormObj] = useState({});
    const [rejectFormDisable, setRejectFormDisable] = useState(true);

    const [id, setId] = useState()
    const { TabPane } = Tabs;
    const [selectionType, setSelectionType] = useState()
    const [key, setActiveKey] = useState('1')
    const columns = [
        {
            title: '店铺ID',
            dataIndex: 'supplierId',
            key: 'supplierId',
        },
        {
            title: '店铺名称',
            dataIndex: 'supplierName',
            key: 'supplierName',
        },
        {
            title: '付款申请批次号',
            dataIndex: 'paymentBatchNo',
            key: 'paymentBatchNo',
        },
        {
            title: '订单总金额',
            key: 'sumOrderAmount',
            dataIndex: 'sumOrderAmount',
            // render: (t, r, i) => {
            //     return <span>{(r.sumPaymentAmount).toFixed(2)}</span>
            // }
        },
        {
            title: '订单实付总金额 ',
            key: 'sumPaymentAmount',
            dataIndex: 'sumPaymentAmount',
        },
        {
            title: '联行号',
            key: 'cnapsNum',
            dataIndex: 'cnapsNum',
        },
        {
            title: '订单日期',
            key: 'orderAt',
            dataIndex: 'orderAt',
            render: (t, r, i) => {
                return <span>{t && t.substr(0, 10)}</span>
            },
        },
        {
            title: '订单笔数',
            key: 'orderCount',
            dataIndex: 'orderCount',
        },
        {
            title: '付款状态',
            key: 'paymentStatus',
            dataIndex: 'paymentStatus',
            render: (t, r, i) => {
                if (t === '0') {
                    return '未付款'
                } else if (t === '1') {
                    return '已申请'
                } else if (t === '2') {
                    return '已审批'
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
        },
        {
            title: '付款申请日期',
            key: 'paymentApplyAt',
            dataIndex: 'paymentApplyAt',
            render: (t, r, i) => {
                return <span>{t && t.substr(0, 10)}</span>
            },
        },
        {
            title: '收方户名',
            dataIndex: 'payeeName',
            key: 'payeeName',

        },
        {
            title: '收方账号',
            dataIndex: 'payeeAcctNo',
            key: 'payeeAcctNo',
        },
        {
            title: '收方开户行名称',
            dataIndex: 'payeeBankName',
            key: 'payeeBankName',

        }, {
            title: '收方开户行地址',
            dataIndex: 'payaeeBankAddr',
            key: 'payaeeBankAddr',
        }, {
            title: '操作',
            key: 'action',
            fixed: 'right',
            render: (text, record) => (
                <Space size="middle">
                    {record.paymentStatus === '7' ?
                        <>
                            <a onClick={() => { finanAction(record) }}>查看明细</a>
                            <a onClick={() => { finanReject(record) }}>驳回原因</a>
                        </> : <>
                            <a onClick={() => { finanAction(record) }}>查看明细</a>
                        </>
                    }
                </Space>
            ),
        }
    ];
    //驳回原因
    const finanReject = (record) => {
        //record.rejectDesc
        Modal.info({
            title: '驳回原因',
            content: (
                <div>
                    <p>{record.rejectDesc}</p>
                </div>
            ),
        })
    }
    //查看明细
    const finanAction = (record) => {
        props.history.push({
            pathname: '/financial/financialMaintenanceDetail',
            query: record
        })
    }
    useEffect(() => {
        setLoading(true)
        writterList(pageNum, pageSize)
    }, [])
    //核销结果查询
    const writterList = async (pageNum, pageSize) => {
        let params = {
            tellerNo: tellerNo,
            paymentStatus: key,
            orderAt: accDate ? accDate.format('yyyy-MM-DD') : 'null',
            supplierName: voucherValue,
            pageNum: pageNum,
            pageSize: pageSize,
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        const res = await summaryList(params)
        if (res.result) {
            setTotal(res.pageInfo.total)
            setTabdata(res.result)
        }

    }
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
        setRejectFormObj({});
        //重置表格数据
        rejectForm.resetFields();
    };

    const changeDate = (moment, string) => {
        setAccountDate(moment)
    }
    const voucherRck = (e) => {
        setVoucherValue(e.target.value)
    }
    //查询按钮
    const searchBtn = () => {
        setLoading(true)
        writterList(pageNum, pageSize)
        changeTab(key)
    }
    //重置按钮
    const inputreset = () => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        setLoading(true)
        setVoucherValue()
        setAccountDate(moment(initDate))
    }
    //分页变化 
    const pagechange = async (pageNum, pageSize) => {
        setPageNum(pageNum)
        setPageSize(pageSize)
        writterList(pageNum, pageSize);
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
            setSelectedRowKeys(selectedRowKeys)
        },
        onSelect: (record, selected, selectedRows) => {
            setSelectedRows(selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            setSelectedRows(selectedRows);
        },
    };

    //弹框判断
    const look = (a) => {
        if (a === "2") {
            setOperation("驳回订单确认");
            setA(a)
        } else if (a === "3") {
            setOperation("付款确认");
            setA(a)
        }
        setIsModalVisible(true);
    };
    //驳回
    const handleReject = () => {
        if (selectedRows.length > 0) {
            let _rejectOrderAmount = 0;//驳回结算金额
            let _rejectOrderCount = 0;
            look('2')
            selectedRows.forEach(item => {
                _rejectOrderAmount += Number(item.sumPaymentAmount);
                _rejectOrderCount += Number(item.orderCount);
            })
            setRejectFormObj({
                rejectOrderAmount: _rejectOrderAmount,
                rejectOrderCount: _rejectOrderCount,
                orderSum: selectedRows.length
            })
        } else {
            message.info('请先选择一个驳回订单')
        }
    }
    //审批
    const handleFinancialApproval = () => {
        if (key === '1' || key === '5' ||key === '6' || key === '8') {
            if (selectedRows.length > 0) {
                handleConfirmTips('是否审批这些订单', financialApproval)
            } else {
                message.info('请先选择一个订单')
            }
        }
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
    //订单审批接口调用
    const financialApproval = async (type = '0', rejectDesc = '') => {
        let paymentBatchNoArr = [];
        selectedRows.forEach(item => {
            // 只有当 未付款  或者是审批驳回的才调用此接口
            paymentBatchNoArr.push(item.paymentBatchNo)
        });
        if (paymentBatchNoArr.length > 0) {
            let params = {
                tellerNo: tellerNo,
                examineType: type,//审批类型  0 是审批 1 是驳回
                paymentBatchNos: paymentBatchNoArr,
            }
            if (type === '1') {
                params.rejectDesc = rejectDesc
            }
            let res = await approveOrder(params)
            writterList(pageNum, pageSize)
            setIsModalVisible(false);
            if (res.success) {
                if (type === '1') {
                    message.info('驳回成功');
                } else if (type === '0') {
                    message.info('审批成功');
                }
            } else {
                message.info(res.errorMsg);
            }

        } else {
            message.info('数据不正确');
        }
    }
    const handleConfirm = () => {
        if (a === '2') {
            // a 为2  是驳回订单确认页面
            //   rejectForm.validateForm();
            rejectForm.validateFields(['rejectDesc']).then((data) => {
                if (data) {
                    financialApproval('1', data.rejectDesc)
                }
            });
        }
    }

    const rendermodal = (a) => {
        if (a === '2') {
            return <div>
                <Form
                    form={rejectForm}
                    initialValues={rejectFormObj}
                    values={rejectFormObj}
                    layout={'vertical'}
                >
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name='orderSum' label="订单数据">
                                <Input type='number' disabled={rejectFormDisable} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='rejectOrderCount' label="总数量明细">
                                <Input type='number' disabled={rejectFormDisable} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='rejectOrderAmount' label="驳回结算金额">
                                <Input type='number' disabled={rejectFormDisable} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider dashed className={styles.divider} />
                    <Form.Item label="驳回原因" name='rejectDesc' rules={[{ required: true, message: '请输入驳回原因' }]}>
                        <TextArea rows={6} placeholder="请输入驳回原因" />
                    </Form.Item>
                    <Divider />
                    <div
                        className={styles.formButton}
                    >
                        <Button type="" onClick={handleCancel} className={styles.formButtonItem} style={{ marginRight: '20px' }}>取消</Button>
                        <Button type="primary" onClick={handleConfirm} className={styles.formButtonItem} htmlType="submit" width="650px">
                            确定
                        </Button>
                    </div>
                </Form>
            </div>
        }
        else if (a === '3') {
            return <div>
                <Form
                    layout={'vertical'}
                >
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name='orderSum' label="订单数据">
                                <Input type='number' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='rejectOrderCount' label="总数量明细">
                                <Input type='number' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='rejectOrderAmount' label="驳回结算金额">
                                <Input type='number' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider dashed className={styles.divider} />
                    <Form.Item label="填写用途"   >
                        <TextArea disabled={rejectFormDisable} rows={6} placeholder="请输入用途" />
                    </Form.Item>
                    <Form.Item label="填写摘要"   >
                        <TextArea rows={6} placeholder="请输入摘要" />
                    </Form.Item>
                    <Divider />
                    <div
                        className={styles.formButton}

                    >  <TextArea value={rejectForm.reject} disabled={rejectFormDisable} rows={6} placeholder="请输入用途" />
                        <Button type="" onClick={handleCancel} className={styles.formButtonItem} style={{ marginRight: '20px' }}>取消</Button>
                        <Button type="primary" onClick={handleConfirm} className={styles.formButtonItem} htmlType="submit" width="650px">
                            确定
                        </Button>
                    </div>
                </Form>
            </div>
        }
    }
    //Tab点击事件
    const changeTab = async (key) => {
        setSelectedRows([]); //每次选中tab 都清空下选择项保存
        setSelectedRowKeys([]);
        setActiveKey(key)
        let params = {
            tellerNo: tellerNo,
            orderAt: accDate.format('yyyy-MM-DD'),
            paymentStatus: key,
        }
        const res = await summaryList(params)
        setTotal(res.pageInfo.total)
        setTabdata(res.result)
        setTimeout(() => {
            setLoading(false)
        }, 500)
        setLoading(true)
    }
    return (
        <div className={styles.box}>
            <div className={styles.proTableSearch}>
                <div className={styles.proTableHead}>
                    <div style={{ display: 'flex' }}>
                        <div>
                            <span style={{ fontSize: '15px' }}>订单日期:</span>
                            <Space direction="vertical">
                                <DatePicker defaultValue={moment().subtract(1, 'days').endOf('day')} style={{
                                    maxWidth: '200px', minWidth: '110px',
                                    height: '32px', marginLeft: '15px', width: '400px',
                                }} size={"small"}
                                    onChange={changeDate}
                                    value={accDate}
                                />
                            </Space>
                        </div>
                        <div>
                            <span style={{ fontSize: '15px', marginLeft: '20px' }}>店铺名称:</span>
                            <Input placeholder='请输入:' value={voucherValue} onChange={(e) => { voucherRck(e) }} style={{
                                maxWidth: '200px', minWidth: '110px',
                                marginLeft: '5px', height: '32px', width: '400px'
                            }}>
                            </Input>
                        </div>
                    </div>
                    <div className={styles.proTables}>
                        <Button className={styles.reset} onClick={inputreset}>重置</Button>
                        <Button className={styles.searchBtn} onClick={searchBtn}>查询</Button>
                    </div>
                </div>

            </div>
            <div className={styles.card}>
                <div className={styles.mixing}>
                    <b>财务审批</b>
                </div>
                <div className={styles.but}>
                    <Button type='primary' onClick={handleFinancialApproval} style={{ fontSize: '16px' }} >财务审批</Button>
                    <Button type='primary' onClick={handleReject} style={{ marginLeft: "10px", fontSize: "16px" }}>驳回订单</Button>
                </div>
                <div className={styles.cardTop}>
                    <div className={styles.tab}>
                        <Spin spinning={loading}>
                            <Tabs onChange={changeTab}>
                                <TabPane tab="待审批" key="1" activeKey="1">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }}
                                        rowSelection={{
                                            selectedRowKeys,
                                            type: selectionType,
                                            ...rowSelection,
                                        }}
                                        rowKey={record => record.paymentBatchNo}
                                    />
                                </TabPane>
                                <TabPane tab="待付款" key="2" activeKey="2">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }} />
                                </TabPane>
                                <TabPane tab="付款中" key="3" activeKey="3">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }} />
                                </TabPane>
                                <TabPane tab="付款成功" key="4" activeKey="4">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }} />
                                </TabPane>
                                <TabPane tab="付款失败" key="5" activeKey="5">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }}
                                        rowSelection={{
                                            selectedRowKeys,
                                            type: selectionType,
                                            ...rowSelection,
                                        }}
                                        rowKey={record => record.paymentBatchNo}
                                    />
                                </TabPane>
                                <TabPane tab="付款取消" key="6" activeKey="6">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }}
                                        rowSelection={{
                                            selectedRowKeys,
                                            type: selectionType,
                                            ...rowSelection,
                                        }}
                                        rowKey={record => record.paymentBatchNo}
                                    />
                                </TabPane>
                                <TabPane tab="付款异常" key="8" activeKey="8">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }}
                                        rowSelection={{
                                            selectedRowKeys,
                                            type: selectionType,
                                            ...rowSelection,
                                        }}
                                        rowKey={record => record.paymentBatchNo}
                                    />
                                </TabPane>
                                <TabPane tab="已驳回" key="7" activeKey="7">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }} />
                                </TabPane>
                            </Tabs>
                        </Spin>

                    </div>
                    <div className={styles.table}>
                        <div className={styles.pagination}>
                            <Pagination
                                total={total}
                                current={pageNum}
                                showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                                defaultPageSize={pageSize}
                                defaultCurrent={pageNum}
                                showSizeChanger={true}
                                pageSizeOptions={[10, 20, 50, 100]}
                                onChange={(pageNum, pageSize) => pagechange(pageNum, pageSize)}
                            />
                        </div>
                    </div>
                </div>

            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(finanMaintenance);
