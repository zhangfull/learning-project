import type { RegisterInfo, UserInfo } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

export const loginRequest = async (emailOrUid: string, password: string): Promise<[UserInfo | null, number]> => {
    console.log(`API主动登陆 ${emailOrUid}...`)
    try {
        const response = await axiosInstance.post('/api/login/active',
            { emailOrUid, password }
        )
        console.log("后端返回的信息码：", response.data.code)              //调试
        console.log("后端返回的数据：", response.data.data)              //调试
        return [response.data.data, response.data.code]
    } catch (error) {
        // 取消上传失败，捕获异常
        console.error('获取资源数据失败:', error)
        throw error;
    }
};

export const autoLoginRequest = async (): Promise<[UserInfo | null, number]> => {
    try {
        const response = await axiosInstance.get(
            '/api/login/auto'
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        return [response.data.data, response.data.code]
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}

export const registerRequest = async (userInfo: RegisterInfo): Promise<number> => {
    try {
        const response = await axiosInstance.post(
            '/api/login/register',
            userInfo
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        return 0
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}


export const refreshTokenRequest = async (): Promise<[number, string]> => {
    try {
        const response = await axiosInstance.post(
            '/api/login/refresh', {}, { withCredentials: true }
        )
        console.log("后端返回的信息码：", response.data.code)
        return [response.data.code, response.data.data]
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}
