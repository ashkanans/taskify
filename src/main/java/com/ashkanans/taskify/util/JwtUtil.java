package com.ashkanans.taskify.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Objects;


@Component
public class JwtUtil {

    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String createToken(String username) {
        long expirationTimeInMillis = 1000 * 60 * 60; // 1 hours
        return Jwts.builder()
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTimeInMillis))
                .setSubject(username)
                .signWith(SECRET_KEY)
                .compact();
    }


    public static boolean validateToken(String token, String username) {
        try {
            // Parse the token and extract the claims
            Claims claims = extractClaims(token);
            return Objects.equals(claims.getSubject(), username);
        } catch (Exception e) {
            return false;
        }
    }

    public static String extractUsername(String token) {
        Claims claims = extractClaims(token);
        return claims.getSubject();
    }

    public static Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }
}
