package com.content.my_springboot_project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.content.my_springboot_project.annotation.CheckLoginState;
import com.content.my_springboot_project.model.LoginRequest;
import com.content.my_springboot_project.model.LoginResponse;
import com.content.my_springboot_project.model.RegisterInfo;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.service.LoginService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final LoginService loginService;
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/active")
    public Result<LoginResponse> activeLogin(@RequestBody LoginRequest request) {
        return loginService.activeLogin(request.getEmailOrUid(), request.getPassword());
    }

    @CheckLoginState
    @GetMapping("/auto")
    public Result<LoginResponse> autoLogin(HttpServletRequest request) {
        return loginService.autoLogin();
    }

    @PostMapping("/register")
    public Result<String> register(@RequestBody RegisterInfo request) {
        return loginService.register(request.getUserName(), request.getEmail(), request.getPassword());
    }
    
}
