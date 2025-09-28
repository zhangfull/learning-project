package com.content.my_springboot_project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import com.content.my_springboot_project.model.LoginResponse;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.security.CustomUserDetail;
import com.content.my_springboot_project.security.filter.CustomAuthenticationFilter;
import com.content.my_springboot_project.security.filter.JwtAuthenticationFilter;
import com.content.my_springboot_project.service.impl.CustomUserDetailsServiceImpl;
import com.content.my_springboot_project.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,

            JwtUtil jwtUtil) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 用 BCrypt 加密
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager)
            throws Exception {

        CustomAuthenticationFilter cFilter = new CustomAuthenticationFilter(authenticationManager);
        cFilter.setFilterProcessesUrl("/login/active");
        cFilter.setAllowSessionCreation(false);
        cFilter.setAuthenticationSuccessHandler((request, response, authentication) -> {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpStatus.OK.value());
            response.getWriter().write(new ObjectMapper().writeValueAsString(Result.success(successTodo(response))));
        });
        cFilter.setAuthenticationFailureHandler((request, response, exception) -> {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpStatus.OK.value());
            Result<String> result;
            if (exception instanceof UsernameNotFoundException) {
                result = Result.error(1, "用户不存在");
            } else if (exception instanceof BadCredentialsException) {
                result = Result.error(2, "账号或密码错误");
            } else if (exception instanceof LockedException) {
                result = Result.error(3, "账号被锁定");
            } else if (exception instanceof DisabledException) {
                result = Result.error(4, "账号被禁用");
            } else {
                result = Result.error(5, "认证失败");
            }
            response.getWriter().write(new ObjectMapper().writeValueAsString(result));
        });

        http
                .authenticationManager(authenticationManager)
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers("/**")
                        .requireCsrfProtectionMatcher(request -> "/refresh".equals(request.getServletPath())))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/login", "/file/getFiles").permitAll()
                        .requestMatchers("/img/**").hasRole("USER")
                        .requestMatchers("/**").authenticated()
                        .anyRequest().authenticated())
                .httpBasic(AbstractHttpConfigurer::disable)
                .addFilter(cFilter)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private LoginResponse successTodo(HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetail user = (CustomUserDetail) auth.getPrincipal();
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setAvatarUrl(user.getAvatarUrl());
        String accessToken = jwtUtil.generateToken(user.getUsername(), 1000 * 60 * 10);
        loginResponse.setAccessToken(accessToken);
        String refreshToken = jwtUtil.generateToken(user.getUsername(), 1000 * 60 * 60 * 24 * 7);
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 开发环境 false，生产 true
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 天，单位是秒
        response.addCookie(cookie);
        return loginResponse;
    }
}
