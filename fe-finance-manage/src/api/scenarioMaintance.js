import fetch from '@utils/request';
//科目规则维护
//分页查询
export function getScenarioMainList(params) {
    return fetch.post('/api/finance-account/api/accScene/queryScenePage',  params)
};
//添加
export function addScenarioMainList(params) {
    return fetch.post('/api/finance-account/api/accScene/addSceneInfo',  params)
};
//修改
export function changeScenarioMainList(params) {
    return fetch.post('/api/finance-account/api/accScene/updateSceneInfo',  params)
};
//查看
export function scenarioMainDetail(params) {
    return fetch.post('/api/finance-account/api/accScene/querySceneInfo',  params)
};
//删除
export function scenarioMainRemove(params) {
    return fetch.post('/api/finance-account/api/accScene/removeSceneInfo',  params)
};