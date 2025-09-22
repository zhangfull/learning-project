package com.content.my_springboot_project.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FilePage {
    Long currentPage;
    Long totalPages;
    Integer pageSize;
    Long latestVersion;
    List<DisplayFile> results;
}
