package com.content.my_springboot_project.dto;

import java.util.Set;

public interface UserView {
    Long getId();

    String getName();

    String getUid();

    String getEmail();

    String getPassword();

    String getAvatarUrl();

    Set<RoleView> getRoles();

}
