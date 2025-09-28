package com.content.my_springboot_project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "user_roles")
public class UserRoles {
    private Long userId;
    private Long roleId;
}
