import React, { useCallback, useMemo, useState } from "react";
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
  Tooltip
} from "antd";
import MiniTable from '@components/MiniTable';
import ViewFails from "./ViewFails";
import {
  findImportBatchList,
  importBatchOrder,
  confirmImportBatch,
  deleteImportBatch,
  downloadBatchTemplate
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
      title: "校验成功订单数",
      align: "center",
      dataIndex: "successCnt",
    }, {
      title: "校验失败订单数",
      align: "center",
      dataIndex: "failureCnt",
      render: (t, r) => (
        <Button
          type="link"
          onClick={_handleViewFail(r)}
        >
          {t}
        </Button>
      )
    }, {
      title: "订单导入状态",
      align: "center",
      dataIndex: "statusDesc"
    }, {
      title: "创建人",
      align: "center",
      dataIndex: "userName",
    }, {
      title: "操作人",
      align: "center",
      dataIndex: "importOmsUserName",
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
                确认导入
              </Button>
              <Button
                type="link"
                onClick={_handleDelete(r)}
              >
                删除批次
              </Button>
            </>
          )
      )
    }
  ]

  const _handleDownTemplate = () => {
    downloadBatchTemplate()
      .then(res => {
        if (res) {
          exportFile(
            "导入模板.xlsx",
            res
          )
        }
      })
  }

  const _handleImport = ({ file }) => {
    let param = new FormData();
    param.append('file', file);
    setLoading(true)
    importBatchOrder(param).then(res => {
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

  const _handleViewFail = (record) => () => {
    setShow(true)
    setOptItem(record)
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
      title: "是否确认导入校验成功的订单？",
      optionFunc: confirmImportBatch,
    })
  }

  const _handleDelete = ({ id }) => () => {
    _confirm({
      id,
      title: "是否确认删除批次？",
      optionFunc: deleteImportBatch,
    })
  }

  const _getLists = useCallback((params) => {
    const { time, ...rest } = params;
    const req = rest;
    const [start, end] = time || [];
    if (end) {
      req['startCreateTime'] = formatSearchDate(start);
      req['endCreateTime'] = formatSearchDate(end, true);
    }
    return findImportBatchList(req);
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
          </Upload>,
          <Tooltip
            placement="top"
            title={
              <div style={{ fontSize: 12 }}>
                <div>导入说明：</div>
                <div>1、请先下载批量导入表格模板，填写好表格后上传导入</div>
                <div>2、导入条数限制5000条</div>
                <div>3、导入平台仅限天猫、京东、快手、抖音、网易严选、口碑、线下B2B、外部互联网医院</div>
                <div>4、导入的平台订单号不能与系统现有平台订单重复</div>
                <div>5、导入订单的SKUID必须为复星商城SKUID</div>
                <div>6、相同平台订单号的金额、收货信息必须一致</div>
              </div>
            }
          >
            <Button
              type="link"
            >
              导入说明
            </Button>
          </Tooltip>

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
          label="导入状态"
          name="status"
          initialValue={null}
        >
          <Select
            options={[
              { label: "全部", value: null },
              { label: "未导入", value: 0 },
              { label: "已导入", value: 2 },
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
