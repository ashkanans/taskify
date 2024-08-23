package com.ashkanans.taskify;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.ashkanans.taskify.model")
public class TodoListAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(TodoListAppApplication.class, args);
    }
}