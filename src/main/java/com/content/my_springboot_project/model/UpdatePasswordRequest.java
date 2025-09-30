package com.content.my_springboot_project.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdatePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
