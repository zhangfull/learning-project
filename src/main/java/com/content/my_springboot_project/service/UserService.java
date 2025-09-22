package com.content.my_springboot_project.service;

import com.content.my_springboot_project.entity.User;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.model.UpdatePasswordRequest;

public interface UserService {
    
    Result<User> getUserInfo();

    Result<String> update(User user);

    Result<String> updatePassword(UpdatePasswordRequest updatePasswordRequest);

}
