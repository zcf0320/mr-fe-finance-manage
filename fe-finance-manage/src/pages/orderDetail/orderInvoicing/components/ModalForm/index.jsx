import React, { useEffect, useState } from 'react';
import { Modal, Form, Radio, Input, Space } from 'antd'
import TableEditableForm from '../TableEditableForm'

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
  },
};

const ModalForm = props => {
  const { visible, dataSource, invoiceAmount, onCancel, onSave, loading } = props;
  const [modalList, setModalList] = useState([]);

  const [form] = Form.useForm();
  const [invoiceType, setInvoiceType] = useState('1');

  useEffect(() => {
    setModalList(dataSource)
  }, [dataSource])

  const onInvoiceTypeChange = (e) => {
    setInvoiceType(e.target.value)
  }

  const onTableSave = (data) => {
    setModalList(data)
  }

  const onModalSave = () => {
    form.validateFields().then(values => {
      const data = {
        ...values,
        invoiceItemReqs: modalList
      }
      onSave(data)
    })
  }

  return (
    <Modal
      visible={visible}
      title='申请发票'
      destroyOnClose={true}
      width={800}
      onCancel={onCancel}
      onOk={onModalSave}
      confirmLoading={loading}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div>订单开票金额：{invoiceAmount}</div>
        <TableEditableForm dataSource={modalList} onSave={onTableSave} />
        <Form
          form={form}
          preserve={false}
          name='requestBill'
          autoComplete="off"
          initialValues={{ invoiceTitle: "1" }}
          {...formItemLayout}
        >
          <Form.Item
            name="invoiceTitle"
            label="开票类型"
            rules={[{ required: true, message: '请选择发票类型' }]}
          >
            <Radio.Group onChange={onInvoiceTypeChange}>
              <Radio value="1">个人</Radio>
              <Radio value="2">企业</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="购方抬头"
            name="customerName"
            rules={[{ required: true, message: '请输入购方抬头' }]}
          >
            <Input />
          </Form.Item>
          {
            invoiceType === "2" && (
              <Form.Item
                label="购方税号"
                name="customerCode"
                rules={[{ required: true, message: '请输入购方税号' }]}
              >
                <Input />
              </Form.Item>
            )
          }
          <Form.Item
            label="接收邮箱"
            name="customerEmail"
            rules={[{ type: 'email', required: true, message: '请输入合法邮箱' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  )
}
export default ModalForm;
