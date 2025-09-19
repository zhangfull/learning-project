import type { FileRequestCondition, FilePage, DetailFile } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

export const getFileListRequest = async (frc: FileRequestCondition): Promise<FilePage | null> => {

    console.log('API获取文件条件', frc);
    try {
        const response = await axiosInstance.post('/api/file/getFiles', 
            frc
        )
        console.log("后端返回的信息码：", response.data.code)              //调试
        console.log("后端返回的数据：", response.data.data)              //调试
        return response.data.data
    } catch (error) {
        // 取消上传失败，捕获异常
        console.error('获取资源数据失败:', error)
        throw error;
    }
};

export const getFileDetailRequest = async (id: number): Promise<DetailFile | null> => {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    // 模拟文件列表
    const df: DetailFile = {
        uploader: "ben_ren",
        introduce: "这是一个非常棒的资源，包含了丰富的内容和实用的信息，适合各种需求的用户下载和使用。",
        imgs: ['www.baidu.com', 'www.sina.com'],
        size: "10GB",
        downloadUrl: "www.google.com",
        collectionCount: 10086,
        tags: ['热门', '推荐', '最新'],
        id: id,
        name: "测试文件" + id,
        fileType: "video",
        description: "这是测试文件" + id + "的描述",
        uploadDate: new Date().toLocaleDateString('zh-CN'),
    }
    return df;
};
