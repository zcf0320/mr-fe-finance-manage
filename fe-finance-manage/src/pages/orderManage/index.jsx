import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Modal, message, Input, Form } from 'antd';
import * as _ from 'lodash';
import '@ant-design/pro-table/dist/table.css';
import { getOrderColumns } from './listColumns';
import MaterialsModal from './materialsModal';
import {
  fetchOrderManageList,
  fetchExportData,
  auditOrder,
  cancelOrder,
  getOrgInfo
} from '@api/orderManage';
import ShipModal from '../component/shipModal';

const { confirm } = Modal;
const { TextArea } = Input;
export default props => {
  const actionRef = useRef();
  const formRef = useRef();
  const [exportLoading, setExportLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [materialVisible, setMaterialVisible] = useState(false);
  const [skuidsList, setSkuidList] = useState([]); //物料编码列表
  const [id, setId] = useState(null);
  const [shipVisible, setShipVisible] = useState(false); //发货
  const [visible, setVisible] = useState(false);
  const [basicOrgs, setBasicOrgs] = useState({});
  const { history } = props;

  useEffect(() => {
    getOrgInfo().then(res => {
      if (res.status === 200) {
        const basicOrgs = {}
        res.data?.forEach(d => {
          basicOrgs[d.code] = d.name;
        });
        setBasicOrgs(basicOrgs)
      } else {
        message.error(res.message)
      }
    })
  }, [])

  const jumpToDetail = (record) => {
    history.push({ pathname: `/oms-order/manage/detail`, state: { id: record.id } });
  };
  const batchExportData = async () => {
    let res;
    setExportLoading(true);
    try {
      res = await fetchExportData(searchParams);
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
  const showAuditModal = (record) => {
    if (_.isEmpty(record.skuIds)) {
      confirm({
        title: '确认审核完成？',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return auditDone(record);
        },
      });
    } else {
      setId(record.id);
      setSkuidList(record.skuIds);
      setMaterialVisible(true);
    }
  };
  const auditDone = async (record) => {
    try {
      const res = await auditOrder({ id: record.id });
      if (res.status == 200) {
        message.success('审核成功');
        actionRef.current.reload();
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error(e.error);
    }
  };
  const showCancelOrderModal = (record) => {
    setTimeout(() => {
      formRef.current.setFieldsValue({
        id: record.id,
      });
    }, 100);
    setVisible(true);
  };

  const cancelDone = async (data) => {
    const { id, cancelReason } = data;
    if (cancelReason === undefined) {
      message.error('请填写取消原因！');
      return;
    } else {
      await cancelOrder(id, cancelReason);
      actionRef.current.reload();
    }
    formRef.current.resetFields();
    handleCancel();
  };
  //关闭Madal
  const handleCancel = () => {
    setVisible(false);
    formRef.current.resetFields();
  };

  const showShipModal = (record) => {
    setShipVisible(true);
    setId(record.id);
  };

  const _handleViewReason = (record) => () => {
    Modal.warning({
      icon: null,
      title: "",
      content: `处方审核失败原因：${record.inquiryTwiceCheckMsg || "-"}`
    })
  }

  const tempColumns = [
    ...getOrderColumns({
      basicOrgs,
      viewReason: _handleViewReason
    }),
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (text, record) => [
        <div key='1'>
          <div style={{ display: 'flex' }}>
            {record.operationalButtons?.includes(1) &&
              <Button size='small' type='link' onClick={() => jumpToDetail(record)}>
                详情
              </Button>
            }
            {record.operationalButtons?.includes(2) &&
              <Button size='small' type='link' onClick={() => showShipModal(record)}>
                发货
              </Button>
            }
            {record.operationalButtons?.includes(3) &&
              <Button size='small' type='link' onClick={() => showAuditModal(record)}>
                审核
              </Button>
            }
            {record.operationalButtons?.includes(4) &&
              <Button size='small' type='link' onClick={() => showCancelOrderModal(record)}>
                取消
              </Button>
            }
            {record.operationalButtons?.includes(5) &&
              <Button size='small' type='link' onClick={() => abnormalReason(record)}>
                查看异常原因
              </Button>
            }
          </div>
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
      result = await fetchOrderManageList(newParams);
      setSearchParams(newParams);
    } catch (error) {
    }
    return {
      data: result.data.list || [],
      size: result.data.pageSize,
      current: result.data.pageNum,
      total: result.data.total,
      success: true,
    };
  };
  const abnormalReason = (record) => {
    confirm({
      title: '异常原因',
      content: record.pushWmsFailureReason,
      onOk() {
      },
    });
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
            // </Button>,
            <Button key='3' type='primary' loading={exportLoading} onClick={() => batchExportData()}>
              批量导出数据
            </Button>,
          ];
        }}

      ></ProTable>
      {/* <BatchImportModal
      batchImportVisible={batchImportVisible}
      setbatchImportVisible={setbatchImportVisible}
    /> */}
      <ShipModal
        shipVisible={shipVisible}
        setShipVisible={setShipVisible}
        id={id}
        isReturn={false}
        successCallback={() => actionRef.current.reload()}
      />
      <MaterialsModal
        materialVisible={materialVisible}
        setMaterialVisible={setMaterialVisible}
        skuidsList={skuidsList}
        id={id}
        successCallback={() => actionRef.current.reload()}
      />
      <Modal
        title='填写取消出库原因'
        visible={visible}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form ref={formRef} name='nest-messages' onFinish={cancelDone}>
          <Form.Item name='id' hidden>
            <Input />
          </Form.Item>
          <Form.Item name='cancelReason'>
            <TextArea autoSize={{ minRows: 10, maxRows: 6 }} showCount maxLength={500} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center', marginTop: '50px' }}>
            <Button type='primary' htmlType='submit'>
              确定
            </Button>
            <Button style={{ marginLeft: '20px' }} type='dashed' onClick={handleCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </>
  );
}
