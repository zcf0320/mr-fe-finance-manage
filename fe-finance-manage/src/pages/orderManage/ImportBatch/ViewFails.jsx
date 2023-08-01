import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "antd";
import { 
  findFailOrders,
  exportFailOrders
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

  const { list, total, searchLib } = dataSource;

  const _getData = (params = {}) => {
    let req = Object.assign(
      {id: info.id}, 
      searchLib, 
      params
    );
    (!loading) && setLoading(true)
    findFailOrders(req).then(res => {
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

  const columns = [
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
      title: "SKUID",
      align: "center",
      dataIndex: "skuId",
      width: 80,
    }, {
      title: "平台单价",
      align: "center",
      dataIndex: "retailPrice",
      width: 90,
    }, {
      title: "购买数量",
      align: "center",
      dataIndex: "goodsNum",
      width: 90,
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
      title: "失败原因",
      align: "center",
      dataIndex: "failureDesc",
    }
  ]

  const _handleExport = () => {
    setLoading(true)
    exportFailOrders({
      batchNo: info.batchNo,
      ...searchLib
    }).then(res=> {
      if(res) {
        exportFile(
          "导入失败列表.xlsx",
          res
        )
      }
      setLoading(false)
    })
  }

  return (
    <Modal
      visible
      title="校验失败订单明细"
      maskClosable={false}
      footer={null}
      onCancel={onCancel}
      width={800}
    >
      <Button
        type="primary"
        onClick={_handleExport}
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