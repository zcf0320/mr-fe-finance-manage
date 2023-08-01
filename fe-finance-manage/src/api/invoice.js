import fetch from '@utils/request';

const baseUrl = "/api/mall-oms-e"

export const getInvoicOrderList = (params) => fetch.get(baseUrl + '/api/oms/order/queryCheckInvoicOrder', { params });
