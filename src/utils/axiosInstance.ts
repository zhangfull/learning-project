import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { openErrorNotice, openWarningNotice } from './noticeUtils';
import { refreshTokenRequest } from '@/api/LoginApi';

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
    if (response.data.code === 110) {
      console.log("异常：", response.data.message)
      throw new Error(response.data.message)
    }
    if (response.data.code === 43) {
      const [code, data] = await refreshTokenRequest();
      if (code === 0) {
        localStorage.setItem('accessToken', data)
        openWarningNotice("请求丢失请刷新重试")
      } else {
        localStorage.removeItem('accessToken')
        useUserStore().logout();
        console.log("Token 已过期，用户已登出")
        openErrorNotice("登陆已过期，请重新登录")
      }

    }
    return response;
  },
  (error) => {
    // 响应错误处理
    return Promise.reject(error);
  }
);

export default axiosInstance;
