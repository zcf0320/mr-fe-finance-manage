import React, { useState, useEffect } from 'react'
import { Card, Select, DatePicker, Space, Button, Col, Table, Pagination, Modal, notification } from 'antd';
import styles from './index.module.scss'
import moment from 'moment';
import dailyReport from '../../../enumeration/dailyReport'
import { getdailyReportList, dailyReportDetail, withDrawDetail, orderDetail, exportEveryDay, summaryExportEveryDay, errorDetail, otherDetail } from '@api/dailyReport.js'
export default function index() {
    const { Option } = Select;
    //时间选择
    const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    const appendZero = (obj) => {
        if (obj < 10) {
            return '0' + obj
        } else {
            return obj
        }
    }
    const Y = date.getFullYear()
    const M = appendZero(date.getMonth() + 1)
    const D = appendZero(date.getDate())
    const initDate = Y + "-" + M + "-" + D
    const [operation, setOperation] = useState();
    const [acountMount, setAcountMount] = useState()
    const [accountMountVal, setAccountMountVal] = useState()
    const [beginDate, setBeginDate] = useState(moment(initDate))
    const [endDate, setEndDate] = useState(moment(initDate))
    const [tabData, setTabData] = useState()
    const [total, setTotal] = useState()
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [tablist, setTablist] = useState()
    const [tabTotal, setTabTotal] = useState()
    const [tabpageNum, setTabPageNum] = useState(1)
    const [tabpageSize, setTabPageSize] = useState(5)
    const [tabDetail, setTabDetail] = useState()
    const [orderTotal, setOrderTotal] = useState()
    const [orderPageNum, setOrderPageNum] = useState(1)
    const [orderPageSize, setOrderPageSize] = useState(5)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [accountId, setAccountId] = useState()
    const [tradeType, setTradeType] = useState()
    const [supplierId, setSupplierId] = useState()
    const [record, setRecord] = useState()
    const [accountName, setAccountName] = useState()
    const [index, setIndex] = useState()

    //消费/退款
    const columns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        }, {
            title: '店铺名称',
            dataIndex: 'supplierName',
            key: 'supplierName',
        }, {
            title: '清算金额',
            dataIndex: 'clearAmount',
            key: 'clearAmount',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        }, {
            title: '手续费金额',
            dataIndex: 'feeAmount',
            key: 'feeAmount',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        }, {
            title: '店铺Id',
            dataIndex: 'supplierId',
            key: 'supplierId',
        }, {
            title: '操作',
            key: 'option',
            width: '150px',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => lookDetail(record)}>查看明细</ a>
                </Space>
            ),
        }
    ]
    //提现
    const withdrawColumns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        }, {
            title: '金额',
            dataIndex: 'transferAmount',
            key: 'transferAmount',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        }, {
            title: '手续费金额',
            dataIndex: 'transferFee',
            key: 'transferFee',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        },
    ]//充值
    const depositColumns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        }, {
            title: '日期',
            dataIndex: 'accountDate',
            key: 'accountDate',
        }, {
            title: '金额',
            dataIndex: 'transferAmount',
            key: 'transferAmount',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        }
    ]
    //差错
    const errorColumns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        }, {
            title: '日期',
            dataIndex: 'accountDate',
            key: 'accountDate',
        }, {
            title: '流水号',
            dataIndex: 'jnlNo',
            key: 'jnlNo',
        }, {
            title: '差错类型',
            dataIndex: 'errorType',
            key: 'errorType',
            render: (t, r, i) => {
                return dailyReport(t, 'errorType')
            }
        }, {
            title: '交易类型',
            dataIndex: 'tradeType',
            key: 'tradeType',
            render: (t, r, i) => {
                return dailyReport(t, 'tradeType')
            }
        }, {
            title: '主队账方金额，（单位元）',
            dataIndex: 'masterMoney',
            key: 'masterMoney',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        }, {
            title: '次对账方金额，（单位元）',
            dataIndex: 'secondaryMoney',
            key: 'secondaryMoney',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        }, {
            title: '店铺ID',
            dataIndex: 'supplierId',
            key: 'supplierId',
        }, {
            title: '店铺名称',
            dataIndex: 'supplierName',
            key: 'supplierName',
        },
    ]
    //其他
    const otherColumns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        }, {
            title: '费用类型',
            dataIndex: 'tradeType',
            key: 'tradeType',
            render: (t, r, i) => {
                return dailyReport(t, 'tradeType')
            }
        }, {
            title: '费用金额',
            dataIndex: 'accountAmount',
            key: 'accountAmount',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        },
    ]
    //每日订单明细
    const tabDetailcolumns = [
        {
            title: '日期',
            dataIndex: 'accountDate',
            key: 'accountDate',
        }, {
            title: '支付订单号',
            dataIndex: 'orderTransactionNumber',
            key: 'orderTransactionNumber',
        }, {
            title: 'OMS订单号',
            dataIndex: 'orderNo',
            key: 'orderNo',
        }, {
            title: '交易类型',
            dataIndex: 'tradeType',
            key: 'tradeType',
            render: (t, r, i) => {
                return dailyReport(t, 'tradeType')
            }
        }, {
            title: '支付金额',
            dataIndex: 'paymentAmount',
            key: 'paymentAmount',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        }, {
            title: '手续费金额',
            dataIndex: 'feeAmount',
            key: 'feeAmount',
            render: (t, r, i) => {
                return moneyFormat(t?t.toFixed(2):t)
            }
        }, {
            title: '发生额',
            dataIndex: 'occurAmount',
            key: 'occurAmount',
            width:'70px',
            render: (t, r, i) => {
                return moneyFormat((r.paymentAmount - r.feeAmount).toFixed(2))
            }
        }, {
            title: '店铺名称',
            dataIndex: 'supplierName',
            key: 'supplierName',
        }, {
            title: '店铺ID',
            dataIndex: 'supplierId',
            key: 'supplierId',
        }, {
            title: '清算状态',
            dataIndex: 'clearStatus',
            key: 'clearStatus',
            render: (t, r, i) => {
                return dailyReport(t, 'clearStatus')
            }
        }, {
            title: '清算错误码',
            dataIndex: 'clearCode',
            key: 'clearCode',
        }, {
            title: '清算结果',
            dataIndex: 'clearMsg',
            key: 'clearMsg',
        }, {
            title: '总账会计日期',
            dataIndex: 'accountZwDate',
            key: 'accountZwDate',
        }, {
            title: '总账会计流水号',
            dataIndex: 'accountZwNo',
            key: 'accountZwNo',
        }, {
            title: '结算流水号',
            dataIndex: 'clearJournalNo',
            key: 'clearJournalNo',
        }, {
            title: '三方平台编号',
            dataIndex: 'thirdPlatformId',
            key: 'thirdPlatformId',
            render: (t, r, i) => {
                return dailyReport(t, 'thirdPlatformId')
            }
        }, {
            title: '机构编码',
            dataIndex: 'orgCode',
            key: 'orgCode',
        },
    ]

    useEffect(() => {
        getdailyReport(pageNum, pageSize)
    }, []);
    //获取数据
    const getdailyReport = async (pageNum, pageSize) => {
        let params = {
            accountId: acountMount,
            beginTime: beginDate.format('YYYY-MM-DD'),
            endTime: endDate.format('YYYY-MM-DD'),
            pageNum: pageNum,
            pageSize: pageSize
        }
        let res = await getdailyReportList(params)
        setTotal(res.pageInfo.total)
        setTabData(res.result)
    }
    //开始日期
    const changBeginDate = (moment, date) => {
        setBeginDate(moment)
    }
    //结束日期
    const changEndDate = (moment, date) => {
        setEndDate(moment)
    }
    //账号
    const acountMountSel = (e) => {
        if (e === '快钱-徐州万邦云药房连锁有限公司-yyf2@wbpharma.com-10219834775') {
            setAcountMount('fxjk')
            setAccountMountVal(e)
        } else if (e === '快钱-复星健康科技(江苏)有限公司-yjk2@wbpharma.com-10219928668') {
            setAcountMount('fxyjk')
            setAccountMountVal(e)
        } else if (e === '快钱-海南星创互联网医药有限公司-jkdj005@fosun.com-10219733103') {
            setAcountMount('platform')
            setAccountMountVal(e)
        } else if (e === '京东钱包-徐州万邦云药房连锁有限公司-xingshaoning123') {
            setAcountMount('JINGDONG_PAY')
            setAccountMountVal(e)
        } else if (e === '支付宝-徐州万邦云药房连锁有限公司-shiluyi@fosunhealth.com') {
            setAcountMount('ALI_PAY')
            setAccountMountVal(e)
        } else if (e === '拼多多钱包-徐州万邦云药房连锁有限公司-13585586846') {
            setAcountMount('PDD_PAY')
            setAccountMountVal(e)
        }
    }
    //重置
    const resetBtn = () => {
        setBeginDate(moment(initDate))
        setEndDate(moment(initDate))
        setAcountMount()
        setAccountMountVal('请选择')
    }
    //查询
    const search = () => {
        getdailyReport(pageNum, pageSize)
    }
    //每日汇总导出
    const summaryExport = async (beginTime, endTime, accountId, accountName) => {
        let params = {
            beginTime: beginTime,
            endTime: endTime,
            accountId: accountId,
            body: {
                exportNum: "1",
                fileName: "每日汇总文件" + accountName + beginTime + "-" + endTime + ".csv",
            }
        }
        let res = await summaryExportEveryDay(params)
        let blob = new Blob([res]);
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = params.body.fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    }
    //每日订单导出
    const reportExport = async () => {
        let params = {
            beginTime: beginDate.format('YYYY-MM-DD'),
            endTime: endDate.format('YYYY-MM-DD'),
            accountId: accountId,
            tradeType: tradeType,
            supplierId: supplierId,
            body: {
                exportNum: "1",
                fileName: "每日订单文件" + accountName + "-" + dailyReport(tradeType, 'tradeType') + "类型" + "-" + beginDate.format('YYYY-MM-DD') + "-" + endDate.format('YYYY-MM-DD') + ".csv",
            }
        }
        let res = await exportEveryDay(params)
        let blob = new Blob([res]);
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = params.body.fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    }
    //查看明细/消费/退款
    const reportDel = async (idx, type, accountId, accountName, tabpageNum, tabpageSize) => {
        setAccountId(accountId)
        setTradeType(type)
        setAccountName(accountName)
        setIndex(idx)
        setTabPageSize(tabpageSize)
        setTabPageNum(tabpageNum)
        if (type === 'CONSUME') {
            setOperation('查看消费详情')
        } else if (type === 'REFUND') {
            setOperation('查看退款详情')
        }
        getTabReportDetail(type, accountId, tabpageNum, tabpageSize ? tabpageSize : "5")
    }
    //消费/退款表格数据
    const getTabReportDetail = async (type, accountId, tabpageNum, tabpageSize) => {
        let params = {
            accountId: accountId,
            beginTime: beginDate.format('YYYY-MM-DD'),
            endTime: endDate.format('YYYY-MM-DD'),
            tradeType: type,
            pageNum: tabpageNum.toString(),
            pageSize: tabpageSize
        }
        let res = await dailyReportDetail(params)
        if (res.success) {
            setTabTotal(res.pageInfo.total)
            setTablist(res.result)
        } else {
            setTabTotal(0)
            setTablist([])
            openNotification(res.errorMsg)
        }
    }
    //提现/充值
    const withDrawDel = (idx, type, accountId, beginTime, endTime, tabpageNum, tabpageSize) => {
        setAccountId(accountId)
        setTradeType(type)
        setBeginDate(moment(beginTime))
        setEndDate(moment(endTime))
        setIndex(idx)
        setTabPageSize(tabpageSize)
        setTabPageNum(tabpageNum)
        getTabWithDrawDetail(type, accountId, moment(beginTime), moment(endTime), tabpageNum, tabpageSize ? tabpageSize : "5")
    }
    //提现/充值表格数据
    const getTabWithDrawDetail = async (tradeType, accountId, beginDate, endDate, tabpageNum, tabpageSize) => {
        let params = {
            accountId: accountId,
            beginTime: beginDate.format('YYYY-MM-DD'),
            endTime: endDate.format('YYYY-MM-DD'),
            tradeType: tradeType,
            pageNum: tabpageNum.toString(),
            pageSize: tabpageSize
        }
        let res = await withDrawDetail(params)
        if (res.success) {
            setTabTotal(res.pageInfo.total)
            setTablist(res.result)
        } else {
            setTabTotal(0)
            setTablist([])
            openNotification(res.errorMsg)
        }
    }
    //差错
    const errorDel = async (idx, accountId, beginTime, endTime, tabpageNum, tabpageSize) => {
        setAccountId(accountId)
        setBeginDate(moment(beginTime))
        setEndDate(moment(endTime))
        setIndex(idx)
        setTradeType('ERROR')
        setTabPageSize(tabpageSize)
        setTabPageNum(tabpageNum)
        getTabErrorDetail(accountId, moment(beginTime), moment(endTime), tabpageNum, tabpageSize ? tabpageSize : "5")
    }
    //差错表格数据
    const getTabErrorDetail = async (accountId, beginTime, endTime, tabpageNum, tabpageSize) => {
        let params = {
            accountId: accountId,
            beginTime: beginTime.format('YYYY-MM-DD'),
            endTime: endTime.format('YYYY-MM-DD'),
            pageNum: tabpageNum.toString(),
            pageSize: tabpageSize
        }
        let res = await errorDetail(params)
        if (res.success) {
            setTabTotal(res.pageInfo.total)
            setTablist(res.result)
        } else {
            setTabTotal(0)
            setTablist([])
            openNotification(res.errorMsg)
        }
    }
    //其他费用
    const otherDel = (idx, accountId, beginTime, endTime, tabpageNum, tabpageSize) => {
        setAccountId(accountId)
        setBeginDate(moment(beginTime))
        setEndDate(moment(endTime))
        setIndex(idx)
        setTradeType('OTHER')
        setTabPageSize(tabpageSize)
        setTabPageNum(tabpageNum)
        getTabOtherDetail(accountId, moment(beginTime), moment(endTime), tabpageNum, tabpageSize ? tabpageSize : "5")
    }
    //其他费用表格数据
    const getTabOtherDetail = async (accountId, beginTime, endTime, tabpageNum, tabpageSize) => {
        let params = {
            accountId: accountId,
            beginTime: beginTime.format('YYYY-MM-DD'),
            endTime: endTime.format('YYYY-MM-DD'),
            pageNum: tabpageNum.toString(),
            pageSize: tabpageSize
        }
        let res = await otherDetail(params)
        if (res.success) {
            setTabTotal(res.pageInfo.total)
            setTablist(res.result)
        } else {
            setTabTotal(0)
            setTablist([])
            openNotification(res.errorMsg)
        }
    }
    //查看每日订单表格明细
    const lookDetail = (record) => {
        setRecord(record)
        setIsModalVisible(true);
        setSupplierId(record.supplierId)
        getOrderDetail(record, orderPageNum, orderPageSize)
    }
    //获取每日订单表格明细
    const getOrderDetail = async (record, orderPageNum, orderPageSize) => {
        let params = {
            accountId: accountId,
            beginTime: beginDate.format('YYYY-MM-DD'),
            endTime: endDate.format('YYYY-MM-DD'),
            tradeType: tradeType,
            supplierId: record.supplierId,
            pageNum: orderPageNum,
            pageSize: orderPageSize,
        }
        let res = await orderDetail(params)
        setTabDetail(res.result)
        setOrderTotal(res.pageInfo.total)
    }
    //分页每日订单明细
    const orderPageChang = (orderPageNum, orderPageSize) => {
        setOrderPageSize(orderPageSize)
        setOrderPageNum(orderPageNum)
        getOrderDetail(record, orderPageNum, orderPageSize)
    }
    //分页Tab
    const tabPageChang = (tabpageNum, tabpageSize) => {
        setTabPageSize(tabpageSize)
        setTabPageNum(tabpageNum)
        if (tradeType === 'CONSUME' || tradeType === 'REFUND') {
            getTabReportDetail(tradeType, accountId, tabpageNum, tabpageSize)
        } else if (tradeType === 'WITHDRAW' || tradeType === 'DEPOSIT') {
            getTabWithDrawDetail(tradeType, accountId, beginDate, endDate, tabpageNum, tabpageSize)
        } else if (tradeType === 'ERROR') {
            getTabErrorDetail(accountId, beginDate, endDate, tabpageNum, tabpageSize)
        } else if (tradeType === 'OTHER') {
            getTabOtherDetail(accountId, beginDate, endDate, tabpageNum, tabpageSize)
        }


    }
    //分页list
    const pageChang = (pageNum, pageSize) => {
        setPageSize(pageSize)
        setPageNum(pageNum)
        getdailyReport(pageNum, pageSize)
    }
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    //弹框确定
    const handleOk = () => {
        setIsModalVisible(false);
    }
    //错误弹框
    const openNotification = (errorMsg) => {
        notification.open({
            duration: 3,
            description: errorMsg
        });
    }
    //金额格式化
    const moneyFormat = (num) => {
        if (typeof(num) != "undefined") {
            //判断数据类型
            if (isNaN(num)) {
                // 没有小数点时，在末尾补上一个小数点
                if (num.indexOf('.') === -1) {
                    num += '.00'
                }
                return num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(/\.$/, '')
            }else{
                let str = num.toString()
                // 没有小数点时，在末尾补上一个小数点
                if (str.indexOf('.') === -1) {
                    str += '.00'
                }
                return str.replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(/\.$/, '')
            }
        }else{
            return num
        }
    }
    return (
        <div className={styles.dailyReportBox}>
            <Card bodyStyle={{ width: '100%', height: 100, background: '#FFFFFF', borderRadius: 4, padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Col style={{ width: '80%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Col style={{ marginRight: '20px' }}>
                        账号(选公司)：
                        <Select defaultValue="请选择" style={{ width: 120 }} onSelect={acountMountSel} value={accountMountVal}>
                            <Option value="快钱-徐州万邦云药房连锁有限公司-yyf2@wbpharma.com-10219834775">快钱-徐州万邦云药房连锁有限公司-yyf2@wbpharma.com-10219834775</Option>
                            <Option value="快钱-复星健康科技(江苏)有限公司-yjk2@wbpharma.com-10219928668">快钱-复星健康科技(江苏)有限公司-yjk2@wbpharma.com-10219928668</Option>
                            <Option value="快钱-海南星创互联网医药有限公司-jkdj005@fosun.com-10219733103">快钱-海南星创互联网医药有限公司-jkdj005@fosun.com-10219733103</Option>
                            <Option value="京东钱包-徐州万邦云药房连锁有限公司-xingshaoning123">京东钱包-徐州万邦云药房连锁有限公司-xingshaoning123</Option>
                            <Option value="支付宝-徐州万邦云药房连锁有限公司-shiluyi@fosunhealth.com">支付宝-徐州万邦云药房连锁有限公司-shiluyi@fosunhealth.com</Option>
                            <Option value="拼多多钱包-徐州万邦云药房连锁有限公司-13585586846">拼多多钱包-徐州万邦云药房连锁有限公司-13585586846</Option>
                        </Select>
                    </Col>
                    <Col style={{ display: 'flex' }}>
                        起止日期:
                        <Space>
                            <DatePicker value={beginDate} defaultValue={moment(initDate)} onChange={changBeginDate} />
                        </Space>
                        <Space>
                            至<DatePicker value={endDate} defaultValue={moment(initDate)} onChange={changEndDate} />
                        </Space>
                    </Col>

                </Col>
                <div style={{ width: '20%', display: 'flex' }}>
                    <Button style={{ maxWidth: '100px', maxHeight: '50px', marginRight: '10px' }} onClick={() => resetBtn()}>重置</Button>
                    <Button type="primary" style={{ maxWidth: '100px', maxHeight: '50px' }} onClick={() => search()}>查询</Button>
                </div>
            </Card>

            {
                tabData ? tabData.map((item, idx) => {
                    return <Card style={{ marginTop: '15px' }}
                        bodyStyle={{ width: '100%', }}>
                        <div style={{ background: '#FFFFFF', borderRadius: 4, padding: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p><span>账号(选公司)：{item.accountName}</span><span></span></p>
                            <p><span>起止日期:</span><span>{item.beginTime}-{item.endTime}</span></p>
                            <Button type="primary" onClick={() => summaryExport(item.beginTime, item.endTime, item.accountId, item.accountName)}>导出</Button>
                        </div>
                        <span style={{ color: '#1890FF' }}>发生额：{moneyFormat(item.channelTotalNetting?item.channelTotalNetting.toFixed(2):item.channelTotalNetting)}</span>
                        <div style={{ width: '100%', background: '#FFFFFF', borderRadius: 4, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card title="消费" bodyStyle={{ padding: '10px', height: "100px" }} extra={<a href="#" onClick={() => reportDel(idx, 'CONSUME', item.accountId, item.accountName, '1', '5')}>查看明细</a>} style={{ width: "15%" }}>
                                <p>
                                    <span>总金额:</span><span>{moneyFormat(item.consumeAmount?item.consumeAmount.toFixed(2):item.consumeAmount)}</span>
                                </p>
                                <p>
                                    <span>费用:</span><span>{moneyFormat(item.consumeFeeAmount?item.consumeFeeAmount.toFixed(2):item.consumeFeeAmount)}</span>
                                </p>
                            </Card>
                            <Card title="退款" bodyStyle={{ padding: '10px', height: "100px" }} extra={<a href="#" onClick={() => reportDel(idx, 'REFUND', item.accountId, item.accountName, '1', '5')}>查看明细</a>} style={{ width: "15%" }}>
                                <p>
                                    <span>总金额:</span><span>{moneyFormat(item.refundAmount?item.refundAmount.toFixed(2):item.refundAmount)}</span>
                                </p>
                                <p>
                                    <span>费用:</span><span>{moneyFormat(item.refundFeeAmount?item.refundFeeAmount.toFixed(2):item.refundFeeAmount)}</span>
                                </p>
                            </Card>
                            <Card title="提现" bodyStyle={{ padding: '10px', height: "100px" }} extra={<a href="#" onClick={() => withDrawDel(idx, 'WITHDRAW', item.accountId, item.beginTime, item.endTime, '1', '5')}>查看明细</a>} style={{ width: "15%" }}>
                                <p>
                                    <span>总金额:</span><span>{moneyFormat(item.withdrawAmount?item.withdrawAmount.toFixed(2):item.withdrawAmount)}</span>
                                </p>
                                <p>
                                    <span>费用:</span><span>{moneyFormat(item.withdrawFeeAmount?item.withdrawFeeAmount.toFixed(2):item.withdrawFeeAmount)}</span>
                                </p>
                            </Card>
                            <Card title="充值" bodyStyle={{ padding: '10px', height: "100px" }} extra={<a href="#" onClick={() => withDrawDel(idx, 'DEPOSIT', item.accountId, item.beginTime, item.endTime, '1', '5')}>查看明细</a>} style={{ width: "15%" }}>
                                <p>
                                    <span>总金额:</span><span>{moneyFormat(item.depositAmount?item.depositAmount.toFixed(2):item.depositAmount)}</span>
                                </p>
                            </Card>
                            <Card title="差错(不平)" bodyStyle={{ padding: '10px', height: "100px" }} extra={<a href="#" onClick={() => errorDel(idx, item.accountId, item.beginTime, item.endTime, '1', '5')}>查看明细</a>} style={{ width: "15%" }}>
                                <p>
                                    <span>长款金额:</span><span>{moneyFormat(item.errorMoreAmount?item.errorMoreAmount.toFixed(2):item.errorMoreAmount)}</span>
                                </p>
                                <p>
                                    <span>短款金额:</span><span>{moneyFormat(item.errorLessAmount?item.errorLessAmount.toFixed(2):item.errorLessAmount)}</span>
                                </p>
                            </Card>
                            <Card title="其他费用" bodyStyle={{ padding: '10px', height: "100px" }} extra={<a href="#" onClick={() => otherDel(idx, item.accountId, item.beginTime, item.endTime, '1', '5')}>查看明细</a>} style={{ width: "15%" }}>
                                <p>
                                    <span>总金额:</span><span>{moneyFormat(item.otherAmount?item.otherAmount.toFixed(2):item.otherAmount)}</span>
                                </p>
                            </Card>
                        </div>
                        {
                            index === idx ?
                                tradeType === 'CONSUME' ?
                                    tablist ?
                                        <div>
                                            <h2 style={{ marginLeft: 10 }}>消费明细:消费</h2>
                                            <Table columns={columns} dataSource={tablist} size="small" pagination={false} />
                                            <Pagination
                                                total={tabTotal}
                                                showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                                                defaultPageSize={tabpageSize}
                                                defaultCurrent={tabpageNum}
                                                pageSizeOptions={[5, 10, 20, 50]}
                                                style={{ display: 'flex', justifyContent: 'right' }}
                                                onChange={(tabpageNum, tabpageSize) => tabPageChang(tabpageNum, tabpageSize)}
                                            />
                                        </div> : ''
                                    : tradeType === 'REFUND' ?
                                        <div>
                                            <h2 style={{ marginLeft: 10 }}>消费明细:退款</h2>
                                            <Table columns={columns} dataSource={tablist} size="small" pagination={false} />
                                            <Pagination
                                                total={tabTotal}
                                                showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                                                defaultPageSize={tabpageSize}
                                                defaultCurrent={tabpageNum}
                                                pageSizeOptions={[5, 10, 20, 50]}
                                                style={{ display: 'flex', justifyContent: 'right' }}
                                                onChange={(tabpageNum, tabpageSize) => tabPageChang(tabpageNum, tabpageSize)}
                                            />
                                        </div>
                                        : tradeType === 'WITHDRAW' ?
                                            <div>
                                                <h2 style={{ marginLeft: 10 }}>消费明细:提现</h2>
                                                <Table columns={withdrawColumns} dataSource={tablist} size="small" pagination={false} />
                                                <Pagination
                                                    total={tabTotal}
                                                    showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                                                    defaultPageSize={tabpageSize}
                                                    defaultCurrent={tabpageNum}
                                                    pageSizeOptions={[5, 10, 20, 50]}
                                                    style={{ display: 'flex', justifyContent: 'right' }}
                                                    onChange={(tabpageNum, tabpageSize) => tabPageChang(tabpageNum, tabpageSize)}
                                                />
                                            </div>
                                            : tradeType === 'DEPOSIT' ?
                                                <div>
                                                    <h2 style={{ marginLeft: 10 }}>消费明细:充值</h2>
                                                    <Table columns={depositColumns} dataSource={tablist} size="small" pagination={false} />
                                                    <Pagination
                                                        total={tabTotal}
                                                        showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                                                        defaultPageSize={tabpageSize}
                                                        defaultCurrent={tabpageNum}
                                                        pageSizeOptions={[5, 10, 20, 50]}
                                                        style={{ display: 'flex', justifyContent: 'right' }}
                                                        onChange={(tabpageNum, tabpageSize) => tabPageChang(tabpageNum, tabpageSize)}
                                                    />
                                                </div>
                                                : tradeType === 'ERROR' ?
                                                    <div>
                                                        <h2 style={{ marginLeft: 10 }}>消费明细:差错（不平）</h2>
                                                        <Table columns={errorColumns} dataSource={tablist} size="small" pagination={false} />
                                                        <Pagination
                                                            total={tabTotal}
                                                            showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                                                            defaultPageSize={tabpageSize}
                                                            defaultCurrent={tabpageNum}
                                                            pageSizeOptions={[5, 10, 20, 50]}
                                                            style={{ display: 'flex', justifyContent: 'right' }}
                                                            onChange={(tabpageNum, tabpageSize) => tabPageChang(tabpageNum, tabpageSize)}
                                                        />
                                                    </div>
                                                    : tradeType === 'OTHER' ?
                                                        <div>
                                                            <h2 style={{ marginLeft: 10 }}>消费明细:其他费用</h2>
                                                            <Table columns={otherColumns} dataSource={tablist} size="small" pagination={false} />
                                                            <Pagination
                                                                total={tabTotal}
                                                                showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                                                                defaultPageSize={tabpageSize}
                                                                defaultCurrent={tabpageNum}
                                                                pageSizeOptions={[5, 10, 20, 50]}
                                                                style={{ display: 'flex', justifyContent: 'right' }}
                                                                onChange={(tabpageNum, tabpageSize) => tabPageChang(tabpageNum, tabpageSize)}
                                                            />
                                                        </div>
                                                        : <div>
                                                            <h2 style={{ marginLeft: 10 }}>消费明细:暂无</h2>
                                                            <Table columns={columns} dataSource={tablist} size="small" pagination={false} />
                                                            <Pagination
                                                                total={tabTotal}
                                                                showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                                                                defaultPageSize={tabpageSize}
                                                                defaultCurrent={tabpageNum}
                                                                pageSizeOptions={[5, 10, 20, 50]}
                                                                style={{ display: 'flex', justifyContent: 'right' }}
                                                                onChange={(tabpageNum, tabpageSize) => tabPageChang(tabpageNum, tabpageSize)}
                                                            />
                                                        </div>
                                : ''
                        }
                    </Card>
                }) : ''
            }
            <Pagination
                total={total}
                showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                hideOnSinglePage={true}
                defaultPageSize={pageSize}
                defaultCurrent={pageNum}
                style={{ display: 'flex', justifyContent: 'right' }}
                onChange={(pageNum, pageSize) => pageChang(pageNum, pageSize)}
            />

            <Modal title={operation} visible={isModalVisible} width="70%" onCancel={handleCancel} onOk={handleOk}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'right', margin: '5px 0px' }}>
                    <Button type="primary" style={{ maxWidth: '100px', maxHeight: '50px' }} onClick={() => reportExport()}>导出</Button>
                </div>
                <Table columns={tabDetailcolumns} dataSource={tabDetail} size='small' scroll={{ x: '100vw' }} pagination={false} />
                <Pagination
                    total={orderTotal}
                    showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                    defaultPageSize={tabpageSize}
                    defaultCurrent={tabpageNum}
                    pageSizeOptions={[5, 10, 20, 50]}
                    style={{ display: 'flex', justifyContent: 'right' }}
                    onChange={(orderPageNum, orderPageSize) => orderPageChang(orderPageNum, orderPageSize)}
                />
            </Modal>
        </div >
    )
}
