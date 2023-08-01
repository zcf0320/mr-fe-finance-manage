import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useHistory } from 'react-router';
import GlobalHeader from '@components/globalheader';
import GlobalSider from '@components/globalsider';
import { getSysUser, getMenuData } from '@api/user';
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import { Menu } from 'antd';
import { routerLib } from '@config/router.config';
import Loadable from 'react-loadable';
import MyLoading from '@components/Loading';
import NotFound from '../404';
import 'moment/locale/zh-cn';
import styles from './index.module.scss';
import envConfig from '../utils/env_variable'

const { SubMenu, Item } = Menu;

const { Header, Sider, Content } = Layout;

let redirctPath = null;
const LayoutBasic = (props) => {
  const { cacheUser, userInfo } = props;
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const [menus, setMenus] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const _goLogin = () => {
    if (process.env.NODE_ENV !== 'development') {
      const url = window.location.origin + '/fe-finance-manage/user/login';
      window.location.href = envConfig.loginUrl;
    } else {
      history.push('/login');
    }
  };

  useEffect(() => {
    // 获取用户信息
    const mscode_token = localStorage.getItem('mscode_token');
    if (mscode_token) {
      getSysUser().then((res) => {
        if (res) {
          cacheUser(res.data);
          getMenuDataList(res.data);
        }
      });
    } else {
      _goLogin();
    }
  }, []);
  // 获取左侧侧边栏的信息
  const getMenuDataList = (data) => {
    let formData = new FormData();
    formData.append('username', data.username);
    // formData.append('sysId', envConfig.id);
    formData.append('sysId', 39);
    // formData.append('mobile', data.mobile);
    getMenuData(formData)
      .then((res = {}) => {
        if (res.status === 'ok') {
          setMenus(res.menu);
        }
      })
      .finally(() => {
        setLoaded(true);
      });

  };

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('mscode_token');
      localStorage.setItem('mscode_authority', 'guest');
      _goLogin();
    }
    if (key === 'switchsys') {
      const url = window.location.origin + '/fe-admin-common/sysselect';
      window.location.href = url;
    }
  };

  const _creatAsyncComp = (loader) =>
    Loadable({
      loader,
      loading: MyLoading,
    });

  const _creatMenuNode = (list = []) => {
    const menuList = [],
      len = list.length || 0;
    let routers = [],
      i = 0;
    while (i < len) {
      const item = list[i],
        { routes, hideInMenu, path, id } = item;
      const count = routes?.length || 0;
      let children = null,
        cRouters = null;
      if (count) {
        [children, cRouters] = _creatMenuNode(routes);
      }
      if (!hideInMenu) {
        const hasChild = children && children.length;
        const MenuNode = hasChild ? SubMenu : Item;
        menuList.push(
          <MenuNode key={item.path} title={hasChild ? item.menuName : null}>
            {hasChild ? children : <Link to={item.path}>{item.menuName}</Link>}
          </MenuNode>
        );
      }
      let route = null;
      if (routerLib[path]) {
        const Comp = _creatAsyncComp(routerLib[path]);
        if (!redirctPath && !hideInMenu) redirctPath = path;
        route = <Route key={'router' + id} path={path} exact component={Comp} />;
      }
      route && routers.push(route);
      cRouters && (routers = routers.concat(cRouters));
      i++;
    }
    return [menuList, routers];
  };
  const [navs, routers] = _creatMenuNode(menus || []);

  return (
    <div className={styles.container}>
      <Layout style={{ height: '100vh' }}>
        <Sider width="256px" trigger={null} collapsible collapsed={collapsed} className={styles.sider}>
          <GlobalSider redirctPath={redirctPath} history={history} menus={menus}>
            {navs}
          </GlobalSider>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, height: '67px' }}>
            <GlobalHeader onMenuClick={handleMenuClick} userInfo={userInfo} handleToggle={handleToggle} collapsed={collapsed} />
          </Header>
          <Content className={styles.content}>
            <div className={styles.box}>
              <div className={styles.wrap}>
                <Switch>
                  {redirctPath && <Redirect path="/" to={redirctPath} exact />}
                  {routers}
                  {loaded ? <Route component={NotFound} /> : <Route component={null} />}
                </Switch>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  cacheUser(user) {
    dispatch(cacheUserInfo(user));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LayoutBasic);
