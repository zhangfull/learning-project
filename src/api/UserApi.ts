import type { PersonalInfo } from "@/types"
import axiosInstance from "@/utils/axiosInstance"

export const getPersonalInfoRequest = async (): Promise<[PersonalInfo | null, number]> => {
    try {
        const response = await axiosInstance.get(
            '/api/user/getInfo'
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        return [response.data.data, response.data.code]
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}

export const updateUserInfoRequest = async (userInfo: PersonalInfo): Promise<number> => {
    try {
        const response = await axiosInstance.post(
            '/api/user/update', userInfo
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        return response.data.code
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}

export const updateUserPasswordRequest = async (oldPassword: string, newPassword: string): Promise<number> => {
    try {
        const response = await axiosInstance.post(
            '/api/user/updatePassword', { oldPassword, newPassword }
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        return response.data.code
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}

// 头像上传API
export const updateAvatarRequest = async (avatarData: string): Promise<number> => {
    try {
        const response = await axiosInstance.post(
            '/api/user/updateAvatar', { avatar: avatarData }
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        return response.data.code
    } catch (error) {
        console.error('上传头像失败:', error)
        throw error;
    }
}
