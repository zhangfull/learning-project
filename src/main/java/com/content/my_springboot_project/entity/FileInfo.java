package com.content.my_springboot_project.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "file_info")
public class FileInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long uploaderId;
    private String name;
    private String fileType;
    private String description;
    private String uploader;
    private LocalDateTime uploadDate;
    private Long collectionCount;

    private String introduce;
    private String size;
    private String downloadDescription;
    private String downloadUrl;

    private String[] imgs;
    private String[] tags;
}
