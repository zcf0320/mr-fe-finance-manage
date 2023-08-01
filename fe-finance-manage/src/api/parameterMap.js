import fetch from '@utils/request';
//查询
export function parameterMapList(params) {
    return fetch.post('/api/finance-product/api/finParam/queryFinParam', params)
};
//未匹配参数
export function FinParamSapIsNullList(params) {
    return fetch.post('/api/finance-product/api/finParam/queryFinParamSapIsNull', params)
};
//修改详情表格
export function SapParamByIdList(params) {
    return fetch.post('/api/finance-product/api/sapParam/querySapParamById', params)
};
//修改映射
export function changeFinParam(params) {
    return fetch.post('/api/finance-product/api/finParam/modifyFinParam', params)
};
//查询映射
export function changeSapParamList(params) {
    return fetch.post('/api/finance-product/api/sapParam/fuzzySapParam', params)
};