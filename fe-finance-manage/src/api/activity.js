import fetch from '@utils/request';

//获取开票信息列表
export const getActivityList = (params) => fetch.post('/api/mall-promotion-e/api/activity/config/list', params);

//获取店铺列表信息
export const getStoreInformation = (params) => fetch.get(`/api/mall-shop-e/api/supplier/select/listName/${params.id}`);

//获取商品列表信息
export const getActivityGoodsList = (params) => fetch.post('/api/mall-promotion-e/api/activity/config/valid/skuId', params);

//添加活动
export const addActivity = (params) => fetch.post('/api/mall-promotion-e/api/activity/config/add', params); 

