import React, { useCallback, useState, useMemo } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Upload,
} from "antd";
import MiniTable from '@components/MiniTable';
import ViewFails from "./ViewFails";
import {
  findImportCancelBatchList,
  importCancelBatchOrder,
  confirmImportCancelBatch,
  deleteImportCancelBatch,
  downloadCancelBatchTemplate
} from "@api/order";
import {
  exportFile,
  formatSearchDate
} from "@utils/common";
import {
  DATE_FORMAT
} from '@utils/constants';
import basicData from '@utils/basicData';

const ImportBatch = (props) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optItem, setOptItem] = useState(false);
  const [refrash, setRefrash] = useState(0);

  const columns = [
    {
      title: "批次号",
      align: "center",
      dataIndex: "id",
    }, {
      title: "渠道",
      align: "center",
      dataIndex: "thirdPlatformDesc"
    }, {
      title: "批次导入时间",
      align: "center",
      dataIndex: "createTime",
    }, {
      title: "导入订单总数",
      align: "center",
      dataIndex: "totalCnt",
    }, {
      title: "取消出库成功订单数",
      align: "center",
      dataIndex: "successCnt",
      render: (t, r) => (
        <Button
          type="link"
          onClick={_handleViewFail(r, 1)}
        >
          {t}
        </Button>
      )
    }, {
      title: "部分取消出库成功订单数",
      align: "center",
      dataIndex: "partFailureCnt",
      render: (t, r) => (
        <Button
          type="link"
          onClick={_handleViewFail(r, 2)}
        >
          {t}
        </Button>
      )
    }, {
      title: "取消出库失败订单数",
      align: "center",
      dataIndex: "failureCnt",
      render: (t, r) => (
        <Button
          type="link"
          onClick={_handleViewFail(r, 3)}
        >
          {t}
        </Button>
      )
    }, {
      title: "订单导入状态",
      align: "center",
      dataIndex: "status",
      render: (t, r) => (
        // 0.未处理1.处理中2.处理完成
        ({
          0: "未处理",
          1: "处理中",
          2: "处理完成",
        })[t]
      )
    }, {
      title: "创建人",
      align: "center",
      dataIndex: "userName",
    },
    {
      title: "操作人",
      align: "center",
      dataIndex: "executeName",
    },
    {
      title: "操作",
      align: "center",
      fixed: "right",
      width: 150,
      dataIndex: "status",
      render: (t, r) => (
        t != 0 ? null
          : (
            <>
              <Button
                type="link"
                onClick={_handleConfirm(r)}
              >
                开始处理
              </Button>
              <Button
                type="link"
                onClick={_handleDelete(r)}
              >
                取消批次
              </Button>
            </>
          )
      )
    }
  ]

  const _handleDownTemplate = () => {
    downloadCancelBatchTemplate()
      .then(res => {
        if (res) {
          exportFile(
            "导入取消批次模板.xlsx",
            res
          )
        }
      })
  }

  const _handleImport = ({ file }) => {
    let param = new FormData();
    param.append('file', file);
    setLoading(true)
    importCancelBatchOrder(param).then(res => {
      if (res.status === 200) {
        message.success("导入成功!");
        setRefrash(Date.now())
      } else {
        message.error(res.message);
      }
      setLoading(false);
    }).catch(err => {
      setLoading(false)
    })
  };

  const _handleHide = () => {
    setShow(false);
  };

  const _handleViewFail = (record, cancelStatus) => () => {
    setShow(true)
    setOptItem({
      ...record,
      cancelStatus,
    })
  };

  const _confirm = ({
    title,
    optionFunc,
    id
  }) => {
    Modal.confirm({
      icon: null,
      title,
      onOk: () => {
        setLoading(true);
        return optionFunc(id).then(res => {
          if (res.status === 200) {
            setRefrash(Date.now())
          } else {
            message.error(res.message)
          }
          setLoading(false);
        })
      }
    })
  }

  const _handleConfirm = ({ id }) => () => {
    _confirm({
      id,
      title: "确认开始处理订单？",
      optionFunc: confirmImportCancelBatch,
    })
  }

  const _handleDelete = ({ id }) => () => {
    _confirm({
      id,
      title: "是否确认删除批次？",
      optionFunc: deleteImportCancelBatch,
    })
  }

  const _getLists = useCallback((params) => {
    const { time, ...rest } = params;
    const req = rest;
    const [start, end] = time || [];
    if (end) {
      req['startTime'] = formatSearchDate(start);
      req['endTime'] = formatSearchDate(end, true);
    }
    return findImportCancelBatchList(req);
  }, [])

  const _platform = useMemo(() => {
    const platformList = [{ label: "全部", value: null }];
    Object.entries(basicData.getPlatForm()).reduce((list, [key, name]) => {
      list.push({ label: name, value: key });
      return list;
    }, platformList);
    return platformList;
  }, [])

  return (
    <Spin spinning={loading}>
      <MiniTable
        refrash={refrash}
        tableConfig={{
          columns,
          bordered: true,
          scroll: { x: 950 }
        }}
        otherBtns={[
          <Button
            type="primary"
            key="download"
            onClick={_handleDownTemplate}
          >
            下载模板
          </Button>,
          <Upload
            key="import"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            listType="text"
            showUploadList={false}
            customRequest={_handleImport}
          >
            <Button
              type="primary"
            >
              导入批次订单
            </Button>
          </Upload>
        ]}
        requestPromise={_getLists}
      >
        <Form.Item label="批次号" name="id">
          <Input autoComplete="off" placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="平台"
          name="thirdPlatformId"
          initialValue={null}
        >
          <Select
            options={_platform}
          />
        </Form.Item>
        <Form.Item
          label="处理状态"
          name="status"
          initialValue={null}
        >
          <Select
            options={[
              { label: "全部", value: null },
              { label: "未处理", value: 0 },
              { label: "处理中", value: 1 },
              { label: "处理完成", value: 2 },
            ]}
          />
        </Form.Item>
        <Form.Item label="导入时间" name="time">
          <DatePicker.RangePicker format={DATE_FORMAT} />
        </Form.Item>
      </MiniTable>
      {
        show && <ViewFails info={optItem} onCancel={_handleHide} />
      }
    </Spin>
  )
}


export default ImportBatch;
