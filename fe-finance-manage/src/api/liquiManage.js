import fetch from '@utils/request';
//清算信息列表 查询
export function LiquidationList(params) {
    return fetch.post('/api/finance-settle/api/checkClearManage/queryPage', params)
};
//自动清算
export function ManualSettles(params) {
    return fetch.post('/api/finance-settle/api/checkClearManage/manualClear', params)
};
//清算信息列表导出
export function ExportSettles(params) {
    return fetch.post('/api/finance-settle/api/checkClearManage/export', params)
};
//结算信息列表 查询
export function SettlementList(params) {
    return fetch.post('/api/finance-settle/api/checkClearManage/querySettle', params)
};
//自动结算
export function ManualSettle(params) {
    return fetch.post('/api/finance-settle/api/checkClearManage/manualSettle', params)
};

//其他记账结果查询
export function otherList(params) {
    return fetch.post('/api/finance-settle/api/checkOtherAccountManager/queryPage', params)
};
//其他记账结果查询人工记账
export function otherAction(params) {
    return fetch.post('/api/finance-settle/api/checkOtherAccountManager/manualClear', params)
};

//会计总账管理
//会计分录查询/分页
export function AccountingEntry(params) {
    return fetch.post('/api/finance-account/api/accEntry/queryAccEntryPage', params)
};
//会计分录查看
export function AccountingSee(params) {
    return fetch.post('/api/finance-account/api/accEntry/queryAccEntry', params)
};
// 会计新增科目名称 查询完整的科目名称
export function AccountingSubjectName(params) {
    return fetch.post('/api/finance-account/api/accEntry/fuzzySearchSubjectName', params)
};
// 会计新增完整的科目名称 返回出三级科目号
export function AccountingSubjectNo(params) {
    return fetch.post('/api/finance-account/api/accEntry/searchSubjectNo', params)
};
// 会计新增模糊查询三级科目号
export function AccountingSubjectNoBySno(params) {
    return fetch.post('/api/finance-account/api/accEntry/searchSubjectNoBySno', params)
};
// 会计新增模糊查询三级科目号 返回科目名称
export function AccountingSubjectNameByNo(params) {
    return fetch.post('/api/finance-account/api/accEntry/serachSubjectNameByNo', params)
};
// 会计新增模糊查询成本部门
export function AccountingCostDepartmentName(params) {
    return fetch.post('/api/finance-account/api/accEntry/searchCostDepartmentName', params)
};
//会计分录新增接口
export function AccountingaddAccEntry(params) {
    return fetch.post('/api/finance-account/api/accEntry/addAccEntry', params)
};
//科目余额查询/分页
export function AccountingBalance(params) {
    return fetch.post('/api/finance-account/api/accSubjectBal/querySubjectBalPage', params)
};
//科目余号模糊查询
export function AccountingSearch(params) {
    return fetch.post('/api/finance-account/api/accSubjectBal/querySubjectNoLike', params)
};
//三级科目号查询
export function AccountingSear(params) {
    return fetch.post('/api/finance-account/api/accSubjectBal/queryThreeSubjectLike', params)
};
//科目余额导出
export function accSubjectExport(params) {
    return fetch.post('/api/finance-account/api/accSubjectBal/export', params,{ responseType: 'arraybuffer' })
};

