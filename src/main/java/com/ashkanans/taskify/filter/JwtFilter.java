package com.ashkanans.taskify.filter;

import com.ashkanans.taskify.service.RequestLogService;
import com.ashkanans.taskify.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final RequestLogService requestLogService; // Inject RequestLogService

    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService, RequestLogService requestLogService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.requestLogService = requestLogService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        String ipAddress = request.getRemoteAddr(); // Get the IP address of the requester
        String authorizationHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;


        // Skip JWT filtering for certain paths
        if (requestURI.startsWith("/api/auth") || requestURI.startsWith("/api/register")) {
            requestLogService.logRequest(username, ipAddress, requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
            try {
                // Extract username from the token
                username = JwtUtil.extractUsername(token);
            } catch (Exception e) {
                // Handle cases where token extraction fails (e.g., malformed token)
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Validate token by comparing with the username and checking expiration
            if (JwtUtil.validateToken(token, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                // Token validation failed
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired JWT token");
                return;
            }
        }

        // If the requestURI starts with "/api" and no valid username was extracted
        if (requestURI.startsWith("/api") && (token == null || username == null)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is missing or invalid");
            return;
        }

        requestLogService.logRequest(username, ipAddress, requestURI);
        // Continue with the filter chain if the token is valid
        filterChain.doFilter(request, response);
    }
}
