import type { UserInfo } from "@/types";

export const loginRequest = async (email: string, password: string): Promise<[UserInfo | null, number]> => {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 模拟登录逻辑
    if (email === "123@qq.com") {
        const userInfo: UserInfo = {
            username: "",
                email: "",
                avatarUrl: "",
                token: "",
                free: "请5秒后再次登陆"
        };
        return [userInfo, 3];
    }
    if (email === "user@example.com") {
        // Handle successful login
        if (password === "password") {
            const userInfo: UserInfo = {
                username: "JohnDoe",
                email: "user@example.com",
                avatarUrl: "http://example.com/avatar.jpg",
                token: "abc123",
                free: ""
            };
            return [userInfo, 0];
        } else {
            // Handle failed login
            return [null, 1];
        }
    } else {
        // Handle failed login
        return [null, 2];
    }
};