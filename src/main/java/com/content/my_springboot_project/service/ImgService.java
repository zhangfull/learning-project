package com.content.my_springboot_project.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.content.my_springboot_project.model.Result;

public interface ImgService {

    Result<String> getImg(String url) throws IOException;

    Result<String> uploadImg(MultipartFile img);
    
}
