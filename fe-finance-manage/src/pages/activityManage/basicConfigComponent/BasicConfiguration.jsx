import moment from 'moment';
import { Form, Row, Col, Input, DatePicker, TimePicker, Select, Radio } from 'antd';
import { activityTypeList, activityPlatformList } from '../ListColumns';

export default (props) => {
  const { handleChange, form, storeInformationList } = props;
  return (
    <Form
      form={form}
      name="activity_search"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      className="ant-advanced-search-form"
      onValuesChange={handleChange}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="activityName"
            label="活动名称"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="activityType"
            label="活动类型"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="请选择"
            >
              {activityTypeList.map(i => <Select.Option disabled={!i.status} value={i.key} key={i.key}>{i.value}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="platformId"
            label="活动平台"
            initialValue={1}
            rules={[{ required: true }]}
          >
            <Select placeholder="请选择">
              {activityPlatformList.map(i => <Select.Option disabled={!i.status} value={i.key} key={i.key}>{i.value}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="生效时间" style={{ marginBottom: "0" }} >
            <Form.Item
              name="startDate"
              rules={[{ required: true, message: "请选择生效日期" }]}
              style={{ display: 'inline-block', width: 'calc(50% - 4px)' }}
              initialValue={moment()}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="startTime"
              rules={[{ required: true, message: "请选择生效时间" }]}
              style={{ display: 'inline-block', width: 'calc(50% - 4px)' }}
              initialValue={moment('00:00:00', 'HH:mm:ss')}
            >
              <TimePicker />
            </Form.Item>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="失效时间" style={{ marginBottom: "0" }} >
            <Form.Item
              name="endDate"
              rules={[{ required: true, message: "请选择失效日期" }]}
              style={{ display: 'inline-block', width: 'calc(50% - 4px)' }}
              initialValue={moment()}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="endTime"
              rules={[{ required: true, message: "请选择失效时间" }]}
              style={{ display: 'inline-block', width: 'calc(50% - 4px)' }}
              initialValue={moment('23:59:59', 'HH:mm:ss')}
            >
              <TimePicker />
            </Form.Item>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="supplierId"
            label="活动店铺"
            style={{ marginBottom: "0"}}
            rules={[{required: true}]}
          >
            <Select placeholder="请选择">
              {storeInformationList.map(i => <Select.Option value={i.id} key={i.id}>{i.abbrName}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="mutexType"
            label="是否互斥"
            rules={[{ required: true }]}
            initialValue={0}
          >
            <Radio.Group >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}