import fetch from '@utils/request';
//科目规则维护
//分页查询
export function getAccountMainList(params) {
    return fetch.post('/api/finance-account/api/accSubject/querySubjectPage',  params)
};
//开户场景编号
export function getAccountSceneNo() {
    return fetch.post('/api/finance-account/api/accScene/querySceneNoList')
};

//添加
export function addAccountMainList(params) {
    return fetch.post('/api/finance-account/api/accSubject/addSubject',  params)
};
//修改
export function changeAccountMainList(params) {
    return fetch.post('/api/finance-account/api/accSubject/modifySubject',  params)
};
//查看
export function AccountMainDetail(params) {
    return fetch.post('/api/finance-account/api/accSubject/querySubjectInfo',  params)
};
//删除
export function AccountMainRemove(params) {
    return fetch.post('/api/finance-account/api/accSubject/removeSubject',  params)
};