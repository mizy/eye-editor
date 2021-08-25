import axios from 'axios';
import {message} from 'antd';

const getRequest = (url) => {
  url = url || location.search; //获取url中"?"符后的字串
  const theRequest = {};
  if (url.indexOf('?') !== -1 || url.indexOf('#') !== -1) {
    const str = url.substr(1);
    const strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
    }
  }
  return theRequest;
};

const getData = (url, data, fn, errFn, method = 'get') => {
  const params = method === 'get' ? data : {};
  const timeout = 30000;
  axios({
    url,
    method,
    data,
    params,
    timeout
  }).then(
    (res) => {
      const {data} = res;
      if (data.success) {
        fn && fn(data.data);
      } else {
        errFn && errFn();
        message.error(data.message || '');
      }
    }
  ).catch((error) => {
    // message.error('仿真预览失败！');
    errFn && errFn();
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.warn(error.response.data);
      console.warn(error.response.status);
      console.warn(error.response.headers);
      // console.log('save');
      message.error('请求错误，错误码：' + error.response.status);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.warn('Error', error.message);
      message.error('请求错误 ' + error.message);
    }
  });
};
const getParamByName = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) {
    return unescape(r[2]);
  }
  return null;
}
const decodeHTML = (text) => {
  let temp = document.createElement('div');
  temp.innerHTML = text;
  const output = temp.innerText || temp.textContent;
  temp = null;
  return output;
};
export default {
  getData,
  getParamByName,
  getRequest,
  decodeHTML
};
