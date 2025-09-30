package com.content.my_springboot_project.service.impl;

import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.content.my_springboot_project.entity.User;
import com.content.my_springboot_project.exception.OperationException;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.model.UpdatePasswordRequest;
import com.content.my_springboot_project.repository.UserRepository;
import com.content.my_springboot_project.service.UserService;
import com.content.my_springboot_project.utils.Log;
import com.content.my_springboot_project.utils.PasswordUtil;
import com.content.my_springboot_project.utils.ThreadLocalUtil;

@Transactional
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Result<User> getUserInfo() {
        Long id = ThreadLocalUtil.getLongId();
        Optional<User> byId = userRepository.findById(id);
        if (byId.isEmpty()) {
            Log.info(getClass(), "获取用户信息失败：id:{} 的用户为空", id);
            throw new OperationException(110, "用户不存在");
        }
        User user1 = byId.get();
        User user = new User();
        user.setPassword("********");
        user.setId(0L);
        user.setAuthority(user1.getAuthority());
        user.setAvatarUrl(user1.getAvatarUrl());
        user.setBriefIntroduction(user1.getBriefIntroduction());
        user.setEmail(user1.getEmail());
        user.setFollowersCount(user1.getFollowersCount());
        user.setMyFollowersCount(user1.getMyFollowersCount());
        user.setName(user1.getName());
        user.setRegistrationDate(user1.getRegistrationDate());
        user.setUid(user1.getUid());
        return Result.success(user);
    }

    @Override
    public Result<String> update(User user) {
        Log.info(getClass(), "用户更改用户名:{},用户介绍:{}", user.getName(), user.getBriefIntroduction());
        Long id = ThreadLocalUtil.getLongId();
        Optional<User> byId = userRepository.findById(id);
        if (byId.isEmpty()) {
            Log.info(getClass(), "更新用户信息失败：id:{} 的用户为空", id);
            throw new OperationException(110, "用户不存在");
        }
        User user1 = byId.get();
        user1.setName(user.getName());
        user1.setBriefIntroduction(user.getBriefIntroduction());
        userRepository.save(user1);
        return Result.success();
    }

    @Override
    public Result<String> updatePassword(UpdatePasswordRequest updatePasswordRequest) {
        Long id = ThreadLocalUtil.getLongId();
        Optional<User> byId = userRepository.findById(id);
        if (byId.isEmpty()) {
            Log.info(getClass(), "更新用户密码失败：id:{} 的用户为空", id);
            throw new OperationException(43, "用户不存在");
        }
        User user1 = byId.get();
        if (!PasswordUtil.verify(updatePasswordRequest.getOldPassword(), user1.getPassword())) {
            Log.info(getClass(), "更新用户密码失败：id:{} 的用户旧密码不正确", id);
            throw new OperationException(1, "旧密码不正确");
        }
        user1.setPassword(PasswordUtil.encrypt(updatePasswordRequest.getNewPassword()));
        userRepository.save(user1);
        return Result.success();
    }

}
