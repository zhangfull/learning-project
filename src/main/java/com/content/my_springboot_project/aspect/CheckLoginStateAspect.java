package com.content.my_springboot_project.aspect;

import java.util.Map;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.content.my_springboot_project.exception.OperationException;
import com.content.my_springboot_project.model.Result;
import com.content.my_springboot_project.utils.JwtUtil;
import com.content.my_springboot_project.utils.Log;
import com.content.my_springboot_project.utils.ThreadLocalUtil;

import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class CheckLoginStateAspect {

    @Around("@annotation(com.content.my_springboot_project.annotation.CheckLoginState)")
    public Object checkSupplierSession(ProceedingJoinPoint joinPoint) throws Throwable {

        HttpServletRequest request = null;
        // 遍历参数，获取 HttpServletRequest
        for (Object arg : joinPoint.getArgs()) {
            if (arg instanceof HttpServletRequest) {
                request = (HttpServletRequest) arg;
                break;
            }
        }
        if (request == null) {
            throw new RuntimeException("身份检查失败：无法获取 HttpServletRequest");
        }
        try {
            // 获取请求头中的 JWT 令牌
            String token = request.getHeader("Authorization");
            Log.info(getClass(), "token not empty:{}", !(token==null));
            Map<String, String> stringObjectMap = JwtUtil.parseToken(token);
            if (stringObjectMap == null) {
                throw new OperationException(43, "身份验证失败，请重新登录");
            }
            Long userId = Long.parseLong(stringObjectMap.get("id"));
            Log.info(getClass(), "操作的用户ID：{}", userId);
            ThreadLocalUtil.set(userId);

        } catch (Exception e) {
            return Result.error(43, "not login");
        }
        return joinPoint.proceed();
    }

    // 访问结束后执行
    @After("@annotation(com.content.interpretation.CheckLoginState)")
    public void afterRequest(JoinPoint joinPoint) {
        // 清理资源或做其他结束时的操作
        ThreadLocalUtil.remove();
        System.out.println("请求已处理完毕，清理资源或做其他操作");
    }

}
