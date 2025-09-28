package com.content.my_springboot_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.content.my_springboot_project.entity.FileDataVersion;

public interface FileDataVersionRepository extends  JpaRepository<FileDataVersion, Long> {
    
}
