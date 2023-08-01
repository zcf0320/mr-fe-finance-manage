import React, { useEffect, useState, useRef } from 'react';
import { Space, Modal, notification } from 'antd'
import { otherList, otherAction } from '@api/liquiManage'
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
export default function CloseDetail() {
    const actionRef = useRef();
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [otherId, setOtherId] = useState()
    const look = () => {
        setIsModalVisible(true);
    };
    //弹框确认
    const handleOk = async () => {
        let params = {
            id: otherId,
        }
        let res = await otherAction(params)
        if (res.success) {
            openNotification('记账成功')
            setIsModalVisible(false);
            actionRef.current.reload()
        } else {
            openNotification(res.errorMsg)
        }


        setIsModalVisible(false);
    };
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    //错误弹框
    const openNotification = (errorMsg) => {
        notification.open({
            duration: 3,
            description: errorMsg
        });
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            width: 160,
            search: false,
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        },
        {
            title: '开始时间',
            dataIndex: 'beginTime',
            key: 'beginTime',
            width: 160,
            hideInTable: true,
            valueType: 'date',
            initialValue: initDate,
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            width: 160,
            hideInTable: true,
            valueType: 'date',
            initialValue: initDate,
        },
        {
            title: '日期',
            dataIndex: 'accountDate',
            key: 'accountDate',
            search: false,
            width: 160,
        },
        {

            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            search: false,
            width: 160,
        },
        {
            title: '通道',
            dataIndex: 'channelType',
            key: 'channelType',
            valueEnum: {
                "ALI_PAY": "支付宝",
                "KUAIQIAN_PAY": "快钱",
                "JINGDONG_PAY": "京东支付",
                "PDD_PAY":"拼多多"
            },
            width: 160,
            valueType: 'select',
        },
        {
            title: '店铺',
            key: 'supplierName',
            dataIndex: 'supplierName',
            width: 160,
            search: false,
        },
        {
            title: '支付订单号',
            dataIndex: 'orderTransactionNumber',
            key: 'orderTransactionNumber',
            width: 160,
        },

        {
            title: '交易类型',
            key: 'tradeType',
            dataIndex: 'tradeType',
            valueEnum: {
                "PRICEPROTECTBACK": "价保返佣",
                "PRICEPROTECT": "价保扣款",
                "AFTERSALECOMPENSATE": "售后卖家赔付费",
                "EXPAND_NEW": "拓新",
                "platform_commission_settle": "平台佣金结算",
                "FREIGHT_INSURANCE": "卖家版运费保险",
            },
            valueType: 'select',
            width: 160,
        },
        {
            title: '金额1(借)',
            key: 'accountAmount',
            dataIndex: 'accountAmount',
            width: 160,
            search: false,
            render: (t, r, i) => {
                if (t != '-') {
                    const brr = t && t.toString().indexOf('.');
                    if (brr === -1) {
                        return <span>
                            {`${t.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`}
                        </span>
                    } else {
                        return <span>{t.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span>;
                    }
                } else {
                    return t
                }
            }
        },
        {
            title: '金额2(借)',
            key: 'accountAmountSecond',
            dataIndex: 'accountAmountSecond',
            width: 160,
            search: false,
            render: (t, r, i) => {
                if (t != '-') {
                    const brr = t && t.toString().indexOf('.');
                    if (brr === -1) {
                        return <span>
                            {`${t.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`}
                        </span>
                    } else {
                        return <span>{t.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span>;
                    }
                } else {
                    return t
                }
            }
        },
        {
            title: '金额(3)贷',
            key: 'accountAmountThird',
            dataIndex: 'accountAmountThird',
            width: 160,
            search: false,
            render: (t, r, i) => {
                if (t != '-') {
                    const brr = t && t.toString().indexOf('.');
                    if (brr === -1) {
                        return <span>
                            {`${t.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`}
                        </span>
                    } else {
                        return <span>{t.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span>;
                    }
                } else {
                    return t
                }
            }
        }, {
            title: '记账状态',
            key: 'accountStatus',
            dataIndex: 'accountStatus',
            valueEnum: {
                "1": "待记账",
                "2": "已记账",
                "3": "记账失败",
            },
            valueType: 'select',
            width: 160,
        },
        {
            title: '记账结果',
            key: 'resultMsg',
            dataIndex: 'resultMsg',
            width: 160,
            search: false,
        },
        {
            title: '会计日期',
            key: ' accountZwDate',
            dataIndex: 'accountZwDate',
            width: 160,
            search: false,
        }, {
            title: '会计流水号',
            key: 'accountZwNo',
            dataIndex: 'accountZwNo',
            width: 160,
            search: false,
        }, {
            title: '操作',
            key: 'option',
            dataIndex: 'option',
            fixed: 'right',
            width: 160,
            search: false,
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => { look(), costDelete(record.id) }}>记账</a>
                </Space>
            ),
        }
    ];
    const costDelete = async (id) => {
        setOtherId(id)
    }
    return (
        <div>
            <ProTable
                scroll={{ x: 1500 }}
                columns={columns}
                request={async (params, sort, filter) => {
                    let postData = {
                        pageNum: params.current,
                        pageSize: params.pageSize,
                        beginTime: params.beginTime,
                        endTime: params.endTime,
                        tradeType: params.tradeType,
                        orderTransactionNumber: params.orderTransactionNumber,
                        accountStatus: params.accountStatus,
                        channelType: params.channelType
                    }
                    try {
                        const res = await otherList(postData);
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

            <Modal title='记账' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <div>
                    确定进行记账吗?
                </div>
            </Modal>
        </div>
    )
}
