import { getFileDetailRequest, getFileListRequest } from "@/api/FilesApi";
import type { FileRequestCondition, FilePage, FileSearchCondition, DetailFile } from "@/types";

// 判断是否为搜索
export const handleIsSearch = (fsc: FileSearchCondition): boolean => {
    return (fsc.searchTerm !== null && fsc.searchTerm !== '')  ||
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
    if (response === null) {
        const fp : FilePage = {} as FilePage;
        fp.currentPage = 0;
        fp.totalPages = 0;
        fp.latestVersion = 0;
        fp.results = [];
        return fp;
    }
    if (response.latestVersion === undefined || response.latestVersion === null) {
        throw new Error('获取文件列表失败');
    }
    return response;
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
