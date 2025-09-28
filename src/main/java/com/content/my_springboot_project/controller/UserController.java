package com.content.my_springboot_project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.content.my_springboot_project.entity.User;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.model.UpdatePasswordRequest;
import com.content.my_springboot_project.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getInfo")
    public Result<User> getUserInfo(HttpServletRequest request) {
        return userService.getUserInfo();
    }

    @PostMapping("/update")
    public Result<String> updateUserInfo(@RequestBody User user, HttpServletRequest request) {
        return userService.update(user);
    }
    @PostMapping("/updatePassword")
    public Result<String> updatePassword(@RequestBody UpdatePasswordRequest updatePasswordRequest, HttpServletRequest request) {
        return userService.updatePassword(updatePasswordRequest);
    }
    
}
