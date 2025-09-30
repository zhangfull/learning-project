package com.content.my_springboot_project.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.content.my_springboot_project.dto.UserView;
import com.content.my_springboot_project.entity.User;
import com.content.my_springboot_project.mapper.UserMapper;
import com.content.my_springboot_project.repository.UserRepository;
import com.content.my_springboot_project.security.CustomUserDetail;
import com.content.my_springboot_project.utils.Log;

@Service

public class CustomUserDetailsServiceImpl implements UserDetailsService {

    private final UserMapper userMapper;

    public CustomUserDetailsServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Value("${file.img.avatarPath}")
    private String AVATARPATH;

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Log.info(getClass(), "用户：[" + username + "]正在登录");
        User user = userMapper.selectUserWithRoles(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        List<GrantedAuthority> roles = user.getRoles() != null ? user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList())
                : List.of(new SimpleGrantedAuthority("ROLE_USER"));
        Log.info(getClass(), "用户：[" + username + "]的权限是：{}", roles.toString());

        CustomUserDetail customUserDetail = new CustomUserDetail();
        customUserDetail.setId(user.getId());
        customUserDetail.setUsername(username);
        if (user.getAvatarUrl() == null || user.getAvatarUrl().isEmpty()
                || user.getAvatarUrl().trim().isEmpty()) {
            customUserDetail.setAvatarUrl(AVATARPATH + "default.txt");
        } else {
            customUserDetail.setAvatarUrl(user.getAvatarUrl());
        }
        Log.info(getClass(), "用户：[" + username + "]的头像是：{}", user.getAvatarUrl());
        customUserDetail.setPassword(user.getPassword());
        customUserDetail.setAuthorities(roles);
        return customUserDetail;
    }

}
