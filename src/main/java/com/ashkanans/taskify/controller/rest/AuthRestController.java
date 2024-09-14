package com.ashkanans.taskify.controller.rest;

import com.ashkanans.taskify.api.architecture.ApiError;
import com.ashkanans.taskify.api.architecture.ApiResponse;
import com.ashkanans.taskify.controller.AuthResponse;
import com.ashkanans.taskify.model.User;
import com.ashkanans.taskify.service.UserService;
import com.ashkanans.taskify.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static com.ashkanans.taskify.controller.RegistrationStatusController.REGISTRATION_ENABLED;

@RestController
@RequestMapping("/api")
public class AuthRestController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserService userService;

    public AuthRestController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
    }

    @PostMapping("/auth")
    public ResponseEntity<ApiResponse<?>> login(@RequestParam String username, @RequestParam String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = JwtUtil.createToken(userDetails.getUsername());

            Map<String, Object> data = new HashMap<>();
            data.put("token", new AuthResponse(token).getToken());
            data.put("username", userDetails.getUsername());
            return new ResponseEntity<>(ApiResponse.success("Authentication successful", data), HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(ApiResponse.error("Invalid username or password",
                    new ApiError(401, "Authentication failed due to invalid credentials.")), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody User user) {
        try {
            if (REGISTRATION_ENABLED) {
                userService.registerNewUser(user);
                return new ResponseEntity<>(ApiResponse.success("Registration successful", null), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(ApiResponse.error("Registration is blocked",
                        new ApiError(403, "User registration is currently disabled.")), HttpStatus.FORBIDDEN);
            }
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage().contains("Key (username)")) {
                return new ResponseEntity<>(ApiResponse.error("Username already exists",
                        new ApiError(400, "The provided username is already taken.")), HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(ApiResponse.error("Data integrity issue during registration",
                    new ApiError(500, "An unexpected error occurred.")), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(ApiResponse.error("Registration failed",
                    new ApiError(401, "Authentication failure during registration.")), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("An unexpected error occurred",
                    new ApiError(500, "An unexpected error occurred during registration.")), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<?>> validateToken(HttpServletRequest request, @RequestParam String username) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>(ApiResponse.error("Missing or invalid Authorization header",
                    new ApiError(400, "Authorization header must be in the format: Bearer <token>")), HttpStatus.BAD_REQUEST);
        }

        String token = authorizationHeader.substring(7);  // Extract token (remove "Bearer ")

        if (JwtUtil.validateToken(token, username)) {
            Date tokenExpiration = JwtUtil.extractExpiration(token);

            Map<String, Object> data = new HashMap<>();
            data.put("username", username);
            data.put("tokenExpiration", tokenExpiration);

            return new ResponseEntity<>(ApiResponse.success("Token is valid", data), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(ApiResponse.error("Token is invalid or expired",
                    new ApiError(401, "Authentication token has expired.")), HttpStatus.UNAUTHORIZED);
        }
    }
}
