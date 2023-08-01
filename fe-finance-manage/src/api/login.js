import fetch from '@utils/request';

export const getToken = (params) => fetch.get('/api/account/captcha/getToken', params)

//查看验证码是否正确
export const compareCaptcha = (params) => fetch.post('/api/account/sysuserdetail/compareCaptcha', params)

//登录请求
export const getLogin = (params) => fetch.post('/api/uaa/oauth/token', params)