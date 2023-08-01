import { Modal, Form, Input, message, Select,Spin, Button ,Upload} from 'antd';
import { useEffect, useState } from 'react';
import styles from  './index.less';
import { exportBatchMould } from '../../../api/orderManage';

export default function BatchImport(props) {
 const [loading,setLoading] =useState(false);
 
 const onCancel=()=>{
   props.setbatchImportVisible(false)
 }
 const upload=async ()=>{
   setLoading(true);
   
 }
 const downTemplate =async ()=>{
  setLoading(true);
  let res;
  try {
    setLoading(true);
    res = await exportBatchMould();
    message.success('导出成功！');
    let url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', '批量导入模板.xlsx');
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    message.error('下载失败！');
  }
  // setLoading(false);

 }
  return (
    <Modal
    destroyOnClose={true}
      title={<span>上传批量文件</span>}
      visible={props.batchImportVisible}
      centered={true}
      maskClosable={false}
      onCancel={onCancel}
      footer={null}
    >
    <Spin spinning={loading}>
      <div className={styles.otherBatchUpload}>
        <div className={styles.batchOne}>
          <div className={styles.batch}>1.下载模板文件，根据模板格式填写三方订单信息</div>
          <div><Button type='link' className={styles.batchDown} onClick={downTemplate}>下载模板</Button></div>
        </div>
        <div className={styles.batchTwo}>
          <span>2.上传文件：</span>
          <Upload accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
            listType="text" 
            showUploadList={false}
          >
            <Button type="primary">选择文件</Button>
          </Upload>
        </div>
        <div className={styles.batchThree}>
          <div>3.导入说明</div>
          <div>（1）一次最多提交5000条数据</div>
          <div>（2）再导入过程中无法关闭弹窗</div>
          <div>（3）仅支持XLS、XLSX格式</div>
        </div>
        <div>
          <div className={styles.batchFooter}style={{marginTop:20,textAlign:'center'}}>
            <Button className={styles.batchUpload} type='primary' style={{marginRight:20}} onClick={()=>upload()}>开始上传</Button>
            <Button onClick={onCancel}>取消</Button>
          </div>
        </div>
      </div>
    </Spin>
    </Modal>
  )

}