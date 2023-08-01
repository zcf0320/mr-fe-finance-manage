import React, { useEffect, useState } from "react";
import { commonPolicy } from "@api/package";
import { Upload, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';

const CommonUpload = (props) => {
  const { 
    children, 
    onChange, 
    multiple = false, 
    verificationFun, 
    fileList = [], 
    usePropsFile = false, 
    limit = 1,
    ...rest 
  } = props;
  const [ossData, setOSSData] = useState({host: ""});
  const [files, setFiles] = useState(fileList);

  const getOSSData  = async () => {
    commonPolicy().then((res) => {
      if (res.status === 200) {
        const { policy, signature, accessId, dir, host, expire } = res.data;
        setOSSData({policy, signature, accessid: accessId, dir, host, expire})
      } else {
        message.error("获取OSS签名失败");
      }
    }).catch((err) => {
      message.error('获取OSS签名失败');
    })
  };

  useEffect(()=>{
    getOSSData()
  }, [])

  const _handleChange = (info) => {
    const { host } = ossData;
    let fileList = info.fileList;
    if (info.file.status == 'done') {
      let len = fileList.length;
      fileList[len - 1].url = host + '/' + info.file.url;
    }
    let list = fileList.filter(file => file.status != 'error');
    if(typeof onChange == "function") {
      onChange(list);
    }
    (!usePropsFile) && setFiles(list);
  };

  const _getExtraData = file => {
    const { accessid, policy, signature } = ossData;
    return {
      key: file.url,
      OSSAccessKeyId: accessid,
      policy: policy,
      Signature: signature,
      success_action_status: "200"
    }
  }

  const _handleBeforeUpload = async (file) => {
    const done = verificationFun ? verificationFun(file) : (file.type === 'image/jpeg' || file.type === 'image/png')
    if (!done) {
      message.warning('请上传正确格式的文件！');
      return false;
    }
    await new Promise(async (resolve, reject) => {
      let sizeIsRight = true;
      if (sizeIsRight) {
        const { dir, expire } = ossData;
        const expire_ = expire * 1000;
        let currentTime = new Date();
        let sec = currentTime.getSeconds() + 10;
        currentTime = currentTime.setSeconds(sec);
        if (expire_ < currentTime) {
          await getOSSData();
        }
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        file.url = dir + filename;
        resolve(file)
      } else {
        reject(false)
      }
    })
  };
  const list = usePropsFile ? fileList : files
  return (
    <Upload
      fileList={list}
      action={ossData.host}
      multiple={multiple}
      onChange={_handleChange}
      data={_getExtraData}
      beforeUpload={_handleBeforeUpload}
      {...rest}
    >
      {
        list.length >= limit 
          ? null 
          : children 
            ? children
            : <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
      }
    </Upload>
  )
}

export default CommonUpload;