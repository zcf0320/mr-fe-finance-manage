import fetch from '@utils/request';

//售后列表
export function fetchAfterSaleList(data){
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/order/refund/list',
    data,
  });
}
//详情
export function fetchAfterSaleDeatil(data){
  return fetch({
      method: 'GET',
      url: `/api/mall-oms-e/api/oms/order/refund/detail/?refundNo=${data.refundNo}`,
   
  });
}
//发货
export function returnGoods(data){
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/order/refund/fillRefundLogistics',
    data,
  });
}
//取消发货
export function cancelOrder(data){
  return fetch({
    method: 'POST',
    url: '/api/mall-oms-e/api/oms/order/refund/cancel',
    data,
  });
}