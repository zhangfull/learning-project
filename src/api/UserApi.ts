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
        throw new Error('网络错误')
    }
}