
import fetch from '@utils/request';

export const demo = (params) => fetch.post('/api/params', params);

// 获取用户信息
export const getSysUser = (params) => fetch.get('/api/uaa/users/getSysUser', params)

//获取左侧侧边栏的信息
export const getMenuData = (params) => fetch.post('/api/account/sysuserdetail/sysdirectory', params)