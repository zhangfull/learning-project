package com.content.my_springboot_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.content.my_springboot_project.entity.User;

public interface RolesRepository extends JpaRepository<User, Long> {
    
}
