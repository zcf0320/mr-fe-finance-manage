import React, { useEffect, useState, useRef } from 'react';
import { Space, Modal, notification, Button } from 'antd';
import styles from './index.module.scss'
import { errorDetail, detailOperation, jobModule, exportErrorFile } from '@api/resultManage'
import moment from 'moment';
import writeOffSearch from '../../../enumeration/browserResult'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
const resultBrowsering = (props) => {
    const { cacheUser, userInfo } = props;
    const actionRef = useRef();
    //日期选择框
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
    const [propsdata, setPropsData] = useState(props.location.query)
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [tabId, setTabId] = useState()
    const [Job, setJob] = useState()//对账模块
    const [modularSelect, setModularSelect] = useState()//对账模块下拉框
    const [typeSelect, setTypeSelect] = useState()//差错类型下拉框
    const [beginDate, setBeginDate] = useState(props.location.query ? moment(props.location.query.startTime) : moment(initDate))//开始日期
    const [endDate, setEndDate] = useState(props.location.query ? moment(props.location.query.endTime) : moment(initDate))//结束日期
    const [matchDate, setMatchDate] = useState(props.location.query ? moment(props.location.query.accountDate) : moment(initDate))//日期
    const [batchVal, setBatchVal] = useState(propsdata ? propsdata.batchNo : '')//对账流水批次号
    const [errorSelect, setErrorSelect] = useState()//差错类型下拉框
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState('123');
    const [a, setA] = useState("0")

    const [downLoadBeginDate, setDownloadBeginDate] = useState()
    const [downLoadEndDate, setDownloadEndDate] = useState()
    const [downLoadBatchNo, setDownLoadBatchNo] = useState()
    const [downLoadJobCfgId, setDownLoadJobCfgId] = useState()
    const [downLoadErrorType, setDownLoadErrorType] = useState()
    const [downLoadDealResult, setDownLoadDealResult] = useState()
    const look = (a) => {
        if (a === "1") {
            setOperation("记坏账");
            setA(a)
        } else if (a === "2") {
            setOperation("转人工");
            setA(a)
        } else if (a === "3") {
            setOperation("导文件");
            setA(a)
        }
        setIsModalVisible(true);
    };
    //确认按钮
    const handleOk = async () => {
        if (a === '1') {
            let params = {
                tellerNo: tellerNo,
                operation: 'BAD_ACCOUNT',
                errorId: tabId
            }
            let res = await detailOperation(params)
            if (res.success) {
                openNotification('记坏账成功')
                actionRef.current.reload()
            } else {
                openNotification(res.errorMsg)
            }
        } else if (a === '2') {
            let params = {
                tellerNo: tellerNo,
                operation: 'MANUAL_DEAL',
                errorId: tabId
            }
            let res = await detailOperation(params)
            if (res.success) {
                openNotification('转人工成功')
                actionRef.current.reload()
            } else {
                openNotification(res.errorMsg)
            }
        } else if (a === '3') {
            const params = {
                tellerNo: tellerNo,
                beginDate: downLoadBeginDate,
                endDate: downLoadEndDate,
                batchNo: downLoadBatchNo ? downLoadBatchNo : null,
                jobCfgId: downLoadJobCfgId ? downLoadJobCfgId : null,
                errorType: downLoadErrorType ? downLoadErrorType : null,
                dealResult: downLoadDealResult ? downLoadDealResult : null,
                body: {
                    exportNum: "1",
                    fileName: "对账差错文件" + initDate + ".csv",
                },
            }
            let res = await exportErrorFile(params)
            let blob = new Blob([res]);
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = params.body.fileName;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
        }
        setIsModalVisible(false);
    };
    //取消按钮
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const rendermodal = (a) => {
        if (a === '1') {
            return <div>
                确定记坏账吗
            </div>
        } else if (a === '2') {
            return <div>
                确定转人工吗
            </div>
        } else if (a === '3') {
            return <div>
                确定生成差错结果文件吗
            </div>
        }
    }


    //记坏账
    const setRegister = async (id) => {
        setTabId(id)
    }
    //错误弹框
    const openNotification = (errorMsg) => {
        notification.open({
            duration: 3,
            description: errorMsg
        });
    }
    //转人工
    const Register = async (id) => {
        setTabId(id)
    }
    //分页查询数据
    useEffect(() => {
        errorJobData(tellerNo);
    }, [])

    //对账模块
    const errorJobData = async (tellerNo) => {
        let params = {
            tellerNo: tellerNo
        }
        let obj = {}
        const res = await jobModule(params)
        res.result.forEach((item) => {
            obj[item.id] = item.jobName
        })
        setJob(obj)
    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            width: 150,
            search: false,
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        },
        {
            title: '差错流水ID',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            search: false,
        },
        {
            title: '开始时间',
            dataIndex: 'beginDate',
            key: 'beginDate',
            width: 150,
            hideInTable: true,
            valueType: 'date',
            initialValue: matchDate,
        },
        {
            title: '结束时间',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 150,
            hideInTable: true,
            valueType: 'date',
            initialValue: matchDate,
        },
        {
            title: '主对账方名称',
            dataIndex: 'masterJobDsName',
            key: 'masterJobDsName',
            search: false,
            width: 150,
        },
        {
            title: '次对账方名称',
            dataIndex: 'secondaryJobDsName',
            key: 'secondaryJobDsName',
            search: false,
            width: 150,
        },
        {
            title: '对账流水批次号',
            dataIndex: 'batchNo',
            key: 'batchNo',
            width: 150,
            initialValue: batchVal,

        },
        {
            title: '店铺名称',
            dataIndex: 'supplierName',
            key: 'supplierName',
            search: false,
            width: 150,
        },
        {
            title: '对账会计日期',
            key: 'accountDate',
            dataIndex: 'accountDate',
            width: 150,
            search: false,

        },
        {
            title: '单笔流水号',
            key: 'jnlNo',
            dataIndex: 'jnlNo',
            search: false,
            width: 150,
        },
        {
            title: '差错类型',
            dataIndex: 'errorType',
            key: 'errorType',
            valueEnum: {
                "MASTER_MONEY_MORE": "主对账方长款",
                "MASTER_MONEY_LESS": "主对账方短款",
                "MASTER_JNL_MORE": "主对账方多",
                "SECONDARY_JNL_MORE": "次对账方多",
            },
            valueType: 'select',
            width: 150,
            // render: (t, r, i) => {
            //     return writeOffSearch(t, 'errorType')
            // }
        },
        {
            title: '交易类型',
            dataIndex: 'tradeType',
            key: 'tradeType',
            search: false,
            width: 150,
            render: (t, r, i) => {
                return writeOffSearch(t, 'tradeType')
            }
        },
        {
            title: '主对账方的金额',
            dataIndex: 'masterMoney',
            key: 'masterMoney',
            search: false,
            width: 150,
        },

        {
            title: '次对账方的金额',
            dataIndex: 'secondaryMoney',
            key: 'secondaryMoney',
            search: false,
            width: 150,
        },

        {
            title: '主对账方的对账流水批次号',
            dataIndex: 'masterBatchNo',
            key: 'masterBatchNo',
            width: 150,
            search: false,
        }, {
            title: '次对账方的对账流水批次号',
            dataIndex: 'secondaryBatchNo',
            key: 'secondaryBatchNo',
            width: 150,
            search: false,
        }, {
            title: '主对账方的流水会计日',
            dataIndex: 'masterAccountDate',
            key: 'masterAccountDate',
            search: false,
            width: 150,
        }, {
            title: '次对账方的流水会计日',
            dataIndex: 'secondaryAccountDate',
            key: 'secondaryAccountDate',
            search: false,
            width: 150,
        }, {
            title: '店铺ID',
            dataIndex: 'supplierId',
            key: 'supplierId',
            search: false,
            width: 150,
        },
        {
            title: '业务模块',
            dataIndex: 'jobName',
            key: 'jobName',
            width: 150,
            hideInTable: true,
            valueType: 'select',
            valueEnum: Job
        },

        {
            title: '差错处理状态',
            dataIndex: 'dealResult',
            key: 'dealResult',
            valueEnum: {
                "UNDO": "未处理",
                "BAD_ACCOUNT": "记坏账",
                "MANUAL_DEAL": "转人工",
                "AUTO_MATCH": "自动勾兑",
            },
            valueType: 'select',
            width: 150,
            // render: (t, r, i) => {
            //     return writeOffSearch(t, 'dealResult')
            // }
        }, {
            title: '操作',
            key: 'option',
            dataIndex: 'option',
            fixed: 'right',
            width: 150,
            search: false,
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => { look('1'), setRegister(record.id) }}>记坏账</a>
                    <a onClick={() => { look('2'), Register(record.id) }}>转人工</a>
                </Space>
            ),
        },
    ];
    return (
        <div className={styles.box}>
            <ProTable
                scroll={{ x: 1500 }}
                columns={columns}
                request={async (params, sort, filter) => {
                    setDownloadBeginDate(params.beginDate)
                    setDownloadEndDate(params.endDate)
                    setDownLoadBatchNo(params.batchNo)
                    setDownLoadJobCfgId(params.jobCfgId)
                    setDownLoadErrorType(params.errorType)
                    setDownLoadDealResult(params.dealResult)
                    let postData = {
                        pageNum: params.current,
                        pageSize: params.pageSize,
                        tellerNo: tellerNo,
                        beginDate: params.beginDate,
                        endDate: params.endDate,
                        jobCfgId: params.jobName,
                        batchNo: params.batchNo,
                        errorType: params.errorType,
                        dealResult: params.dealResult
                    }
                    try {
                        const res = await errorDetail(postData);
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
                }} dateFormatter="string" headerTitle="信息列表"
                toolBarRender={() => [
                    <Button key="button" onClick={() => look('3')} type="primary">
                        生成差错结果文件
                    </Button>
                ]}
            />
            { }

            <Modal title={operation} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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

export default connect(mapStateToProps, mapDispatchToProps)(resultBrowsering);