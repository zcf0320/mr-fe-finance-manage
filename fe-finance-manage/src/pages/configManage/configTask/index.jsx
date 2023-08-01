import React, { useEffect, useState, useRef } from 'react';
import { Space, Button, Modal, Select, Row, Col, Form, notification, Spin } from 'antd';
import { getConfigPageList, jobDataList, jobDataDetail, addConfigList, changeConfigList, lookConfigList, delConfigList } from '@api/configManage'
import { jobModule } from '@api/resultManage'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import configManageTask from '../../../enumeration/configManageTask'
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';

const configTask = (props) => {
    const { cacheUser, userInfo } = props;
    const actionRef = useRef();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState();
    const [a, setA] = useState("0")
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [tabDetail, settabDetail] = useState()
    const [tabId, setTabId] = useState()
    const [Job, setJob] = useState()
    const [tabJob, setTabJob] = useState()
    //首页下拉框id
    const [jobModuleData, setJobModuleData] = useState()
    const [masterJob, setMasterJob] = useState()
    const [secondJob, setSecondJob] = useState()
    //添加
    const [addjobName, setAddJobName] = useState()
    const [addmasterJobDsId, setAddMasterJobDsId] = useState()
    const [addsecondaryJobDsId, setAddSecondaryJobDsId] = useState()
    const [addcheckType, setAddCheckType] = useState()
    const [addremark, setAddRemark] = useState()
    const [adderrorThreshold, setAddErrorThreshold] = useState()
    const [addaccountCycle, setAddAccountCycle] = useState()
    const [addholidayCheckFlag, setAddHolidayCheckFlag] = useState()
    const [addErrorCycle, setAddErrorCycle] = useState()
    const [showJob, setShowJob] = useState(false)
    //修改
    const [form] = Form.useForm();
    const [record, setRecord] = useState()
    const [jobName, setJobName] = useState()
    const [masterJobDsId, setMasterJobDsId] = useState()
    const [secondaryJobDsId, setSecondaryJobDsId] = useState()
    const [checkType, setCheckType] = useState()
    const [remark, setRemark] = useState()
    const [errorThreshold, setErrorThreshold] = useState()
    const [holidayCheckFlag, setHolidayCheckFlag] = useState()
    //表格数据
    const columns = [
        {
            title: '序号',
            dataIndex: 'idx',
            hideInTable: false,
            hideInSearch: true,
            fieldProps: { allowClear: false },
            key: 'id',
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        },
        {
            title: '业务模块',
            hideInTable: false,
            dataIndex: 'jobName',
            key: 'jobName',
            valueType: 'select',
            fieldProps: { allowClear: false },
            valueEnum: jobModuleData
        },
        {
            title: '主对账方',
            hideInTable: false,
            dataIndex: 'masterJobDsName',
            key: 'masterJobDsName',
            valueType: 'select',
            fieldProps: { allowClear: false },
            valueEnum: tabJob
        },
        {
            title: '次对账方',
            hideInTable: false,
            dataIndex: 'secondaryJobDsName',
            key: 'secondaryJobDsName',
            valueType: 'select',
            fieldProps: { allowClear: false },
            valueEnum: tabJob
        },
        {
            title: '备注',
            hideInTable: false,
            hideInSearch: true,
            dataIndex: 'remark',
            key: 'remark',
            fieldProps: { allowClear: false },
        },
        {
            title: '对账类型',
            hideInTable: false,
            hideInSearch: true,
            dataIndex: 'checkType',
            key: 'checkType',
            fieldProps: { allowClear: false },
            render: (t, r, i) => { return configManageTask(t, 'checkType') }
        },
        {
            title: '对账开关',
            hideInTable: false,
            hideInSearch: true,
            dataIndex: 'jobStatus',
            key: 'jobStatus',
            fieldProps: { allowClear: false },
            render: (t, r, i) => { return configManageTask(t, 'jobStatus') }
        },
        {
            title: '节假日是否参与对账标志',
            hideInTable: false,
            hideInSearch: true,
            dataIndex: 'holidayCheckFlag',
            key: 'holidayCheckFlag',
            fieldProps: { allowClear: false },
            render: (t, r, i) => { return configManageTask(t, 'holidayCheckFlag') }
        },
        {
            title: '操作',
            hideInTable: false,
            hideInSearch: true,
            valueType: 'option',
            key: 'option',
            fixed: 'right',
            render: (text, record, index) => (
                <Space size="middle">
                    <a onClick={() => { configchang(record), look('2') }}>修改</ a>
                    <a onClick={() => { configlook(record.id), look('3') }}>查看</ a>
                    <a onClick={() => { configdel(record.id), look('4') }}>删除</ a>
                </Space>
            ),
        },
    ];
    //弹框判断
    const look = (a) => {
        if (a === "1") {
            setOperation("新增对账配置信息");
            setShowJob(false)
            setA(a)
        } else if (a === "2") {
            setOperation("修改对账配置信息");
            setA(a)
        } else if (a === "3") {
            setOperation("查看对账配置信息");
            setA(a)
        } else if (a === "4") {
            setOperation("删除对账配置信息")
            setA(a)
        }
        setIsModalVisible(true);
    };
    //修改回显
    const configchang = (record) => {
        setShowJob(true)
        setRecord(record)
        setJobName(record.jobName)
        setRemark(record.remark)
        setCheckType(record.checkType)
        setMasterJobDsId(record.masterJobDsId)
        setSecondaryJobDsId(record.secondaryJobDsId)
        setErrorThreshold(record.errorThreshold)
        setHolidayCheckFlag(record.holidayCheckFlag)
        form.setFieldsValue({
            jobName: record.jobName,
            remark: record.remark,
            checkType: configManageTask(record.checkType, 'checkType'),
            masterJobDsName: record.masterJobDsName,
            secondaryJobDsName: record.secondaryJobDsName,
            errorThreshold: record.errorThreshold,
            holidayCheckFlag: configManageTask(record.holidayCheckFlag, 'holidayCheckFlag')
        })
        //主对账方详情
        masterdata(record.masterJobDsId)
        //次对账方详情
        seconddata(record.secondaryJobDsId)
    }
    //查看
    const configlook = async (id) => {
        setTabId(id)
        let params = { tellerNo: tellerNo, jobId: id }
        const res = await lookConfigList(params)
        settabDetail(res.result)
    }
    //删除
    const configdel = async (id) => {
        setTabId(id)
    }
    //初始化数据 
    useEffect(() => {
        jobdata(tellerNo);
        jobMod(tellerNo)
    }, [])
    //业务模块
    const jobMod = async (tellerNo) => {
        let params = {
            tellerNo: tellerNo
        }
        let obj = {};
        const res = await jobModule(params)
        res.result.forEach((item) => {
            obj[item.id] = item.jobName
        })
        setJobModuleData(obj)
    }
    //对账方列表
    const jobdata = async (tellerNo) => {
        let params = {
            tellerNo: tellerNo
        }
        let obj = {};
        const res = await jobDataList(params)
        res.result.forEach((item) => {
            obj[item.id] = item.dsName
        })
        setJob(res.result)
        setTabJob(obj)
    }
    //主对账方详细信息
    const masterdata = async (masterJobId) => {
        let params = { tellerNo: tellerNo, jobDsId: masterJobId }
        const res = await jobDataDetail(params)
        setMasterJob(res.result)
    }
    //次对账方详细信息
    const seconddata = async (secondJobId) => {
        let params = { tellerNo: tellerNo, jobDsId: secondJobId }
        const res = await jobDataDetail(params)
        setSecondJob(res.result)
    }
    //添加主对账方
    const addmasterJob = async (v, o) => {
        await masterdata(o.key)
        setAddMasterJobDsId(o.key)
        setShowJob(true)
        if (o.key == addsecondaryJobDsId) {
            openNotification('主次对账方不能相同')
        }
    }
    
    //添加次对账方
    const addsecondJob = async (v, o) => {
        await seconddata(o.key)
        setAddSecondaryJobDsId(o.key)
        setShowJob(true)
        if (o.key == addmasterJobDsId) {
            openNotification('主次对账方不能相同')
        }
    }
    //修改主对账方
    const changmasterJob = async (v, o) => {
        await masterdata(o.key)
        setMasterJobDsId(o.key)
        if (o.key == secondaryJobDsId) {
            openNotification('主次对账方不能相同')
        }
    }
    //修改次对账方
    const changsecondJob = async (v, o) => {
        await seconddata(o.key)
        setSecondaryJobDsId(o.key)
        if (o.key == masterJobDsId) {
            openNotification('主次对账方不能相同')
        }
    }
    //弹框确定
    const handleOk = async () => {
        if (a === '2') {
            let params = {
                tellerNo: tellerNo,
                id: record.id,
                jobName: jobName,
                masterJobDsId: masterJobDsId,
                secondaryJobDsId: secondaryJobDsId,
                checkType: checkType,
                jobStatus: "ENABLE",
                remark: remark,
                errorThreshold: errorThreshold,
                holidayCheckFlag: holidayCheckFlag
            }
            const res = await changeConfigList(params)
            actionRef.current.reload()
            if (res.success) {
                openNotification('修改成功')
                setIsModalVisible(false);
            } else {
                openNotification(res.errorMsg)
                setIsModalVisible(false);
            }
        } else if (a === '3') {
            setIsModalVisible(false);
        } else if (a === '4') {
            let params = { tellerNo: tellerNo, id: tabId }
            const res = await delConfigList(params)
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
        let params = {
            tellerNo: tellerNo,
            jobName: addjobName,
            masterJobDsId: addmasterJobDsId,
            secondaryJobDsId: addsecondaryJobDsId,
            checkType: addcheckType,
            jobStatus: "ENABLE",
            remark: addremark,
            errorThreshold: adderrorThreshold,
            accountCycle: addaccountCycle,
            holidayCheckFlag: addholidayCheckFlag,
            errorMatchCycle: addErrorCycle
        }
        const res = await addConfigList(params)
        actionRef.current.reload()
        if (res.success) {
            openNotification('添加成功')
            setIsModalVisible(false);
        } else {
            openNotification(res.errorMsg)
            setIsModalVisible(false)
        }
    };
    //表单提交失败
    const onFinishFailed = (e) => {
        setIsModalVisible(true);
    };
    const rendermodal = (a) => {
        if (a === '1') {
            return <Form onFinishFailed={onFinishFailed} onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="业务模块" label="业务模块" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addJobName(e)} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="备注" label="备注" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addRemarks(e)} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="对账类型" label="对账类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={(e) => addClas(e)}>
                                <Select.Option value="销售">销售</Select.Option>
                                <Select.Option value="采购">采购</Select.Option>
                                <Select.Option value="提现">提现</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="主对账方" label="主对账方" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={addmasterJob}>
                                {
                                    Job ? Job.map((item) => {
                                        return <Select.Option key={item.id} value={item.dsName}>{item.dsName}</Select.Option>
                                    }) : ''
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="次对账方" label="次对账方" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={addsecondJob}>
                                {
                                    Job ? Job.map((item) => {
                                        return <Select.Option key={item.id} value={item.dsName}>{item.dsName}</Select.Option>
                                    }) : ''
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="挂账周期" label="挂账周期" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={(e) => addCycle(e)}>
                                <Select.Option value="0">0</Select.Option>
                                <Select.Option value="1">1</Select.Option>
                                <Select.Option value="2">2</Select.Option>
                                <Select.Option value="3">3</Select.Option>
                                <Select.Option value="4">4</Select.Option>
                                <Select.Option value="5">5</Select.Option>
                                <Select.Option value="7">7</Select.Option>
                                <Select.Option value="14">14</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="差错阈值(笔)" label="差错阈值(笔)" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addError(e)} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="节假日是否参与对账标志" label="节假日是否参与对账标志" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={(e) => addholidayCheck(e)}>
                                <Select.Option value="是">是</Select.Option>
                                <Select.Option value="否">否</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="差错勾兑周期" label="差错勾兑周期" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={(e) => addErrorMatchCycle(e)}>
                                <Select.Option value="7">7</Select.Option>
                                <Select.Option value="14">14</Select.Option>
                                <Select.Option value="28">28</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {
                    showJob ?
                        <div className="modaltable">
                            {
                                masterJob ?
                                    <div>
                                        <div>
                                            <p><b style={{ color: "#FF0000" }}>*</b>
                                                主对账键值提取</p>
                                            <Form.Item label="主对账键值提取" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                                <span>{masterJob.dataSql}</span>
                                            </Form.Item>
                                        </div>
                                        <div>
                                            <p><b style={{ color: "#FF0000" }}>*</b>主队账方业务要素提取</p>
                                            {masterJob.fields ? masterJob.fields.map((item, idx) => {
                                                return <div key={idx}>
                                                    <p><span>{`要素${idx + 1}:`}</span><span>{item.dataSqlFieldDesc}</span></p>
                                                </div>
                                            }) : ''}
                                        </div>
                                    </div> : ''}
                        </div> : ''
                }
                {
                    showJob ?
                        <div className="modaltable">
                            {
                                secondJob ?
                                    <div>
                                        <div>
                                            <p><b style={{ color: "#FF0000" }}>*</b>
                                                次对账键值提取</p>
                                            <Form.Item label="次对账键值提取" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                                <span>{secondJob.dataSql}</span>
                                            </Form.Item>
                                        </div>
                                        <div>
                                            <p><b style={{ color: "#FF0000" }}>*</b>次对账方业务要素提取</p>
                                            {secondJob.fields ? secondJob.fields.map((item, idx) => {
                                                return <div key={idx}>
                                                    <p><span>{`要素${idx + 1}:`}</span><span>{item.dataSqlFieldDesc}</span></p>
                                                </div>
                                            }) : ''}
                                        </div>
                                    </div> : ''}
                        </div> : ''
                }

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
            return <Form form={form}
                initialValues={{
                    jobName: record.jobName,
                    remark: record.remark,
                    checkType: record.checkType,
                    masterJobDsName: record.masterJobDsName,
                    secondaryJobDsName: record.secondaryJobDsName,
                    errorThreshold: record.errorThreshold,
                    holidayCheckFlag: record.holidayCheckFlag,
                }}
            >
                <Row gutter={24}>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="jobName" label="业务模块" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => changJobName(e)} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="remark" label="备注" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => changRemarks(e)} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="checkType" label="对账类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={changClas}>
                                <Select.Option value="销售">销售</Select.Option>
                                <Select.Option value="采购">采购</Select.Option>
                                <Select.Option value="提现">提现</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="masterJobDsName" label="主对账方" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={changmasterJob}>
                                {
                                    Job ? Job.map((item) => {
                                        return <Select.Option key={item.id} value={item.dsName}>{item.dsName}</Select.Option>
                                    }) : ''
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="secondaryJobDsName" label="次对账方" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={changsecondJob}>
                                {
                                    Job ? Job.map((item) => {
                                        return <Select.Option key={item.id} value={item.dsName}>{item.dsName}</Select.Option>
                                    }) : ''
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="errorThreshold" label="差错阈值(笔)" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => changError(e)} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="holidayCheckFlag" label="节假日是否参与对账标志" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                            <Select
                                placeholder="请选择"
                                style={{ width: '100%' }}
                                onChange={changholidayCheckFlag}>
                                <Select.Option value="是">是</Select.Option>
                                <Select.Option value="否">否</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="modaltable">
                    {
                        masterJob ?
                            <div>
                                <div>
                                    <p><b style={{ color: "#FF0000" }}>*</b>
                                        主对账键值提取</p>
                                    <Form.Item label="主对账键值提取" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                        <span>{masterJob.dataSql}</span>
                                    </Form.Item>
                                </div>
                                <div>
                                    <p><b style={{ color: "#FF0000" }}>*</b>主队账方业务要素提取</p>
                                    {masterJob.fields ? masterJob.fields.map((item, idx) => {
                                        return <div key={idx}>
                                            <p><span>{`要素${idx + 1}:`}</span><span>{item.dataSqlFieldDesc}</span></p>
                                        </div>
                                    }) : ''}
                                </div>
                            </div> : ''}
                </div>
                <div className="modaltable">
                    {
                        secondJob ?
                            <div>
                                <div>
                                    <p><b style={{ color: "#FF0000" }}>*</b>
                                        次对账键值提取</p>
                                    <Form.Item label="次对账键值提取" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                        <span>{secondJob.dataSql}</span>
                                    </Form.Item>
                                </div>
                                <div>
                                    <p><b style={{ color: "#FF0000" }}>*</b>次对账方业务要素提取</p>
                                    {secondJob.fields ? secondJob.fields.map((item, idx) => {
                                        return <div key={idx}>
                                            <p><span>{`要素${idx + 1}:`}</span><span>{item.dataSqlFieldDesc}</span></p>
                                        </div>
                                    }) : ''}
                                </div>
                            </div> : ''}
                </div>
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
                        <span>业务模块:</span><span>{tabDetail ? tabDetail.jobName : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>备注:</span><span>{tabDetail ? tabDetail.remark : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>对账类型:</span><span>{tabDetail ? configManageTask(tabDetail.checkType, 'checkType') : ''}</span>
                    </Col>
                </Row>
                <Row gutter={24} align={'middle'} style={{ marginBottom: '10px' }}>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>主对账方:</span><span>{tabDetail ? tabDetail.masterJobDsName : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>次对账方:</span><span>{tabDetail ? tabDetail.secondaryJobDsName : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>对账开关:</span><span>{tabDetail ? configManageTask(tabDetail.jobStatus, 'jobStatus') : ''}</span>
                    </Col>
                </Row>
                <Row gutter={24} align={'middle'} style={{ marginBottom: '10px' }}>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>挂账周期:</span><span>{tabDetail ? tabDetail.accountCycle : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>差错阈值(笔):</span><span>{tabDetail ? tabDetail.errorThreshold : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>节假日是否参与对账标志:</span><span>{tabDetail ? configManageTask(tabDetail.holidayCheckFlag, 'holidayCheckFlag') : ''}</span>
                    </Col>
                    <Col span={8} style={{ width: '30%' }}>
                        <span>差错勾兑周期:</span><span>{tabDetail ? tabDetail.errorMatchCycle : ''}</span>
                    </Col>
                </Row>

                <div className="modaltable" style={{ background: "#F7F7F7", borderRadius: "6px", padding: '10px' }}>
                    {
                        tabDetail ?
                            <div>
                                <div style={{ marginTop: '15px', padding: '0px 23px' }} >
                                    <p><b style={{ color: "#FF0000" }}>*</b>主对账键值提取</p >
                                    <div style={{ border: '1px solid #ccc', textIndent: '5px', borderRadius: '3px' }}>
                                        <span style={{ display: 'block', width: '100px', borderRight: '1px solid #ccc' }}>主对账键值提取</span>
                                        <span style={{ marginLeft: '102px', display: 'block', marginTop: '-22px' }}>{tabDetail ? tabDetail.masterDateSql : ''}</span>
                                    </div>
                                </div>
                                <div style={{ padding: ' 0px 23px', marginTop: '25px' }}>
                                    <p><b style={{ color: "#FF0000" }}>*</b>主对账方业务要素提取</p >

                                    <div style={{ border: '1px solid #ccc', textIndent: '10px', borderRadius: '3px' }}>
                                        <p style={{ display: 'block', width: '100px' }}>字段描述</p>
                                        {tabDetail.masterFields ? tabDetail.masterFields.map((item, idx) => {
                                            return <p key={idx}>
                                                <span>{`元素${idx * 1 + 1}`}:</span>
                                                <span>{item}</span>
                                            </p>
                                        }) : '/'}
                                    </div>
                                </div>
                            </div> : ''
                    }
                </div>
                <div className="modaltable" style={{ background: "#F7F7F7", borderRadius: "6px", padding: '10px' }}>
                    {
                        tabDetail ?
                            <div>
                                <div style={{ marginTop: '15px', padding: '0px 23px' }} >
                                    <p><b style={{ color: "#FF0000" }}>*</b>次对账键值提取</p >
                                    <div style={{ border: '1px solid #ccc', textIndent: '5px', borderRadius: '3px' }}>
                                        <span style={{ display: 'block', width: '100px', borderRight: '1px solid #ccc' }}>次对账键值提取</span>
                                        <span style={{ marginLeft: '102px', display: 'block', marginTop: '-22px' }}>{tabDetail ? tabDetail.secondaryDateSql : ''}</span>
                                    </div>
                                </div>
                                <div style={{ padding: ' 0px 23px', marginTop: '25px' }}>
                                    <p><b style={{ color: "#FF0000" }}>*</b>次对账方业务要素提取</p >

                                    <div style={{ border: '1px solid #ccc', textIndent: '10px', borderRadius: '3px' }}>
                                        <p style={{ display: 'block', width: '100px' }}>字段描述</p>
                                        {tabDetail.secondaryFields ? tabDetail.secondaryFields.map((item, idx) => {
                                            return <p key={idx}>
                                                <span>{`元素${idx * 1 + 1}`}:</span>
                                                <span>{item}</span>
                                            </p>
                                        }) : '/'}
                                    </div>
                                </div>
                            </div> : ''
                    }
                </div>
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
                <p style={{ textAlign: 'center' }}>确定删除该条对账信息吗？</p>
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
    //添加挂账周期
    const addCycle = (e) => {
        setAddAccountCycle(e)
    }
    //添加业务模块
    const addJobName = (e) => {
        setAddJobName(e.target.value)
    }//添加备注
    const addRemarks = (e) => {
        setAddRemark(e.target.value)
    }//添加类型
    const addClas = (e) => {
        if (e === '销售') {
            setAddCheckType('SALES')
        } else if (e === '采购') {
            setAddCheckType('PURCHASE')
        } else if (e === '提现') {
            setAddCheckType('WITHDRAW')
        }
    }
    //添加差错
    const addError = (e) => {
        setAddErrorThreshold(e.target.value)
    }
    //添加节假日是否参与对账
    const addholidayCheck = (e) => {
        if (e === '是') {
            setAddHolidayCheckFlag('YES')
        } else if (e === '否') {
            setAddHolidayCheckFlag('NO')
        }
    }
    //添加差错勾兑周期
    const addErrorMatchCycle = (e) => {
        setAddErrorCycle(e)
    }
    //修改业务模块
    const changJobName = (e) => {
        setJobName(e.target.value)
    }//修改备注
    const changRemarks = (e) => {
        setRemark(e.target.value)
    }//修改类型
    const changClas = (e) => {
        if (e === '销售') {
            setCheckType('SALES')
        } else if (e === '采购') {
            setCheckType('PURCHASE')
        } else if (e === '提现') {
            setCheckType('WITHDRAW')
        }
    }
    //修改差错
    const changError = (e) => {
        setErrorThreshold(e.target.value)
    }
    //修改节假日是否参与对账
    const changholidayCheckFlag = (e) => {
        if (e === '是') {
            setHolidayCheckFlag('YES')
        } else if (e === '否') {
            setHolidayCheckFlag('NO')
        }
    }
    return (
        <div>
            <ProTable
                columns={columns}
                request={async (params, sort, filter) => {
                    let postData = {
                        pageNum: params.current, pageSize: params.pageSize, tellerNo: tellerNo, id: params.jobName,
                        masterJobDsId: params.masterJobDsName,
                        secondaryJobDsId: params.secondaryJobDsName
                    }
                    try {
                        const res = await getConfigPageList(postData);
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
                }} dateFormatter="string" headerTitle="信息列表" toolBarRender={() => [
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

export default connect(mapStateToProps, mapDispatchToProps)(configTask);