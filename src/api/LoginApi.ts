import type { UserInfo } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

export const loginRequest = async (email: string, password: string): Promise<[UserInfo | null, number]> => {
    console.log(`API主动登陆 ${email}...`)
    try {
        const response = await axiosInstance.post('/api/login/active',
            { email, password }
        )
        console.log("后端返回的信息码：", response.data.code)              //调试
        console.log("后端返回的数据：", response.data.data)              //调试
        return [response.data.data, response.data.code]
    } catch (error) {
        // 取消上传失败，捕获异常
        console.error('获取资源数据失败:', error)
        throw new Error('网络错误')
    }
};

export const autoLoginRequest = async (): Promise<[UserInfo | null, number]> => {
    try {
        const response = await axiosInstance.post(
            '/api/login/auto',
            {} // 请求体为空对象
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        return [response.data.data, 0]
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw new Error('网络错误')
    }
}
