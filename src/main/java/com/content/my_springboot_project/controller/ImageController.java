package com.content.my_springboot_project.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.content.my_springboot_project.annotation.CheckLoginState;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.service.ImgService;
import com.content.my_springboot_project.utils.Log;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/img")
public class ImageController {

    private final ImgService imgService;

    public ImageController(ImgService imgService) {
        this.imgService = imgService;
    }

    @CheckLoginState
    @PostMapping("/getImage")
    public Result<String> getImage(@RequestBody  Map<String, String> body, HttpServletRequest request) throws IOException {
        Log.info(getClass(), "前端请求的头像地址：{}", body.get("url"));
        return imgService.getImg(body.get("url"));
    }

    @CheckLoginState
    @PostMapping("/uploadImage")
    public Result<String> uploadImage(@RequestParam("avatar") MultipartFile file, HttpServletRequest request) {
        if (file.isEmpty()) {
            return Result.error(1, "后端未收到文件");
        }
        return imgService.uploadImg(file);
    }
    
}