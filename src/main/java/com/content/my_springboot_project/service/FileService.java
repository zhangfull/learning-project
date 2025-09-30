package com.content.my_springboot_project.service;

import com.content.my_springboot_project.model.DisplayFile;
import com.content.my_springboot_project.model.FilePage;
import com.content.my_springboot_project.model.FileRequestCondition;
import com.content.my_springboot_project.model.Result;

public interface FileService {

    Result<FilePage<DisplayFile>> getFiles(FileRequestCondition fileRequestCondition);

}
