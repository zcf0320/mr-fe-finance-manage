import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "antd";
import { 
  findCancelOrders,
  exportCancelOrders
} from "@api/order";
import { 
  exportFile 
} from "@utils/common";

const ViewFails = ({
  info,
  onCancel
}) => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState({
    list: [],
    total: 0,
    searchLib: {
      pageNum: 1,
      pageSize: 10
    },
  });
  const title = ["取消出库成功订单明细","部分取消出库成功订单明细","取消出库失败订单明细"][info.cancelStatus-1]
  const exportName = ["取消出库成功订单列表.xlsx", "部分取消出库成功订单列表.xlsx", "取消出库失败订单列表.xlsx"][info.cancelStatus-1]

  const { list, total, searchLib } = dataSource;

  const _getData = (params = {}) => {
    let req = Object.assign(
      {batchId: info.id, status: info.cancelStatus}, 
      searchLib, 
      params
    );
    (!loading) && setLoading(true)
    findCancelOrders(req).then(res => {
      let data = [], count = 0;
      if (res.status == 200) {
        const { list, total, records } = res.data || {};
        data = list || records;
        count = total;
      } else {
        message.error("列表获取失败");
      }
      setDataSource({
        list: data,
        total: count,
        searchLib: req,
      })
      setLoading(false)
    }).catch(() => {
      setDataSource({
        list: [],
        total: 0,
        searchLib: req,
      })
      setLoading(false)
    })
  }

  useEffect(()=> {
    if(info.failNumber < 1) {
      setLoading(false)
    } else {
      _getData()
    }
  }, [])

  const _handlePage = (pageNum, pageSize) =>  _getData({ pageNum, pageSize })

  const column = [
    {
      title: "平台订单号",
      align: "center",
      dataIndex: "thirdOrderNo",
      width: 90,
    }, {
      title: "平台",
      align: "center",
      dataIndex: "thirdPlatformDesc",
      width: 80,
    }, {
      title: "店铺",
      align: "center",
      dataIndex: "supplierName",
      width: 80,
    }, {
      title: "订单金额",
      align: "center",
      dataIndex: "totalAmount",
      width: 90,
    }, {
      title: "订单实付",
      align: "center",
      dataIndex: "paymentAmount",
      width: 90,
    }, {
      title: "收货人手机号",
      align: "center",
      dataIndex: "receiverTel",
    },  {
      title: "收货人地址",
      align: "center",
      dataIndex: "receiverAddress",
    }
  ]

  const columns = info.cancelStatus === 3 
  ? [
    ...column, {
    title: "失败原因",
    align: "center",
    dataIndex: "failureDesc",
  }]
  : column

  const _handleExport = () => {
    setLoading(true)
    exportCancelOrders({
      batchId: info.batchId,
      status: info.cancelStatus,
      ...searchLib
    }).then(res=> {
      if(res) {
        exportFile(
          exportName,
          res
        )
      }
      setLoading(false)
    })
  }

  return (
    <Modal
      visible
      title={title}
      maskClosable={false}
      footer={null}
      onCancel={onCancel}
      width={800}
    >
      <Button
        type="primary"
        onClick={_handleExport}
        style={{ float: "right", marginBottom: "20px"}}
        disabled={list.length < 1}
      >
        导出
      </Button>
      <Table 
        rowKey="id"
        size="small"
        bordered
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          total,
          size: "small",
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: _handlePage,
          current: searchLib.pageNum,
          pageSize: searchLib.pageSize,
        }}
      />
    </Modal>
  )
}

export default ViewFails;