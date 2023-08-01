import fetch from '@utils/request';
//新特药财务审批查询
export function summaryList(params) {
    return fetch.post('/api/finance-product/api/tpa/queryTpaOrderSummary', params)
};
//新特药财务审批明细查询
export function summaryDetail(params) {
    return fetch.post('/api/finance-product/api/tpa/queryTpaOrderDetail', params)
};
//新特药批次查询
export function batchQueryList(params) {
    return fetch.post('/api/finance-product/api/tpa/queryPaymentBatch', params)
};
//付款接口
export function sumbitPayStatement(params) {
    return fetch.post('/api/finance-product/api/liquidation/statement/payStatement', params)
};
//取消付款
export function cancelPayStatement(params) {
    return fetch.post('/api/finance-product/api/liquidation/statement/cancelPayStatement', params)
};
//财务审批/驳回订单
export function approveOrder(params) {
    return fetch.post('/api/finance-product/api/tpa/applyPayment', params)
};
//收款信息维护查询
export function collectionList(params) {
    return fetch.post('/api/finance-product/api/tpa/queryPayeeInfo', params)
};
//收款信息维护更新
export function collectionUpdate(params) {
    return fetch.post('/api/finance-product/api/tpa/updatePayeeInfo', params)
};