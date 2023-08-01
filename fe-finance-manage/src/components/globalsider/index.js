import React, { useState } from 'react';
import { Menu } from 'antd';
import styles from './index.module.scss';
import { useEffect } from 'react';

const GlobalSider = (props) => {
  const { children, history, redirctPath, menus = [] } = props;
  const { location } = history;
  const [activeKey, setActiveKey] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  // useEffect(() => {
  //   window.addEventListener('popstate', (e) => {
  //     let key = e.target.location.pathname.replace('/fe-finance-manage', '');
  //     console.log('----', key);
  //     let paths = getOpenkeys(menus, key);
  //     let allOpens = Array.from(new Set(paths.concat([...openKeys])));
  //     setOpenKeys(allOpens);
  //     setActiveKey([key]);
  //   });
  //   return () => {
  //     // window.removeEventListener('popstate', historyChange);
  //   };
  // }, []);

  useEffect(() => {
    const key = location.pathname !== '/' ? location.pathname : redirctPath;
    let paths = getOpenkeys(menus, key) || [];
    let allOpens = Array.from(new Set(paths.concat([...openKeys])));
    setOpenKeys(allOpens);
    setActiveKey([key]);
  }, [menus, location.pathname]);

  let pathsArr = [];
  const getOpenkeys = (menuArr = [], key) => {
    if (menuArr.length == 0) return [];
    for (const item of menuArr) {
      pathsArr.push(item.path);
      if ((item.routes || []).some((element) => element.path === key)) return pathsArr;
      getOpenkeys(item.routes, key);
      pathsArr.pop();
    }
  };

  const _handleSelect = ({ key }) => {
    setActiveKey([key]);
  };

  return (
    <div className={styles['globalSider']}>
      <div className={styles['globalSider_title']}>业财对账系统</div>
      <div className={styles['globalSider_container']}>
        <Menu theme="light" mode="inline" multiple={false} openKeys={openKeys} selectedKeys={activeKey} onSelect={_handleSelect} onOpenChange={(value) => setOpenKeys(value)}>
          {children}
        </Menu>
      </div>
    </div>
  );
};

export default GlobalSider;
