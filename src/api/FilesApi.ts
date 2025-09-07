import type { FileRequestCondition, FilePage } from "@/types";

export const getFileListRequest = async (frc: FileRequestCondition): Promise<FilePage | null> => {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    // 模拟文件列表
    const mockFileList: FilePage = {
        currentPage: frc.needPage,
        totalPages: 15,
        latestVersion: 3,
        results: [
            {
                id: 1,
                name: "文件1",
                type: "文档",
                description: "这是文件1的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 1,
                name: "文件1",
                type: "文档",
                description: "这是文件1的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 1,
                name: "文件1",
                type: "文档",
                description: "这是文件1的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 1,
                name: "文件1",
                type: "文档",
                description: "这是文件1的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 1,
                name: "文件1",
                type: "文档",
                description: "这是文件1的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN')
            }
        ]
    };
    return mockFileList;
};
