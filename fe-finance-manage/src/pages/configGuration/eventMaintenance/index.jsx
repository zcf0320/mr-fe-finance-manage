import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss'
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
import { accountingList, accountingDelete, accountingSee, accountingAdd, accountingModify } from '@api/eventMaintance'
import eventMain from '../../../enumeration/eventMain'
import { Button, Space, Select, Modal, notification, Input, Form, Row, Col } from 'antd'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
const eventMaintance = (props) => {
  const { cacheUser, userInfo } = props;
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eventid, seteventId] = useState()//删除
  const [eventDetail, setEventDetail] = useState()
  const [operation, setOperation] = useState();
  const [a, setA] = useState("0")
  const [tellerNo, setTellerNo] = useState(userInfo.username)
  //添加业务场景
  const [businessMode, setBusinessMode] = useState()
  //添加
  const [addEventNumber, setAddEventNumber] = useState()
  const [addSeriaNumber, setAddSeriaNumber] = useState()
  const [addBusNumber, setAddBusNumber] = useState()
  const [addInstiution, setAddInstiution] = useState()
  const [addAccountNumber, setAddAccountNumber] = useState()
  const [addThrAccountNumber, setAddThrAccountNumber] = useState()
  const [addAddDebit, setAddDebit] = useState()
  const [addAmountType, setAmountType] = useState()
  const [addCurrency, setAddCurrency] = useState()
  const [addAcounts, setAddAcounts] = useState()
  const [addDescribe, setAddDescribe] = useState()

  //修改
  const [form] = Form.useForm();
  const [record, setRecord] = useState()
  const [changeEventNo, setChangeEventNo] = useState()
  const [changeSerialNumber, setChangeSerialNumber] = useState()
  const [changeBusinessScenario, setChangeBusinessScenario] = useState()
  const [changeOrgNo, setChangeOrgNo] = useState()
  const [changeSubjectNo, setChangeSubjectNo] = useState()
  const [changeThreeSubjectNo, setChangeThreeSubjectNo] = useState()
  const [changeDrccFlag, setChangeDrcrFlag] = useState()
  const [changeAmtType, setChangeAmtType] = useState()
  const [changeCcy, setChangeCcy] = useState()
  const [changeTargetAccountNo, setChangeTargetAccountNo] = useState()
  const [changeEventDesc, setChangeEventDesc] = useState()

  //弹框确认
  const handleOk = async () => {
    if (a === '3') {
      let params = {
        tellerNo: tellerNo,
        id: eventid,
      }
      let res = await accountingDelete(params)
      if (res.success) {
        openNotification('删除成功')
        setIsModalVisible(false);
        actionRef.current.reload()
      } else {
        openNotification(res.errorMsg)
      }
    } else if (a === '4') {
      setIsModalVisible(false);
    } else if (a === '2') {
      let params = {
        id: eventid,
        tellerNo: tellerNo,
        eventNo: changeEventNo,
        serialNumber: changeSerialNumber,
        businessScenario: changeBusinessScenario,
        orgNo: changeOrgNo,
        subjectNo: changeSubjectNo,
        threeSubjectNo: changeThreeSubjectNo,
        drcrFlag: changeDrccFlag,
        amtType: changeAmtType,
        ccy: changeCcy,
        targetAccountNo: changeTargetAccountNo,
        eventDesc: changeEventDesc,

      }
      let res = await accountingModify(params)
      actionRef.current.reload()
      if (res.success) {
        openNotification('修改成功')
        setIsModalVisible(false);
      } else {
        openNotification(res.errorMsg)
        setIsModalVisible(false)
      }
    }
  };
  //弹框取消
  const handleCancel = () => {
    setBusinessMode()
    setIsModalVisible(false);
  };

  //弹框判断
  const look = (a) => {
    if (a === "1") {
      setOperation("新增会计事件规则维护");
      setA(a)
    } else if (a === "2") {
      setOperation("修改会计事件规则维护");
      setA(a)
    } else if (a === "3") {
      setOperation("删除会计事件规则维护");
      setA(a)
    } else if (a === "4") {
      setOperation("查看会计事件规则维护")
      setA(a)
    }
    setIsModalVisible(true);
  };
  //错误弹框
  const openNotification = (errorMsg) => {
    notification.open({
      duration: 3,
      description: errorMsg
    });
  }
  //添加业务场景
  const addBusinessScenario = (e) => {
    if (e === 'OMS') {
      setBusinessMode('1')
      setAddBusNumber('1')

    } else if (e === '供应链') {
      setBusinessMode('2')
      setAddBusNumber('2')
    }
  }
  //表单提交成功
  const onFinish = async () => {
    let params = {
      tellerNo: tellerNo,
      eventNo: addEventNumber,
      serialNumber: addSeriaNumber,
      businessScenario: addBusNumber,
      orgNo: addInstiution,
      subjectNo: addAccountNumber,
      threeSubjectNo: addThrAccountNumber,
      drcrFlag: addAddDebit,
      amtType: addAmountType,
      ccy: addCurrency,
      targetAccountNo: addAcounts,
      eventDesc: addDescribe,

    }
    const res = await accountingAdd(params)
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
  //添加会计编号
  const addeventNumber = (e) => {
    setAddEventNumber(e.target.value)
  }
  //添加业务序号
  const addseriaNumber = (e) => {
    setAddSeriaNumber(e.target.value)
  }
  //添加机构号
  const addinstiution = (e) => {
    setAddInstiution(e.target.value)
  }
  //添加科目号
  const addaccountNumber = (e) => {
    setAddAccountNumber(e.target.value)
  }

  //添加三级科目号
  const addthraccountNumber = (e) => {
    setAddThrAccountNumber(e.target.value)
  }
  //添加借贷标识
  const addDebit = (e) => {
    if (e === '借') {
      setAddDebit('dr')
    } else if (e === '贷') {
      setAddDebit('cr')
    }
  }
  //添加金额类型
  const amountType = (e) => {
    if (e === '应收账款-待清算') {
      setAmountType('1')
    } else if (e === '应收账款-待清算-平台') {
      setAmountType('2')
    } else if (e === '预收账款') {
      setAmountType('3')
    } else if (e === '主营业务收入-药品') {
      setAmountType('4')
    } else if (e === '主营业务收入-医疗器械') {
      setAmountType('5')
    } else if (e === '主营业务收入-非药非器械') {
      setAmountType('6')
    } else if (e === '增值税') {
      setAmountType('7')
    } else if (e === '库存商品') {
      setAmountType('8')
    } else if (e === '应收账款-已清算') {
      setAmountType('9')
    } else if (e === '销售费用-通道费') {
      setAmountType('10')
    } else if (e === '财务费用-手续费') {
      setAmountType('11')
    } else if (e === '银行存款-企业存款') {
      setAmountType('12')
    } else if (e === '其他货币-企业存款') {
      setAmountType('13')
    } else if (e === '商品销售数量') {
      setAmountType('15')
    } else if (e === '主营业务收入-佣金收入') {
      setAmountType('16')
    } else if (e === '库存商品-医疗器械') {
      setAmountType('1')
    } else if (e === '库存商品-非药非器械') {
      setAmountType('2')
    } else if (e === '应收账款-采购折扣款项') {
      setAmountType('3')
    } else if (e === '应付账款-暂估') {
      setAmountType('4')
    } else if (e === '应交税费-增值税(销项税)') {
      setAmountType('5')
    } else if (e === '应付账款-商品货款') {
      setAmountType('6')
    } else if (e === '库存商品-药品') {
      setAmountType('7')
    } else if (e === '主营业务成本-采购商品成本-药品') {
      setAmountType('8')
    } else if (e === '主营业务成本-采购商品成本-器械') {
      setAmountType('9')
    } else if (e === '主营业务成本-采购商品成本-非药非器械') {
      setAmountType('10')
    }
  }
  //添加币种
  const addcurrency = (e) => {
    if (e === '人民币') {
      setAddCurrency('156')
    }
  }
  //添加对方账户
  const addacounts = (e) => {
    setAddAcounts(e.target.value)
  }
  //添加备注
  const adddescribe = (e) => {
    setAddDescribe(e.target.value)
  }
  //修改业务场景
  const changeModify = (e) => {
    if (e === 'OMS') {
      setChangeBusinessScenario('1')
    } else if (e === '供应链') {
      setChangeBusinessScenario('2')
    }
  }
  //修改会计编号
  const modifyeventNumber = (e) => {
    setChangeEventNo(e.target.value)
  }
  //修改业务序号
  const modifyseriaNumber = (e) => {
    setChangeSerialNumber(e.target.value)
  }
  //修改机构号
  const modifyinstiution = (e) => {
    setChangeOrgNo(e.target.value)
  }
  //修改科目号
  const modifyaccountNumber = (e) => {
    setChangeSubjectNo(e.target.value)
  }

  //修改三级科目号
  const modifythraccountNumber = (e) => {
    setChangeThreeSubjectNo(e.target.value)
  }
  //修改借贷标识
  const modifyDebit = (e) => {
    if (e === '借') {
      setChangeDrcrFlag('dr')
    } else if (e === '贷') {
      setChangeDrcrFlag('cr')
    }
  }
  //修改金额类型
  const modifyamountType = (e) => {
    if (e === '应收账款-待清算') {
      setChangeAmtType('1')
    } else if (e === '应收账款-待清算-平台') {
      setChangeAmtType('2')
    } else if (e === '预收账款') {
      setChangeAmtType('3')
    } else if (e === '主营业务收入-药品') {
      setChangeAmtType('4')
    } else if (e === '主营业务收入-医疗器械') {
      setChangeAmtType('5')
    } else if (e === '主营业务收入-非药非器械') {
      setChangeAmtType('6')
    } else if (e === '增值税') {
      setChangeAmtType('7')
    } else if (e === '库存商品') {
      setChangeAmtType('8')
    } else if (e === '应收账款-已清算') {
      setChangeAmtType('9')
    } else if (e === '销售费用-通道费') {
      setChangeAmtType('10')
    } else if (e === '财务费用-手续费') {
      setChangeAmtType('11')
    } else if (e === '银行存款-企业存款') {
      setChangeAmtType('12')
    } else if (e === '其他货币-企业存款') {
      setChangeAmtType('13')
    } else if (e === '商品销售数量') {
      setChangeAmtType('15')
    } else if (e === '主营业务收入-佣金收入') {
      setChangeAmtType('16')
    } else if (e === '库存商品-医疗器械') {
      setChangeAmtType('1')
    } else if (e === '库存商品-非药非器械') {
      setChangeAmtType('2')
    } else if (e === '应收账款-采购折扣款项') {
      setChangeAmtType('3')
    } else if (e === '应付账款-暂估') {
      setChangeAmtType('4')
    } else if (e === '应交税费-增值税(销项税)') {
      setChangeAmtType('5')
    } else if (e === '应付账款-商品货款') {
      setChangeAmtType('6')
    } else if (e === '库存商品-药品') {
      setChangeAmtType('7')
    } else if (e === '主营业务成本-采购商品成本-药品') {
      setChangeAmtType('8')
    } else if (e === '主营业务成本-采购商品成本-器械') {
      setChangeAmtType('9')
    } else if (e === '主营业务成本-采购商品成本-非药非器械') {
      setChangeAmtType('10')
    }
  }
  //修改币种
  const modifycurrency = (e) => {
    if (e === '人民币') {
      setChangeCcy('156')
    }
  }
  //修改对方账户
  const modifyacounts = (e) => {
    setChangeTargetAccountNo(e.target.value)
  }
  //修改描述
  const modifydescribe = (e) => {
    setChangeEventDesc(e.target.value)
  }
  const rendermodal = (a) => {
    if (a === '1') {
      return <Form onFinishFailed={onFinishFailed} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="会计事件编号" label="会计事件编号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addeventNumber(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="业务序号" label="业务序号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addseriaNumber(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="业务场景" label="业务场景" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addBusinessScenario}
              >
                <Select.Option value="OMS">OMS</Select.Option>
                <Select.Option value="供应链">供应链</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="机构号" label="机构号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addinstiution(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="科目号" label="科目号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addaccountNumber(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="三级科目序号" label="三级科目序号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addthraccountNumber(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="借贷标识" label="借贷标识" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addDebit}
              >
                <Select.Option value="借">借</Select.Option>
                <Select.Option value="贷">贷</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {
            businessMode == '1' ?
              <>
                <Col span={10} style={{ width: '40%' }}>
                  <Form.Item name="金额类型" label="金额类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onSelect={amountType}
                    >
                      <Select.Option value="应收账款-待清算-平台">应收账款-待清算-平台</Select.Option>
                      <Select.Option value="应收账款-待清算">应收账款-待清算</Select.Option>
                      <Select.Option value="预收账款">预收账款</Select.Option>
                      <Select.Option value="主营业务收入-药品">主营业务收入-药品</Select.Option>
                      <Select.Option value="主营业务收入-医疗器械">主营业务收入-医疗器械</Select.Option>
                      <Select.Option value="主营业务收入-非药非器械">主营业务收入-非药非器械</Select.Option>
                      <Select.Option value="增值税">增值税</Select.Option>
                      <Select.Option value="库存商品">库存商品</Select.Option>
                      <Select.Option value="应收账款-已清算">应收账款-已清算</Select.Option>
                      <Select.Option value="销售费用-通道费">销售费用-通道费</Select.Option>
                      <Select.Option value="财务费用-手续费">财务费用-手续费</Select.Option>
                      <Select.Option value="银行存款-企业存款">银行存款-企业存款</Select.Option>
                      <Select.Option value="其他货币-企业存款">其他货币-企业存款</Select.Option>
                      <Select.Option value="商品销售数量">商品销售数量</Select.Option>
                      <Select.Option value="主营业务收入-佣金收入">主营业务收入-佣金收入</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </> : businessMode == '2' ? <>
                <Col span={10} style={{ width: '40%' }}>
                  <Form.Item name="金额类型" label="金额类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onSelect={amountType}>
                      <Select.Option value="库存商品-医疗器械">库存商品-医疗器械</Select.Option>
                      <Select.Option value="库存商品-非药非器械">库存商品-非药非器械</Select.Option>
                      <Select.Option value="应收账款-采购折扣款项">应收账款-采购折扣款项</Select.Option>
                      <Select.Option value="应收账款-暂估">应收账款-暂估</Select.Option>
                      <Select.Option value="应交税费-增值税(销项税)">应交税费-增值税(销项税)</Select.Option>
                      <Select.Option value="应付账款-商品货款">应付账款-商品货款</Select.Option>
                      <Select.Option value="库存商品-药品">库存商品-药品</Select.Option>
                      <Select.Option value="主营业务成本-采购商品成本-药品">主营业务成本-采购商品成本-药品</Select.Option>
                      <Select.Option value="主营业务成本-采购商品成本-器械">主营业务成本-采购商品成本-器械</Select.Option>
                      <Select.Option value="主营业务成本-采购商品成本-非药非器械">主营业务成本-采购商品成本-非药非器械</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </> : ''
          }
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="币种" label="币种" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addcurrency}
              >
                <Select.Option value="人民币">人民币</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="对方账户" label="对方账户" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addacounts(e)} />
            </Form.Item>
          </Col>
          <Col span={10} style={{ width: '40%' }}>
            <Form.Item name="描述" label="描述" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => adddescribe(e)} />
            </Form.Item>
          </Col>
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
    } else if (a === '2') {
      return <Form form={form}
        initialValues={{
          eventNo: record.eventNo,
          serialNumber: record.serialNumber,
          businessScenario: record.businessScenario,
          orgNo: record.orgNo,
          subjectNo: record.subjectNo,
          threeSubjectNo: record.threeSubjectNo,
          drcrFlag: record.drcrFlag,
          amtType: record.amtType,
          ccy: record.ccy,
          targetAccountNo: record.targetAccountNo,
          eventDesc: record.eventDesc,
        }}>
        <Row gutter={24}>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="eventNo" label="会计事件编号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => modifyeventNumber(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="serialNumber" label="业务序号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => modifyseriaNumber(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="businessScenario" label="业务场景" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changeModify}>
                <Select.Option value="OMS">OMS</Select.Option>
                <Select.Option value="供应链">供应链</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="orgNo" label="机构号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => modifyinstiution(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="subjectNo" label="科目号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => modifyaccountNumber(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="threeSubjectNo" label="三级科目序号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => modifythraccountNumber(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="drcrFlag" label="借贷标识" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={modifyDebit}>
                <Select.Option value="借">借</Select.Option>
                <Select.Option value="贷">贷</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {
            changeBusinessScenario == '1' ?
              <>
                <Col span={10} style={{ width: '40%' }}>
                  <Form.Item name="amtType" label="金额类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onSelect={modifyamountType}>
                      <Select.Option value="应收账款-待清算-平台">应收账款-待清算-平台</Select.Option>
                      <Select.Option value="应收账款-待清算">应收账款-待清算</Select.Option>
                      <Select.Option value="预收账款">预收账款</Select.Option>
                      <Select.Option value="主营业务收入-药品">主营业务收入-药品</Select.Option>
                      <Select.Option value="主营业务收入-医疗器械">主营业务收入-医疗器械</Select.Option>
                      <Select.Option value="主营业务收入-非药非器械">主营业务收入-非药非器械</Select.Option>
                      <Select.Option value="增值税">增值税</Select.Option>
                      <Select.Option value="库存商品">库存商品</Select.Option>
                      <Select.Option value="应收账款-已清算">应收账款-已清算</Select.Option>
                      <Select.Option value="销售费用-通道费">销售费用-通道费</Select.Option>
                      <Select.Option value="财务费用-手续费">财务费用-手续费</Select.Option>
                      <Select.Option value="银行存款-企业存款">银行存款-企业存款</Select.Option>
                      <Select.Option value="其他货币-企业存款">其他货币-企业存款</Select.Option>
                      <Select.Option value="商品销售数量">商品销售数量</Select.Option>
                      <Select.Option value="主营业务收入-佣金收入">主营业务收入-佣金收入</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </> : changeBusinessScenario == '2' ? <>
                <Col span={10} style={{ width: '40%' }}>
                  <Form.Item name="amtType" label="金额类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onSelect={modifyamountType}>
                      <Select.Option value="库存商品-医疗器械">库存商品-医疗器械</Select.Option>
                      <Select.Option value="库存商品-非药非器械">库存商品-非药非器械</Select.Option>
                      <Select.Option value="应收账款-采购折扣款项">应收账款-采购折扣款项</Select.Option>
                      <Select.Option value="应收账款-暂估">应收账款-暂估</Select.Option>
                      <Select.Option value="应交税费-增值税(销项税)">应交税费-增值税(销项税)</Select.Option>
                      <Select.Option value="应付账款-商品货款">应付账款-商品货款</Select.Option>
                      <Select.Option value="库存商品-药品">库存商品-药品</Select.Option>
                      <Select.Option value="主营业务成本-采购商品成本-药品">主营业务成本-采购商品成本-药品</Select.Option>
                      <Select.Option value="主营业务成本-采购商品成本-器械">主营业务成本-采购商品成本-器械</Select.Option>
                      <Select.Option value="主营业务成本-采购商品成本-非药非器械">主营业务成本-采购商品成本-非药非器械</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </> : ''
          }
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="ccy" label="币种" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={modifycurrency}
              >
                <Select.Option value="人民币">人民币</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="targetAccountNo" label="对方账户" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => modifyacounts(e)} />
            </Form.Item>
          </Col>
          <Col span={10} style={{ width: '40%' }}>
            <Form.Item name="eventDesc" label="描述" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => modifydescribe(e)} />
            </Form.Item>
          </Col>
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
    } else if (a === '3') {
      return <div>
        确定删除该条会计事件维护信息吗？
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
      </div>
    } else if (a === '4') {
      return <div>
        <Form>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <span>会计事件编号:</span>
              <span>{eventDetail ? eventDetail.eventNo : ''}</span>
            </Col>
            <Col span={8}>
              <span>业务序号:</span>
              <span>{eventDetail ? eventDetail.serialNumber : ''}</span>
            </Col>
            <Col span={8}>
              <span>业务场景:</span>
              <span>{eventDetail ? eventMain(eventDetail.businessScenario, 'businessScenario') : ''}</span>
            </Col>
            <Col span={8}>
              <span>机构号:</span>
              <span>{eventDetail ? eventDetail.orgNo : ''}</span>
            </Col>
            <Col span={8}>
              <span>科目号:</span>
              <span>{eventDetail ? eventDetail.subjectNo : ''}</span>
            </Col>
            <Col span={8}>
              <span>科目名称:</span>
              <span>{eventDetail ? eventDetail.subjectName : ''}</span>
            </Col>
            <Col span={8}>
              <span>三级科目序号:</span>
              <span>{eventDetail ? eventDetail.threeSubjectNo : ''}</span>
            </Col>
            <Col span={8}>
              <span>借贷标识:</span>
              <span>{eventDetail ? eventMain(eventDetail.drcrFlag, 'drcrFlag') : ''}</span>
            </Col>

            <Col span={8}>
              <span>金额类型:</span>
              <span>{eventDetail ? eventMain(eventDetail.amtType, 'amtType') : ''}</span>
            </Col>
            <Col span={8}>
              <span>币种:</span>
              <span>{eventDetail ? eventMain(eventDetail.ccy, 'ccy') : ''}</span>
            </Col>
            <Col span={8}>
              <span>对方账号:</span>
              <span>{eventDetail ? eventDetail.targetAccountNo : ''}</span>
            </Col>
            <Col span={8}>
              <span>描述:</span>
              <span>{eventDetail ? eventDetail.eventDesc : ''}</span>
            </Col>
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
      </div>
    }
  }
  //删除会计事件维护信息
  const eventDelete = async (id) => {
    seteventId(id)
  }
  //查看会计事件规则维护信息
  const eventSee = async (id) => {
    let params = {
      tellerNo: tellerNo,
      id: id,
    }
    const res = await accountingSee(params)
    setEventDetail(res.result)
    setIsModalVisible(true);
  }
  //修改会计事件规则维护信息
  const eventModify = (record) => {
    setRecord(record)
    setChangeEventNo(record.eventNo)
    setChangeSerialNumber(record.serialNumber)
    setChangeBusinessScenario(record.businessScenario)
    setChangeOrgNo(record.orgNo)
    setChangeSubjectNo(record.subjectNo)
    setChangeThreeSubjectNo(record.threeSubjectNo)
    setChangeDrcrFlag(record.drcrFlag)
    setChangeAmtType(record.amtType)
    setChangeCcy(record.ccy)
    setChangeTargetAccountNo(record.targetAccountNo)
    setChangeEventDesc(record.eventDesc)
    seteventId(record.id)
    form.setFieldsValue({
      eventNo: record.eventNo,
      serialNumber: record.serialNumber,
      businessScenario: eventMain(record.businessScenario, 'businessScenario'),
      orgNo: record.orgNo,
      subjectNo: record.subjectNo,
      threeSubjectNo: record.threeSubjectNo,
      drcrFlag: eventMain(record.drcrFlag, 'drcrFlag'),
      amtType: eventMain(record.amtType, 'amtType'),
      ccy: eventMain(record.ccy, 'ccy'),
      targetAccountNo: record.targetAccountNo,
      eventDesc:record.eventDesc,
      subjectName: record.subjectName
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      search: false,
      width: 150,
    },
    {
      title: '会计事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 150,
    },
    {
      title: '业务序号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      search: false,
      width: 150,
    },

    {
      title: '业务场景',
      dataIndex: 'businessScenario',
      key: 'businessScenario',
      search: false,
      width: 150,
      render: (t, r, i) => {
        return eventMain(t, 'businessScenario')
      }
    },
    {
      title: '金额类型',
      key: 'amtType',
      dataIndex: 'amtType',
      search: false,
      width: 150,
      render: (t, r, i) => {
        return eventMain(t, 'amtType')
      }
    },
    {
      title: '机构号',
      key: 'orgNo',
      dataIndex: 'orgNo',
      search: false,
      width: 150,
    },
    {
      title: '科目号',
      key: 'subjectNo',
      dataIndex: 'subjectNo',
      search: false,
      width: 150,
    },
    {
      title: '科目名称',
      key: 'subjectName',
      dataIndex: 'subjectName',
      search: false,
      width: 150,
    },
    {
      title: '三级科目序号',
      key: 'threeSubjectNo',
      dataIndex: 'threeSubjectNo',
      search: false,
      width: 150,
    },
    {
      title: '借贷标识',
      key: 'drcrFlag',
      dataIndex: 'drcrFlag',
      search: false,
      width: 150,
      render: (t, r, i) => {
        return eventMain(t, 'drcrFlag')
      }
    },

    {
      title: '币种',
      key: 'ccy',
      dataIndex: 'ccy',
      search: false,
      width: 150,
      render: (t, r, i) => {
        return eventMain(t, 'ccy')
      }
    },
    {
      title: '对方账号',
      key: 'targetAccountNo',
      dataIndex: 'targetAccountNo',
      search: false,
      width: 150,
    },
    {
      title: '描述',
      key: 'eventDesc',
      dataIndex: 'eventDesc',
      search: false,
      width: 150,
    },
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      search: false,
      width: 150,
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => { look('2'), eventModify(record) }}>修改</a>
          <a onClick={() => { look('3'), eventDelete(record.id) }}>删除</a>
          <a onClick={() => { look('4'), eventSee(record.id) }}>查看</a>
        </Space>
      ),
    }
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
            eventNo: params.eventNo,
            tellerNo: tellerNo,
          }
          try {
            const res = await accountingList(postData);
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
          <Button key="button" onClick={() => look('1')} type="primary">
            新增
          </Button>]} />
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

export default connect(mapStateToProps, mapDispatchToProps)(eventMaintance);
