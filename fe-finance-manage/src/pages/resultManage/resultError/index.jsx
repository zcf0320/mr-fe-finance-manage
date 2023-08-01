import React, { useEffect, useState, useRef } from 'react';
import { Space, Modal, notification, } from 'antd';
import styles from './index.module.scss'
import { recoverData, performReconciliation, resultList, jobModule } from '@api/resultManage'
import writeOffSearch from '../../../enumeration/errorResult'

import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
const resultError = (props) => {
    const { cacheUser, userInfo } = props;
    const actionRef = useRef();
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState();
    const [a, setA] = useState("0")
    const [Job, setJob] = useState()//业务模块
    const [batch, setBatch] = useState()//批次号
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const look = (a) => {
        if (a === "1") {
            setOperation("恢复数据");
            setA(a)
        } else if (a === "2") {
            setOperation("执行对账");
            setA(a)
        } else if (a === "4") {
            setOperation("查看对账配置信息");
            setA(a)
        } else if (a === "3") {
            setOperation("执行对账")
            setA(a)
        }
        setIsModalVisible(true);
    };
    //确认
    const handleOk = async () => {
        if (a === "1") {
            let params = {
                tellerNo: tellerNo,
                recheckType: 'ROLLBACK',
                batchNo: batch
            }
            let res = await recoverData(params)

            if (res.success) {
                openNotification('恢复数据成功')
                actionRef.current.reload()
            } else {
                openNotification(res.errorMsg)
            }

        } else if (a === "2") {
            let params = {
                tellerNo: tellerNo,
                recheckType: 'EXECUTE',
                batchNo: batch
            }
            let res = await performReconciliation(params)
            if (res.success) {
                openNotification('执行对账成功')
                actionRef.current.reload()
            } else {
                openNotification(res.errorMsg)
            }
        }
        setIsModalVisible(false);
    };
    //取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const rendermodal = (a) => {
        if (a === '1') {
            return <div>
                恢复数据
            </div>
        } else if (a === '2') {
            return <div>
                执行对账
            </div>
        } else if (a === '4') {
            return <div></div>
        } else if (a === '3') {
            return (
                <p>确定重新对账吗？</p>
            )
        }
    }
    //恢复数据
    const lookAction = async (batchNo) => {
        setBatch(batchNo)
    }
    //执行对账
    const loopAction = async (batchNo) => {
        setBatch(batchNo)
    }
    //错误弹框
    const openNotification = (errorValue) => {
        notification.open({
            duration: 3,
            description: errorValue
        });
    }
    //业务模块
    const errorJobData = async (tellerNo) => {
        let params = {
            tellerNo: tellerNo
        }
        let obj = {};
        const res = await jobModule(params)
        res.result.forEach((item) => {
            obj[item.id] = item.jobName
        })
        setJob(obj)
    }
    //页面跳转
    const jobAction = (record) => {
        //传参
        props.history.push({
            pathname: 'browsering',
            query: record,
        })
    }
    useEffect(() => {
        errorJobData(tellerNo);
    }, [])
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
            title: '日期',
            dataIndex: 'accountDate',
            key: 'accountDate',
            width: 150,
            search: false,
        },
        {
            title: '对账流水批次号',
            dataIndex: 'batchNo',
            key: 'batchNo',
            width: 150,
            search: false,
        },
        {
            title: '业务模块名称',
            dataIndex: 'jobName',
            key: 'jobName',
            width: 150,
            hideInTable: false,
            valueType: 'select',
            valueEnum: Job
        },
        {
            title: '开始时间',
            key: 'startTime',
            dataIndex: 'startTime',
            width: 150,
            valueType: 'date',
            hideInTable: false,
            initialValue: initDate,
            render: (t, r, i) => {
                return r.startTime?r.startTime:'-'
            }
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            width: 150,
            valueType: 'date',
            hideInTable: false,
            initialValue: initDate,
            render: (t, r, i) => {
                return r.endTime?r.endTime:'-'
            }
        },
        {
            title: '主对账方名称',
            dataIndex: 'masterJobDsName',
            key: 'masterJobDsName',
            width: 150,
            search: false,
        },
        {
            title: '次对账方名称',
            dataIndex: 'secondaryJobDsName',
            key: 'secondaryJobDsName',
            width: 150,
            search: false,
        },
        {
            title: '对账类型',
            dataIndex: 'checkType',
            key: 'checkType',
            width: 100,
            search: false,
            render: (t, r, i) => {
                return writeOffSearch(t, 'checkType')
            }
        },
        {
            title: '执行阶段',
            dataIndex: 'executePhase',
            key: 'executePhase',
            width: 150,
            search: false,
            render: (t, r, i) => {
                return writeOffSearch(t, 'executePhase')
            }
        },
        {
            title: '阶段状态',
            dataIndex: 'phaseStatus',
            key: 'phaseStatus',
            width: 100,
            search: false,
            render: (t, r, i) => {
                return writeOffSearch(t, 'phaseStatus')
            }
        },
        {
            title: '主对账方日间交易笔数',
            dataIndex: 'dailyMasterTotal',
            key: 'dailyMasterTotal',
            width: 180,
            search: false,
        },
        {
            title: '主对账方日间交易金额',
            dataIndex: 'dailyMasterTotalAmount',
            key: 'dailyMasterTotalAmount',
            width: 180,
            search: false,
        },
        {
            title: '次对账方日间交易笔数',
            dataIndex: 'dailySecondaryTotal',
            key: 'dailySecondaryTotal',
            width: 180,
            search: false,
        },
        {
            title: '次对账方日间交易金额',
            dataIndex: 'dailySecondaryTotalAmount',
            key: 'dailySecondaryTotalAmount',
            width: 180,
            search: false,
        },
        {
            title: '主对账方过往存疑交易总笔数',
            dataIndex: 'doubtMasterTotal',
            key: 'doubtMasterTotal',
            width: 180,
            search: false,
        }, {
            title: '主对账方过往存疑交易总金额',
            dataIndex: 'doubtMasterTotalAmount',
            key: 'doubtMasterTotalAmount',
            width: 180,
            search: false,
        },
        {
            title: '对平总笔数',
            dataIndex: 'balanceCount',
            key: 'balanceCount',
            width: 100,
            search: false,
        },
        {
            title: '对平总金额',
            dataIndex: 'balanceAmount',
            key: 'balanceAmount',
            width: 100,
            search: false,
        },
        {
            title: '主对账方日间交易转存疑总笔数',
            dataIndex: 'dailyMasterDoubtCount',
            key: 'dailyMasterDoubtCount',
            width: 190,
            search: false,
        },
        {
            title: '主对账方日间交易转存疑总金额',
            dataIndex: 'dailyMasterDoubtAmount',
            key: 'dailyMasterDoubtAmount',
            width: 190,
            search: false,
        },
        {
            title: '差错总笔数',
            dataIndex: 'errorCount',
            key: 'errorCount',
            width: 150,
            search: false,
        }, {
            title: '主对账方长款总笔数',
            dataIndex: 'masterMoneyMoreCount',
            key: 'masterMoneyMoreCount',
            width: 130,
            search: false,
        },
        {
            title: '主对账方长款总金额',
            dataIndex: 'masterMoneyMoreAmount',
            key: 'masterMoneyMoreAmount',
            width: 130,
            search: false,
        },
        {
            title: '主对账方短款总笔数',
            dataIndex: 'masterMoneyLessCount',
            key: 'masterMoneyLessCount',
            width: 130,
            search: false,
        },
        {
            title: '主对账方短款总金额',
            dataIndex: 'masterMoneyLessAmount',
            key: 'masterMoneyLessAmount',
            width: 130,
            search: false,
        },
        {
            title: '主对账方多总笔数',
            dataIndex: 'masterMoreCount',
            key: 'masterMoreCount',
            width: 160,
            search: false,
        },
        {
            title: '主对账方多总金额',
            dataIndex: 'masterMoreAmount',
            key: 'masterMoreAmount',
            width: 160,
            search: false,
        },
        {
            title: '次对账方多总笔数',
            dataIndex: 'secondaryMoreCount',
            key: 'secondaryMoreCount',
            width: 160,
            search: false,
        },
        {
            title: '次对账方多总金额',
            dataIndex: 'secondaryMoreAmount',
            key: 'secondaryMoreAmount',
            width: 160,
            search: false,
        },
        {
            title: '操作',
            key: 'option',
            dataIndex: 'option',
            fixed: 'right',
            width: 180,
            search: false,
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => jobAction(record)}>查看差错</a>
                    <a onClick={() => { look('1', lookAction(record.batchNo)) }}>恢复数据</ a>
                    <a onClick={() => { look('2', loopAction(record.batchNo)) }}>执行对账</ a>
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
                    let postData = {
                        pageNum: params.current,
                        pageSize: params.pageSize,
                        tellerNo: tellerNo,
                        beginTime: params.startTime,
                        endTime: params.endTime,
                        jobCfgId: params.jobName,

                    }
                    try {
                        const res = await resultList(postData);
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
                }} dateFormatter="string" headerTitle="信息列表" />
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

export default connect(mapStateToProps, mapDispatchToProps)(resultError);

