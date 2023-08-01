import {  Form, Row, Col, Input,Cascader, Select, Button, Table } from 'antd';
import { useTextAreaHeight } from "@hook/useTextAreaHeight";
import styles from './index.module.scss';

const options = [
  {
    value: '1',
    label: '改价',
    children: [
      {
        value: '1',
        label: '加购特价',
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
        noStyle
        initialValue={t}
        name={['externalGoodsVoList', i, 'skuId']}
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
        noStyle
        initialValue={t}
        name={['externalGoodsVoList', i, 'goodsName']}
      >
        <span>{r.goodsName}</span>
      </Form.Item>
    )
  },{
    title: '活动价格',
    dataIndex: 'activityPrice',
    render: (t, r, i)=> (
      <Form.Item 
        initialValue={t}
        name={['externalGoodsVoList', i, 'activityPrice']}
        rules={[{ required: true }]}
      >
        <Input placeholder="请输入"/>
      </Form.Item>
    )
  },{
    title: '活动库存',
    dataIndex: 'activityStock',
    render: (t, r, i)=> (
      <Form.Item 
        initialValue={t}
        name={['externalGoodsVoList', i, 'activityStock']}
      >
        <Input placeholder="请输入"/>
      </Form.Item>
    )
  },{
    title: '数量限制',
    dataIndex: 'num',
    render: (t, r, i)=> (
      <Form.Item 
        initialValue={t}
        name={['externalGoodsVoList', i, 'num']}
      >
        <Input placeholder="请输入"/>
      </Form.Item>
    )
  },
];

export default ({onActionCheckSkuIds, actionTableGoodsList}) => {
  const textAreaHeight = useTextAreaHeight("textArea1");

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
              label="特价商品"
              style={{margin: "20px 0 0 0"}}
              initialValue={"1"}
            >
              <Select>
                <Select.Option value="1">额外指定商品</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="other"
              label="指定商品"
              style={{ margin: "20px 0 0 0", position: "relative"}}
            >
              <Form.Item>
                <Input.TextArea
                  placeholder="请输入SKUID"
                  allowClear
                  enterbutton="校验"
                  rows={4}
                  id="textArea1"
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
              size="small"
              rowKey="skuId"
              bordered
              className={styles.configInfoTable}
              style={{ margin: "20px 0", overflowY: "scroll", minHeight: "150px", height: textAreaHeight + 50 + "px"}}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
};