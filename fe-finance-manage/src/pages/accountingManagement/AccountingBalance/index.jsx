import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { Button, Table, Tag, Space, DatePicker, Select, Modal, Input, Form, Row, Col, Pagination, Spin, AutoComplete, notification } from 'antd'
import moment from 'moment';
import { AccountingBalance, AccountingSearch, AccountingSear, accSubjectExport } from '@api/liquiManage'
import accountBa from '../../../enumeration/accountBa'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
const accountBalance=(props)=> {
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
    const [tableData, setTableData] = useState()
    const [arr, setarr] = useState()
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [accDate, setAccountDate] = useState(moment(initDate))
    const [total, setTotal] = useState(1)
    const [tabDetail, setTabDetail] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);
    //数据懒加载
    const [loading, setLoading] = useState(false)
    //科目号
    const [AccountNumber, setAccountNumber] = useState()
    //三级科目序号
    const [AccountThree, setAccountThree] = useState()
    //科目号
    const [account, setAccount] = useState()
    //三级科目号
    const [acc, setAcc] = useState()
    //查看
    const [record, setRecord] = useState()
    //数据
    useEffect(() => {
        setLoading(true)
        accountingBalanceList(pageNum, pageSize)
        accountNumberList(AccountNumber)
        accountThree(AccountNumber)
    }, [])
    //数据列表
    const accountingBalanceList = async (pageNum, pageSize) => {
        let params = {
            accDate: accDate ? accDate.format('YYYY-MM-DD') : '',
            pageNum: pageNum,
            pageSize: pageSize,
            subjectNo: AccountNumber,
            threeSubjectNo: AccountThree,
            tellerNo:tellerNo
            }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        const res = await AccountingBalance(params)
        setTotal(res.pageInfo.total);
        setTableData(res.result);
        setarr(res.result.accSubjectBalQueryDTOList)
        console.log(res.result.accSubjectBalQueryDTOList);
    }
    //监听分页变化
    const queryPage = async (pageNum, pageSize) => {
        setPageNum(pageNum);
        setPageSize(pageSize)
        await accountingBalanceList(pageNum, pageSize)
    }
    //日期选择框onchange事件
    const changeDate = (moment, string) => {
        setAccountDate(moment)
    }
    //科目号搜索
    const AccountRck = (e) => {
        setAccountNumber(e)
        accountNumberList(e)
    }
    //三级科目序号搜索
    const AccountTh = (e) => {
        setAccountThree(e)
    }
    //重置
    const Xia = () => {
        setAccountDate(moment(initDate))
        setAccountNumber("")
        setAccountThree()
    }
    //查找
    const Abb = () => {
        accountingBalanceList(pageNum, pageSize)
        setLoading(true)
    }
    //科目号
    const accountNumberList = async (AccountNumber) => {
        let params = {
            subjectNo: AccountNumber,
            tellerNo:tellerNo
        }
        const res = await AccountingSearch(params)
        setAccount(res.result)
        accountThree(AccountNumber)
    }
    //三级科目号
    const accountThree = async (AccountNumber) => {
        let params = {
            threeSubjectNo: AccountNumber,
            tellerNo:tellerNo
        }
        const res = await AccountingSear(params)
        setAcc(res.result)
    }
    //查看
    const accountingLook = async (record) => {
        setRecord(record)
        setIsModalVisible(true);
    }
    //弹框确认
    const handleOk = async () => {
        setIsModalVisible(false);
    };
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    //导出
    const exportAccount = async () => {
        const params = {
            tellerNo:tellerNo,
            accDate: accDate ? accDate.format('YYYY-MM-DD') : '',
            pageNum: pageNum,
            pageSize: pageSize,
            subjectNo: AccountNumber,
            threeSubjectNo: AccountThree,
            body: {
                exportNum: "1",
                fileName: "科目余额查询信息表" + initDate + ".csv",
            }
        }
        let res = await accSubjectExport(params)
        let blob = new Blob([res]);
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = params.body.fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'id',
            width: 110,
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        },
        {
            title: '会计日',
            key: 'accDate',
            dataIndex: 'accDate',
            render: (t, r, i) => {
                return <span>{t && t.substr(0, 10)}</span>
            }
        },
        {
            title: '核算机构',
            dataIndex: 'settleBranch',
            key: 'settleBranch',
            width: 110,
            render: (t, r, i) => {
                return accountBa(t, 'settleBranch')
            }
        }, {
            title: '要素1',
            key: 'element1',
            dataIndex: 'element1',
        }, {
            title: '要素2',
            key: 'element2',
            dataIndex: 'element2',
        },
        {
            title: '科目号',
            dataIndex: 'subjectNo',
            key: 'subjectNo',
        },
        {
            title: '科目名称',
            dataIndex: 'subjectName',
            key: 'subjectName',
        },
        {
            title: '货币',
            key: 'ccy',
            dataIndex: 'ccy',
            width: 110,
            render: (t, r, i) => {
                return accountBa(t, 'ccy')
            }
        },
        {
            title: '上期借方余额',
            key: 'perviousDrBal',
            dataIndex: 'perviousDrBal',
            width: 120,
            render: (t, r, i) => {
                return <span>{(r.perviousDrBal).toFixed(2)}</span>
            }
        },
        {
            title: '上期贷方余额',
            key: 'perviousCrBal',
            dataIndex: 'perviousCrBal',
            width: 120,
            render: (t, r, i) => {
                return <span>{(r.perviousCrBal).toFixed(2)}</span>
            }
        },
        {
            title: '当前借方余额',
            key: 'currDrBal',
            dataIndex: 'currDrBal',
            width: 120,
            render: (t, r, i) => {
                return <span>{(r.currDrBal).toFixed(2)}</span>
            }
        }, {
            title: '当前贷方余额',
            key: 'currCrBal',
            dataIndex: 'currCrBal',
            render: (t, r, i) => {
                return <span>{(r.currCrBal).toFixed(2)}</span>
            }
        },
        {
            title: '当前借方发生笔数',
            key: 'currDrCnt',
            dataIndex: 'currDrCnt',
        },
        {
            title: '当前贷方发生笔数',
            key: 'currCrCnt',
            dataIndex: 'currCrCnt',
        },
        {
            title: '当前借方发生金额',
            key: 'currDrAmt',
            dataIndex: 'currDrAmt',
            render: (t, r, i) => {
                return <span>{(r.currDrAmt).toFixed(2)}</span>
            }
        },
        {
            title: '当前贷方发生金额',
            key: 'currCrAmt',
            dataIndex: 'currCrAmt',
            render: (t, r, i) => {
                return <span>{(r.currCrAmt).toFixed(2)}</span>
            }
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => { accountingLook(record) }}>查看</a>
                </Space>
            ),
        }
    ];
    return (
        <div className={styles.box}>
            <div className={styles.proTableSearch}>
                <div className={styles.proTableHead}>
                    <div style={{ display: 'flex', width: '25%', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', marginTop: '10px' }}>科目号:</span>
                        <Input.Group style={{ width: '70%', maxWidth: '200px', minWidth: '100px', marginLeft: '5px', height: '45px', borderRadius: '5px' }}>
                            <AutoComplete
                                onChange={(e) => AccountRck(e)}
                                value={AccountNumber}
                                style={{ width: '100%', marginTop: '10px' }}
                                placeholder="请输入"
                                options={account}
                            />
                        </Input.Group>
                    </div>
                    <div style={{ display: 'flex', width: '25%', alignItems: 'center' }}>
                        <span style={{ marginLeft: '19px', fontSize: '18px', marginTop: '10px' }}>三级科目序号:</span>
                        <Select placeholder='请输入:' value={AccountThree} onSelect={AccountTh} style={{ width: '70%', maxWidth: '200px', minWidth: '100px', marginLeft: '5px', height: '35px', borderRadius: '5px', marginTop: '17px' }}>
                            {
                                acc ? acc.map((item) => {
                                    return <Select.Option key={item.value}>{item.value}</Select.Option>
                                }) : ''
                            }
                        </Select>
                    </div>
                    <div style={{ display: 'flex', width: '25%', alignItems: 'center' }}>
                        <span style={{ marginLeft: '15px', fontSize: '18px', marginTop: '10px' }}>会计日:</span>
                        <Space direction="vertical">
                            <DatePicker defaultValue={moment().subtract(1, 'days').endOf('day')} style={{ width: '70%', maxWidth: '200px', minWidth: '100px', height: '35px', borderRadius: '5px', marginLeft: '15px', marginTop: '10px' }} size={"small"}
                                onChange={changeDate}
                                value={accDate}
                            />
                        </Space>
                    </div>
                    <div className={styles.footerBix}  >
                        <Button className={styles.reset} onClick={() => Xia()}>重置</Button>
                        <Button className={styles.searchBtn} onClick={() => Abb()}>查询</Button>
                    </div>
                </div>
            </div>
            <div className={styles.card}>
                <div className={styles.mixing}>
                    <b>科目余额列表</b>
                    <Button type="primary" style={{ maxWidth: '100px', maxHeight: '50px' }} onClick={() => exportAccount()}>导出</Button>
                </div>
                <div className={styles.table}>
                    <Spin spinning={loading}>
                        <Table columns={columns} dataSource={tableData} pagination={false}
                            rowKey="id"
                            scroll={{ x: 2400 }} />
                    </Spin>
                    <div className={styles.pagination}>
                        <Pagination
                            total={total}
                            current={pageNum}
                            showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                            defaultPageSize={pageSize}
                            defaultCurrent={pageNum}
                            showSizeChanger={true}
                            pageSizeOptions={[10, 20, 30, 40, 50]}
                            onChange={(pageNum, pageSize) => queryPage(pageNum, pageSize)}
                        />
                    </div>
                </div>
            </div>
            <Modal title="查看科目余额信息" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={800}>
                <div>
                    <Form>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <span>科目名称:</span>
                                <span>{record ? record.subjectName : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>核算机构:</span>
                                <span>{record ? accountBa(record.settleBranch, 'settleBranch') : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>科目号:</span>
                                <span>{record ? record.subjectNo : ""}</span>
                            </Col>
                            <Col span={8}>
                                <span>货币:</span>
                                <span>{record ? accountBa(record.ccy, 'ccy') : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>上期借方余额:</span>
                                <span>{record ? (record.perviousDrBal).toFixed(2) : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>上期贷方余额:</span>
                                <span>{record ? (record.perviousCrBal).toFixed(2) : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>当前借方余额:</span>
                                <span>{record ? (record.currDrBal).toFixed(2) : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>当前贷方余额:</span>
                                <span>{record ? (record.currCrBal).toFixed(2) : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>当前借方发生笔数:</span>
                                <span>{record ? record.currDrCnt : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>当前贷方发生笔数:</span>
                                <span>{record ? record.currCrCnt : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>当前借方发生金额:</span>
                                <span>{record ? (record.currDrAmt).toFixed(2) : ''}</span>
                            </Col>
                            <Col span={8}>
                                <span>当前贷方发生金额:</span>
                                <span>{record ? (record.currCrAmt).toFixed(2) : ''}</span>
                            </Col>
                        </Row>
                    </Form>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(accountBalance);