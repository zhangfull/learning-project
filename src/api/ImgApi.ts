import axiosInstance from "@/utils/axiosInstance";

export const getImgRequest = async (url: string): Promise<[string | null, number]> => {
    console.log(`API获取图片 ${url}...`)
    try {
        const response = await axiosInstance.post('/api/img/getImage',
            { url }
        )
        console.log("后端返回的信息码：", response.data.code)              //调试

        return [response.data.data, response.data.code]
    } catch (error) {
        // 取消上传失败，捕获异常
        console.error('获取资源数据失败:', error)
        throw new Error('网络错误')
    }
};
