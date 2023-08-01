import fetch from '@utils/request';

//订单列表
export function fetchOrderManageList(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/order/get/list',
    data,
  });
}

//导出数据
export function fetchExportData(data) {
  return fetch({
    method: 'POST',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
    url: '/api/mall-oms-e/api/oms/order/exportOMSOrderExcel',
    data,
  });
}

//下载批量发货模板
export function exportBatchMould(data) {
  return request(`/api/oms/order/downloadTemplate`, {
    method: 'POST',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

//取消订单
export function cancelOrder(id, data) {
  return fetch({
    method: 'POST',
    url: `/api/mall-oms-e/api/oms/order/cancelOMSOrder/${id}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
}

//物流公司
export function fetchLogisticsList() {
  return fetch({
    method: 'GET',
    url: `/api/mall-oms-e/api/oms/express/list`,
  });
}

//订单发货
export function shipOrder(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/order/ship',
    data,
  });
}

//订单审核
export function auditOrder(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/order/checkOMSOrder',
    data,
  });
}

//订单详情
export function fetchOrderDetail(id) {
  return fetch({
    method: 'GET',
    url: `/api/mall-oms-e/api/oms/order/get/${id}`,
  });
}

//订单详情商品退货
export function returnCommodity(data) {
  return fetch({
    method: 'POST',
    url: `/api/mall-oms-e/api/oms/order/refund/create`,
    data,
  });
}

//订单详情申请单子发票
export function requestInvoice(data) {
  return fetch({
    method: 'POST',
    url: `/api/mall-oms-e/api/oms/order/add`,
    data,
  });
}

//订单详情列表
export function fetchInvoiceList(id) {
  return fetch({
    method: 'POST',
    url: `/api/mall-oms-e/api/oms/order/list/?orderNo=${id}`,
  });
}

//订单详情发票冲红操作
export function goRed(id) {
  return fetch({
    method: 'POST',
    url: `/api/mall-oms-e/api/oms/order/make/red/?orderNo=${id}`
  });
}

//订单详情标记线下开票
export function markInvoice(data) {
  return fetch({
    method: 'POST',
    url: `/api/mall-oms-e/api/oms/order/markOfflineInvoice`,
    data,
  });
}

//订单详情页，物流详情
export function logisticsList(data){
  return fetch({
    method:'GET',
    url:`/api/mall-oms-e/api/expressDelivery/info?companyCode=${data.companyCode}&&expressNo=${data.expressNo}`,
    data
  })
}

//获取机构列表
export function getOrgInfo() {
  return fetch({
    method: 'GET',
    url: `/api/mall-oms-e/api/oms/b2b/order/getOrgInfo`
  });
}
