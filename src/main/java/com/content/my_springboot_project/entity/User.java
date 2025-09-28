package com.content.my_springboot_project.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.content.my_springboot_project.enumeration.Authority;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String uid;
    private String name;
    private String email;
    private String password;
    private LocalDateTime registrationDate;
    @Enumerated(EnumType.STRING)
    private Authority authority;
    private String briefIntroduction;
    private Integer followersCount;
    private Integer myFollowersCount;
    private String avatarUrl;

    @ManyToMany(fetch = FetchType.EAGER) // 一次性加载角色
    @JoinTable(
        name = "user_roles",                     // 中间表
        joinColumns = @JoinColumn(name = "user_id"),     // 当前表外键
        inverseJoinColumns = @JoinColumn(name = "role_id") // 对应 role 表外键
    )
    private Set<Role> roles = new HashSet<>();
}
