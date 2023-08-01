import {  Form, Row, Col, Input,Cascader, Select, Button, Table } from 'antd';
import { useTextAreaHeight } from "@hook/useTextAreaHeight";
import styles from './index.module.scss';

const options = [
  {
    value: '2',
    label: '行为',
    children: [
      {
        value: '1',
        label: '购买',
      }
    ],
  },
];

const columns = [
  {
    title: 'SKUID',
    dataIndex: 'skuId',
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
  },
  {
    title: '售价',
    dataIndex: 'retailPrice',
  },
];

export default props => {

  const { activityType, conditionHandleChange, isTextAreaDisabled, form, onCheckSkuIds, behaviorTableGoodsList, isShowNumAndAmount } = props;
  
  const isDisabled = [1, 2, 7].includes(activityType);
  
  const textAreaHeight = useTextAreaHeight("textArea");

  return (
    <Form
      form={form}
      name="activity_condition"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      className="ant-advanced-search-form"
      onValuesChange={conditionHandleChange}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="ruleType"
            label="条件1"
            initialValue={['2', '1']}
            rules={[{ required: true }]}
          >
            <Cascader
              options={options}
              expandTrigger="hover"
              // onChange={onChange}
              placeholder="请选择"
            />
          </Form.Item>
          
        </Col>
        <Col span={16} style={{ border: "1px solid #ccc"}}>
          <Row gutter={24} >
            <Col span={12}>
              <Form.Item label="购买数量" style={{ margin: "20px 0 0 0" }}>
                <Form.Item
                  name="buyMinNum"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: "0" }}
                >
                  <Input disabled={isShowNumAndAmount} placeholder="请输入数量下限" />
                </Form.Item>
                <Form.Item
                  style={{ display: 'inline-block', margin: '0 4px' }}
                >
                  -
                </Form.Item>
                <Form.Item
                  name="buyMaxNum"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: "0" }}
                >
                  <Input disabled={isShowNumAndAmount} placeholder="请输入数量上限" />
                </Form.Item>
              </Form.Item>
              <Form.Item label="购买金额" style={{ margin: "20px 0 0 0" }}>
                <Form.Item
                  name="buyMinAmount"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: "0" }}
                >
                  <Input disabled={isShowNumAndAmount} placeholder="请输入金额下限" />
                </Form.Item>
                <Form.Item
                  style={{ display: 'inline-block', margin: '0 4px' }}
                >
                  -
                </Form.Item>
                <Form.Item
                  name="buyMaxAmount"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: "0" }}
                >
                  <Input disabled={isShowNumAndAmount} placeholder="请输入金额上限" />
                </Form.Item>
              </Form.Item>
              <Form.Item
                name="acitivityGoodsType"
                label="商品限制"
                style={{margin: "20px 0 0 0"}}
                rules={[{ required: true }]}
              >
                <Select placeholder="请选择">
                  <Select.Option disabled={isDisabled} value="1">不限制</Select.Option>
                  <Select.Option value="2">指定商品</Select.Option>
                  <Select.Option disabled={isDisabled} value="3">排除商品</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="指定商品"
                style={{ margin: "20px 0 0 0", position: "relative"}}
              >
                <Form.Item name="skuIds">
                  <Input.TextArea
                    placeholder="请输入SKUID"
                    allowClear
                    enterbutton="校验"
                    rows={4}
                    id="textArea"
                    disabled={isTextAreaDisabled}
                  />
                </Form.Item>
                <Form.Item
                  style={{ display: 'inline-block', margin: '0 4px', position: "absolute", left: "-70px", top: "40px" }}
                >
                  <Button disabled={isTextAreaDisabled} size="small" onClick={ onCheckSkuIds }>校验</Button>
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Table
                pagination={false}
                columns={columns}
                dataSource={behaviorTableGoodsList}
                size="small"
                rowKey="id"
                bordered
                className={styles.configInfoTable}
                style={{margin: "20px 0", overflowY: "scroll", minHeight: "250px",  height: textAreaHeight + 150 + "px"}}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}