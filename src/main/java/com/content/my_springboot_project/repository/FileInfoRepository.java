package com.content.my_springboot_project.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.content.my_springboot_project.dto.FileInfoProjection;
import com.content.my_springboot_project.entity.FileInfo;

public interface FileInfoRepository extends JpaRepository<FileInfo, Long> {

    @Query("SELECT f.id AS id, f.uploaderId AS uploaderId, f.name AS name, f.fileType AS fileType, " +
            "f.description AS description, f.uploader AS uploader, f.uploadDate AS uploadDate, f.collectionCount AS collectionCount "
            +
            "FROM FileInfo f")
    Page<FileInfoProjection> findAllForDisplay(Pageable pageable);

}
