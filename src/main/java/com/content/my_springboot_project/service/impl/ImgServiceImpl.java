package com.content.my_springboot_project.service.impl;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.content.my_springboot_project.entity.User;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.repository.UserRepository;
import com.content.my_springboot_project.service.ImgService;
import com.content.my_springboot_project.utils.Log;
import com.content.my_springboot_project.utils.ThreadLocalUtil;

import java.io.IOException;

@Transactional
@Service
public class ImgServiceImpl implements ImgService {

    @Value("${file.img.avatarPath}")
    private String AVATARPATH;
    @Value("${file.img.introduceImgs}")
    private String INTRODUCEIMGS;

    private final UserRepository userRepository;

    public ImgServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Result<String> getImg(String url) throws IOException {
        if (url == null || url.isEmpty()) {
           return Result.error(1, "前端请求的头像地址为空");
        }
        Log.info(getClass(), "前端请求的最终头像地址：{}", url);
        File file = new File(url);
        StringBuilder content = new StringBuilder();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                content.append(line);
            }
        } catch (IOException e) {
            Log.error(getClass(), "读取文件失败", e);
            return Result.error(1, "读取文件失败: ");
        }
        // 返回读取的 Base64 字符串
        return Result.success(content.toString());
    }

    @Override
    public Result<String> uploadImg(MultipartFile img) {
        Optional<User> byId = userRepository.findById(ThreadLocalUtil.getLongId());
        if (byId.isEmpty()) {
            return Result.error(2, "用户不存在");
        }
        try {
            User user = byId.get();
            String path = AVATARPATH + user.getUid() + ".txt";
            byte[] bytes = img.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            File dest = new File(path);
            File parent = dest.getParentFile();
            if (!parent.exists())
                parent.mkdirs();
            try (BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(new FileOutputStream(dest), StandardCharsets.UTF_8))) {
                writer.write(base64);
            }
            user.setAvatarUrl(path);
            userRepository.save(user);
        } catch (Exception e) {
            Log.error(getClass(), "头像转换Base64失败", e);
            return Result.error(2, "头像转换Base64失败");
        }
        return Result.success();
    }

}
