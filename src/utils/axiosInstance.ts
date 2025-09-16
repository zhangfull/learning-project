import axios from 'axios';

// 创建统一的 axios 实例
const axiosInstance = axios.create();

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("请求拦截器被调用，URL:", config.url);
    // 从 localStorage 获取令牌
    const token = localStorage.getItem('token');
    console.log("从 localStorage 获取的 token:", token);
    
    if (token) {
      // 如果令牌存在，设置请求头的 Authorization 字段
      config.headers['Authorization'] = `${token}`;
      console.log("设置 Authorization token:", token);
      console.log("请求头配置:", config.headers);
    } else {
      console.log("没有找到 token，不设置 Authorization 头");
    }
    // 返回修改后的请求配置
    return config;
  },
  (error) => {
    // 请求错误处理
    console.error("请求拦截器错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器（可选）
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 响应错误处理
    return Promise.reject(error);
  }
);

export default axiosInstance;
