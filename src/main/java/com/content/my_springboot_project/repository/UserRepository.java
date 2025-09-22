package com.content.my_springboot_project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.content.my_springboot_project.dto.UserView;
import com.content.my_springboot_project.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u.id AS id, u.name AS name, u.uid AS uid, u.email AS email, " +
            "u.avatarUrl AS avatarUrl, u.password AS password " +
            "FROM User u WHERE u.email = :email OR u.uid = :uid")
    Optional<UserView> findByEmailOrUid(String email, String uid);

    @Query("SELECT u.id AS id, u.name AS name, u.uid AS uid, u.email AS email, " +
            "u.avatarUrl AS avatarUrl " +
            "FROM User u WHERE u.id = :id")
    Optional<UserView> findByIdForUserView(Long id);

    boolean existsByEmail(String email);

    boolean existsByUid(String uid);

}