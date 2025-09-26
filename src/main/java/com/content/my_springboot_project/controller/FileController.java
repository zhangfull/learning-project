package com.content.my_springboot_project.controller;

import org.springframework.web.bind.annotation.RestController;

import com.content.my_springboot_project.model.FilePage;
import com.content.my_springboot_project.model.FileRequestCondition;
import com.content.my_springboot_project.model.FileSearchCondition;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.service.FileService;
import com.content.my_springboot_project.utils.Log;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/getFiles")
    public Result<FilePage> getFiles(@RequestBody FileRequestCondition fileRequestCondition) {
        Log.info(getClass(), "获取文件列表条件：{}", fileRequestCondition);
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            Log.info(getClass(), "线程被中断: {}", e.getMessage());
        }
        return fileService.getFiles(fileRequestCondition);
    }
}
