import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from './app';
// 国际化
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
// import{ConfigProvider} from '@ant-design/pro-table'

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);