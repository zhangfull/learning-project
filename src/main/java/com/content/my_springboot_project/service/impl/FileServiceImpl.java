package com.content.my_springboot_project.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.content.my_springboot_project.dto.FileInfoProjection;
import com.content.my_springboot_project.mapper.FileMapper;
import com.content.my_springboot_project.model.DisplayFile;
import com.content.my_springboot_project.model.FilePage;
import com.content.my_springboot_project.model.FileRequestCondition;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.repository.FileInfoRepository;
import com.content.my_springboot_project.service.FileService;
import com.content.my_springboot_project.utils.Log;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

@Transactional
@Service
public class FileServiceImpl implements FileService {

    @Value("${file.pagination.page-size}")
    private int defaultPageSize;

    private final FileInfoRepository fileInfoRepository;
    private final FileMapper fileMapper;

    public FileServiceImpl(FileInfoRepository fileInfoRepository, FileMapper fileMapper) {
        this.fileMapper = fileMapper;
        this.fileInfoRepository = fileInfoRepository;
    }

    @Override
    public Result<FilePage> getFiles(FileRequestCondition fileRequestCondition) {
        FilePage filePage = new FilePage();
        filePage.setPageSize(defaultPageSize);
        if (!fileRequestCondition.getIsFiltered()) {
            Pageable pageable = PageRequest.of(fileRequestCondition.getNeedPage().intValue() - 1, defaultPageSize);
            Page<FileInfoProjection> allForDisplay = fileInfoRepository.findAllForDisplay(pageable);
            if (allForDisplay.isEmpty()) {
                Log.info(getClass(), "获取文件列表为空");
                return Result.success(null);
            }
            List<DisplayFile> displayFiles = new ArrayList<>();
            try {
                for (FileInfoProjection fileInfo : allForDisplay.getContent()) {
                    displayFiles.add(new DisplayFile(fileInfo));
                }
            } catch (Exception e) {
                e.printStackTrace();
                Log.error(getClass(), "获取文件列表加密上传者ID失败", e);
            }
            filePage.setResults(displayFiles);
            filePage.setCurrentPage(fileRequestCondition.getNeedPage());

            filePage.setTotalPages((long)allForDisplay.getTotalPages());
            //filePage.setLatestVersion(1L);
            filePage.setLatestVersion(2L);
        } else {
            int offset = (fileRequestCondition.getNeedPage().intValue() - 1) * defaultPageSize;
            List<DisplayFile> searchFiles = fileMapper.searchFiles(fileRequestCondition, offset, defaultPageSize);
            filePage.setResults(searchFiles);
            filePage.setCurrentPage(fileRequestCondition.getNeedPage());
            long count = fileMapper.countSearchFiles(fileRequestCondition);
            Log.info(getClass(), "获取文件列表数量{}", count);
            if (count % 10 == 0) {
                filePage.setTotalPages(count / defaultPageSize);
            } else {
                filePage.setTotalPages((count / defaultPageSize) + 1);
            }
            filePage.setLatestVersion(2L);
        }
        return Result.success(filePage);
    }

    private void updateVersion(String message) {
        Log.info(getClass(), message);
    }

}
