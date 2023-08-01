import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { useRef, useState, useEffect  } from 'react';
import { Button, Form, message, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { getActivityList, getStoreInformation } from '@api/activity';
import { BillColumns } from './ListColumns';
import '@ant-design/pro-table/dist/table.css';

export default ({history}) => {
  const [params, setParams] = useState({});
  const [storeInformationList, setStoreInformationList] = useState([]);
  const [platformId, setplatformId] = useState(1);

  const actionRef = useRef();
  const formRef = useRef();
  const ref = useRef();
  const [form] = Form.useForm();
  
  useEffect(() => {
    getShopInformation();
  }, [platformId])

  useEffect(() => {
    formRef.current.submit();
  }, [])

  const getShopInformation = async () => {
    try {
      const res = await getStoreInformation({id: platformId});
      if (res.data) {
        const cacheMap = {}
        res.data.forEach(item => {
          cacheMap[item.id] = item.abbrName
        })
        setStoreInformationList(cacheMap);
      } else {
        message.error("获取店铺信息错误");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const BillColumn = [
    ...BillColumns,
    
  {
    // 平台：1复星健康云商城3邦甸园商城
    title: '活动平台',
    dataIndex: 'platformId',
    renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
      return [
        <Form.Item name="platformId" label="发布平台" initialValue={'1'}>
          <Select
            onChange={(value) => {setplatformId(value)}}
            placeholder="复星健康云商城"
            allowClear={true}
          >
            <Select.Option key={1}>复星健康云商城</Select.Option>
            <Select.Option key={3}>邦甸园</Select.Option>
          </Select>
        </Form.Item>
      ]
    },
    valueEnum: {
      1: {
        text: '复星健康云商城',
      },
      3: {
        text: '邦甸园商城',
      },
    }
  },
    {
      title: '活动店铺',
      hideInTable: true,
      dataIndex: 'taxpayerCode',
      valueEnum: storeInformationList,
    },{
      title: '操作',
      dataIndex: 'invoiceStatus',
      key: 'invoiceStatus',
      valueType: 'dateRange',
      hideInSearch: true,
      //开票订单状态,1:待开票2:开票中3:开票成功4:开票失败5:已冲红 6:冲红中
      render: (_, record) => {
        return ;
      }
    },
  ];

  return (
    <>
      <ProTable
        columns={BillColumn}
        actionRef={ref}
        formRef={formRef}
        params={params}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          let postData = { pageNum: params.current };
          if ((params.settleTime || []).length == 2) {
            postData = {
              ...postData,
              ...params,
              startDate: moment(params.settleTime[0]).format('YYYY-MM-DD'),
              endDate: moment(params.settleTime[1]).format('YYYY-MM-DD'),
            };
          } else {
            postData = {
              ...postData,
              ...params,
              startDate: moment().subtract(1, 'M').format('YYYY-MM-DD') ,
              endDate: moment().format('YYYY-MM-DD'),
            };
          }
          if (postData.hasOwnProperty('settleTime')) {
            delete postData.settleTime;
          }
          if (postData.hasOwnProperty('current')) {
            delete postData.current;
          }
          try {
            const res = await getActivityList(postData);
            return Promise.resolve({
              data: res.data.list,
              size: res.data.pageSize,
              current: res.data.pageNum,
              total: res.data.total,
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
        rowKey="id"
        dateFormatter="string"
        pagination={{
          showQuickJumper: true,
        }}
        search={{
          span: 6,
          labelWidth: 'auto',
          optionRender: false,
          collapsed: false,
          collapseRender: () => {return ''}
        }}
        toolBarRender={() => [
          <Button key="show" onClick={() => formRef.current.submit()} type="primary"><SearchOutlined />搜索</Button>,
          <Button key="primary" type="primary" onClick={() => {history.push("/activityEngine/createActivity")}}><PlusOutlined />新建</Button>,
        ]}
      >
    </ProTable>
  </>
  );
};
