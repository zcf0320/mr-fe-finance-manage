import fetch from '@utils/request';

// 结算单分页列表
export const getOrderList = (params) => fetch.post(`/api/mall-payment-e/api/index/statement/page`, params)

// 结账单详情分页列表（明细）
export const getOrderAllList = (params) => fetch.post('/api/mall-payment-e/api/index/statement/detail/page', params)

// 结账单医生维度分页列表分页列表
export const getOrderDetailList = (params) => fetch.post('/api/mall-payment-e/api/index/statement/doctor/page', params)

// 医生维度批量导入结算
export const importOrderExcel = (params) => fetch.post(`/api/mall-payment-e/api/index/statement/doctor/import/settlement`, params)

// 获取业务标示列表
export const getBusinessList = () => fetch.get(`/api/mall-payment-e/api/index/statement/detail/business/list`)

// 医生维度结账单导出
export const exportBillExcel = (statementNo) => fetch({
  url: `/api/mall-payment-e/api/index/statement/doctor/export?statementNo=${statementNo}`,
  method: 'GET',
  responseType: 'blob',
})