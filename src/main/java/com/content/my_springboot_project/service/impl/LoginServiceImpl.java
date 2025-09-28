package com.content.my_springboot_project.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import java.util.Optional;
import org.springframework.stereotype.Service;

import com.content.my_springboot_project.dto.UserView;
import com.content.my_springboot_project.entity.User;
import com.content.my_springboot_project.enumeration.Authority;
import com.content.my_springboot_project.exception.OperationException;
import com.content.my_springboot_project.model.LoginResponse;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.repository.UserRepository;
import com.content.my_springboot_project.service.LoginService;
import com.content.my_springboot_project.utils.GeneratingUtils;
import com.content.my_springboot_project.utils.JwtUtil;
import com.content.my_springboot_project.utils.Log;
import com.content.my_springboot_project.utils.PasswordUtil;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class LoginServiceImpl implements LoginService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public LoginServiceImpl(UserRepository userRepository,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Result<String> register(String userName, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            return Result.error(1, String.format("%s邮箱已被注册:", email));
        } else {
            String uid = GeneratingUtils.generateUID();
            for (int i = 0; i < 50; i++) {
                if (!userRepository.existsByUid(uid))
                    break;
                uid = GeneratingUtils.generateUID();
            }
            User user = new User();
            user.setId(null);
            user.setName(userName);
            user.setEmail(email);
            user.setPassword(PasswordUtil.encrypt(password));
            user.setUid(uid);
            user.setRegistrationDate(LocalDateTime.now());
            user.setAuthority(Authority.USER);
            user.setFollowersCount(0);
            user.setMyFollowersCount(0);
            User save = userRepository.save(user);
            if (save.getId() == null) {
                throw new OperationException(-1, "注册失败,请稍后再试");
            }
            Log.info(getClass(), "注册成功: {}", save.getEmail());
            return Result.success("注册成功");
        }
    }

    @Override
    public Result<LoginResponse> refreshLogin(String refreshToken) {
        String emailOrUid = jwtUtil.parseToken(refreshToken);
        if (emailOrUid == null) {
            return Result.error(1, "token无效");
        }
        Optional<UserView> user = userRepository.findByEmailOrUid(emailOrUid);
        if (user.isEmpty()) {
            Log.info(getClass(), "自动登录用户为空:{}",emailOrUid);
            return Result.error(2, "用户不存在");
        }
        UserView current = user.get();
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setAvatarUrl(current.getAvatarUrl());
        loginResponse.setAccessToken(jwtUtil.generateToken(emailOrUid, 1000 * 60 * 10));
        if (loginResponse.getAccessToken() == null) {
            throw new OperationException(-1, "token生成失败");
        }
        return Result.success(loginResponse);
    }

}
