import React, { useState, useRef, useEffect } from 'react';
import { Space, Modal, Input, Form, Row, Col,notification } from 'antd'
import { collectionList, collectionUpdate } from '@api/specialMedicine'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
const collectionMain = (props) => {
    const { cacheUser, userInfo } = props;
    const actionRef = useRef();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState('收款信息维护-更新');
    const [a, setA] = useState("0")
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [record, setRecord] = useState()
    const [supplierId, setSupplierId] = useState()//店铺Id
    const [supplierName, setSupplierName] = useState()//店铺名称
    const [payeeName, setPayeeName] = useState()//收款户名
    const [payeeBankName, setPayeeBankName] = useState()//收款银行名称
    const [payeeAcctNo, setPayeeAcctNo] = useState()//收款银行卡号
    const [payaeeBankAddr, setPayaeeBankAddr] = useState()//收款银行开户行地址
    const [cnapsNum, setCnapsNum] = useState()//收款银行联行号
    const columns = [
        {
            title: '店铺ID',
            dataIndex: 'supplierId',
            key: 'supplierId',
            search: false,
        }, {
            title: '店铺名称',
            dataIndex: 'supplierName',
            key: 'supplierName',
        }, {
            title: '收款卡号',
            dataIndex: 'payeeAcctNo',
            key: 'payeeAcctNo',
            hideInTable: true,
        },
        {
            title: '收款户名',
            dataIndex: 'payeeName',
            key: 'payeeName',
            search: false,
        },
        {
            title: '收款银行名称',
            dataIndex: 'payeeBankName',
            key: 'payeeBankName',
            search: false,
        },
        {
            title: '收款银行卡号',
            dataIndex: 'payeeAcctNo',
            key: 'payeeAcctNo',
            search: false,
        },
        {
            title: '收款银行开户行地址',
            dataIndex: 'payaeeBankAddr',
            key: 'payaeeBankAddr',
            search: false,
        },
        {
            title: '收款银行联行号',
            dataIndex: 'cnapsNum',
            key: 'cnapsNum',
            search: false,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
            search: false,
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => { updateLocale(record) }}>更新</a>
                </Space >
            ),
        }
    ];
    //更新
    const updateLocale = (record) => {
        setIsModalVisible(true);
        setRecord(record)
        setSupplierId(record.supplierId)
        setSupplierName(record.supplierName)
        setPayeeName(record.payeeName)//收款户名
        setPayeeBankName(record.payeeBankName)//收款银行名称
        setPayeeAcctNo(record.payeeAcctNo)//收款银行卡号
        setPayaeeBankAddr(record.payaeeBankAddr)//收款银行开户行地址
        setCnapsNum(record.cnapsNum)//收款银行联行号
        form.setFieldsValue({
            payeeName: record.payeeName,//收款户名
            payeeBankName: record.payeeBankName,//收款银行名称
            payeeAcctNo: record.payeeAcctNo,//收款银行卡号
            payaeeBankAddr: record.payaeeBankAddr,//收款银行开户行地址
            cnapsNum: record.cnapsNum,//收款银行联行号
        })
    }
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    //弹框确定
    const handleOk = async() => {
        let params={
            tellerNo:tellerNo,
            payeeType:'1',
            supplierId:supplierId,
            supplierName:supplierName,
            payeeName: payeeName,//收款户名
            payeeBankName: payeeBankName,//收款银行名称
            payeeAcctNo: payeeAcctNo,//收款银行卡号
            payaeeBankAddr: payaeeBankAddr,//收款银行开户行地址
            cnapsNum: cnapsNum,//收款银行联行号
        }
        const res=await collectionUpdate(params)
        actionRef.current.reload()
        if (res.success) {
            openNotification('更新成功')
            setIsModalVisible(false);
        } else {
            openNotification(res.errorMsg)
            setIsModalVisible(false);
        }
        setIsModalVisible(false);
    }
    //更新错误弹框
    const openNotification = (errorvalue) => {
        notification.open({
            duration: 5,
            description:
                errorvalue
        });
    }
    //收款户名
    const changePayeeNameInp = (e) => {
        setPayeeName(e.target.value)
    }
    //收款银行名称
    const changePayeeBankNameInp = (e) => {
        setPayeeBankName(e.target.value)
    }
    //收款银行卡号
    const changePayeeAcctNoInp = (e) => {
        setPayeeAcctNo(e.target.value)
    }
    //收款银行开户行地址
    const changePayeeBankAddrInp = (e) => {
        setPayaeeBankAddr(e.target.value)
    }
    //收款银行联行号
    const changeCnapsNumInp = (e) => {
        setCnapsNum(e.target.value)
    }
    const rendermodal = () => {
        // let initialValues={
        //     payeeName: record.payeeName,//收款户名
        //     payeeBankName: record.payeeBankName,//收款银行名称
        //     payeeAcctNo: record.payeeAcctNo,//收款银行卡号
        //     payaeeBankAddr: record.payaeeBankAddr,//收款银行开户行地址
        //     cnapsNum: record.cnapsNum,//收款银行联行号
        // }
        return <Form form={form}
            // initialValues={initialValues}
        >
            <Row gutter={24}>
                <Col>
                    <Form.Item name='payeeName' label="收款户名">
                        <Input onChange={(e) => { changePayeeNameInp(e) }} />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item name='payeeBankName' label="收款银行名称">
                        <Input onChange={(e) => { changePayeeBankNameInp(e) }} />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item name='payeeAcctNo' label="收款银行卡号">
                        <Input onChange={(e) => { changePayeeAcctNoInp(e) }} />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item name='payaeeBankAddr' label="收款银行开户行地址">
                        <Input onChange={(e) => { changePayeeBankAddrInp(e) }} />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item name='cnapsNum' label="收款银行联行号">
                        <Input onChange={(e) => { changeCnapsNumInp(e) }} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
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
                        supplierName: params.supplierName,
                        payeeAcctNo: params.payeeAcctNo
                    }
                    try {
                        const res = await collectionList(postData);
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
                }} dateFormatter="string"
                toolBarRender={() => [

                ]}
            />
            <Modal title={operation} visible={isModalVisible} keyboard={true} onCancel={handleCancel} onOk={handleOk} >
                {rendermodal()}
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

export default connect(mapStateToProps, mapDispatchToProps)(collectionMain);