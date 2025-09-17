import type { FileRequestCondition, FilePage, DetailFile } from "@/types";

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
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 1,
                name: "文件1",
                type: "文档",
                description: "这是文件1的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 1,
                name: "文件1",
                type: "文档",
                description: "这是文件1的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 1,
                name: "文件1",
                type: "文档",
                description: "这是文件1的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 1,
                name: "文件1",
                type: "文档",
                description: "这是文件1的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 2,
                name: "文件2",
                type: "视频",
                description: "这是文件2的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            },
            {
                id: 3,
                name: "文件3",
                type: "音频",
                description: "这是文件3的描述",
                uploadDate: new Date().toLocaleDateString('zh-CN'),
                collectionCount: 123
            }
        ]
    };
    return mockFileList;
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
        type: "video",
        description: "这是测试文件" + id + "的描述",
        uploadDate: new Date().toLocaleDateString('zh-CN'),
    }
    return df;
};
