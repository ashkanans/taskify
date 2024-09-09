package com.ashkanans.taskify.controller;

import com.ashkanans.taskify.model.User;
import com.ashkanans.taskify.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import static com.ashkanans.taskify.controller.RegistrationStatusController.REGISTRATION_ENABLED;

@Controller
public class RegistrationController {

    private final UserService userService;

    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(User user) {
        if(REGISTRATION_ENABLED) {
            userService.registerNewUser(user);
        }
        return "redirect:/login";
    }
}

