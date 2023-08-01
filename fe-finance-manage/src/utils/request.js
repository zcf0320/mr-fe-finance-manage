import axios from 'axios';
import { message } from "antd";
import envConfig from "./env_variable";

const instance = axios.create({ timeout: 30000 });
let token = localStorage.getItem('mscode_token')
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : undefined;

// 添加请求拦截器(post只能接受字符串类型数据)
instance.interceptors.request.use(function (config) {
  token = localStorage.getItem('mscode_token')
  // config.headers.common['Authorization'] = token ? `Bearer ${token}` : undefined;
  config.headers.common['Authorization'] = (config.url === '/api/uaa/oauth/token') ? 'Basic YnJvd3Nlcjo=' : (token ? `Bearer ${token}` : undefined)
  // if (config.url.indexOf('/api/mall-payment-e') == -1){
  //   config.headers.common['Authorization'] = (config.url === '/api/uaa/oauth/token') ?  'Basic YnJvd3Nlcjo=' : (token ? `Bearer ${token}` : undefined)
  // }
  config.headers.RoleCode = localStorage.getItem('mscode_authority');
  config.url = `${envConfig.apiUrl || ""}` + config.url;
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.status === 200) {
      return Promise.resolve(res.data);
    }
    return Promise.reject(res)
  }, (err) => {
    const { response } = err;
    if (response) {
      errorHandle(response.status, response.data);
      return Promise.reject(response);
    } else {
      console.log('请求失败')
    }
  }
);
const errorHandle = (status, data) => {
  switch (status) {
    case 401:
      if (window.location.pathname.includes('/login')) {
        // Toast.fail('用户名密码错误');
      } else {
        message.error("未登录或登录已过期，请重新登录!", () => {
          localStorage.removeItem('mscode_token');
          localStorage.setItem('mscode_authority', 'guest');
          if (process.env.NODE_ENV !== 'development') {
            // const url = window.location.origin + "/fe-finance-manage/sysselect";
            window.location.href = envConfig.loginUrl;
          } else {
            window.location.href = "/fe-finance-manage/login";
          }
        })
      }
      break;
    case 403:
    case 404:
    default:
      // Toast.fail(data.message)
      break;

  }
}
export default instance;