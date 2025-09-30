package com.content.my_springboot_project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.content.my_springboot_project.model.LoginResponse;
import com.content.my_springboot_project.model.RegisterInfo;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.service.LoginService;
import com.content.my_springboot_project.utils.Log;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/register")
    public Result<String> register(@Validated @RequestBody RegisterInfo request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // 收集所有错误信息
            List<String> errors = bindingResult.getFieldErrors()
                    .stream()
                    .map(e -> e.getField() + ": " + e.getDefaultMessage())
                    .toList();
            Log.info(getClass(), "注册参数验证errors: {}", errors);
            return Result.error(-2, "注册参数验证失败");
        }
        return loginService.register(request.getUserName(), request.getEmail(), request.getPassword());
    }

    @PostMapping("/refresh")
    public Result<LoginResponse> postMethodName(
            @CookieValue(value = "refresh_token", required = false) String refreshToken) {
        // Log.info(getClass(), "refreshToken: {}", refreshToken);
        return loginService.refreshLogin(refreshToken);
    }

}
