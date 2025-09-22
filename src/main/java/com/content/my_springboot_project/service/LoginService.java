package com.content.my_springboot_project.service;

import com.content.my_springboot_project.model.LoginResponse;
import com.content.my_springboot_project.model.Result;

public interface LoginService {
    Result<LoginResponse> activeLogin(String emailOrUid, String password);
    public Result<LoginResponse> autoLogin();
    Result<String> register(String userName, String email, String password);
}
