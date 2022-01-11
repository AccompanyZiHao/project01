import axios from 'axios';
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox  } from 'element-plus';

const service = axios.create({
  withCredentials: true,
  timeout: 20000,
  baseURL: '',
});

const TOKEN_KEY = 'token'
service.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token')
    // 设置url白名单
    if(token){
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
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
      const { code, message } = data;
      console.log(1, code, data)
      if (code === 0) {
        if(res.config.url ==='/api/user/login'){
          localStorage.setItem(TOKEN_KEY, data.token)
        }
        return Promise.resolve(data);
      } else if(code === 101){
        ElMessageBox.confirm('登录过期了','过期',{
          confirmButtonText:'登录',
          showCancelButton:false,
          type:'warning'
        }).then(()=>{
          localStorage.removeItem(TOKEN_KEY)
          // redirect({ path:'/login'})
        })
      } else {
        ElMessage.error(message);
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
