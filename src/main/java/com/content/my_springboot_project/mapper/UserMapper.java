package com.content.my_springboot_project.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.content.my_springboot_project.entity.User;

@Mapper
public interface UserMapper {
    User selectUserWithRoles(String emailOrUid);
}

