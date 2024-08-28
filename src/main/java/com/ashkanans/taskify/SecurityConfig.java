package com.ashkanans.taskify;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll() // Allow access to static resources
                                .requestMatchers("/login", "/register").permitAll() // Allow access to login and register pages
                                .anyRequest().authenticated() // All other requests require authentication
                )
                .formLogin(formLogin ->
                        formLogin
                                .loginPage("/login") // Specify the login page
                                .defaultSuccessUrl("/", true) // Redirect to index.html after successful login                                .failureUrl("/login?error") // Redirect to login page with error on failure
                )
                .logout(logout ->
                        logout
                                .logoutUrl("/logout") // Specify the logout URL
                                .logoutSuccessUrl("/login?logout") // Redirect to login page after logout
                                .permitAll()
                )
                .csrf(csrf -> csrf.disable()); // Disable CSRF for simplicity; adjust for production

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
