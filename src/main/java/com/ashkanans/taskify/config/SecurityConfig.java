package com.ashkanans.taskify.config;

import com.ashkanans.taskify.filter.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtRequestFilter;

    // API Security Configuration (JWT-based)
    @Bean
    @Order(1) // Higher priority to apply to API requests first
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**") // Only applies to /api/** routes
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/auth", "/api/register").permitAll() // Permit authentication and registration endpoints
                                .anyRequest().authenticated() // All other API routes require authentication
                )
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling
                                .authenticationEntryPoint((request, response, authException) -> {
                                    // Return 401 Unauthorized for API requests on authentication failure
                                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Token is either missing or invalid");
                                })
                )
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for API routes
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter

        return http.build();
    }

    // Web App Security Configuration (Form-based login)
    @Bean
    @Order(2) // Lower priority than API security configuration
    public SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll() // Allow access to static resources
                                .requestMatchers("/login", "/register", "/registration-status").permitAll() // Allow access to login and register pages
                                .anyRequest().authenticated() // All other requests require authentication
                )
                .formLogin(formLogin ->
                        formLogin
                                .loginPage("/login") // Specify the login page
                                .defaultSuccessUrl("/", true) // Redirect to index.html after successful login
                )
                .logout(logout ->
                        logout
                                .logoutUrl("/logout") // Specify the logout URL
                                .logoutSuccessUrl("/login") // Redirect to login page after logout
                                .permitAll()
                )
                .csrf(AbstractHttpConfigurer::disable); // Disable CSRF for simplicity in this example

        return http.build();
    }
}
