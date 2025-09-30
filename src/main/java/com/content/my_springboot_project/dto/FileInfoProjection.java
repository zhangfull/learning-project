package com.content.my_springboot_project.dto;

import java.time.LocalDateTime;

public interface FileInfoProjection {
    Long getId();

    Long getUploaderId();

    String getName();

    String getFileType();

    String getDescription();

    String getUploader();

    LocalDateTime getUploadDate();

    Long getCollectionCount();
}
