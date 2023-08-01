import fetch from '@utils/request';
//分页查询
export function getConfigPageList(params) {
    return fetch.post('/api/finance-check/api/checkRuleManage/queryPage',  params)
};
//对账方列表
export function jobDataList(params) {
    return fetch.post('/api/finance-check/api/checkRuleManage/queryDsList', params)
};
//对账方详细信息
export function jobDataDetail(params) {
    return fetch.post('/api/finance-check/api/checkRuleManage/queryDsDetail', params)
};
//添加对账规则
export function addConfigList(params){
    return  fetch.post('/api/finance-check/api/checkRuleManage/add', params)
}
//修改对账规则
export function changeConfigList(params){
    return  fetch.post('/api/finance-check/api/checkRuleManage/modify', params)
}
//查看对账数据详情
export function lookConfigList(params){
    return  fetch.post('/api/finance-check/api/checkRuleManage/queryDetail',params)
}
//删除对账数据
export function delConfigList(params){
    return  fetch.post('/api/finance-check/api/checkRuleManage/remove', params)
}