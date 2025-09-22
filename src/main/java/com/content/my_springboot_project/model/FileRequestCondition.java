package com.content.my_springboot_project.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FileRequestCondition {
    Long needPage;
    Long currentVersion;
    Boolean isFiltered;
    FileSearchCondition fileSearchCondition;
}
