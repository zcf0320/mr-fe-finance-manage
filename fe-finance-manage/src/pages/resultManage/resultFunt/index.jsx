import React, { useEffect, useState, useRef } from 'react';
import { Space, } from 'antd';
import styles from './index.module.scss'
import { fundsList, jobModule } from '@api/resultManage'
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
import writeOffSearch from '../../../enumeration/funtResult'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
const resultFunt = (props) => {
    const { cacheUser, userInfo } = props;
    const actionRef = useRef();
    const [tellerNo, setTellerNo] = useState(userInfo.username)
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
    const [Job, setJob] = useState()//业务模块
    //业务模块
    const errorJobData = async (tellerNo) => {
        let obj = {};
        let params = {
            tellerNo: tellerNo
        }
        const res = await jobModule(params)
        res.result.forEach((item) => {
            obj[item.id] = item.jobName
        })
        setJob(obj)
    }
    useEffect(() => {
        //对账结果列表数据
        errorJobData(tellerNo);
    }, [])

    //页面跳转
    const jobAction = (record) => {
        props.history.push({
            pathname: 'browsering',
            query: record,
        })
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
            title: '对账日期',
            dataIndex: 'accountDate',
            key: 'accountDate',
            width: 150,
            search: false,
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
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
            title: '应收总金额',
            dataIndex: 'receivableAmount',
            key: 'receivableAmount',
            width: 150,
            search: false,
        },
        {
            title: '待清算总金额',
            dataIndex: 'paymentAmount',
            key: 'paymentAmount',
            width: 150,
            search: false,
        },
        {
            title: '存疑交易总金额',
            dataIndex: 'doubtAmount',
            key: 'doubtAmount',
            width: 150,
            search: false,
        },
        {
            title: '长款总金额',
            dataIndex: 'longAmount',
            key: 'longAmount',
            width: 150,
            search: false,
        },
        {
            title: '短款总金额',
            dataIndex: 'shortAmount',
            key: 'shortAmount',
            width: 150,
            search: false,
        },
        {
            title: '上日存疑总金额',
            dataIndex: 'lastDoubtAmount',
            key: 'lastDoubtAmount',
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
            title: '统计维度',
            dataIndex: 'groupName',
            key: 'groupName',
            width: 150,
            search: false,
        },
        {
            title: '对平金额',
            dataIndex: 'balanceAmount',
            key: 'balanceAmount',
            width: 150,
            search: false,
        },
        {
            title: '试算平衡',
            dataIndex: 'trialBalance',
            key: 'trialBalance',
            width: 150,
            search: false,
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
            title: '对账流水批次号',
            dataIndex: 'batchNo',
            key: 'batchNo',
            width: 150,
            search: false,
        },
        {
            title: '对账类型',
            dataIndex: 'checkType',
            key: 'checkType',
            width: 150,
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
            width: 150,
            search: false,
            render: (t, r, i) => {
                return writeOffSearch(t, 'phaseStatus')
            }
        },
        {
            title: '操作',
            key: 'option',
            dataIndex: 'option',
            fixed: 'right',
            width: 150,
            search: false,
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => jobAction(record)}>查看差错</ a>
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
                        const res = await fundsList(postData);
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

export default connect(mapStateToProps, mapDispatchToProps)(resultFunt);

