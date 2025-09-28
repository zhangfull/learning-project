package com.content.my_springboot_project.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "file_operation_info")
public class FileDataVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String operator;
    LocalDate operatorTime;
}
