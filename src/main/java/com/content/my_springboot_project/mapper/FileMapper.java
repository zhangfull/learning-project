package com.content.my_springboot_project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.content.my_springboot_project.model.DisplayFile;
import com.content.my_springboot_project.model.FileRequestCondition;

@Mapper
public interface FileMapper {
    List<DisplayFile> searchFiles(@Param("fileRequestCondition") FileRequestCondition fileRequestCondition, @Param("offset") int offset, @Param("pageSize") int pageSize);

    long countSearchFiles(@Param("fileRequestCondition") FileRequestCondition fileRequestCondition);
}
