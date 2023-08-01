import fetch from '@utils/request';

//查询b2b订单列表
export function getListOrderB2B(data) {
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/b2b/order/list',
    data,
  });
}

// 增加b2b订单
export function addOrderB2B(data) {
    return fetch({
        method: 'POST',
        url: '/api/mall-oms-e/api/oms/b2b/order/add',
        data,
    });
}

// 增加b2b订单草稿
export function addDraftOrderB2B(data) {
    return fetch({
        method: 'POST',
        url: '/api/mall-oms-e/api/oms/b2b/order/addDraft',
        data,
    });
}

//通过物料编码查询商品库存信息
export function getWmsStockInfo(params) {
  return fetch({
    method: 'GET',
    url: `/api/mall-oms-e/api/oms/b2b/order/wmsStockInfo`,
    params,
  });
}

//获取b2b订单的物流公司
export function getExpressCompanies() {
    return fetch({
      method: 'GET',
      url: '/api/mall-oms-e/api/oms/b2b/order/expressCompanies',
    });
}

//获取订单详情
export function getDetailOrderB2B(params) {
    return fetch({
      method: 'GET',
      url: `/api/mall-oms-e/api/oms/b2b/order/detail?orderId=${params}`,
    });
}

//获取成本部门单元
export function getCostRelationDetail() {
    return fetch({
      method: 'GET',
      url: '/api/mall-oms-e/api/oms/b2b/order/costRelationDetail',
    });
}

//获取机构信息
export function getOrgInfo() {
    return fetch({
      method: 'GET',
      url: '/api/mall-oms-e/api/oms/b2b/order/getOrgInfo',
    });
}

// 获取省市区
export function getCity() {
  return fetch({
    method: 'GET',
    url:'/api/mall-shop-e/api/supplier/region', 
  })
}

// 导出订单信息
export function exportListOrderB2B(data) {
  return fetch({
      method: 'POST',
      url: '/api/mall-oms-e/api/oms/b2b/order/exportList',
      responseType: 'blob',
      data,
  });
}

// B2B订单取消出库
export function cancelOMSB2bOrder(data) {
  return fetch({
      method: 'POST',
      url: '/api/mall-oms-e/api/oms/b2b/order/cancelOMSB2bOrder',
      data,
  });
}