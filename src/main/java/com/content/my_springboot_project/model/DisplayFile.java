package com.content.my_springboot_project.model;

import java.time.LocalDateTime;

import com.content.my_springboot_project.dto.FileInfoProjection;
import com.content.my_springboot_project.utils.AESUtil;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DisplayFile {
    Long id;
    String uploaderId;
    String name;
    String fileType;
    String description;
    String uploader;
    LocalDateTime uploadDate;
    Long collectionCount;

    public DisplayFile(FileInfoProjection fileInfo) throws Exception {
        this.id = fileInfo.getId();
        this.uploaderId = AESUtil.encrypt(fileInfo.getUploaderId().toString());
        this.name = fileInfo.getName();
        this.fileType = fileInfo.getFileType();
        this.description = fileInfo.getDescription();
        this.uploader = fileInfo.getUploader();
        this.uploadDate = fileInfo.getUploadDate();
        this.collectionCount = fileInfo.getCollectionCount();
    }
    
}
