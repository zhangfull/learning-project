import axios from 'axios';
import { openErrorNotice, openWarningNotice } from './noticeUtils';
import { useUserStore } from '@/stores/user';
// 创建统一的 axios 实例
const axiosInstance = axios.create();
// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("请求拦截器被调用，URL:", config.url);
    // 从 localStorage 获取令牌
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      // 如果令牌存在，设置请求头的 Authorization 字段
      config.headers['Authorization'] = `${accessToken}`;
      console.log("设置 Authorization token");
    } else {
      console.log("没有找到 accessToken，未设置 Authorization 头");
    }
    // 返回修改后的请求配置
    return config;
  },
  (error) => {
    // 请求错误处理
    console.error("请求拦截器错误:", error)
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  async (response) => {
    const userStore = useUserStore()
    if (response.data.code === 110) {
      console.log("异常：", response.data.message)
      openErrorNotice(response.data.message);
    }
    if (response.data.code === 43) {
      await userStore.refreshLogin()
      openWarningNotice('网络异常请刷新页面');
    }
    return response;
  },
  (error) => {
    // 响应错误处理
    console.error("响应拦截器错误:", error)
    return Promise.reject(error);
  }
);

export default axiosInstance;
