package com.content.my_springboot_project.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.content.my_springboot_project.dto.UserView;
import com.content.my_springboot_project.repository.UserRepository;
import com.content.my_springboot_project.security.CustomUserDetail;
import com.content.my_springboot_project.utils.Log;

public class CustomUserDetailsServiceImpl implements UserDetailsService{

    private final UserRepository userRepository;

    public CustomUserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserView user = userRepository.findByEmailOrUid(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        List<GrantedAuthority> roles = user.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getRoleName())).collect(Collectors.toList());
        Log.info(getClass(), "用户：[" + username + "]的权限是：{}", roles.toString());
        
        CustomUserDetail customUserDetail = new CustomUserDetail();
        customUserDetail.setId(user.getId());
        customUserDetail.setUsername(username);
        customUserDetail.setAvatarUrl(user.getAvatarUrl());
        customUserDetail.setPassword(user.getPassword());
        customUserDetail.setAuthorities(roles);
        return customUserDetail;
    }
    
}
