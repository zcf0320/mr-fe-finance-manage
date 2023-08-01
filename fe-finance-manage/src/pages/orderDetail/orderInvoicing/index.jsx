import React, { useState, useEffect } from 'react';
import { Button, message, Space, Table, Modal } from 'antd';
import { orderInvoicingList } from '../listColumns.js';
import Viewer from 'react-viewer';
import FileSaver from 'file-saver';
import { requestInvoice, fetchInvoiceList, goRed, markInvoice } from '../../../api/orderManage';
import ModalForm from './components/ModalForm'
import { getInvoicOrderList } from '@api/invoice'

const btnStyle = { cursor: 'pointer', color: '#1890ff', paddingRight: 6 };
const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
  },
};
export default props => {
  const { reflesh, detailData } = props;
  const { orderNo, thirdOrderNo, offlineImportFlag, invoiceType: type } = detailData;
  const [imageVisible, setImageVisible] = useState(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [offlineVisible, setOfflineVisible] = useState(false);
  const [operateType, setOperateType] = useState(null);
  const [currentMessage, setCurrentMessage] = useState({});
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([]);
  const [invoiceAmount, setInvoiceAmount] = useState(0);

  useEffect(async () => {
    if (thirdOrderNo) {
      await getInvoiceList();
    }
  }, [thirdOrderNo])

  const getInvoiceList = async () => {
    try {
      const res = await fetchInvoiceList(thirdOrderNo);
      if (res.status == 200) {
        setInvoiceList(res.data);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log(err)
    }

  }

  const onShowError = (record) => {
    Modal.error({
      title: '开票失败',
      content: record.reason,
    });
  }

  const invoicingList = [
    ...orderInvoicingList,
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => {
        // thirdPlatformId!=1 and invoiceStatus=3
        return record.invoiceStatus === 4 ?
          (
            <Button type='link' onClick={() => onShowError(record)}>查看失败原因</Button>
          ) : (
            <Space size="middle">
              <Button type='link' onClick={() => showReView(record)}>预览</Button>
              <Button type='link' onClick={() => download(record)}>下载</Button>
              {
                (record.thirdPlatformId !== 1 && record.invoiceStatus === 3) && record.orderType === 1 && (
                  <Button type='link' onClick={() => showGoRed(record)}>冲红</Button>
                )
              }
            </Space>
          )
      },
    },
  ]

  const showReView = (record) => {
    // setImageUrl('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png');
    setCurrentMessage(record);
    setImageVisible(true);
  }
  const imageClose = () => {
    setImageVisible(false);
  }
  const download = (record) => {
    FileSaver(record.pdfUrl, '发票')
  }
  const showRequestBill = () => {
    setLoading(true)
    getInvoicOrderList({ orderNo: thirdOrderNo }).then(d => {
      if (d.status === 200) {
        setDataSource(d.data.invoiceItemVos);
        setInvoiceAmount(d.data.invoiceAmount);
        setRequestVisible(true)
      } else {
        message.error(d.message)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  const showMrakBill = () => {
    setOfflineVisible(true);
    setOperateType(0);
  }
  const requestCancel = () => {
    setRequestVisible(false);
  }
  const requestOk = async (values) => {

    values.invoiceSource = 2; //写死的来源
    values.orderNo = thirdOrderNo;
    try {
      setLoading(true)
      const res = await requestInvoice(values);
      if (res.status == 200) {
        message.success('操作成功');
        getInvoiceList();
        setRequestVisible(false);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }
  const offlineCancel = () => {
    setOfflineVisible(false);
  }
  const offlineOk = async () => {
    try {
      const res = await (operateType == 1 ? goRed(thirdOrderNo) : markInvoice({ orderNo }));
      if (res.status == 200) {
        message.success('操作成功');
        if (operateType != 1) {
          reflesh();
        } else {
          getInvoiceList();
        }
        setOfflineVisible(false);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const showGoRed = (record) => {
    setOperateType(1);
    setOfflineVisible(true);
    setCurrentMessage(record);
  }

  return (
    <div>
      <p style={{ marginTop: 14, color: '#1890ff' }}>订单开票信息</p>
      {
        (type !== 2 && !invoiceList.length)
        &&
        (
          <Space style={{ marginBottom: 14 }}>
            <Button type='primary' loading={loading} onClick={showRequestBill}>申请电子发票</Button>
            <Button type='primary' onClick={showMrakBill}>标记为线下开票</Button>
          </Space>
        )
      }
      {
        (type !== 2 && !!invoiceList.length) &&
        (
          <Table
            size="small"
            pagination={false}
            columns={invoicingList}
            dataSource={invoiceList}
            rowKey="orderNo"
          />
        )
      }
      {
        type === 2 && (
          <h3>此订单已标记为线下开票</h3>
        )
      }
      <Viewer
        visible={imageVisible}
        onClose={imageClose}
        images={[{ src: currentMessage.imgUrl, alt: '' }]}  //{[{src:currentMessage.imgUrl,alt:''}]} 
      />

      <ModalForm
        visible={requestVisible}
        dataSource={dataSource}
        invoiceAmount={invoiceAmount}
        onCancel={requestCancel}
        onSave={requestOk}
        loading={loading}
      />

      <Modal
        title={!operateType ? '标记为线下开票' : '冲红'}
        visible={offlineVisible}
        onCancel={offlineCancel}
        onOk={offlineOk}
        destroyOnClose={true}
      >
        <p>{`是否确定${!operateType ? '已线下开票？' : '冲红发票？'}`}</p>
      </Modal>

    </div>
  )
}