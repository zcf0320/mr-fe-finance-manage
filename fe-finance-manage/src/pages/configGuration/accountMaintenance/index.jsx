import React, { useEffect, useState, useRef } from 'react';
import { Space, Button, Modal, Select, Row, Col, Form, notification, Checkbox } from 'antd';
import { getAccountMainList, addAccountMainList, AccountMainDetail, AccountMainRemove, getAccountSceneNo, changeAccountMainList } from '@api/accountMaintenance'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import accountMain from '../../../enumeration/accountMain'
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';

const accountMaintance = (props) => {
  const { cacheUser, userInfo } = props;
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operation, setOperation] = useState();
  const [a, setA] = useState("0")
  const [tellerNo, setTellerNo] = useState(userInfo.username)
  const [tabDetail, settabDetail] = useState()
  const [delSubjectNo, setDelSubjectNo] = useState()
  const [openaccountSceneNoList, setOpenaccountSceneNoList] = useState()//开户场景
  //添加
  const [Add, setAdd] = useState()
  const [addSubjectNo, setAddSubjectNo] = useState()//科目号
  const [addSubjectName, setAddSubjectName] = useState()//科目名称
  const [addStatus, setAddStatus] = useState()//状态
  const [addRmk, setAddRmk] = useState()//备注
  const [addType, setAddType] = useState()//类型
  const [addNegativeFlag, setAddNegativeFlag] = useState()//红字标识
  const [adddrcrFlag, setAdddrcrFlag] = useState()//余额方向
  const [addSubjectLevel, setAddSubjectLevel] = useState()//科目级别
  const [addsupSubjectNo, setAddsupSubjectNo] = useState()//上级科目号
  const [addautoOpenaccountFlag, setAddautoOpenaccountFlag] = useState()//自动开户标志
  const [addOpenaccountSceneNo, setAddOpenaccountSceneNo] = useState()//开户场景编号
  const [addsubjectBreakdown, setAddsubjectBreakdown] = useState()//科目细分
  const [addAuxiliaryAccounting1check, setAddAuxiliaryAccounting1check] = useState(false)//辅助核销
  const [addAuxiliaryAccounting2check, setAddAuxiliaryAccounting2check] = useState(false)
  const [addAuxiliaryAccounting3check, setAddAuxiliaryAccounting3check] = useState(false)
  const [addAuxiliaryAccounting4check, setAddAuxiliaryAccounting4check] = useState(false)

  const [addOpenNumber, setAddOpenNumber] = useState()
  const [addOpens, setAddOpens] = useState()
  //修改
  const [changeSubjectNo, setChangeSubjectNo] = useState()//科目号
  const [changeSubjectName, setChangeSubjectName] = useState()//科目名称
  const [changeStatus, setChangeStatus] = useState()//状态
  const [changeRmk, setChangeRmk] = useState()//备注
  const [changeType, setChangeType] = useState()//类型
  const [changeNegativeFlag, setChangeNegativeFlag] = useState()//红字标识
  const [changedrcrFlag, setChangedrcrFlag] = useState()//余额方向
  const [changeSubjectLevel, setChangeSubjectLevel] = useState()//科目级别
  const [changesupSubjectNo, setChangesupSubjectNo] = useState()//上级科目号
  const [changeautoOpenaccountFlag, setChangeautoOpenaccountFlag] = useState()//自动开户标志
  const [changeOpenaccountSceneNo, setChangeOpenaccountSceneNo] = useState()//开户场景编号
  const [changesubjectBreakdown, setChangesubjectBreakdown] = useState()//科目细分
  const [changeAuxiliaryAccounting1check, setChangeAuxiliaryAccounting1check] = useState()//辅助核销
  const [changeAuxiliaryAccounting2check, setChangeAuxiliaryAccounting2check] = useState()
  const [changeAuxiliaryAccounting3check, setChangeAuxiliaryAccounting3check] = useState()
  const [changeAuxiliaryAccounting4check, setChangeAuxiliaryAccounting4check] = useState()
  const [form] = Form.useForm();
  const [record, setRecord] = useState()


  useEffect(() => {
    getopenAccountSceneNo(),
      getopenAccountScene()
  }, [])

  const getopenAccountSceneNo = async () => {
    let obj = {};
    const res = await getAccountSceneNo()
    res.result.forEach((item) => {
      obj[item] = item
    })

    setOpenaccountSceneNoList(obj)
  }

  //获取场景编号
  const getopenAccountScene = async () => {
    let obj = {};
    const res = await getAccountSceneNo()
    res.result.forEach((item) => {
      obj[item.id] = item.opName
    })
    setOpenaccountSceneNoList(obj)
    setAdd(res.result)
  }

  //表格数据
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      valueType: 'select',
      width: 150,
      valueEnum: {
        "0": "资产",
        "1": "负债",
        "5": "损益",
        "9": "表外"
      },
    },
    {
      title: '序号',
      dataIndex: 'idx',
      key: 'idx',
      search: false,
      width: 150,
      render: (t, r, i) => {
        return i = i * 1 + 1
      }
    },
    {
      title: '科目号',
      dataIndex: 'subjectNo',
      key: 'subjectNo',
      width: 150,
    },
    {
      title: '科目名称',
      dataIndex: 'subjectName',
      key: 'subjectName',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: {
        "normal": "normal"
      },
      width: 150,
    },
    {
      title: '红字标识',
      dataIndex: 'negativeFlag',
      key: 'negativeFlag',
      search: false,
      width: 150,
      render: (t, r, i) => { return accountMain(t, 'negativeFlag') }
    },
    {
      title: '余额方向',
      dataIndex: 'drcrFlag',
      key: 'drcrFlag',
      search: false,
      width: 150,
      render: (t, r, i) => { return accountMain(t, 'drcrFlag') }
    },
    {
      title: '科目级别',
      dataIndex: 'subjectLevel',
      key: 'subjectLevel',
      search: false,
      width: 150,
    },
    {
      title: '上级科目号',
      dataIndex: 'supSubjectNo',
      key: 'supSubjectNo',
      search: false,
      width: 150,
    },
    {
      title: '账龄标志',
      dataIndex: 'accAgingFlag',
      key: 'accAgingFlag',
      search: false,
      width: 150,
    }, {
      title: '自动开户标志',
      dataIndex: 'autoOpenaccountFlag',
      key: 'autoOpenaccountFlag',
      search: false,
      width: 150,
      render: (t, r, i) => { return accountMain(t, 'autoOpenaccountFlag') }
    }, {
      title: '开户场景编号',
      dataIndex: 'openaccountSceneNo',
      key: 'openaccountSceneNo',
      valueType: 'select',
      valueEnum: openaccountSceneNoList,
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'rmk',
      key: 'rmk',
      search: false,
      width: 150,
    },
    {
      title: '操作',
      hideInTable: false,
      hideInSearch: true,
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 150,
      render: (text, record, index) => (
        <Space size="middle">
          <a onClick={() => { accountMainchang(record), look('2') }}>修改</ a>
          <a onClick={() => { accountMainlook(record.id), look('3') }}>查看</ a>
          <a onClick={() => { accountMaindel(record.subjectNo), look('4') }}>删除</ a>
        </Space>
      ),
    },
  ];
  //修改回显
  const accountMainchang = (record) => {
    setRecord(record)
    setChangeSubjectNo(record.subjectNo)//科目号
    setChangeSubjectName(record.subjectName)//科目名称
    setChangeStatus(record.status)//状态
    setChangeRmk(record.rmk)//备注
    setChangeType(record.type)//类型
    setChangeNegativeFlag(record.negativeFlag)//红字标是
    setChangedrcrFlag(record.drcrFlag)//余额方向
    setChangeSubjectLevel(record.subjectLevel)//科目级别
    setChangesupSubjectNo(record.supSubjectNo)//上级科目号
    setChangeautoOpenaccountFlag(record.autoOpenaccountFlag)//自动开户标志
    setChangeOpenaccountSceneNo(record.openaccountSceneNo)//开户场景编号
    setChangesubjectBreakdown(record.subjectBreakdown)//科目西风
    setChangeAuxiliaryAccounting1check(record.auxiliaryAccounting1)
    setChangeAuxiliaryAccounting2check(record.auxiliaryAccounting2)
    setChangeAuxiliaryAccounting3check(record.auxiliaryAccounting3)
    setChangeAuxiliaryAccounting4check(record.auxiliaryAccounting4)

    form.setFieldsValue({
      subjectNo: record.subjectNo,
      subjectName: record.subjectName,
      status: record.status,
      rmk: record.rmk,
      type: accountMain(record.type, 'type'),
      negativeFlag: accountMain(record.negativeFlag, 'negativeFlag'),
      drcrFlag: accountMain(record.drcrFlag, 'drcrFlag'),
      subjectLevel: record.subjectLevel,
      supSubjectNo: record.supSubjectNo,
      autoOpenaccountFlag: accountMain(record.autoOpenaccountFlag, 'autoOpenaccountFlag'),
      openaccountSceneNo: record.openaccountSceneNo,
      subjectBreakdown: accountMain(record.subjectBreakdown, 'subjectBreakdown'),
      auxiliaryAccounting1: record.auxiliaryAccounting1,
      auxiliaryAccounting2: record.auxiliaryAccounting2,
      auxiliaryAccounting3: record.auxiliaryAccounting3,
      auxiliaryAccounting4: record.auxiliaryAccounting4,
    })
  }
  //查看
  const accountMainlook = async (id) => {
    let params = { id: id ,tellerNo: tellerNo,}
    const res = await AccountMainDetail(params)
    settabDetail(res.result)
  }
  //删除
  const accountMaindel = async (subjectNo) => {
    setDelSubjectNo(subjectNo)
  }
  //弹框判断
  const look = (a) => {
    if (a === "1") {
      setOperation("新增科目规则维护列表信息");
      setA(a)
    } else if (a === "2") {
      setOperation("修改科目规则维护列表信息");
      setA(a)
    } else if (a === "3") {
      setOperation("查看科目规则维护列表信息");
      setA(a)
    } else if (a === "4") {
      setOperation("删除科目规则维护列表信息")
      setA(a)
    }
    setIsModalVisible(true);
  };
  //弹框确定
  const handleOk = async () => {
    if (a === '2') {
      let params = {
        tellerNo: tellerNo,
        id: record.id,
        subjectNo: changeSubjectNo,
        subjectName: changeSubjectName,
        status: changeStatus,
        rmk: changeRmk,
        type: changeType,
        negativeFlag: changeNegativeFlag,
        drcrFlag: changedrcrFlag,
        subjectLevel: changeSubjectLevel,
        supSubjectNo: changesupSubjectNo,
        autoOpenaccountFlag: changeautoOpenaccountFlag,
        openaccountSceneNo: changeOpenaccountSceneNo,
        subjectBreakdown: changesubjectBreakdown,
        auxiliaryAccounting1: changeAuxiliaryAccounting1check,
        auxiliaryAccounting2: changeAuxiliaryAccounting2check,
        auxiliaryAccounting3: changeAuxiliaryAccounting3check,
        auxiliaryAccounting4: changeAuxiliaryAccounting4check,
      }
      const res = await changeAccountMainList(params)
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
      let params = { subjectNo: delSubjectNo }
      const res = await AccountMainRemove(params)
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
      subjectNo: addSubjectNo,
      subjectName: addSubjectName,
      status: addStatus,
      rmk: addRmk,
      type: addType,
      negativeFlag: addNegativeFlag,
      drcrFlag: adddrcrFlag,
      subjectLevel: addSubjectLevel,
      supSubjectNo: addsupSubjectNo,
      autoOpenaccountFlag: addautoOpenaccountFlag,
      openaccountSceneNo: addOpenaccountSceneNo,
      subjectBreakdown: addsubjectBreakdown,
      auxiliaryAccounting1: addAuxiliaryAccounting1check,
      auxiliaryAccounting2: addAuxiliaryAccounting2check,
      auxiliaryAccounting3: addAuxiliaryAccounting3check,
      auxiliaryAccounting4: addAuxiliaryAccounting4check,
    }
    const res = await addAccountMainList(params)
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
  //添加科目号
  const addSubjectNoInp = (e) => {
    setAddSubjectNo(e.target.value)
  }
  //添加科目名称
  const addSubjectNameInp = (e) => {
    setAddSubjectName(e.target.value)
  }
  //添加状态
  const addStatusSel = (e) => {
    setAddStatus(e)
  }
  //添加备注
  const addRmkInp = (e) => {
    setAddRmk(e.target.value)
  }
  //添加类型
  const addTypeSel = (e) => {
    if (e === '资产') {
      setAddType('0')
    } else if (e === '负债') {
      setAddType('1')
    } else if (e === '损益') {
      setAddType('5')
    } else if (e === '表外') {
      setAddType('9')
    }
  }
  //添加红字标识
  const addNegativeFlagSel = (e) => {
    if (e === '需红字记账（是否允许为负）') {
      setAddNegativeFlag('y')
    } else if (e === '正常记账') {
      setAddNegativeFlag('n')
    }
  }
  //添加余额方向
  const adddrcrFlagSel = (e) => {
    if (e === '借') {
      setAdddrcrFlag('dr')
    } else if (e === '贷') {
      setAdddrcrFlag('cr')
    }
  }
  //添加科目级别
  const addSubjectLevelSel = (e) => {
    setAddSubjectLevel(e)
  }
  //添加上级科目号
  const addsupSubjectNoInp = (e) => {
    setAddsupSubjectNo(e.target.value)
  }
  //添加自动开户标志
  const addautoOpenaccountFlagSel = (e) => {
    if (e === '自动开户') {
      setAddautoOpenaccountFlag('y')
    } else if (e === '手动开户') {
      setAddautoOpenaccountFlag('n')
    }
  }
  //添加开户场景编号
  const addOpenaccountSceneNoSel = (e) => {
    setAddOpenaccountSceneNo(e)
  }
  //添加科目细分
  const addsubjectBreakdownSel = (e) => {
    if (e === '收入') {
      setAddsubjectBreakdown('cost')
    } else if (e === '成本') {
      setAddsubjectBreakdown('income')
    } else if (e === '费用') {
      setAddsubjectBreakdown('exes')
    } else if (e === '往来') {
      setAddsubjectBreakdown('contacts')
    }
  }
  //添加辅助核算信息
  const addAuxiliaryAccounting1 = (e) => {
    setAddAuxiliaryAccounting1check(e.target.checked)
  }
  const addAuxiliaryAccounting2 = (e) => {
    setAddAuxiliaryAccounting2check(e.target.checked)
  }
  const addAuxiliaryAccounting3 = (e) => {
    setAddAuxiliaryAccounting3check(e.target.checked)
  }
  const addAuxiliaryAccounting4 = (e) => {
    setAddAuxiliaryAccounting4check(e.target.checked)
  }
  //修改科目号
  const changeSubjectNoInp = (e) => {
    setChangeSubjectNo(e.target.value)
  }
  //修改科目名称
  const changeSubjectNameInp = (e) => {
    setChangeSubjectName(e.target.value)
  }
  //修改状态
  const changeStatusSel = (e) => {
    setChangeStatus(e)
  }
  //修改备注
  const changeRmkInp = (e) => {
    setChangeRmk(e.target.value)
  }
  //修改类型
  const changeTypeSel = (e) => {
    if (e === '资产') {
      setChangeType('0')
    } else if (e === '负债') {
      setChangeType('1')
    } else if (e === '损益') {
      setChangeType('5')
    } else if (e === '表外') {
      setChangeType('9')
    }
  }
  //修改红字标识
  const changeNegativeFlagSel = (e) => {
    if (e === '需红字记账（是否允许为负）') {
      setChangeNegativeFlag('y')
    } else if (e === '正常记账') {
      setChangeNegativeFlag('n')
    }
  }
  //修改余额方向
  const changedrcrFlagSel = (e) => {
    if (e === '借') {
      setChangedrcrFlag('dr')
    } else if (e === '贷') {
      setChangedrcrFlag('cr')
    }
  }
  //修改科目级别
  const changeSubjectLevelSel = (e) => {
    setChangeSubjectLevel(e)
  }
  //修改上级科目号
  const changesupSubjectNoInp = (e) => {
    setChangesupSubjectNo(e.target.value)
  }
  //修改自动开户标志
  const changeautoOpenaccountFlagSel = (e) => {
    if (e === '自动开户') {
      setChangeautoOpenaccountFlag('y')
    } else if (e === '手动开户') {
      setChangeautoOpenaccountFlag('n')
    }
  }
  //修改开户场景编号
  const changeOpenaccountSceneNoSel = (e) => {
    setChangeOpenaccountSceneNo(e)
  }
  //修改科目细分
  const changesubjectBreakdownSel = (e) => {
    if (e === '收入') {
      setChangesubjectBreakdown('cost')
    } else if (e === '成本') {
      setChangesubjectBreakdown('income')
    } else if (e === '费用') {
      setChangesubjectBreakdown('exes')
    } else if (e === '往来') {
      setChangesubjectBreakdown('contacts')
    }
  }
  //修改辅助核算信息
  const changeAuxiliaryAccounting1 = (e) => {
    setChangeAuxiliaryAccounting1check(e.target.checked)
  }
  const changeAuxiliaryAccounting2 = (e) => {
    setChangeAuxiliaryAccounting2check(e.target.checked)
  }
  const changeAuxiliaryAccounting3 = (e) => {
    setChangeAuxiliaryAccounting3check(e.target.checked)
  }
  const changeAuxiliaryAccounting4 = (e) => {
    setChangeAuxiliaryAccounting4check(e.target.checked)
  }
  const rendermodal = (a) => {
    if (a === '1') {
      return <Form onFinishFailed={onFinishFailed} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="科目号" label="科目号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addSubjectNoInp} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="科目名称" label="科目名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addSubjectNameInp} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="状态" label="状态" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addStatusSel}>
                <Select.Option value="normal">normal</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="类型" label="类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addTypeSel}>
                <Select.Option value="资产">资产</Select.Option>
                <Select.Option value="负债">负债</Select.Option>
                <Select.Option value="损益">损益</Select.Option>
                <Select.Option value="表外">表外</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="红字标识" label="红字标识" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addNegativeFlagSel}>
                <Select.Option value="需红字记账（是否允许为负）">需红字记账（是否允许为负）</Select.Option>
                <Select.Option value="正常记账">正常记账</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="余额方向" label="余额方向" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={adddrcrFlagSel}>
                <Select.Option value="借">借</Select.Option>
                <Select.Option value="贷">贷</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="科目级别" label="科目级别" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addSubjectLevelSel}>
                <Select.Option value="first">first</Select.Option>
                <Select.Option value="second">second</Select.Option>
                <Select.Option value="third">third</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="上级科目号" label="上级科目号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addsupSubjectNoInp} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="自动开户标志" label="自动开户标志" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addautoOpenaccountFlagSel}>
                <Select.Option value="自动开户">自动开户</Select.Option>
                <Select.Option value="手动开户">手动开户</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="开户场景编号" label="开户场景编号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onChange={addOpenaccountSceneNoSel}>
                {
                  Add ? Add.map((item) => {
                    return <Select.Option key={item} value={item} >{item}</Select.Option>
                  }) : ''
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="科目细分" label="科目细分" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addsubjectBreakdownSel}>
                <Select.Option value="收入">收入</Select.Option>
                <Select.Option value="成本">成本</Select.Option>
                <Select.Option value="费用">费用</Select.Option>
                <Select.Option value="往来">往来</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="备注" label="备注" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={addRmkInp} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item name="辅助核算信息（可多选）" label="辅助核算信息（可多选）" style={{ width: '100%' }}>
              <Checkbox onChange={addAuxiliaryAccounting1}>部门</Checkbox>
              <Checkbox onChange={addAuxiliaryAccounting2}>成本中心</Checkbox>
              <Checkbox onChange={addAuxiliaryAccounting3}>产品</Checkbox>
              <Checkbox onChange={addAuxiliaryAccounting4}>客商名称</Checkbox>
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
      </Form >
    } else if (a === '2') {
      console.log(record,'111');
      return <Form form={form}
        initialValues={{
          subjectNo: record.subjectNo,
          subjectName: record.subjectName,
          status: record.status,
          rmk: record.rmk,
          type: record.type,
          negativeFlag: record.negativeFlag,
          drcrFlag: record.drcrFlag,
          subjectLevel: record.subjectLevel,
          supSubjectNo: record.supSubjectNo,
          autoOpenaccountFlag: record.autoOpenaccountFlag,
          openaccountSceneNo: record.openaccountSceneNo,
          subjectBreakdown: record.subjectBreakdown,
          auxiliaryAccounting1: record.auxiliaryAccounting1,
          auxiliaryAccounting2: record.auxiliaryAccounting2,
          auxiliaryAccounting3: record.auxiliaryAccounting3,
          auxiliaryAccounting4: record.auxiliaryAccounting4,
        }}
      >
        <Row gutter={24}>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="subjectNo" label="科目号" style={{ width: '100%' }}>
              <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changeSubjectNoInp} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="subjectName" label="科目名称" style={{ width: '100%' }}>
              <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changeSubjectNameInp} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="status" label="状态" style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changeStatusSel}>
                <Select.Option value="normal">normal</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="type" label="类型" style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changeTypeSel}>
                <Select.Option value="资产">资产</Select.Option>
                <Select.Option value="负债">负债</Select.Option>
                <Select.Option value="损益">损益</Select.Option>
                <Select.Option value="表外">表外</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="negativeFlag" label="红字标识" style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changeNegativeFlagSel}>
                <Select.Option value="需红字记账（是否允许为负）">需红字记账（是否允许为负）</Select.Option>
                <Select.Option value="正常记账">正常记账</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="drcrFlag" label="余额方向" style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changedrcrFlagSel}>
                <Select.Option value="借">借</Select.Option>
                <Select.Option value="贷">贷</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="subjectLevel" label="科目级别" style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changeSubjectLevelSel}>
                <Select.Option value="first">first</Select.Option>
                <Select.Option value="second">second</Select.Option>
                <Select.Option value="third">third</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="supSubjectNo" label="上级科目号" style={{ width: '100%' }}>
              <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changesupSubjectNoInp} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="autoOpenaccountFlag" label="自动开户标志" style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changeautoOpenaccountFlagSel}>
                <Select.Option value="自动开户">自动开户</Select.Option>
                <Select.Option value="手动开户">手动开户</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="openaccountSceneNo" label="开户场景编号" style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changeOpenaccountSceneNoSel}>
                {
                  Add ? Add.map((item) => {
                    return <Select.Option key={item} value={item} >{item}</Select.Option>
                  }) : ''
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="subjectBreakdown" label="科目细分" style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changesubjectBreakdownSel}>
                <Select.Option value="收入">收入</Select.Option>
                <Select.Option value="成本">成本</Select.Option>
                <Select.Option value="费用">费用</Select.Option>
                <Select.Option value="往来">往来</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="rmk" label="备注" style={{ width: '100%' }}>
              <input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={changeRmkInp} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item name="辅助核算信息（可多选）" label="辅助核算信息（可多选）" style={{ width: '100%' }}>
              <Checkbox onChange={changeAuxiliaryAccounting1} checked={changeAuxiliaryAccounting1check}>部门</Checkbox>
              <Checkbox onChange={changeAuxiliaryAccounting2} checked={changeAuxiliaryAccounting2check}>成本中心</Checkbox>
              <Checkbox onChange={changeAuxiliaryAccounting3} checked={changeAuxiliaryAccounting3check}>产品</Checkbox>
              <Checkbox onChange={changeAuxiliaryAccounting4} checked={changeAuxiliaryAccounting4check}>客商名称</Checkbox>
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
      return <Form >
        <Row gutter={24} align={'middle'} style={{ marginBottom: '10px' }}>
          <Col span={8} style={{ width: '30%' }}>
            <span>科目号:</span><span>{tabDetail ? tabDetail.subjectNo : ''}</span>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <span>科目名称:</span><span>{tabDetail ? tabDetail.subjectName : ''}</span>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <span>状态:</span><span>{tabDetail ? tabDetail.subjectName : ''}</span>
          </Col>

          <Col span={8} style={{ width: '30%' }}>
            <span>备注:</span><span>{tabDetail ? tabDetail.rmk : ''}</span>
          </Col><Col span={8} style={{ width: '30%' }}>
            <span>红字标识:</span><span>{tabDetail ? accountMain(tabDetail.negativeFlag, 'negativeFlag') : ''}</span>
          </Col><Col span={8} style={{ width: '30%' }}>
            <span>余额方向:</span><span>{tabDetail ? accountMain(tabDetail.drcrFlag, 'drcrFlag') : ''}</span>
          </Col>

          <Col span={8} style={{ width: '30%' }}>
            <span>科目级别:</span><span>{tabDetail ? tabDetail.subjectLevel : ''}</span>
          </Col><Col span={8} style={{ width: '30%' }}>
            <span>上级科目号:</span><span>{tabDetail ? tabDetail.supSubjectNo : ''}</span>
          </Col>
          {/* <Col span={8} style={{ width: '30%' }}>
            <span>账龄标志:</span><span>{tabDetail ? tabDetail.accAgingFlag : ''}</span>
          </Col> */}
          <Col span={8} style={{ width: '30%' }}>
            <span>自动开户标志:</span><span>{tabDetail ? accountMain(tabDetail.autoOpenaccountFlag, 'autoOpenaccountFlag') : ''}</span>
          </Col><Col span={8} style={{ width: '30%' }}>
            <span>开户场景编号:</span><span>{tabDetail ? tabDetail.openaccountSceneNo : ''}</span>
          </Col><Col span={8} style={{ width: '30%' }}>
            <span>科目细分:</span><span>{tabDetail ? accountMain(tabDetail.subjectBreakdown, 'subjectBreakdown') : ''}</span>
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
    } else if (a === '4') {
      return <Form>
        <p style={{ textAlign: 'center' }}>确定删除该条信息吗？</p>
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
  return (
    <div>
      <ProTable
        columns={columns}
        scroll={{ x: 1500 }}
        request={async (params, sort, filter) => {
          let postData = {
            tellerNo: tellerNo,
            pageNum: params.current,
            pageSize: params.pageSize,
            subjectNo: params.subjectNo,
            subjectName: params.subjectName,
            status: params.status,
            type: params.type,
            openaccountSceneNo: params.openaccountSceneNo
          }
          try {
            const res = await getAccountMainList(postData);
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
        }} dateFormatter="string" headerTitle="科目规则维护列表信息" toolBarRender={() => [
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

export default connect(mapStateToProps, mapDispatchToProps)(accountMaintance);