import { getFileDetailRequest, getFileListRequest } from "@/api/FilesApi";
import type { FileRequestCondition, FilePage, FileSearchCondition, DetailFile } from "@/types";
import { ResourceTypes } from "@/types";

// 判断是否为搜索
export const handleIsSearch = (fsc: FileSearchCondition): boolean => {
    return (fsc.searchTerm !== null && fsc.searchTerm !== '') ||
        (fsc.resourceType !== null && fsc.resourceType !== '') ||
        (fsc.dateRange !== null && fsc.dateRange !== '') ||
        (fsc.order !== null && fsc.order !== '');
};

export const handlePageAcquisition = async (frc: FileRequestCondition): Promise<FilePage | null> => {
    console.log(frc);

    if (frc.needPage < 1) {
        throw new Error('页码必须大于0');
    }

    if (!handleIsSearch(frc.fileSearchCondition!)) {
        frc.isFiltered = false;
        frc.fileSearchCondition = null;
        console.log("未设置任何过滤条件");
    } else {
        frc.isFiltered = true;
        console.log("设置过滤条件", frc.fileSearchCondition);
    }
    const response = await getFileListRequest(frc);
    const fp: FilePage = {} as FilePage;
    if (response === null) {
        fp.currentPage = 0;
        fp.totalPages = 0;
        fp.pageSize = 0;
        fp.latestVersion = 0;
        fp.results = [];
        return fp;
    }
    if (response.latestVersion === undefined || response.latestVersion === null) {
        throw new Error('获取文件列表失败');
    }
    fp.currentPage = response.currentPage;
    fp.totalPages = response.totalPages;
    fp.pageSize = response.pageSize;
    fp.latestVersion = response.latestVersion;

    fp.results = response.results.map(item => {
        return {
            ...item,
            fileType: ResourceTypes[item.fileType as keyof typeof ResourceTypes],
            uploadDate: new Date(item.uploadDate).toLocaleDateString('zh-CN')
        }
    })
    return fp;
};

export const handleFileDetail = async (id: number): Promise<DetailFile | null> => {
    if (id < 1) {
        throw new Error('无效的文件ID');
    }
    const response = await getFileDetailRequest(id);
    if (response === null) {
        throw new Error('获取文件详情失败');
    }
    return response;
};
