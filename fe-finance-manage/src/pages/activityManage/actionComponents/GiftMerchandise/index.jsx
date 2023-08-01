import {  Form, Row, Col, Input,Cascader, Select, Button, Table } from 'antd';
import { useTextAreaHeight } from "@hook/useTextAreaHeight";
import styles from './index.module.scss';

const options = [
  {
    value: '1',
    label: '赠送',
    children: [
      {
        value: '1',
        label: '赠送商品',
      }
    ],
  },
];

const columns = [
  {
    title: 'SKUID',
    dataIndex: 'skuId',
    render:  (t, r, i)=> (
      <Form.Item 
        initialValue={t}
        name={['giftGoodsVoList', i, 'skuId']}
        rules={[{ required: true }]}
      >
        <span>{r.skuId}</span>
      </Form.Item>
    )
  },{
    title: '商品名称',
    width: 80,
    dataIndex: 'goodsName',
    render:  (t, r, i)=> (
      <Form.Item 
        initialValue={t}
        name={['giftGoodsVoList', i, 'goodsName']}
        rules={[{ required: true }]}
      >
        <span>{r.skuId}</span>
      </Form.Item>
    )
  },{
    title: '售价',
    dataIndex: 'retailPrice',
    render:  (t, r, i)=> (
      <Form.Item 
        initialValue={t}
        name={['giftGoodsVoList', i, 'retailPrice']}
        rules={[{ required: true }]}
      >
        {r.retailPrice}
      </Form.Item>
    )
  },{
    title: '活动库存',
    dataIndex: 'activityStock',
    width: 120,
    render: (t, r, i)=> (
      <Form.Item 
        initialValue={t}
        name={['giftGoodsVoList', i, 'activityStock']}
      >
        <Input placeholder="请输入"/>
      </Form.Item>
    )
  },{
    title: '赠送数量',
    dataIndex: 'num',
    width: 120,
    render: (t, r, i)=> (
      <Form.Item 
        initialValue={t}
        name={['giftGoodsVoList', i, 'num']}
        rules={[{ required: true }]}
      >
        <Input placeholder="请输入"/>
      </Form.Item>
    )
  },
];

export default ({onActionCheckSkuIds, actionTableGoodsList}) => {
  const textAreaHeight = useTextAreaHeight("textArea2");

  return (
    <Row gutter={24}>
      <Col span={8}>
        <Form.Item
          name="actionRuleType"
          label="动作1"
          initialValue={['1', '1']}
          rules={[
            {
              required: true,
              message: '请选择条件！',
            },
          ]}
        >
          <Cascader
            options={options}
            expandTrigger="hover"
            placeholder="请选择"
          />
        </Form.Item>
        
      </Col>
      <Col span={16} style={{ border: "1px solid #ccc"}}>
        <Row gutter={24} >
          <Col span={12}>
            <Form.Item
              name="other"
              label="赠送给谁"
              style={{margin: "20px 0 0 0"}}
              initialValue={"1"}
            >
              <Select>
                <Select.Option value="1">本人</Select.Option>
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
                  id="textArea2"
                />
              </Form.Item>
              <Form.Item
                style={{ display: 'inline-block', margin: '0 4px', position: "absolute", left: "-70px", top: "40px" }}
              >
                <Button onClick={onActionCheckSkuIds} size="small">校验</Button>
              </Form.Item>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Table
              pagination={false}
              columns={columns}
              dataSource={actionTableGoodsList}
              rowKey="skuId"
              size="small"
              bordered
              className={styles.configInfoTable}
              style={{ margin: "20px 0", overflowY: "scroll", minHeight: "150px", height: textAreaHeight + 50 + "px"}}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}