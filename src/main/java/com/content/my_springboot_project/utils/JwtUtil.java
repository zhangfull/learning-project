package com.content.my_springboot_project.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {

    // 固定密钥（推荐放在 application.yml 或环境变量里）
    private static final String SECRET = "my-super-secret-key-1234567890-my-super-secret-key";
    private static final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));


    /**
     * 生成 token
     * 
     * @param claims  你要放进 token 的自定义数据
     * @param subject 一般是用户名或用户ID
     */
    public static String generateToken(Map<String, Object> claims, long exception) {
        try {
            claims.put("id", AESUtil.encrypt(claims.get("id").toString()));
            return Jwts.builder()
                    .setClaims(claims) // 自定义数据
                    .setIssuedAt(new Date()) // 签发时间
                    .setExpiration(new Date(System.currentTimeMillis() + exception)) // 过期时间
                    .signWith(key, SignatureAlgorithm.HS256) // 签名算法
                    .compact();
        } catch (Exception e) {
            Log.error(JwtUtil.class, "加密用户ID失败", e);
            return null;
        }

    }

    /**
     * 解析 token
     * 
     * @param token 前端传过来的 JWT
     * @return Claims，里面可以拿到 subject 和自定义数据
     */
    public static Map<String, String> parseToken(String token) {
        try {
            Claims body = Jwts.parserBuilder()
                    .setSigningKey(key) // 验证签名
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            Map<String, String> map = new HashMap<>();
            map.put("email", body.get("email", String.class));
            map.put("id", AESUtil.decrypt(body.get("id", String.class)));
            return map;
        } catch (Exception e) {
            Log.error(JwtUtil.class, "token解析失败", e);
            return null;
        }

    }
}
