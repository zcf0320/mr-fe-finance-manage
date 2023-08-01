import fetch from '@utils/request';
//分页查询
export function getCostPageList(params) {
    return fetch.post('/api/finance-check/api/checkFeeManage/queryPage', params)
};
//添加费用规则
export function addCostPageList(params) {
    return fetch.post('/api/finance-check/api/checkFeeManage/add', params)
};
//修改费用规则
export function changCostPageList(params) {
    return fetch.post('/api/finance-check/api/checkFeeManage/modify', params)
};
//查看费用规则
export function lookCostPageList(params) {
    return fetch.post('/api/finance-check/api/checkFeeManage/queryDetail', params)
};
