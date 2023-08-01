import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { Table, Space, DatePicker, Pagination, Spin, Modal,  Button, Input, Tabs, Form } from 'antd'
import { useHistory } from 'react-router-dom'
import { summaryList } from '@api/specialMedicine'
import writeOffSearch from '../../../enumeration/writeOffSearch'
import moment from 'moment';
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
const finanQueryDetail = (props) => {
    let history = useHistory()
    const { cacheUser, userInfo } = props;
    const [finanData, setFinanData] = useState(props.location.query)
    const [approBatchNo, setAppBatchNo] = useState(finanData ? finanData.approveBatchNo : '')
    //时间选择
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
    const [tabdata, setTabdata] = useState()
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [total, setTotal] = useState()
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [loading, setLoading] = useState(false)
    //店铺日期
    const [accDate, setAccountDate] = useState(finanData ? moment(finanData.orderAt) : moment(initDate))
    //店铺名称
    const [voucherValue, setVoucherValue] = useState()

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState();
    const [a, setA] = useState("0")

    const [id, setId] = useState()
    const { TabPane } = Tabs;
    const [selectionType, setSelectionType] = useState()
    const [key, setActiveKey] = useState()
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
            title: '付款失败原因',
            dataIndex: 'failureDesc',
            key: 'failureDesc',
        },
        {
            title: '用途',
            dataIndex: 'paymentUsage',
            key: 'paymentUsage',
        },

        {
            title: '摘要',
            dataIndex: 'paymentAbstract',
            key: 'paymentAbstract',
        },
        // {
        //     title: '操作',
        //     key: 'action',
        //     fixed: 'right',
        //     render: (text, record) => (
        //         <Space size="middle">
        //             <a onClick={() => { finanReceipt(record) }}>查看回单</a>
        //         </Space>
        //     ),
        // }
    ];
    //查看回单
    const finanReceipt = () => {
        look('1')
    }
    useEffect(() => {
        setLoading(true)
        writterList(pageNum, pageSize,key)
    }, [])
    //列表
    const writterList = async (pageNum, pageSize,key) => {
        let params = {
            tellerNo:tellerNo,
            orderAt: accDate.format('yyyy-MM-DD'),
            approveBatchNo: approBatchNo,
            supplierName: voucherValue,
            paymentStatus: key,
            pageNum: pageNum,
            pageSize: pageSize
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        const res = await summaryList(params)
        setTotal(res.pageInfo.total)
        setTabdata(res.result)
    }
    //Tab点击事件
    const changeTab = async (key) => {
        if(key==='1'){
            setActiveKey()
            writterList(pageNum, pageSize,null)
        }else{
            setActiveKey(key)
            writterList(pageNum, pageSize,key)
        }
    }
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
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
        writterList(pageNum, pageSize,key)
    }
    //重置按钮
    const inputreset = () => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        setLoading(true)
        setAccountDate(moment(initDate))
        setVoucherValue()
    }
    //分页变化
    const pagechange = async (pageNum, pageSize) => {
        setPageNum(pageNum)
        setPageSize(pageSize)
        writterList(pageNum, pageSize,key)
    }

    //弹框判断
    const look = (a) => {
        if (a === "1") {
            setOperation("查看回单");
            setA(a)
        } else if (a === "2") {
            setOperation("驳回订单确认");
            setA(a)
        } else if (a === "3") {
            setOperation("编辑一级部门");
            setA(a)
        } else if (a === "4") {
            setOperation("")
            setA(a)
        }
        setIsModalVisible(true);
    };
    //下载回单
    const handleConfirm = () => {

    }
    const rendermodal = (a) => {
        if (a === '1') {
            return <div>
                <Form>
                    <div
                        className={styles.formButton}>
                        <Button type="" onClick={handleCancel} className={styles.formButtonItem} style={{ marginRight: '20px' }}>取消</Button>
                        <Button type="primary" onClick={handleConfirm} className={styles.formButtonItem} htmlType="submit" width="650px">
                            下载回单
                        </Button>
                    </div>
                </Form>
            </div>
        }
    }

    
    return (
        <div className={styles.box}>
            <div className={styles.proTableSearch}>
                <div className={styles.proTableHead}>
                    <div style={{display:'flex'}}>
                        <div>
                            <span style={{ fontSize: '15px' }}>订单日期:</span>
                            <Space direction="vertical">
                                <DatePicker defaultValue={moment().subtract(1, 'days').endOf('day')} style={{
                                    maxWidth: '200px', minWidth: '80px',
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
                                maxWidth: '200px', minWidth: '80px',
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
                <div className={styles.cardTop}>
                    <div className={styles.tab}>
                        <Spin spinning={loading}>
                            <Tabs onChange={changeTab}>
                                <TabPane tab="全部" key="1" activeKey="1">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }} />
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
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }} />
                                </TabPane>
                                <TabPane tab="付款取消" key="6" activeKey="6">
                                    <Table columns={columns} dataSource={tabdata} pagination={false} scroll={{ x: 2700 }} />
                                </TabPane>
                                <TabPane tab="付款异常" key="8" activeKey="8">
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

export default connect(mapStateToProps, mapDispatchToProps)(finanQueryDetail);
