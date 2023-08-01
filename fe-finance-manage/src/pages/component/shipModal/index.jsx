import { Modal, Form, Input, message, Select } from 'antd';
import { useEffect, useState } from 'react';
const { Option } = Select;
import { fetchLogisticsList, shipOrder } from '../../../api/orderManage';
import { returnGoods } from '../../../api/afterSaleManage';

export default props => {
  const { id, shipVisible, setShipVisible, successCallback, isReturn } = props;  //isReturn:是否退货操作，退货或发货
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [logisticsList, setLogisticsList] = useState([]);
  useEffect(() => {
    getLogisticsList()
  }, [])
  const getLogisticsList = async () => {
    try {
      const res = await fetchLogisticsList();
      if (res.status == 200) {
        setLogisticsList(res.data);
      } else {
        message.error(res.message);
      }
    } catch (e) { }
  }
  const onOk = () => {
    form.validateFields().then(async values => {
      try {
        setLoading(true)
        const res = await (!isReturn ? shipOrder({ ...values, orderId: id }) : returnGoods({ logisticsId: values.expressId, refundNo: id, logisticsNo: values.invoiceNo }));
        if (res.status == 200) {
          successCallback();
          message.success('操作成功');
          setShipVisible(false);
        } else {
          message.error(res.message);
        }
      } catch (error) { }
    }).catch(errorInfo => {

    }).finally(() => {
      setLoading(false)
    });
  };
  const onCancel = () => {
    setShipVisible(false);
  }

  return (
    <Modal destroyOnClose={true} visible={shipVisible} onOk={onOk} centered={true} maskClosable={false} onCancel={onCancel} confirmLoading={loading}>
      <Form preserve={false} form={form} name="order-express-modal" labelCol={{ span: 4, offset: 4 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="物流公司：" name="expressId" rules={[{ required: true, message: '请选择物流公司' }]}>
          <Select placeholder="请选择">
            {logisticsList.map(item => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.expressCompany}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="物流编号："
          name="invoiceNo"
          rules={[
            {
              required: true,
              message: '请输入正确物流编号',
              pattern: /^[a-zA-Z0-9]+$/,
              max: 20,
              type: 'string',
            },
          ]}
        >
          <Input placeholder="物流编号（限制20位）" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
