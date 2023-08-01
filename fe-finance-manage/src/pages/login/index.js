import React, { useEffect, useState, useRef } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { getToken, compareCaptcha, getLogin } from '@api/login.js'
import envConfig from "../../utils/env_variable";
import styles from './index.module.scss'

const Login = ({ history }) => {
  const [randomCode, setRandomCode] = useState(new Date().getTime())
  const [imgUrl, setImgUrl] = useState(`/api/account/captcha/generateImageCaptcha?randomCode=${randomCode}`)
  const [token, setToken] = useState()
  const [value, setValue] = useState("")
  const form = useRef(null)

  useEffect(() => {
    getToken().then((res) => {
      if (res) {
        setToken(res.message)
        handleImg(res.message)
      }
    })
  }, [])

  const handleImg = (token) => {
    const time = new Date().getTime()
    setRandomCode(time)
    setImgUrl(`/api/account/captcha/generateImageCaptcha?randomCode=${time}&token=${token}`)
  }

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const onFinish = () => {
    //比对验证码是否正确
    // let formdata = new FormData();
    // formdata.append("charCaptcha",value);
    // formdata.append("token", token)
    // compareCaptcha(formdata).then((res) => {
    //   if(res.message === "success") {
    //     //发送登录请求
    form.current.validateFields().then((values) => {
      let formData1 = new FormData()
      formData1.append("username", values.username)
      formData1.append("password", values.password)
      formData1.append("scope", "ui")
      formData1.append("type", "account")
      formData1.append("grant_type", "password")
      formData1.append("client_id", "browser")
      formData1.append("tenantCode", "10001")
      formData1.append("charCaptcha", value);
      formData1.append("token", token)
      getLogin(formData1).then(data => {
        if (data && data.access_token) {
          localStorage.setItem('mscode_token', data.access_token);
        } else {
          localStorage.removeItem('mscode_token');
          localStorage.setItem('mscode_authority', 'guest');
        
        }
        history.push("/")
      })
    })
    //   } else {
    //     message.warning(res.message);
    //     handleImg();
    //   }
    // })
  }
  const onFinishFailed = () => {

  }
  return (
    <div className={styles["login"]}>
      <div className={styles["title"]}>业财管理后台</div>
      <div className={styles["container"]}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ref={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined className={styles["site-form-item-icon"]} />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              type="password"
              prefix={<LockOutlined className={styles["site-form-item-icon"]} />}
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item
              style={{ display: "inline-block", width: 'calc(66%)', marginBottom: 0 }}
              name="yanzhengma"
              rules={[{ required: true, message: '请输入验证码!' }]}
            >
              <Input
                style={{ textIndent: "20px", height: "40px" }}
                placeholder="验证码"
                maxLength={4}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              style={{ display: "inline-block", width: '120px', marginLeft: "10px", marginBottom: "0" }}
            >
              <img
                src={imgUrl}
                onClick={() => { handleImg(token) }}
                alt=""
                width="120px"
                height="40px"
              />
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", height: "40px" }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}


export default Login
