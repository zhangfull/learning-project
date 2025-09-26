package com.content.my_springboot_project.service;


import com.content.my_springboot_project.model.LoginResponse;
import com.content.my_springboot_project.model.Result;

import jakarta.servlet.http.HttpServletResponse;

public interface LoginService {
    Result<LoginResponse> activeLogin(String emailOrUid, String password, HttpServletResponse response);

    Result<String> register(String userName, String email, String password);

    Result<LoginResponse> refreshLogin(String refreshToken);
}
