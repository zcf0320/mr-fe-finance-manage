import domains from '@fosun-fe/config';
const env = process.env.RUN_ENV;
//根据环境获取对应配置
const COMMON_DOMAINS = domains.getDomains(env);
const env_lib = {
  dev: {
    apiUrl: `${COMMON_DOMAINS.API_DOMAIN}/be`,
    loginUrl: `${COMMON_DOMAINS.MANAGEMENT_DOMAIN}/fe-admin-common/user/login`,
    id: "39"
  },
  test: {
    apiUrl: `${COMMON_DOMAINS.API_DOMAIN}/be`,
    loginUrl:`${COMMON_DOMAINS.MANAGEMENT_DOMAIN}/fe-admin-common/user/login`,
    id:"38"
  },
  prod: {
    apiUrl: `${COMMON_DOMAINS.API_DOMAIN}/be`,
    loginUrl:`${COMMON_DOMAINS.MANAGEMENT_DOMAIN}/fe-admin-common/user/login`,
    id: "38"
  },
  ptest: {
    apiUrl: `${COMMON_DOMAINS.API_DOMAIN}/be`,
    loginUrl:`${COMMON_DOMAINS.MANAGEMENT_DOMAIN}/fe-admin-common/user/login`,
    id: "38"
  },
}

const config = env_lib[env] || {};
export default config;