package com.content.my_springboot_project.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginResponse {
  private String userName;
  private String uid;
  private String email;
  private String avatarUrl;
  private String token;
  private String free;
}
