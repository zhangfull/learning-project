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
import com.content.my_springboot_project.utils.ThreadLocalUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class LoginServiceImpl implements LoginService {

    private final UserRepository userRepository;

    public LoginServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Result<LoginResponse> activeLogin(String emailOrUid, String password, HttpServletResponse response) {
        LoginResponse loginResponse = new LoginResponse();
        Map<String, Object> userInfo = new HashMap<>();

        userRepository.findByEmailOrUid(emailOrUid, emailOrUid);
        Optional<UserView> optionalUser = userRepository.findByEmailOrUid(emailOrUid, emailOrUid);
        if (optionalUser.isEmpty()) {
            return Result.error(2, "用户不存在");
        }
        UserView user = optionalUser.get();
        if (!PasswordUtil.verify(password, user.getPassword())) {
            return Result.error(1, "密码错误");
        }

        Log.info(getClass(), "用户{}登录成功", user.getEmail());
        loginResponse.setEmail(user.getEmail());
        loginResponse.setUserName(user.getName());
        loginResponse.setUid(user.getUid());
        loginResponse.setAvatarUrl(user.getAvatarUrl());
        loginResponse.setFree(null);
        userInfo.put("email", user.getEmail());
        userInfo.put("id", user.getId());
        Map<String, Object> userInfo1 = new HashMap<>();
        userInfo1.put("email", user.getEmail());
        userInfo1.put("id", user.getId());
        loginResponse.setAccessToken(JwtUtil.generateToken(userInfo, 1000 * 60 * 10));
        String refreshToken = JwtUtil.generateToken(userInfo1, 1000 * 60 * 60 * 24 * 7);

        if (loginResponse.getAccessToken() == null || refreshToken == null) {
            throw new OperationException(-1, "token生成失败");
        }
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 开发环境 false，生产 true
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 天，单位是秒
        response.addCookie(cookie);
        return Result.success(loginResponse);
    }

    @Override
    public Result<LoginResponse> autoLogin() {
        Long id = ThreadLocalUtil.getLongId();
        Log.info(getClass(), "自动登录用户ID: {}", id);
        Optional<UserView> byId = userRepository.findByIdForUserView(id);
        if (byId.isEmpty()) {
            Log.info(getClass(), "自动登录用户ID为空");
            return Result.error(2, "用户不存在");
        }
        UserView user = byId.get();
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUserName(user.getName());
        loginResponse.setEmail(user.getEmail());
        loginResponse.setUid(user.getUid());
        loginResponse.setFree(null);
        loginResponse.setAvatarUrl(user.getAvatarUrl());
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", user.getEmail());
        userInfo.put("id", user.getId());
        loginResponse.setAccessToken(JwtUtil.generateToken(userInfo, 1000 * 60 * 10));
        if (loginResponse.getAccessToken() == null) {
            throw new OperationException(-1, "token生成失败");
        }
        return Result.success(loginResponse);
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
       Map<String,String> token = JwtUtil.parseToken(refreshToken);
       if (token == null) {
        return Result.error(1, "token无效");
       }
       Long userId = Long.parseLong(token.get("id"));
       Optional<UserView> byId = userRepository.findByIdForUserView(userId);
        if (byId.isEmpty()) {
            Log.info(getClass(), "自动登录用户ID为空");
            return Result.error(2, "用户不存在");
        }
        UserView user = byId.get();
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUserName(user.getName());
        loginResponse.setEmail(user.getEmail());
        loginResponse.setUid(user.getUid());
        loginResponse.setFree(null);
        loginResponse.setAvatarUrl(user.getAvatarUrl());
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", user.getEmail());
        userInfo.put("id", user.getId());
        loginResponse.setAccessToken(JwtUtil.generateToken(userInfo, 1000 * 60 * 10));
        if (loginResponse.getAccessToken() == null) {
            throw new OperationException(-1, "token生成失败");
        }
        return Result.success(loginResponse);
    }

}
