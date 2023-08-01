import fetch from '@utils/request';
//核销信息列表
export function getWritterOffList(params) {
    return fetch.post('/api/finance-settle/api/checkVerificationManager/queryPage', params)
};
//人工核销
export function manualWriteoff(params) {
    return fetch.post('/api/finance-settle/api/checkVerificationManager/manualVerification', params)
};
//未对平提现记录查询
export function unWriteoff(params) {
    return fetch.post('/api/finance-settle/api/checkVerificationManager/queryPageWithdraw', params)
};