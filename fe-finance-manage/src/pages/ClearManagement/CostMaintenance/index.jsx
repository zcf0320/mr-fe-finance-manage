import React, { useState, useRef } from 'react';
import { Space, Button, Row, Col, Select, Modal, Form, notification } from 'antd'
import { getCostPageList, addCostPageList, changCostPageList, lookCostPageList } from '@api/expenseRules.js'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import expenseRult from '../../../enumeration/expenseRule'
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
import styles from './index.module.scss'

const CostMaintenance = (props) => {
  const { cacheUser, userInfo } = props;
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operation, setOperation] = useState();
  const [a, setA] = useState("0")
  const [tellerNo, setTellerNo] = useState(userInfo.username)
  //添加
  const [addChannel, setAddChannel] = useState()//通道类型
  const [addFeeName, setAddFeeName] = useState()//费率名称
  const [addFeeMode, setAddFeeMode] = useState()//收费方式
  const [addFeeCalculateMode, setAddFeeCalculateMode] = useState()//费用计算依据
  const [addFeeCalculateBaseFlag, setAddFeeCalculateBaseFlag] = useState()//计费方法
  const [addBeginAmnout, setAddBeginAmnout] = useState()//计费起始金额
  const [addCalculateRate, setAddCalculateRate] = useState()//固定费率
  const [addMinFeeAmount, setAddMinFeeAmount] = useState()//最低收费
  const [addMaxFeeAmount, setAddMaxFeeAmount] = useState()//最高收费
  const [addRoundFlag, setAddRoundFlag] = useState()//四舍五入规则
  const [addFaultTolerantFlag, setAddFaultTolerantFlag] = useState()//容错方式
  const [addFaultTolerantAmount, setAddFaultTolerantAmount] = useState()//容错值
  const [addConstantAmount, setAddConstantAmount] = useState()//固定金额
  //修改
  const [form] = Form.useForm();
  const [record, setRecord] = useState()
  const [changId, setChangId] = useState()
  const [changChannelType, setChangChannelType] = useState()
  const [changFeeName, setChangFeeName] = useState()
  const [changFeeMode, setChangFeeMode] = useState()
  const [changFeeCalculateMode, setChangFeeCalculateMode] = useState()
  const [changFeeCalculateBaseFlag, setChangFeeCalculateBaseFlag] = useState()
  const [changBeginAmnout, setChangBeginAmnout] = useState()
  const [changCalculateRate, setChangCalculateRate] = useState()
  const [changMinFeeAmount, setChangMinFeeAmount] = useState()
  const [changMaxFeeAmount, setChangMaxFeeAmount] = useState()
  const [changRoundFlag, setChangRoundFlag] = useState()
  const [changFaultTolerantFlag, setChangFaultTolerantFlag] = useState()
  const [changFaultTolerantAmount, setChangFaultTolerantAmount] = useState()
  const [changConstantAmount, setChangConstantAmount] = useState()
  const [tabDetail, settabDetail] = useState()//查看
  const columns = [
    {
      title: '序号',
      dataIndex: 'idx',
      key: 'idx',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
      render: (t, r, i) => {
        return i = i * 1 + 1
      }
    },
    {
      title: '费率代码',
      dataIndex: 'id',
      key: 'id',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
    },
    {
      title: '费率代码名称',
      dataIndex: 'feeName',
      key: 'feeName',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
    },
    {
      title: '通道名称',
      key: 'channelType',
      dataIndex: 'channelType',
      valueType: 'select',
      valueEnum: {
        'ALI_PAY': '支付宝',
        'KUAIQIAN_PAY': '快钱',
        'JINGDONG_PAY': '京东支付',
      },
      render: (t, r, i) => { return expenseRult(r.channelType, 'channelType') },
    },
    {
      title: '费用计算依据',
      key: 'feeCalculateMode',
      dataIndex: 'feeCalculateMode',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
      render: (t, r, i) => {
        return expenseRult(t, 'feeCalculateMode')
      }
    },
    {
      title: '收费方式',
      key: 'feeMode',
      dataIndex: 'feeMode',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
      render: (t, r, i) => { return expenseRult(t, 'feeMode') }
    },
    {
      title: '计算方法',
      key: 'feeCalculateBaseFlag',
      dataIndex: 'feeCalculateBaseFlag',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
      render: (t, r, i) => { return expenseRult(t, 'feeCalculateBaseFlag') }
    },
    {
      title: '四舍五入规则',
      key: 'roundFlag',
      dataIndex: 'roundFlag',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
      render: (t, r, i) => { return expenseRult(t, 'roundFlag') }
    },
    {
      title: '容错方式',
      key: 'faultTolerantFlag',
      dataIndex: 'faultTolerantFlag',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
      render: (t, r, i) => { return expenseRult(t, 'faultTolerantFlag') }
    },
    {
      title: '容错值',
      key: 'faultTolerantAmount',
      dataIndex: 'faultTolerantAmount',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
    },
    {
      title: '操作',
      key: 'option',
      width: '150px',
      fixed: 'right',
      hideInTable: false,
      hideInSearch: true,
      fieldProps: { allowClear: false },
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => { costlistchang(record), look('2') }}>修改</ a>
          <a onClick={() => { costlistLook(record.id), look('3') }}>查看</ a>
        </Space>
      ),
    }
  ];
  //查看
  const costlistLook = async (id) => {
    let params = { tellerNo: tellerNo, feeId: id }
    const res = await lookCostPageList(params)
    settabDetail(res.result)
  }
  //弹框判断
  const look = (a) => {
    if (a === "1") {
      setOperation("新增费用规则");
      setA(a)
    } else if (a === "2") {
      setOperation("修改费用规则");
      setA(a)
    } else if (a === "3") {
      setOperation("查看费用规则");
      setA(a)
    }
    setIsModalVisible(true);
  };
  //添加通道类型
  const addChannelTypeSel = (e) => {
    if (e === '支付宝') {
      setAddChannel('ALI_PAY')
    } else if (e === '快钱') {
      setAddChannel('KUAIQIAN_PAY')
    } else if (e === '京东支付') {
      setAddChannel('JINGDONG_PAY')
    }
  }
  //添加费率代码名称
  const addFeeNameSel = (e) => {
    setAddFeeName(e)
  }
  //添加收费方式
  const addFeeModeSel = (e) => {
    if (e === '单笔收取') {
      setAddFeeMode('1')
    } else if (e === '不收取') {
      setAddFeeMode('0')
      setAddFeeCalculateMode(),
        setAddFeeCalculateBaseFlag(),
        setAddBeginAmnout(),
        setAddCalculateRate(),
        setAddMinFeeAmount(),
        setAddMaxFeeAmount(),
        setAddRoundFlag(),
        setAddFaultTolerantFlag(),
        setAddFaultTolerantAmount(),
        setAddConstantAmount()
    }
  }
  //添加费用计算依据
  const addFeeCalculateModeSel = (e) => {
    if (e === '按笔') {
      setAddFeeCalculateMode('1')
    } else if (e === '金额不分层') {
      setAddFeeCalculateMode('2')
    }
  }
  //添加计算方法
  const addFeeCalculateBaseFlagSel = (e) => {
    if (e === '按固定金额收取') {
      setAddFeeCalculateBaseFlag('1')
    } else if (e === '按金额固定百分比收取') {
      setAddFeeCalculateBaseFlag('2')
    }
  }
  //添加起始金额
  const addBeginAmnoutInp = (e) => {
    setAddBeginAmnout(e.target.value)
  }
  //添加固定费率
  const addCalculateRateInp = (e) => {
    setAddCalculateRate(e.target.value)
  }
  //添加最低收费金额
  const addMinFeeAmountInp = (e) => {
    setAddMinFeeAmount(e.target.value)
  }
  //添加最高收费金额
  const addMaxFeeAmountInp = (e) => {
    setAddMaxFeeAmount(e.target.value)
  }
  //添加四舍五入规则
  const addRoundFlagSel = (e) => {
    if (e === '四舍五入') {
      setAddRoundFlag('1')
    } else if (e === '四舍五不入') {
      setAddRoundFlag('2')
    }
  }
  //添加容错方式
  const addFaultTolerantFlagSel = (e) => {
    if (e === '小于等于') {
      setAddFaultTolerantFlag('1')
    } else if (e === '大于等于') {
      setAddFaultTolerantFlag('2')
    } else if (e === '正负') {
      setAddFaultTolerantFlag('3')
    }
  }
  //添加容错值
  const addFaultTolerantAmountInp = (e) => {
    if ((/[^0-9.]/g).test(e.target.value)) {
      openNotification('请输入正确的数字,数字格式为:00000.00')
    }
    setAddFaultTolerantAmount(e.target.value)
  }
  //添加固定金额
  const addConstantAmountInp = (e) => {
    setAddConstantAmount(e.target.value)
  }
  //修改
  //修改通道类型
  const changChannelTypeSel = (e) => {
    if (e === '支付宝') {
      setChangChannelType('ALI_PAY')
    } else if (e === '快钱') {
      setChangChannelType('KUAIQIAN_PAY')
    } else if (e === '京东支付') {
      setChangChannelType('JINGDONG_PAY')
    }
  }
  //修改费率代码名称
  const changFeeNameSel = (e) => {
    setChangFeeName(e)
  }
  //修改收费方式
  const changFeeModeSel = (e) => {
    if (e === '单笔收取') {
      setChangFeeMode('1')
    } else if (e === '不收取') {
      setChangFeeMode('0')
      setChangFeeCalculateMode()
      setChangFeeCalculateBaseFlag()
      setChangBeginAmnout()
      setChangCalculateRate()
      setChangMinFeeAmount()
      setChangMaxFeeAmount()
      setChangRoundFlag()
      setChangFaultTolerantFlag()
      setChangFaultTolerantAmount()
      setChangConstantAmount()
    }
  }
  //修改费用计算依据
  const changFeeCalculateModeSel = (e) => {
    if (e === '按笔') {
      setChangFeeCalculateMode('1')
    } else if (e === '金额不分层') {
      setChangFeeCalculateMode('2')
    }
  }
  //修改计算方法
  const changFeeCalculateBaseFlagSel = (e) => {
    if (e === '按固定金额收取') {
      setChangFeeCalculateBaseFlag('1')
    } else if (e === '按金额固定百分比收取') {
      setChangFeeCalculateBaseFlag('2')
    }
  }
  //修改起始金额
  const changBeginAmnoutInp = (e) => {
    setChangBeginAmnout(e.target.value)
  }
  //修改固定费率
  const changCalculateRateInp = (e) => {
    setChangCalculateRate(e.target.value)
  }
  //修改最低收费金额
  const changMinFeeAmountInp = (e) => {
    setChangMinFeeAmount(e.target.value)
  }
  //修改最高收费金额
  const changMaxFeeAmountInp = (e) => {
    setChangMaxFeeAmount(e.target.value)
  }
  //修改四舍五入规则
  const changRoundFlagSel = (e) => {
    if (e === '四舍五入') {
      setChangRoundFlag('1')
    } else if (e === '四舍五不入') {
      setChangRoundFlag('2')
    }
  }
  //修改容错方式
  const changFaultTolerantFlagSel = (e) => {
    if (e === '小于等于') {
      setChangFaultTolerantFlag('1')
    } else if (e === '大于等于') {
      setChangFaultTolerantFlag('2')
    } else if (e === '正负') {
      setChangFaultTolerantFlag('3')
    }
  }
  //修改容错值
  const changFaultTolerantAmountInp = (e) => {
    if ((/[^0-9.]/g).test(e.target.value)) {
      openNotification('请输入正确的数字,数字格式为:00000.00')
    }
    setChangFaultTolerantAmount(e.target.value)
  }
  //修改固定金额
  const changConstantAmountInp = (e) => {
    setChangConstantAmount(e.target.value)
  }
  //修改回显
  const costlistchang = (record) => {
    setRecord(record)
    setChangId(record.id)
    setChangChannelType(record.channelType)
    setChangFeeName(record.feeName)
    setChangFeeMode(record.feeMode)
    setChangFeeCalculateMode(record.feeCalculateMode)
    setChangFeeCalculateBaseFlag(record.feeCalculateBaseFlag)
    setChangBeginAmnout(record.beginAmnout)
    setChangCalculateRate(record.calculateRate)
    setChangMinFeeAmount(record.minFeeAmount)
    setChangMaxFeeAmount(record.maxFeeAmount)
    setChangRoundFlag(record.roundFlag)
    setChangFaultTolerantFlag(record.faultTolerantFlag)
    setChangFaultTolerantAmount(record.faultTolerantAmount)
    setChangConstantAmount(record.constantAmount)
    form.setFieldsValue({
      channelType: expenseRult(record.channelType, 'channelType'),
      feeName: record.feeName,
      feeMode: expenseRult(record.feeMode, 'feeMode'),
      feeCalculateMode: expenseRult(record.feeCalculateMode, 'feeCalculateMode'),
      feeCalculateBaseFlag: expenseRult(record.feeCalculateBaseFlag, 'feeCalculateBaseFlag'),
      beginAmnout: record.beginAmnout,
      calculateRate: record.calculateRate,
      minFeeAmount: record.minFeeAmount,
      maxFeeAmount: record.maxFeeAmount,
      roundFlag: expenseRult(record.roundFlag, 'roundFlag'),
      faultTolerantFlag: expenseRult(record.faultTolerantFlag, 'faultTolerantFlag'),
      faultTolerantAmount: record.faultTolerantAmount,
      constantAmount: record.constantAmount,
    })
  }
  const rendermodal = (a) => {
    if (a === '1') {
      return <Form onFinishFailed={onFinishFailed} onFinish={onFinish}>
        <Row gutter={16} style={{ borderBottom: '1px ,dashed,#BBBBBB' }}>
          <Col span={8} style={{ width: '30%' }} flex={1}>
            <Form.Item name="通道类型" label="通道类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onChange={addChannelTypeSel}>
                <Select.Option value="支付宝">支付宝</Select.Option>
                <Select.Option value="快钱">快钱</Select.Option>
                <Select.Option value="京东支付">京东支付</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="费率代码名称" label="费率代码名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onChange={addFeeNameSel}>
                <Select.Option value="信用卡支付服务费">信用卡支付服务费</Select.Option>
                <Select.Option value="花呗支付服务费">花呗支付服务费</Select.Option>
                <Select.Option value="技术服务费(花呗分期免息营销)">技术服务费(花呗分期免息营销)</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="收费方式" label="收费方式" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onChange={addFeeModeSel}>
                <Select.Option value="单笔收取">单笔收取</Select.Option>
                <Select.Option value="不收取">不收取</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {
            addFeeMode == '1' ?
              <>
                <Col span={8} style={{ width: '30%' }}>
                  <Form.Item name="费用计算依据" label="费用计算依据" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={addFeeCalculateModeSel}>
                      <Select.Option value="金额不分层">金额不分层</Select.Option>
                      <Select.Option value="按笔">按笔</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                {
                  addFeeCalculateMode === '1' ?
                    <>
                      <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="计算方法" label="计算方法" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                          <Select
                            placeholder="请选择"
                            style={{ width: '100%' }}
                            onChange={addFeeCalculateBaseFlagSel}>
                            <Select.Option value="按固定金额收取">按固定金额收取</Select.Option>
                            <Select.Option value="按金额固定百分比收取">按金额固定百分比收取</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      {
                        addFeeCalculateBaseFlag === '1' ?
                          <>
                            <Col span={8} style={{ width: '30%' }}>
                              <Form.Item name="固定金额" label="固定金额" style={{ width: '100%' }}>
                                <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addConstantAmountInp} />
                              </Form.Item>
                            </Col>
                            <Col span={8} style={{ width: '30%' }}>
                              <Form.Item name="四舍五入规则" label="四舍五入规则" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                <Select
                                  placeholder="请选择"
                                  style={{ width: '100%' }}
                                  onChange={addRoundFlagSel}>
                                  <Select.Option value="四舍五入">四舍五入</Select.Option>
                                  <Select.Option value="四舍五不入">四舍五不入</Select.Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8} style={{ width: '30%' }}>
                              <Form.Item name="容错方式" label="容错方式" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                <Select
                                  placeholder="请选择"
                                  style={{ width: '100%' }}
                                  onChange={addFaultTolerantFlagSel}>
                                  <Select.Option value="小于等于">小于等于</Select.Option>
                                  <Select.Option value="大于等于">大于等于</Select.Option>
                                  <Select.Option value="正负">正负</Select.Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8} style={{ width: '30%' }}>
                              <Form.Item name="容错值" label="容错值" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                <input type="text" style={{ width: '100%' }} placeholder="请输入数字" onChange={addFaultTolerantAmountInp} />
                              </Form.Item>
                            </Col>
                          </>
                          : addFeeCalculateBaseFlag === '2' ?
                            <>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="起始金额" label="起始金额" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addBeginAmnoutInp} />
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="固定费率" label="固定费率" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addCalculateRateInp} />
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="最低收费金额" label="最低收费金额" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addMinFeeAmountInp} />
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="最高收费金额" label="最高收费金额" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addMaxFeeAmountInp} />
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="四舍五入规则" label="四舍五入规则" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                  <Select
                                    placeholder="请选择"
                                    style={{ width: '100%' }}
                                    onChange={addRoundFlagSel}>
                                    <Select.Option value="四舍五入">四舍五入</Select.Option>
                                    <Select.Option value="四舍五不入">四舍五不入</Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="容错方式" label="容错方式" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                  <Select
                                    placeholder="请选择"
                                    style={{ width: '100%' }}
                                    onChange={addFaultTolerantFlagSel}>
                                    <Select.Option value="小于等于">小于等于</Select.Option>
                                    <Select.Option value="大于等于">大于等于</Select.Option>
                                    <Select.Option value="正负">正负</Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="容错值" label="容错值" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addFaultTolerantAmountInp} />
                                </Form.Item>
                              </Col>
                            </> : ''
                      }
                    </>
                    : addFeeCalculateMode === '2' ?
                      <>
                        <Col span={8} style={{ width: '30%' }}>
                          <Form.Item name="计算方法" label="计算方法" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                            <Select
                              placeholder="请选择"
                              style={{ width: '100%' }}
                              onChange={addFeeCalculateBaseFlagSel}>
                              <Select.Option value="按固定金额收取">按固定金额收取</Select.Option>
                              <Select.Option value="按金额固定百分比收取">按金额固定百分比收取</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        {
                          addFeeCalculateBaseFlag === '1' ?
                            <>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="固定金额" label="固定金额" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addConstantAmountInp} />
                                </Form.Item>
                              </Col>

                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="四舍五入规则" label="四舍五入规则" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                  <Select
                                    placeholder="请选择"
                                    style={{ width: '100%' }}
                                    onChange={addRoundFlagSel}>
                                    <Select.Option value="四舍五入">四舍五入</Select.Option>
                                    <Select.Option value="四舍五不入">四舍五不入</Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="容错方式" label="容错方式" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                  <Select
                                    placeholder="请选择"
                                    style={{ width: '100%' }}
                                    onChange={addFaultTolerantFlagSel}>
                                    <Select.Option value="小于等于">小于等于</Select.Option>
                                    <Select.Option value="大于等于">大于等于</Select.Option>
                                    <Select.Option value="正负">正负</Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="容错值" label="容错值" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入数字" onChange={addFaultTolerantAmountInp} />
                                </Form.Item>
                              </Col>
                            </>
                            : addFeeCalculateBaseFlag === '2' ?
                              <>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="起始金额" label="起始金额" style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addBeginAmnoutInp} />
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="固定费率" label="固定费率" style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addCalculateRateInp} />
                                  </Form.Item>
                                </Col>

                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="最低收费金额" label="最低收费金额" style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addMinFeeAmountInp} />
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="最高收费金额" label="最高收费金额" style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addMaxFeeAmountInp} />
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="四舍五入规则" label="四舍五入规则" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                    <Select
                                      placeholder="请选择"
                                      style={{ width: '100%' }}
                                      onChange={addRoundFlagSel}>
                                      <Select.Option value="四舍五入">四舍五入</Select.Option>
                                      <Select.Option value="四舍五不入">四舍五不入</Select.Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="容错方式" label="容错方式" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                    <Select
                                      placeholder="请选择"
                                      style={{ width: '100%' }}
                                      onChange={addFaultTolerantFlagSel}>
                                      <Select.Option value="小于等于">小于等于</Select.Option>
                                      <Select.Option value="大于等于">大于等于</Select.Option>
                                      <Select.Option value="正负">正负</Select.Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="容错值" label="容错值" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addFaultTolerantAmountInp} />
                                  </Form.Item>
                                </Col>
                              </> : ''
                        }
                      </> : ''
                }
              </> : addFeeMode == '0' ? '' : ''
          }
        </Row>
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
          channelType: record.channelType,
          feeName: record.feeName,
          feeMode: record.feeMode,
          feeCalculateMode: record.feeCalculateMode,
          feeCalculateBaseFlag: record.feeCalculateBaseFlag,
          beginAmnout: record.beginAmnout,
          calculateRate: record.calculateRate,
          minFeeAmount: record.minFeeAmount,
          maxFeeAmount: record.maxFeeAmount,
          roundFlag: record.roundFlag,
          faultTolerantFlag: record.faultTolerantFlag,
          faultTolerantAmount: record.faultTolerantAmount,
          constantAmount: record.constantAmount,
        }}
      >
        <Row gutter={16}>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="channelType" label="通道类型" style={{ width: '100%' }}>
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onChange={changChannelTypeSel}>
                <Select.Option value="支付宝">支付宝</Select.Option>
                <Select.Option value="快钱">快钱</Select.Option>
                <Select.Option value="京东支付">京东支付</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="feeName" label="费率代码名称" style={{ width: '100%' }}>
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onChange={changFeeNameSel}>
                <Select.Option value="信用卡支付服务费">信用卡支付服务费</Select.Option>
                <Select.Option value="花呗支付服务费">花呗支付服务费</Select.Option>
                <Select.Option value="技术服务费(花呗分期免息营销)">技术服务费(花呗分期免息营销)</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="feeMode" label="收费方式" style={{ width: '100%' }}>
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onChange={changFeeModeSel}>
                <Select.Option value="单笔收取">单笔收取</Select.Option>
                <Select.Option value="不收取">不收取</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {
            changFeeMode == '1' ?
              <>
                <Col span={8} style={{ width: '30%' }}>
                  <Form.Item name="feeCalculateMode" label="费用计算依据" style={{ width: '100%' }}>
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={changFeeCalculateModeSel}>
                      <Select.Option value="金额不分层">金额不分层</Select.Option>
                      <Select.Option value="按笔">按笔</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                {
                  changFeeCalculateMode === '1' ?
                    <>
                      <Col span={8} style={{ width: '30%' }}>
                        <Form.Item name="feeCalculateBaseFlag" label="计算方法" style={{ width: '100%' }}>
                          <Select
                            placeholder="请选择"
                            style={{ width: '100%' }}
                            onChange={changFeeCalculateBaseFlagSel}>
                            <Select.Option value="按固定金额收取">按固定金额收取</Select.Option>
                            <Select.Option value="按金额固定百分比收取">按金额固定百分比收取</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      {
                        changFeeCalculateBaseFlag === '1' ?
                          <>
                            <Col span={8} style={{ width: '30%' }}>
                              <Form.Item name="constantAmount" label="固定金额" style={{ width: '100%' }}>
                                <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changConstantAmountInp} />
                              </Form.Item>
                            </Col>

                            <Col span={8} style={{ width: '30%' }}>
                              <Form.Item name="roundFlag" label="四舍五入规则" style={{ width: '100%' }} >
                                <Select
                                  placeholder="请选择"
                                  style={{ width: '100%' }}
                                  onChange={changRoundFlagSel}>
                                  <Select.Option value="四舍五入">四舍五入</Select.Option>
                                  <Select.Option value="四舍五不入">四舍五不入</Select.Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8} style={{ width: '30%' }}>
                              <Form.Item name="faultTolerantFlag" label="容错方式" style={{ width: '100%' }}>
                                <Select
                                  placeholder="请选择"
                                  style={{ width: '100%' }}
                                  onChange={changFaultTolerantFlagSel}>
                                  <Select.Option value="小于等于">小于等于</Select.Option>
                                  <Select.Option value="大于等于">大于等于</Select.Option>
                                  <Select.Option value="正负">正负</Select.Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8} style={{ width: '30%' }}>
                              <Form.Item name="faultTolerantAmount" label="容错值" style={{ width: '100%' }}>
                                <input type="text" style={{ width: '100%' }} placeholder="请输入数字" onChange={changFaultTolerantAmountInp} />
                              </Form.Item>
                            </Col>
                          </>
                          : changFeeCalculateBaseFlag === '2' ?
                            <>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="beginAmnout" label="起始金额" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changBeginAmnoutInp} />
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="calculateRate" label="固定费率" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changCalculateRateInp} />
                                </Form.Item>
                              </Col>

                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="minFeeAmount" label="最低收费金额" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changMinFeeAmountInp} />
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="maxFeeAmount" label="最高收费金额" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changMaxFeeAmountInp} />
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="roundFlag" label="四舍五入规则" style={{ width: '100%' }}>
                                  <Select
                                    placeholder="请选择"
                                    style={{ width: '100%' }}
                                    onChange={changRoundFlagSel}>
                                    <Select.Option value="四舍五入">四舍五入</Select.Option>
                                    <Select.Option value="四舍五不入">四舍五不入</Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="faultTolerantFlag" label="容错方式" style={{ width: '100%' }}>
                                  <Select
                                    placeholder="请选择"
                                    style={{ width: '100%' }}
                                    onChange={changFaultTolerantFlagSel}>
                                    <Select.Option value="小于等于">小于等于</Select.Option>
                                    <Select.Option value="大于等于">大于等于</Select.Option>
                                    <Select.Option value="正负">正负</Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="faultTolerantAmount" label="容错值" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changFaultTolerantAmountInp} />
                                </Form.Item>
                              </Col>
                            </> : ''
                      }
                    </>
                    : changFeeCalculateMode === '2' ?
                      <>
                        <Col span={8} style={{ width: '30%' }}>
                          <Form.Item name="feeCalculateBaseFlag" label="计算方法" style={{ width: '100%' }}>
                            <Select
                              placeholder="请选择"
                              style={{ width: '100%' }}
                              onChange={changFeeCalculateBaseFlagSel}>
                              <Select.Option value="按固定金额收取">按固定金额收取</Select.Option>
                              <Select.Option value="按金额固定百分比收取">按金额固定百分比收取</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        {
                          changFeeCalculateBaseFlag === '1' ?
                            <>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="constantAmount" label="固定金额" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changConstantAmountInp} />
                                </Form.Item>
                              </Col>

                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="roundFlag" label="四舍五入规则" style={{ width: '100%' }}>
                                  <Select
                                    placeholder="请选择"
                                    style={{ width: '100%' }}
                                    onChange={changRoundFlagSel}>
                                    <Select.Option value="四舍五入">四舍五入</Select.Option>
                                    <Select.Option value="四舍五不入">四舍五不入</Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="faultTolerantFlag" label="容错方式" style={{ width: '100%' }}>
                                  <Select
                                    placeholder="请选择"
                                    style={{ width: '100%' }}
                                    onChange={changFaultTolerantFlagSel}>
                                    <Select.Option value="小于等于">小于等于</Select.Option>
                                    <Select.Option value="大于等于">大于等于</Select.Option>
                                    <Select.Option value="正负">正负</Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <Form.Item name="faultTolerantAmount" label="容错值" style={{ width: '100%' }}>
                                  <input type="text" style={{ width: '100%' }} placeholder="请输入数字" onChange={changFaultTolerantAmountInp} />
                                </Form.Item>
                              </Col>
                            </>
                            : changFeeCalculateBaseFlag === '2' ?
                              <>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="beginAmnout" label="起始金额" style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changBeginAmnoutInp} />
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="calculateRate" label="固定费率" style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changCalculateRateInp} />
                                  </Form.Item>
                                </Col>

                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="minFeeAmount" label="最低收费金额" style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changMinFeeAmountInp} />
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="maxFeeAmount" label="最高收费金额" style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changMaxFeeAmountInp} />
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="roundFlag" label="四舍五入规则" style={{ width: '100%' }}>
                                    <Select
                                      placeholder="请选择"
                                      style={{ width: '100%' }}
                                      onChange={changRoundFlagSel}>
                                      <Select.Option value="四舍五入">四舍五入</Select.Option>
                                      <Select.Option value="四舍五不入">四舍五不入</Select.Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="faultTolerantFlag" label="容错方式" style={{ width: '100%' }}>
                                    <Select
                                      placeholder="请选择"
                                      style={{ width: '100%' }}
                                      onChange={changFaultTolerantFlagSel}>
                                      <Select.Option value="小于等于">小于等于</Select.Option>
                                      <Select.Option value="大于等于">大于等于</Select.Option>
                                      <Select.Option value="正负">正负</Select.Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <Form.Item name="faultTolerantAmount" label="容错值" style={{ width: '100%' }}>
                                    <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changFaultTolerantAmountInp} />
                                  </Form.Item>
                                </Col>
                              </> : ''
                        }
                      </> : ''
                }
              </>
              : changFeeMode == '2' ? '' : ''
          }

        </Row>
        <Form.Item
          wrapperCol={{
            offset: 16,
            span: 16,
          }}
          style={{ marginTop: '20px' }}
        >
          <Button type="primary" onClick={handleCancel} maxWidth="650px" style={{ marginRight: '20px' }}>取消</Button>
          <Button type="primary" onClick={handleOk} htmlType="submit" maxWidth="650px">
            确定
          </Button>
        </Form.Item>
      </Form>
    } else if (a === '3') {
      return <Form>
        <Row gutter={[16, 16]}>
          <Col span={8} style={{ width: '30%' }}>
            <span>费率代码:</span><span>
              {tabDetail ? tabDetail.id : ''}</span>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <span>通道类型:</span><span>
              {tabDetail ? expenseRult(tabDetail.channelType, 'channelType') : ''}</span>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <span>费率代码名称:</span><span>{tabDetail ? tabDetail.feeName : ''}</span>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <span>收费方式:</span><span>
              {tabDetail ? expenseRult(tabDetail.feeMode, 'feeMode') : ''}</span>
          </Col>
          {
            tabDetail ? tabDetail.feeMode == '1' ?
              <>
                <Col span={8} style={{ width: '30%' }}>
                  <span>费用计算依据:</span><span>
                    {tabDetail ? expenseRult(tabDetail.feeCalculateMode, 'feeCalculateMode') : ''}</span>
                </Col>
                {
                  tabDetail.feeCalculateMode == '1' ?
                    <>
                      <Col span={8} style={{ width: '30%' }}>
                        <span>计算方法:</span><span>
                          {tabDetail ? expenseRult(tabDetail.feeCalculateBaseFlag, 'feeCalculateBaseFlag') : ''}</span>
                      </Col>
                      {
                        tabDetail.feeCalculateBaseFlag == '1' ?
                          <>
                            <Col span={8} style={{ width: '30%' }}>
                              <span>固定金额:</span><span>{tabDetail ? tabDetail.constantAmount : ''}</span>
                            </Col>

                            <Col span={8} style={{ width: '30%' }}>
                              <span>四舍五入规则:</span><span>
                                {tabDetail ? expenseRult(tabDetail.roundFlag, 'roundFlag') : ''}</span>
                            </Col>
                            <Col span={8} style={{ width: '30%' }}>
                              <span>容错方式:</span><span>
                                {tabDetail ? expenseRult(tabDetail.faultTolerantFlag, 'faultTolerantFlag') : ''}</span>
                            </Col>
                            <Col span={8} style={{ width: '30%' }}>
                              <span>容错值:</span><span>{tabDetail ? tabDetail.faultTolerantAmount : ''}</span>
                            </Col>
                          </>
                          : tabDetail.feeCalculateBaseFlag == '2' ?
                            <>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>起始金额:</span><span>{tabDetail ? tabDetail.beginAmnout : ''}</span>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>固定费率:</span><span>{tabDetail ? tabDetail.calculateRate : ''}</span>
                              </Col>

                              <Col span={8} style={{ width: '30%' }}>
                                <span>最低收费金额:</span><span>{tabDetail ? tabDetail.minFeeAmount : ''}</span>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>最高收费金额:</span><span>{tabDetail ? tabDetail.maxFeeAmount : ''}</span>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>四舍五入规则:</span><span>
                                  {tabDetail ? expenseRult(tabDetail.roundFlag, 'roundFlag') : ''}</span>

                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>容错方式:</span><span>
                                  {tabDetail ? expenseRult(tabDetail.faultTolerantFlag, 'faultTolerantFlag') : ''}</span>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>容错值:</span><span>{tabDetail ? tabDetail.faultTolerantAmount : ''}</span>
                              </Col>
                            </> : ''
                      }
                    </>
                    : tabDetail.feeCalculateMode == '2' ?
                      <>
                        <Col span={8} style={{ width: '30%' }}>
                          <span>计算方法:</span><span>
                            {tabDetail ? expenseRult(tabDetail.feeCalculateBaseFlag, 'feeCalculateBaseFlag') : ''}</span>
                        </Col>
                        {
                          tabDetail.feeCalculateBaseFlag == '1' ?
                            <>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>固定金额:</span><span>{tabDetail ? tabDetail.constantAmount : ''}</span>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>四舍五入规则:</span><span>
                                  {tabDetail ? expenseRult(tabDetail.roundFlag, 'roundFlag') : ''}</span>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>容错方式:</span><span>
                                  {tabDetail ? expenseRult(tabDetail.faultTolerantFlag, 'faultTolerantFlag') : ''}</span>
                              </Col>
                              <Col span={8} style={{ width: '30%' }}>
                                <span>容错值:</span><span>{tabDetail ? tabDetail.faultTolerantAmount : ''}</span>
                              </Col>
                            </>
                            : tabDetail.feeCalculateBaseFlag == '2' ?
                              <>
                                <Col span={8} style={{ width: '30%' }}>
                                  <span>起始金额:</span><span>{tabDetail ? tabDetail.beginAmnout : ''}</span>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <span>固定费率:</span><span>{tabDetail ? tabDetail.calculateRate : ''}</span>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <span>最低收费金额:</span><span>{tabDetail ? tabDetail.minFeeAmount : ''}</span>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <span>最高收费金额:</span><span>{tabDetail ? tabDetail.maxFeeAmount : ''}</span>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <span>四舍五入规则:</span><span>
                                    {tabDetail ? expenseRult(tabDetail.roundFlag, 'roundFlag') : ''}</span>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <span>容错方式:</span><span>
                                    {tabDetail ? expenseRult(tabDetail.faultTolerantFlag, 'faultTolerantFlag') : ''}</span>
                                </Col>
                                <Col span={8} style={{ width: '30%' }}>
                                  <span>容错值:</span><span>{tabDetail ? tabDetail.faultTolerantAmount : ''}</span>
                                </Col>
                              </> : ''
                        }
                      </> : ''
                }
              </> : tabDetail.feeMode == '0' ? '' : '' : ''
          }
        </Row>
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
    }
  }
  //表单提交成功
  const onFinish = async () => {
    let params = {
      tellerNo: tellerNo,
      channelType: addChannel,
      feeName: addFeeName,
      feeMode: addFeeMode,
      feeCalculateMode: addFeeCalculateMode,
      feeCalculateBaseFlag: addFeeCalculateBaseFlag,
      beginAmnout: addBeginAmnout,
      calculateRate: addCalculateRate,
      minFeeAmount: addMinFeeAmount,
      maxFeeAmount: addMaxFeeAmount,
      roundFlag: addRoundFlag,
      faultTolerantFlag: addFaultTolerantFlag,
      faultTolerantAmount: addFaultTolerantAmount,
      constantAmount: addConstantAmount,
    }
    const res = await addCostPageList(params)
    actionRef.current.reload()
    if (res.success) {
      openNotification('添加成功')
      setIsModalVisible(false);
    } else {
      openNotification(res.errorMsg)
      setIsModalVisible(false)
    }
    setAddFeeMode()
    setAddFeeCalculateMode()
  };
  //表单提交失败
  const onFinishFailed = () => {
    setIsModalVisible(true);
  };
  //弹框确定
  const handleOk = async () => {
    if (a === '2') {
      let params = {
        tellerNo: tellerNo,
        id: changId,
        channelType: changChannelType,
        feeName: changFeeName,
        feeMode: changFeeMode,
        feeCalculateMode: changFeeCalculateMode,
        feeCalculateBaseFlag: changFeeCalculateBaseFlag,
        beginAmnout: changBeginAmnout,
        calculateRate: changCalculateRate,
        minFeeAmount: changMinFeeAmount,
        maxFeeAmount: changMaxFeeAmount,
        roundFlag: changRoundFlag,
        faultTolerantFlag: changFaultTolerantFlag,
        faultTolerantAmount: changFaultTolerantAmount,
        constantAmount: changConstantAmount,
      }
      const res = await changCostPageList(params)
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
    }
  };
  //添加修改错误弹框
  const openNotification = (errorvalue) => {
    notification.open({
      duration: 5,
      description:
        errorvalue
    });
  }
  //弹框取消
  const handleCancel = () => {
    setIsModalVisible(false);
    setAddFeeMode()
    setAddFeeCalculateMode()
  };
  return (
    <div className={styles.box}>
      <div className={styles.proTableSearch}>
        <div>
          <b>费用规则浏览</b>
        </div>
      </div>
      <ProTable columns={columns}
        request={async (params, sort, filter) => {
          let postData = {
            pageNum: params.current, pageSize: params.pageSize, tellerNo: tellerNo, channelType: params.channelType,
            masterJobDsId: params.masterJobDsName,
            secondaryJobDsId: params.secondaryJobDsName
          }
          try {
            const res = await getCostPageList(postData);
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
        rowKey="key"
        pagination={{
          pageSize: 20,
        }} search={{
          filterType: 'light',
        }} dateFormatter="string" headerTitle="通道类型" toolBarRender={() => [
          <Button key="button" onClick={() => look('1')} icon={<PlusOutlined />} type="primary">
            新建
          </Button>
        ]} />
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
export default connect(mapStateToProps, mapDispatchToProps)(CostMaintenance);