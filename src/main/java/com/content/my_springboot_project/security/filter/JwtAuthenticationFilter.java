package com.content.my_springboot_project.security.filter;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.content.my_springboot_project.repository.UserRepository;
import com.content.my_springboot_project.service.impl.CustomUserDetailsServiceImpl;
import com.content.my_springboot_project.utils.JwtUtil;
import com.content.my_springboot_project.utils.Log;
import com.content.my_springboot_project.utils.ThreadLocalUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsServiceImpl userDetailsService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsServiceImpl userDetailsService,
            UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }

    @SuppressWarnings("null")
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null) {
            String emailOrUid = jwtUtil.parseToken(header);

            if (emailOrUid != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Long id = userRepository.findIdByEmailOrUid(emailOrUid).orElseThrow(() -> {
                    Log.error(getClass(), "token无效,用户不存在", null);
                    throw new UsernameNotFoundException("User not found with emailOrUid: " + emailOrUid);
                });
                ThreadLocalUtil.set(id);
                UserDetails userDetails = userDetailsService.loadUserByUsername(emailOrUid);
                if (jwtUtil.validateToken(header, userDetails)) {
                    Log.info(getClass(), "用户 {} 已自动登录", emailOrUid);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                            null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } else {
                Log.error(getClass(), "token解析无效/用户已登陆", null);
            }
        } else {
            Log.error(getClass(), "token不存在", null);
        }
        Log.info(getClass(), "请求路径：{}", request.getRequestURI());
        filterChain.doFilter(request, response);
    }

}
