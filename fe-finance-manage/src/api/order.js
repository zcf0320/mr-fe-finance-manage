import fetch from '@utils/request';

//交易记录
export function tradingRecordQuery(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-payment-e/api/trade/record/query',
    data,
  });
}

//交易记录导出
export function exportTradingRecord(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-payment-e/api/trade/record/output',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
    data
  });
}

//记账明细
export function bookkeepingQuery(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-payment-e/api/bill/detailrecord/query',
    data,
  });
}

//账单明细
export function billList(params) {
  return fetch({
    method: 'GET',
    url: '/api/mall-payment-e/api/bill/detail/list',
    params,
  });
}

//账单明细 -下载导入excel模板
export function exportBillDownloadExcelTemplate(params) {
  return fetch({
    method: 'GET',
    url: '/api/mall-payment-e/api/bill/detail/download/import/excel/template',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
  });
}

//账单明细 -导出账单明细
export function exportBillList(params) {
  return fetch({
    method: 'GET',
    url: '/api/mall-payment-e/api/bill/detail/download/bill/detail',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
    params
  });
}

//账单明细
export function paymentLogList(params) {
  return fetch({
    method: 'GET',
    url: '/api/mall-payment-e/api/bill/detail/payment/log/list',
    params,
  });
}

//导入预付款订单
export function importPrepaidOrder(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-payment-e/api/bill/detail/import/prepaid/order',
    headers: {
      // 'Content-Type': 'multipart/form-data',
    },
    data,
  });
}

//导入预付款订单
export function billPayStatics(params) {
  return fetch({
    method: 'GET',
    url: '/api/mall-payment-e/api/bill/detail/settle/pay/statics',
    params,
  });
}

//确认付款订单
export function confirmPaymentOrder(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-payment-e/api/bill/detail/import/confirmPayment/order',
    data,
  });
}

//导入付款订单
export function importPaymentOrder(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-payment-e/api/bill/detail/import/payment/order',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    data,
  });
}

/* 导入批次 */
//批次列表查询
export function findImportBatchList(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/order/get/list',
    data,
  });
}
//下载导入模板
export function downloadBatchTemplate() {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/order/downLoad/batchTemplate',
    responseType: 'blob',
  });
}
//导入批次订单
export function importBatchOrder(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/order/import/excelOrder',
    data
  });
}
//确认导入该批次
export function confirmImportBatch(id) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/order/import/orderToOms/' + id,
  });
}
//删除批次
export function deleteImportBatch(id) {
  return fetch({
    method: 'GET',
    url: '/api/mall-oms-e/api/oms/batch/order/delete/batch/' + id,
  });
}
//导出校验失败订单明细
export function exportFailOrders(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/order/export/excel/failureOrderDetail',
    data,
    responseType: 'blob',
  });
}
//查询校验失败订单明细
export function findFailOrders(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/order/get/failureOrderDetail',
    data,
  });
}



/* 导入取消批次 */
//批次列表查询
export function findImportCancelBatchList(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/cancel/query/list',
    data,
  });
}
//下载导入模板
export function downloadCancelBatchTemplate() {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/cancel/downLoad/batchTemplate',
    responseType: 'blob',
  });
}
//导入批次订单
export function importCancelBatchOrder(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/cancel/import',
    data
  });
}

//处理批次
export function confirmImportCancelBatch(id) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/cancel/execute',
    data: { batchId: id }
  });
}

//删除批次
export function deleteImportCancelBatch(id) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/cancel/delete',
    data: { id }
  });
}

//查询导出取消出库订单明细
export function findCancelOrders(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/cancel/queryCancelOrderDetail',
    data,
  });
}

//导出取消出库订单明细
export function exportCancelOrders(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/batch/cancel/exportCancelOrderDetail',
    data,
    responseType: 'blob',
  });
}

// 获取订单日志
export function getOrderLog(params) {
  return fetch.get('/api/mall-oms-e/api/oms/order/log/list', {params});
}