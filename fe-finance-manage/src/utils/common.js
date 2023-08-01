import { DATE_FORMAT } from "./constants";
// 数据类型
export const dataType = (params) => {
  return Object.prototype.toString.call(params);
};
// 删除空字段
export const delEmptyField = (params, value = '') => {
  for(const item in params) {
    if (params.hasOwnProperty(item)) {
      if (params[item] == value) {
        delete params[item];
      };
    }
  };
  return params;
};

//格式化搜索栏日期自动填充时间 
export const formatSearchDate = (time, isEnd = false) => {
  return `${time.format(DATE_FORMAT)} ${isEnd ? '23:59:59' : "00:00:00"}`
}

// 根据文件流生成
export const exportFile = (fileName, streams, type = 'application/vnd.ms-excel') => {
  let url = window.URL.createObjectURL(new Blob([streams], { type }));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
}
