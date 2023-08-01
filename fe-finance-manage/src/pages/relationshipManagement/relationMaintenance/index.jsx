import React, { useEffect, useState, useRef } from 'react';
import { Button, Space, Modal, notification, Form, Row, Col, Input, Select, Radio, Card, Table } from 'antd'
import {
  ExclamationOutlined
} from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import '@ant-design/pro-table/dist/table.css';
import { costRelationList, costRelationLook, costRelationEnable,costDepartmentDeleted} from '@api/costRelation'
import { eventingList, eventingDelete, eventingSee, eventingAdd, eventingModify } from '@api/eventMaintance'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import costMain from '../../../enumeration/costMain';
import moment from 'moment';
const relationMaintenance = (props) => {

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
  const [addCostName, setAddCostName] = useState()
  const [addRemark, setAddRemark] = useState()
  const [addStateValue, setAddStateValue] = useState()

  //启用/禁用
  const [state, setStateEnable] = useState()

  //修改
  const [form] = Form.useForm();

  const [record, setRecord] = useState()
  const [changeCostName, setChangeCostName] = useState()
  const [changeRemark, setChangeRemark] = useState()
  const [changeStateValue, setChangeStateValue] = useState()
  const { TextArea } = Input;
  const { history } = props;
  const [checkStrictly, setCheckStrictly] = React.useState(false);
  //单选框value事件
  const addstateValue = e => {
    if (e === '启用') {
      setAddStateValue('0')
    } else if (e === '停用') {
      setAddStateValue('1')
    }
    setAddStateValue(e.target.value);
  };
  //编辑状态
  const changestateValue = e => {
    if (e === '启用') {
      setChangeStateValue('0')
    } else if (e === '停用') {
      setChangeStateValue('1')
    }
    setChangeStateValue(e.target.value);
  };

  //弹框确认
  const handleOk = async () => {
    if (a === '4') {
      let params = {
        id: legalId,
        tellerNo: tellerNo,
      }
      let res = await costDepartmentDeleted(params)
      if (res.success) {
        openNotification('删除成功')
        setIsModalVisible(false);
        actionRef.current.reload()
      } else {
        openNotification(res.errorMsg)
      }
    } else if (a === '2') {
      let params = {
        enable: state,
        id: legalId,
        tellerNo: tellerNo,
      }
      let res = await costRelationEnable(params)
      if (res.success) {
        openNotification('更改成功')
        setIsModalVisible(false);
        actionRef.current.reload()
      } else {
        openNotification(res.errorMsg)
      }
    }

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
      setOperation("添加成本关系");
      setA(a)
    } else if (a === "2") {
      setOperation("启用成本关系");
      setA(a)
    } else if (a === "3") {
      setOperation("编辑成本关系");
      setA(a)
    } else if (a === "4") {
      setOperation("")
      setA(a)
    }
    setIsModalVisible(true);
  };
  //表单提交成功
  const onFinish = async () => {
    if (a === '1') {
      let params = {
        tellerNo: tellerNo,
        costDepartmentName: addCostName,
        remark: addRemark,
        enable: addStateValue
      }
      const res = await costDepartmentAdd(params)
      actionRef.current.reload()
      if (res.success) {
        openNotification('添加成功')
        setIsModalVisible(false);
      } else {
        openNotification(res.errorMsg ? res.errorMsg : '此规则已存在')
        setIsModalVisible(false)
      }
    } else if (a === '3') {
      let params = {
        tellerNo: tellerNo,
        costDepartmentName: changeCostName,
        remark: changeRemark,
        enable: changeStateValue,
        id: legalId,
      }
      const res = await costDepartmentModify(params)
      actionRef.current.reload()
      if (res.success) {
        openNotification('修改成功')
        setIsModalVisible(false);
      } else {
        openNotification(res.errorMsg ? res.errorMsg : '此规则已存在')
        setIsModalVisible(false)
      }
    }
  };
  //表单提交失败
  const onFinishFailed = (e) => {
    setIsModalVisible(true);
  };
  //添加成本关系名称
  const addcostName = (e) => {
    setAddCostName(e.target.value)
  }
  //添加备注
  const addremark = (e) => {
    setAddRemark(e.target.value)
  }
  //修改成本关系名称
  const changecostName = (e) => {
    setChangeCostName(e.target.value)
  }

  //修改备注
  const changeremark = (e) => {
    setChangeRemark(e.target.value)
  }
  const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };


  const rendermodal = (a) => {
    if (a === '1') {
      return <Form onFinishFailed={onFinishFailed} onFinish={onFinish}>
        <Row gutter={32}>
          <Col span={12} style={{ width: '30%' }}>
            <Form.Item name="成本关系名称" label="成本关系名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
              <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => addcostName(e)} />
            </Form.Item>
            <p style={{ color: '#ccc', marginTop: '5px', marginLeft: '107px' }}>关联到成本关系后,名称不可修改</p>
          </Col>

          <Form.Item name="备注" label="备注" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', textIndent: '10px' }} >
            <TextArea rows={4} placeholder="100个字以内" maxLength={100} style={{ width: '600px', marginLeft: '20px' }}
              onChange={(e) => addremark(e)}
            />
          </Form.Item>

          <Form.Item name="状态" label="状态" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', textIndent: '5px' }}>
            <Radio.Group onChange={(e) => addstateValue(e)} style={{ marginLeft: '15px' }}>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>停用</Radio>
            </Radio.Group>
          </Form.Item>
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
      return <Form>
        <p style={{ fontSize: '15px', color: 'red' }}>当前有启用状态成本关系,需作废才可启用当前关系</p>
        <div>当前需启用:</div>
        <p style={{ textIndent: '35px' }}>成本关系ID: <span> {record ? record.name : ''}</span></p>
        <p style={{ textIndent: '35px' }}>成本关系名称: <span></span></p>

        <div style={{ border: '1px solid #ccc', paddingTop: '10px', textIndent: '5px' }}>
          <p style={{ fontSize: '15px' }}>关联列表</p>
          <Row gutter={16}>
            <Col span={6}>
              <Card title="序号" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={6}>
              <Card title="成本部门ID" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={6}>
              <Card title="成本部门名称" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={6}>
              <Card title="关联业务单元ID-名称" bordered={true}>
                Card content
              </Card>
            </Col>
          </Row>
        </div>
        <div>当前需归档:</div>
        <p style={{ textIndent: '35px' }}>成本关系ID: <span></span></p>
        <p style={{ textIndent: '35px' }}>成本关系名称: <span></span></p>

        <div style={{ border: '1px solid #ccc', paddingTop: '10px', textIndent: '5px' }}>
          <p style={{ fontSize: '15px' }}>关联列表</p>
          <Row gutter={16}>
            <Col span={6}>
              <Card title="序号" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={6}>
              <Card title="成本部门ID" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={6}>
              <Card title="成本部门名称" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={6}>
              <Card title="关联业务单元ID-名称" bordered={true}>
                Card content
              </Card>
            </Col>
          </Row>
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
      return <div>
        <Form
          form={form}
          initialValues={{
            enable: record.enable,
            costDepartmentName: record.costDepartmentName,
            remark: record.remark,
          }}
          onFinishFailed={onFinishFailed} onFinish={onFinish}>
          <Row gutter={32}>
            <Col span={12} style={{ width: '30%' }}>
              <Form.Item name="costDepartmentName" label="成本关系名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%' }} >
                <Input type="text" style={{ width: '100%' }} placeholder="请输入" onChange={(e) => changecostName(e)} />
              </Form.Item>
              <p style={{ color: '#ccc', marginTop: '5px', marginLeft: '107px' }}>关联到成本关系后,名称不可修改</p>
            </Col>

            <Form.Item name="remark" label="备注" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', textIndent: '10px' }} >
              <TextArea rows={4} placeholder="100个字以内" maxLength={100} style={{ width: '600px', marginLeft: '20px' }}
                onChange={(e) => changeremark(e)}
              />
            </Form.Item>

            <Form.Item name="enable" label="状态" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', textIndent: '5px' }}>
              <Radio.Group onChange={(e) => changestateValue(e)} value={changeStateValue} defaultValue='value' style={{ marginLeft: '15px' }}>
                <Radio value='0'>启用</Radio>
                <Radio value='1'>停用</Radio>
              </Radio.Group>
            </Form.Item>
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
    } else if (a === '4') {
      return <div>
        <Form>
          <p style={{ fontSize: '17px' }}> <ExclamationOutlined style={{ color: 'orange', fontSize: '17px' }} />确定删除吗?</p>
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
  const costDelete = async (id) => {
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

  //更改状态
  const costEnable = (record) => {
    setRecord(record)
    if (record.enable === '1') {
      setStateEnable('0')
    } else if (record.enable === '0') {
      setStateEnable('1')
    }
    setlegalId(record.id)
  }
  //编辑
  const costModify = (record) => {
    setRecord(record)
    setChangeCostName(record.costDepartmentName)
    setChangeRemark(record.remark)
    setChangeStateValue(record.enable)
    setlegalId(record.id)
    form.setFieldsValue({
      enable: record.enable,
      costDepartmentName: record.costDepartmentName,
      remark: record.remark,
    })
  }
  //成本关系添加页面
  const jumpToPage = async (record, type) => {
    let pathname= `/relationShip/addMaintenance/add`
    let query={record,type}
    props.history.push({ pathname, query: query, });
  };

  //添加/编辑/查看  跳转页面
  const jumpsToAddPage = () => {
    let pathname = '/relationShip/addMaintenance/add'
    history.push({ pathname,query:{type:'add'} })
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
      title: '成本关系ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '成本关系名称',
      dataIndex: 'costRelationName',
      key: 'costRelationName',
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '状态',
      key: 'enable',
      dataIndex: 'enable',
      valueEnum: {
        "0": "未启用",
        "1": "启用",
        "2": "归档",
      },
      valueType: 'select',
    },
    {
      title: '创建时间选择',
      dataIndex: 'datetime',
      key: 'datetime',
      width: 150,
      hideInTable: true,
      valueType: 'dateRange',
      // initialValue: [moment().subtract(1, 'M'), moment()],
      search: {
        transform: (value) => {
          return {
            beginTime: value[0],
            endTime: value[1],
          }
        }
      }
    },
    {
      title: '启用时间',
      key: 'enableTime',
      dataIndex: 'enableTime',
      search: false,
    },
    {
      title: '归档时间',
      key: 'unableTime',
      dataIndex: 'unableTime',
      search: false,
    },
    {
      title: '创建人',
      key: 'createdBy',
      dataIndex: 'createdBy',
      search: false,
    },
    {
      title: '修改日期',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      search: false,
    },
    {
      title: '更新人',
      key: 'updatedBy',
      dataIndex: 'updatedBy',
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      search: false,
      width: 180,
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          {record.enable === '2' || record.enable === '1' ?
            <>
              <a onClick={() => jumpToPage(record, 'look')}>查看</a>
              <a onClick={() => jumpToPage(record, 'copy')}>复制</a>
            </> : <> 
            <a onClick={() => { look('2'), costEnable(record) }}>启用</ a>
            <a onClick={() => jumpToPage(record, 'edit')}>编辑</a>

            </>}
        </Space>
      ),

    }
  ];


  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //   },
  //   onSelect: (record, selected, selectedRows) => {
  //     console.log(record, selected, selectedRows);
  //   },
  //   onSelectAll: (selected, selectedRows, changeRows) => {
  //     console.log(selected, selectedRows, changeRows);
  //   },
  // };

  // const selectedUserOnChange = (selectedRowKeys, selectedRows) => {
  //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  // }
  return (
    <div>

      <ProTable
        scroll={{ x: 1500 }}
        columns={columns}
        rowKey="id"
        request={async (params, sort, filter) => {
          let postData = {
            pageNum: params.current,
            pageSize: params.pageSize,
            tellerNo: tellerNo,
            id: params.id,
            costRelationName: params.costRelationName,
            enable: params.enable,
            beginTime: params.beginTime,
            endTime: params.endTime
          }
          try {
            const res = await costRelationList(postData);
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
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        search={{
          labelWidth: 'auto',
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === 'set') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }} pagination={{
          pageSize: 20,
        }} dateFormatter="string" headerTitle="信息列表"


        toolBarRender={() => [
          <Button key="button" onClick={() => jumpsToAddPage()} type="primary">
            ＋添加成本关系
          </Button>]}
      />
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
export default connect(mapStateToProps, mapDispatchToProps)(relationMaintenance);