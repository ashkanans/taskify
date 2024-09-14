package com.ashkanans.taskify.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    @GetMapping("/login")
    public String login() {
        return "login"; // Return the view name for the login page
    }

    @GetMapping("/")
    public String index() {
        return "index"; // Return the view name for the index page
    }

    @GetMapping("/logout-success")
    public String logoutSuccess() {
        return "logout"; // Return the view name for the logout page
    }
}
