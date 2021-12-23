import axios from 'axios';
import { useStore } from 'vuex'
import { ElMessage  } from 'element-plus';

const service = axios.create({
  withCredentials: true,
  timeout: 20000,
  baseURL: '',
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  // 响应包含以下信息data,status,statusText,headers,config
  (res) => {
    const { data, status } = res;
    if (status === 200) {
      const { code, msg } = data;
      if (code === 0) {
        return Promise.resolve(data);
      } else {
        ElMessage.error(msg);
        return Promise.resolve(data);
      }
    } else {
      return Promise.reject(res);
    }
  },
  (err) => {
    const { response } = err;
    console.log('网络请求失败！', err)
    if (response) {
      errorHandle(response.status, response.data);
      return Promise.reject(response);
    }else{
      ElMessage.error('网络请求失败！');
    }
    return true;
  }
);

const errorHandle = (status: number, other: any) => {
  switch (status) {
    case 400:
      ElMessage.error('信息校验失败');
      break;
    case 401:
      ElMessage.error('认证失败');
      break;
    case 403:
      ElMessage.error('token校验失败');
      break;
    case 404:
      ElMessage.error('请求的资源不存在');
      break;
    default:
      ElMessage.error(other);
      break;
  }
};

export default { service };
