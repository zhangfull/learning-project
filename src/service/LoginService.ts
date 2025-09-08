import { autoLoginRequest, loginRequest } from "@/api/LoginApi";
import { useUserStore } from "@/stores/user";

export const handleLogin = async (email: string, password: string): Promise<[boolean, string]> => {
    const [userInfo, code] = await loginRequest(email, password);
    if (code === 0 && userInfo) {
        // 在这里可以处理 userInfo，存储到状态管理和本地存储
        const userStore = useUserStore();
        userStore.setUser(userInfo);
        return [true, "登录成功"];
    } else if (code === 1) {
        return [false, "密码错误"];
    } else if (code === 2) {
        return [false, "用户未找到"];
    } else if (code === 3) {
        return [false, userInfo?.free || "请稍后再试"];
    } else {
        return [false, "未知错误"];
    }
};

export const handleAutoLogin = async (token: string): Promise<[boolean, string]> => {
    const [userInfo, code] = await autoLoginRequest(token);
    if (code === 0 && userInfo) {
        // 在这里可以处理 userInfo，存储到状态管理和本地存储
        const userStore = useUserStore();
        userStore.setUser(userInfo);
        return [true, "自动登录成功"];
    }
    else if (code === 1) {
        return [false, "登陆失效，请重新登陆"];
    }
    else {
        return [false, "登录失败"];
    }
};
