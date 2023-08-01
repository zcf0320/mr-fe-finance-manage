import fetch from '@utils/request';
//每日金额汇报报表
//分页查询
export function getdailyReportList(params) {
    return fetch.post('/api/finance-settle/api/checkAmountSummaryManager/queryPage', params)
};
//明细查询/消费/退款
export function dailyReportDetail(params) {
    return fetch.post('/api/finance-settle/api/checkAmountSummaryManager/queryDetails', params)
};
//提现/充值
export function withDrawDetail(params) {
    return fetch.post('/api/finance-settle/api/checkWithdrawInfoManage/queryPage', params)
};
//差错（不平）
export function errorDetail(params) {
    return fetch.post('/api/finance-settle/api/checkAmountSummaryManager/queryErrorPage', params)
};
//其他费用
export function otherDetail(params) {
    return fetch.post('/api/finance-settle/api/checkAmountSummaryManager/queryOtherDetails', params)
};
//订单交易明细查询
export function orderDetail(params) {
    return fetch.post('/api/finance-settle/api/checkClearManage/queryEveryDayPage', params)
};
//每日汇总导出
export function summaryExportEveryDay(params) {
    return fetch.post('/api/finance-settle/api/checkAmountSummaryManager/export', params, { responseType: 'arraybuffer' })
};
//每日订单导出
export function exportEveryDay(params) {
    return fetch.post('/api/finance-settle/api/checkClearManage/exportEveryDayClear', params, { responseType: 'arraybuffer' })
};