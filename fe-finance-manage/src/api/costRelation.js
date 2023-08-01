
import fetch from '@utils/request';
//成本关系管理
//成本部门维护
//成本部门分页查询
export function costDepartmentList(params) {
    return fetch.post('/api/finance-product/api/costDepartmentManager/queryPage', params)
};
//成本部门添加
export function costDepartmentAdd(params) {
    return fetch.post('/api/finance-product/api/costDepartmentManager/add ', params)
};
//成本部门删除
export function costDepartmentDeleted(params) {
    return fetch.post('/api/finance-product/api/costDepartmentManager/delete ', params)
};
//成本部门启用/禁用
export function costDepartmentEnable(params) {
    return fetch.post('/api/finance-product/api/costDepartmentManager/enable ', params)
};
//成本部门修改
export function costDepartmentModify(params) {
    return fetch.post('/api/finance-product/api/costDepartmentManager/update ', params)
};
//一级部门维护
//一级部门分页查询
export function primaryDepartmentList(params) {
    return fetch.post('/api/finance-product/api/costFirstDepartmentManager/queryPage ', params)
};
//一级部门添加
export function primaryDepartmentAdd(params) {
    return fetch.post('/api/finance-product/api/costFirstDepartmentManager/add ', params)
};
//一级部门删除
export function primaryDepartmentDeleted(params) {
    return fetch.post('/api/finance-product/api/costFirstDepartmentManager/delete ', params)
};
//一级部门禁用/启用
export function primaryDepartmentEnable(params) {
    return fetch.post('/api/finance-product/api/costFirstDepartmentManager/enable ', params)
};
//一级部门修改
export function primaryDepartmentModify(params) {
    return fetch.post('/api/finance-product/api/costFirstDepartmentManager/update ', params)
};
//业务部门维护
//业务部门分页查询
export function businessDepartmentList(params) {
    return fetch.post('/api/finance-product/api/costBusinessDepartmentManager/queryPage ', params)
};
//业务部门添加
export function businessDepartmentAdd(params) {
    return fetch.post('/api/finance-product/api/costBusinessDepartmentManager/add ', params)
};
//业务部门删除
export function businessDepartmentDeleted(params) {
    return fetch.post('/api/finance-product/api/costBusinessDepartmentManager/delete ', params)
};
//业务部门启用/禁用
export function businessDepartmentEnable(params) {
    return fetch.post('/api/finance-product/api/costBusinessDepartmentManager/enable ', params)
};
//业务部门修改
export function businessDepartmentModify(params) {
    return fetch.post('/api/finance-product/api/costBusinessDepartmentManager/update ', params)
};
//业务单元维护
//业务单元维护分页查询
export function businessList(params) {
    return fetch.post('/api/finance-product/api/costBusinessUnitManager/queryPage  ', params)
};
//业务单元添加
export function businessAdd(params) {
    return fetch.post('/api/finance-product/api/costBusinessUnitManager/add  ', params)
};
//业务单元删除
export function businessDeleted(params) {
    return fetch.post('/api/finance-product/api/costBusinessUnitManager/deleteById  ', params)
};
//业务单元启用/禁用
export function businessEnable(params) {
    return fetch.post('/api/finance-product/api/costBusinessUnitManager/disableOrEnableById  ', params)
};
//业务单元修改
export function businessModify(params) {
    return fetch.post('/api/finance-product/api/costBusinessUnitManager/modify  ', params)
};
//成本关系分页查询
export function costRelationList(params) {
    return fetch.post('/api/finance-product/api/costRelationManager/queryPage  ', params)
};
//成本关系查看
export function costRelationLook(params) {
    return fetch.post('/api/finance-product/api/costRelationManager/queryDetail  ', params)
};
//成本关系启用
export function costRelationEnable(params) {
    return fetch.post('/api/finance-product/api/costRelationManager/disableOrEnableById  ', params)
};
//成本关系修改
export function costRelationModify(params) {
    return fetch.post('/api/finance-product/api/costRelationManager/modify', params)
};
//成本关系添加
export function costRelationAdd(params) {
    return fetch.post('/api/finance-product/api/costRelationManager/add', params)
};
//业务部门下拉框
export function costRelationDepartmentList(params) {
    return fetch.post('/api/finance-product/api/costBusinessDepartmentManager/costBusinessDepartmentList', params)
};
//业务单元下拉框
export function costRelationUnitList(params) {
    return fetch.post('/api/finance-product/api/costBusinessUnitManager/costBusinessUnitList', params)
};
//成本部门下拉框
export function costRelationDepartment(params) {
    return fetch.post('/api/finance-product/api/costDepartmentManager/costDepartmentList', params)
};
//一级部门下拉框
export function costRelationFirstDepartment(params) {
    return fetch.post('/api/finance-product/api/costFirstDepartmentManager/firstDepartmentList', params)
};