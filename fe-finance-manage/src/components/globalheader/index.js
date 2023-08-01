import React from 'react'
import styles from './index.module.scss'
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { BellOutlined, LogoutOutlined, SettingOutlined, SwapOutlined } from '@ant-design/icons'
import { Dropdown, Menu, Avatar } from 'antd';

const GlobalHeader = (props) => {
  const { onMenuClick, userInfo, handleToggle, collapsed } = props

  const menu = (
    <Menu style={{ width: 160 }} selectedKeys={[]} onClick={ onMenuClick }>
      <Menu.Item disabled={process.env.NODE_ENV === 'development'} key="switchsys">
        <SwapOutlined />
        切换系统
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <div className={ styles["globalheader"] }>
      <div className={ styles["globalheader_icon"] } onClick={ handleToggle }>
        <LegacyIcon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
      </div>
      <div className={ styles["globalheader_user"] }>
        <div className={ styles["user_icon"] }>
          <BellOutlined></BellOutlined>
        </div>
        <div className={ styles["user_info"] }>
          <Dropdown overlay={menu}>
            <div className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={userInfo.avatar + '?token=' + localStorage.getItem('mscode_token')}
                alt="avatar"
              />
              <span className={styles.name}>{userInfo.nickname}</span>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

export default GlobalHeader