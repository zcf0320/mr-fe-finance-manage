import fetch from '@utils/request';
//对账差错明细
//差错明细列表
export function errorDetail(params) {
    return fetch.post('/api/finance-check/api/checkErrorManage/queryPage', params)
};
//记坏账，转人工
export function detailOperation(params) {
    return fetch.post('/api/finance-check/api/checkErrorManage/modify', params)
};
//对账模块
export function jobModule(params) {
    return fetch.post('/api/finance-check/api/checkRuleManage/queryList', params)
};


//生成差错文件
export function exportErrorFile(params) {
    return fetch.post('/api/finance-check/api/checkErrorManage/export', params, { responseType: 'arraybuffer' })
};

//对账结果浏览
//恢复数据
export function recoverData(params) {
    return fetch.post('/api/finance-check/api/checkResultManage/modify', params)
};
//执行对账
export function performReconciliation(params) {
    return fetch.post('/api/finance-check/api/checkResultManage/modify', params)
};
//数据列表
export function resultList(params) {
    return fetch.post('/api/finance-check/api/checkResultManage/queryPage', params)
};

//资金结果浏览 
//数据列表
export function fundsList(params) {
    return fetch.post('/api/finance-check/api/checkResultManage/queryCheckResult', params)
};