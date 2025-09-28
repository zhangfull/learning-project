package com.content.my_springboot_project.service;


import com.content.my_springboot_project.model.LoginResponse;
import com.content.my_springboot_project.model.Result;

public interface LoginService {

    Result<String> register(String userName, String email, String password);

    Result<LoginResponse> refreshLogin(String refreshToken);
}
