
import fetch from '@utils/request';
//总账配置管理
//会计事件维护
//会计事件分页查询
export function accountingList(params) {
    return fetch.post('/api/finance-account/api/accEvent/query', params)
};
//会计事件维护删除
export function accountingDelete(params) {
    return fetch.post('/api/finance-account/api/accEvent/remove', params)
};
//会计事件维护查看
export function accountingSee(params) {
    return fetch.post('/api/finance-account/api/accEvent/queryOne', params)
};
//会计事件维护新增
export function accountingAdd(params) {
    return fetch.post('/api/finance-account/api/accEvent/add', params)
};
//会计事件修改
export function accountingModify(params) {
    return fetch.post('/api/finance-account/api/accEvent/modify', params)
};
//账号与法体分页查询
export function eventingList(params) {
    return fetch.post('/api/finance-account/api/accAcountBodyRelation/query', params)
};
//账号与法体删除
export function eventingDelete(params) {
    return fetch.post('/api/finance-account/api/accAcountBodyRelation/remove', params)
};
//账号与法体查看
export function eventingSee(params) {
    return fetch.post('/api/finance-account/api/accAcountBodyRelation/queryOne', params)
};
//账号与法体新增
export function eventingAdd(params) {
    return fetch.post('/api/finance-account/api/accAcountBodyRelation/add', params)
};
//账号与法体修改
export function eventingModify(params) {
    return fetch.post('/api/finance-account/api/accAcountBodyRelation/modify', params)
};