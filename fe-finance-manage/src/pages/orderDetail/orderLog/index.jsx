import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Empty, message, Modal, Spin, Timeline } from "antd";
import { getOrderLog } from "@api/order";
import styles from "./index.module.scss";

const EUNM_LOG_POINT = {
  1: {
    text: '创建订单',
  },
  2: {
    text: '推送中宝审方',
    NOText: "处方ID",
    NOKey: "presNumber"
  },
  3: {
    text: '接收审方结果',
  },
  4: {
    text: '出库单推送WMS',
    NOText: "出库单号",
    NOKey: "wmsOrderNo"
  },
  5: {
    text: '接收出库结果',
    NOText: "出库单号",
    NOKey: "wmsOrderNo"
  },
  6: {
    text: '调用平台发货',
  },
  7: {
    text: '出库取消',
  },
}

const OrderLog = (props) => {
  const {
    onCancel,
    orderNo
  } = props;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderLog({orderNo}).then(res=> {
      let list = []
      if(res.status === 200) {
        list = res.data;
      } else {
        message.error(res.message);
      }
      unstable_batchedUpdates(() => {
        setLogs(list);
        setLoading(false);
      })
    })
  }, [])

  const lastIndex = logs.length - 1;

  return (
    <Modal
      footer={null}
      onCancel={onCancel}
      visible
    >
      <Spin spinning={loading}>
        {
          logs.length
            ? <Timeline>
                {
                  logs.map((d, index) => {
                    const isLast = index === lastIndex;
                    const { text, NOKey, NOText } = EUNM_LOG_POINT[d.logPoint] || {};
                    return (
                      <Timeline.Item 
                        key={d.logPoint} 
                        color={isLast ? undefined : 'gray'}
                        className={isLast && styles.inProgress}
                      >
                        <h3 className={styles.title}>
                          {`${text}${NOKey ? `(${NOText}：${d[NOKey]})` : ''}`}
                        </h3>
                        <span>{d.createTime}</span>
                      </Timeline.Item>
                    )
                  })
                }
              </Timeline>
            : <Empty />
        }
      </Spin>
    </Modal>
  )
}

export default OrderLog;