import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss'
import { Button, Space, Modal, notification, Form, Row, Col, Input, Select } from 'antd'
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
import { eventingList, eventingDelete, eventingSee, eventingAdd, eventingModify } from '@api/eventMaintance'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import legalMain from '../../../enumeration/legalMain'
const legalMaintenance = (props) => {
  const { cacheUser, userInfo } = props;
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operation, setOperation] = useState();
  const [a, setA] = useState("0")
  const [legalId, setlegalId] = useState()
  const [legalDetail, setLegalDetail] = useState()
  const [tellerNo, setTellerNo] = useState(userInfo.username)
  //添加
  const [tableDate, setTableData] = useState()
  const [addAccountType, setAddAccountType] = useState()
  const [addAccount, setAddAccount] = useState()
  const [addInsTitution, setAddInstitution] = useState()
  //修改
  const [form] = Form.useForm();
  const [record, setRecord] = useState()
  const [changeAccountType, setChangeAccountType] = useState()
  const [changeAccountNo, setChangeAccountNo] = useState()
  const [changeOrgNo, setChangeOrgNo] = useState()
  //弹框确认
  const handleOk = async () => {
    if (a === '3') {
      let params = {
        id: legalId,
        tellerNo: tellerNo,
      }
      let res = await eventingDelete(params)
      if (res.success) {
        openNotification('删除成功')
        setIsModalVisible(false);
        actionRef.current.reload()
      } else {
        openNotification(res.errorMsg)
      }
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

  //弹框判断
  const look = (a) => {
    if (a === "1") {
      setOperation("新增账号与法体关系信息");
      setA(a)
    } else if (a === "2") {
      setOperation("修改账号与法体关系信息");
      setA(a)
    } else if (a === "3") {
      setOperation("删除账号与法体关系信息");
      setA(a)
    } else if (a === "4") {
      setOperation("查看账号与法体关系信息")
      setA(a)
    }
    setIsModalVisible(true);
  };
  //表单提交成功
  const onFinish = async () => {
    if (a === '1') {
      let params = {
        tellerNo: tellerNo,
        accountType: addAccountType,
        accountNo: addAccount,
        orgNo: addInsTitution,
      }
      const res = await eventingAdd(params)
      actionRef.current.reload()
      if (res.success) {
        openNotification('添加成功')
        setIsModalVisible(false);
      } else {
        openNotification(res.errorMsg)
        setIsModalVisible(false)
      }
    } else if (a === '2') {
      let params = {
        id: legalId,
        tellerNo: tellerNo,
        accountType: changeAccountType,
        accountNo: changeAccountNo,
        orgNo: changeOrgNo,
      }
      let res = await eventingModify(params)
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
  //表单提交失败
  const onFinishFailed = (e) => {
    setIsModalVisible(true);
  };
  //添加账号类型
  const addaccountType = (e) => {
    if (e === '招行') {
      setAddAccountType('cmbc')
    } else if (e === '支付宝') {
      setAddAccountType('alipay')
    } else if (e === '快钱') {
      setAddAccountType('bill')
    }
  }
  //添加账号
  const addaccount = (e) => {
    setAddAccount(e.target.value)
  }
  //添加机构号
  const addInstitution = (e) => {
    setAddInstitution(e.target.value)
  }
  //修改账号类型
  const changeaccountType = (e) => {
    if (e === '招行') {
      setChangeAccountType('cmbc')
    } else if (e === '支付宝') {
      setChangeAccountType('alipay')
    } else if (e === '快钱') {
      setChangeAccountType('bill')
    }
  }
  //修改账号
  const changeaccount = (e) => {
    setChangeAccountNo(e.target.value)
  }
  //修改机构号
  const changeInstitution = (e) => {
    setChangeOrgNo(e.target.value)
  }
  const rendermodal = (a) => {
    if (a === '1') {
      return <Form onFinishFailed={onFinishFailed} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="账号类型" label="账号类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={addaccountType}
              >
                <Select.Option value="招行">招行</Select.Option>
                <Select.Option value="快钱">快钱</Select.Option>
                <Select.Option value="支付宝">支付宝</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="账号" label="账号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="number" min={0} style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addaccount(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="机构号" label="机构号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="number" min={0} style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addInstitution(e)} />
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
      return <Form
        form={form}
        initialValues={{
          accountType: record.accountType,
          accountNo: record.accountNo,
          orgNo: record.orgNo

        }} onFinishFailed={onFinishFailed} onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="accountType" label="账号类型" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onSelect={changeaccountType}
              >
                <Select.Option value="招行">招行</Select.Option>
                <Select.Option value="快钱">快钱</Select.Option>
                <Select.Option value="支付宝">支付宝</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="accountNo" label="账号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="number" min={0} style={{ width: '100%' }} placeholder="请输入" onChange={(e) => changeaccount(e)} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ width: '30%' }}>
            <Form.Item name="orgNo" label="机构号" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }}>
              <Input type="number" min={0} style={{ width: '100%' }} placeholder="请输入" onChange={(e) => changeInstitution(e)} />
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
        确定删除账号与法体关系信息吗?
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
              <span>账号类型:</span>
              <span>{legalDetail ? legalMain(legalDetail.accountType, 'accountType') : ''}</span>
            </Col>
            <Col span={8}>
              <span>账号:</span>
              <span>{legalDetail ? legalDetail.accountNo : ''}</span>
            </Col>
            <Col span={8}>
              <span>机构号:</span>
              <span>{legalDetail ? legalDetail.orgNo : ''}</span>
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
  //删除账号与法体信息
  const legalDelete = async (id) => {
    setlegalId(id)
  }
  //查看账号与法体信息
  const legalSee = async (id) => {
    let params = {
      id: id,
      tellerNo: tellerNo,
    }
    const res = await eventingSee(params)
    setLegalDetail(res.result)
    setIsModalVisible(true);
  }

  //修改账号与法体信息
  const legalModify = (record) => {
    setRecord(record)
    setChangeAccountType(record.accountType)
    setChangeAccountNo(record.accountNo)
    setChangeOrgNo(record.orgNo)
    setlegalId(record.id)
    form.setFieldsValue({
      accountNo: record.accountNo,
      accountType: legalMain(record.accountType, 'accountType'),
      orgNo: record.orgNo,
    })
  }
  const columns = [
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
      title: '账号类型',
      dataIndex: 'accountType',
      key: 'accountType',
      valueEnum: {
        "cmbc": "招行",
        "alipay": "支付宝",
        "bill": "快钱",
      },
      valueType: 'select',
    },
    {
      title: '账号',
      dataIndex: 'accountNo',
      key: 'accountNo',

    },
    {
      title: '机构号',
      key: 'orgNo',
      dataIndex: 'orgNo',
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
          <a onClick={() => { look('2'), legalModify(record) }}>修改</a>
          <a onClick={() => { look('3'), legalDelete(record.id) }}>删除</a>
          <a onClick={() => { look('4'), legalSee(record.id) }}>查看</a>
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
            accountNo: params.accountNo,
            accountType: params.accountType,
            orgNo: params.orgNo,
            tellerNo: tellerNo,
          }
          try {
            const res = await eventingList(postData);
            setTableData(res.result)
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

export default connect(mapStateToProps, mapDispatchToProps)(legalMaintenance);
