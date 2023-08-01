import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Modal, message, Input, Form } from 'antd';
import '@ant-design/pro-table/dist/table.css';
import * as _ from 'lodash';
import { orderColumns } from './listColumns.js';
import { getListOrderB2B, exportListOrderB2B, cancelOMSB2bOrder} from '../../api/orderB2B.js';

export default props => {
  const actionRef = useRef();
  const formRef = useRef();
  const [exportLoading, setExportLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reasons, setReasons] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const {history} = props;

  useEffect(() => {

  })
  

  const jumpToPage = (record, tag) => {
    let pathname = tag === 'detail' ? `/oms-orderB2B/manage/detail` : `/oms-orderB2B/manage/add`
    history.push({ pathname, state: { orderId: tag === 'add'? null : record.id } });
  };

  // 批量导出订单
  const batchExportData = async () => {
    let res;
    setExportLoading(true);
    try {
      res = await exportListOrderB2B(searchParams);
    } catch (error) {
      console.log(error);
    }
    setExportLoading(false);
    if (!res) {
      throw message.error('导出失败！');
    }
    message.success('导出成功！');
    let url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', '订单列表.xls');
    document.body.appendChild(link);
    link.click();
  };

  const tempColumns = [
    ...orderColumns,
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (text, record) => [
        <div>
          {record.status === 0 &&
            <Button size='small' type='link' onClick={() => jumpToPage(record, 'edit')}>
              编辑
            </Button>
            }
            {record.status !== 0 &&
              <Button size='small' type='link' onClick={() => jumpToPage(record, 'detail')}>
              详情
            </Button>
            }
            {(record.status === 1 || record.status === 2 ) &&
              <Button size='small' type='link' onClick={() => cancelOrder(record.id)}>
              取消
              </Button>
            }
        </div>,
      ],
    },
  ];

  const fetchList = async (params) => {
    const obj = { ...params };
    obj.createTimeBegin = obj.createTime[0];
    obj.createTimeEnd = obj.createTime[1];
    obj.pageNum = obj.current;
    const newParams = _.omit(obj, ['createTime', 'current']);
    let result;
    try {
      result = await getListOrderB2B(newParams);
      setSearchParams(newParams);
      if(result.status === 200){
        result.data.list.map(item => {
          item.receiverAddress = item.province + item.city + item.area + item.address;
        })
      }
    } catch (error) {
      console.log(error);
    }
    return {
      data: result.data.list || [],
      size: result.data.pageSize,
      current: result.data.pageNum,
      total: result.data.total,
      success: true,
    };
  };

  // 取消出库
  const cancelOrder =  (id) => {
    setCancelId(id);
    setIsModalVisible(true);
  }

  const handleOk = async () => {
    if(reasons && reasons.trim() !== ''){
      let result;
      let params = {
        id: cancelId,
        cancelReason: reasons,
      }
      setBtnLoading(true);
      try{
        result = await cancelOMSB2bOrder(params);
        handleCancel();
        if(result.status === 200){
          message.success(result.message);
          formRef.current.submit();
        }else{
          message.error(result.message);
        }
      }catch(err){
        console.log(err)
      }
    }else{
      message.warning('取消原因不能为空！');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setReasons('');
    setBtnLoading(false);
  };

  return (
    <>
      <ProTable
        columns={tempColumns}
        actionRef={actionRef}
        rowKey='key'
        request={fetchList}
        scroll={{ x: 1300 }}
        rowKey='orderId'
        formRef={formRef}
        search={{ defaultCollapsed: false, labelWidth: 100 }}
        manualRequest={false}
        toolBarRender={(action) => {
          return [
            <>
              <Button key='3' type='primary' onClick={() => jumpToPage( null, 'add')}>
                新增订单
              </Button>
              <Button key='3' type='primary' loading={exportLoading} onClick={batchExportData}>
                批量导出
              </Button>
            </>,
          ];
        }}

      ></ProTable>

      <Modal confirmLoading={btnLoading} title="取消原因" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input.TextArea placeholder="请输入取消原因" value={reasons} onChange={e => setReasons(e.target.value)} />
      </Modal>
    </>
  );
}