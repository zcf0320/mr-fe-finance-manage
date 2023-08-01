import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { Table, Pagination, Button, Input, notification, Spin } from 'antd'
import { summaryList, summaryDetail } from '@api/specialMedicine'
import finanMain from '../../../enumeration/finanMain'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import finanMaintenance from '../finanMaintenance';
const finanMaintenanceDetail = (props) => {
    const { cacheUser, userInfo } = props;
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
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [finansData, setFinansData] = useState(props.location.query)
    const [batchNo, setBatchNo] = useState(finansData ? finansData.paymentBatchNo : '')
    const [written, setWritten] = useState(props.location.query)
    const [tabdata, setTabdata] = useState()
    const [total, setTotal] = useState()
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    //数据懒加载
    const [loading, setLoading] = useState(false)
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
            // render: (t, r, i) => {
            //     return writeOffSearch(t, 'payWayCode')
            // }
        },
        {
            title: '订单号',
            key: 'orderTransactionNumber',
            dataIndex: 'orderTransactionNumber',
            // render: (t, r, i) => {
            //     return <span>{(r.actualReceiveAmount).toFixed(2)}</span>
            // }
        },
        {
            title: '订单总金额',
            dataIndex: 'orderAmount',
            key: 'orderAmount',
        },
        {
            title: '订单实付金额',
            dataIndex: 'paymentAmount',
            key: 'paymentAmount',
        },
        {
            title: '订单日期',
            dataIndex: 'orderAt',
            key: 'orderAt',
            render: (t, r, i) => {
                return <span>{t && t.substr(0, 10)}</span>
            },
        },
        {
            title: '付款状态',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
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
    ];

    useEffect(() => {
        writterOfflist(pageNum, pageSize)
    }, [])
    //财务明细列表
    const writterOfflist = async (pageNum, pageSize) => {
        const params = {
            tellerNo: tellerNo,
            paymentBatchNo: batchNo,
            pageNum: pageNum,
            pageSize: pageSize
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        const res = await summaryDetail(params)
        if (res.result) {
            setTotal(res.pageInfo.total)
            setTabdata(res.result)
        }
    }
    //查询
    const Abb = () => {
        if (batchNo) {
            setLoading(true)
            writterOfflist(pageNum, pageSize)
        } else {
            notification.open({
                duration: 3,
                description: "付款申请批次号必须输入"
            });
        }
    }
    //重置
    const Xia = () => {
        setBatchNo()
    }
    //分页变化
    const pagechange = async (pageNum, pageSize) => {
        setPageNum(pageNum)
        setPageSize(pageSize)
        await writterOfflist(pageNum, pageSize)
    }
    const searchFinan = (e) => {
        if (e.target.value === '') {
            setBatchNo()
        } else {
            setBatchNo(e.target.value)
        }
    }
    return (
        <div className={styles.box}>
            <div className={styles.proTableSearch}>
                <p>财务审批明细</p>
                <div className={styles.writtenmiddle}>
                    <div style={{ marginLeft: '20px' }}>
                        <span style={{ textIndent: '20px', fontSize: '18px', color: '#000' }}>付款申请批次号:</span>
                        <Input placeholder='请输入'
                            value={batchNo}
                            onChange={(e) => searchFinan(e)}
                            style={{ width: '300px', borderRadius: '5px', marginLeft: '5px', marginTop: '-2px' }} />
                    </div>
                    <div style={{ marginRight: '20px' }}>
                        <Button onClick={() => Abb()} type="primary" style={{ width: '90px', height: '40px', fontSize: '18px', }}
                        >查询</Button>
                        <Button onClick={() => Xia()} style={{ width: '90px', height: '40px', fontSize: '18px', marginLeft: "30px" }}>重置</Button>
                    </div>
                </div>
            </div>
            <div className={styles.table}>
                <Spin spinning={loading}>
                    <Table columns={columns} dataSource={tabdata} pagination={false} rowKey="id" />
                </Spin>

                <div className={styles.pagination}>
                    <Pagination
                        total={total}
                        showTotal={(total) => `第1-${total}条/总共 ${total} 条`}
                        defaultPageSize={pageSize}
                        defaultCurrent={pageNum}
                        showSizeChanger={true}
                        pageSizeOptions={[10, 20, 50, 100]}
                        onChange={(pageNum, pageSize) => pagechange(pageNum, pageSize)}
                    />
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(finanMaintenanceDetail);