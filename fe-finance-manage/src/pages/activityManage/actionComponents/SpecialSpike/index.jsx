import {  Form, Row, Col, Cascader, Select, Table, Input } from 'antd';
import styles from './index.module.scss';

const options = [
  {
    value: '1',
    label: '改价',
    children: [
      {
        value: '1',
        label: '特价秒杀',
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
        name={['specialSkillGoodsVoList', i, 'skuId']}
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
        name={['specialSkillGoodsVoList', i, 'goodsName']}
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
        name={['specialSkillGoodsVoList', i, 'activityPrice']}
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
        name={['specialSkillGoodsVoList', i, 'activityStock']}
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
        name={['specialSkillGoodsVoList', i, 'num']}
      >
        <Input placeholder="请输入"/>
      </Form.Item>
    )
  },{
    width: 0,
    dataIndex: "retailPrice",
    render: (t, r, i)=> (
      <Form.Item
        noStyle
        initialValue={t}
        name={['specialSkillGoodsVoList', i, 'retailPrice']}
        style={{display: "none"}}
      />
    )
  }
];


export default props => {
  const { behaviorTableGoodsList } = props;
  
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
                <Select.Option value="1">满足条件商品</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Table
              pagination={false}
              columns={columns}
              dataSource={behaviorTableGoodsList}
              size="small"
              rowKey="skuId"
              bordered
              style={{ margin: "20px 0", overflowY: "scroll", maxHeight: "200px"}}
              className={styles.configInfoTable}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}