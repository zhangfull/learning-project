package com.content.my_springboot_project;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@MapperScan("com.content.my_springboot_project.mapper")
@EnableTransactionManagement
@SpringBootApplication
public class MySpringbootProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(MySpringbootProjectApplication.class, args);
	}

}
