import {  Form, Row, Col, Input,Cascader } from 'antd';

const options = [
  {
    value: '1',
    label: '改价',
    children: [
      {
        value: '1',
        label: '折扣',
      }
    ],
  },
];

export default props => {
  
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
              name="discountPrecent"
              label="折扣比例"
              style={{margin: "20px 0 20px 0"}}
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入折扣比例：0-100" suffix="%"></Input>
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}