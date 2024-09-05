package com.ashkanans.taskify.service;

import com.ashkanans.taskify.model.Role;
import com.ashkanans.taskify.model.User;
import com.ashkanans.taskify.repository.RoleRepository;
import com.ashkanans.taskify.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerNewUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Role userRole = roleRepository.findByName("ROLE_USER");
        if(userRole == null) {
            userRole = new Role("NORMAL_USER", user.getId());
            roleRepository.save(userRole);
            user.setRoles(Set.of(userRole));
        }
        userRepository.save(user);
    }
}
