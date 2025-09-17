import { autoLoginRequest, loginRequest, registerRequest } from "@/api/LoginApi";
import { useUserStore } from "@/stores/user";
import type { RegisterInfo } from "@/types";

export const handleLogin = async (emailOrUid: string, password: string): Promise<[boolean, string]> => {
    const [userInfo, code] = await loginRequest(emailOrUid, password);
    if (code === 0 && userInfo) {
        // 在这里可以处理 userInfo，存储到状态管理和本地存储
        const userStore = useUserStore();
        await userStore.setUser(userInfo);
        return [true, "登录成功"];
    } else if (code === 1) {
        return [false, "密码错误"];
    } else if (code === 2) {
        return [false, "用户不存在"];
    } else if (code === 3) {
        return [false, userInfo?.free || "请稍后再试"];
    } else {
        return [false, "未知错误"];
    }
};

export const handleAutoLogin = async (): Promise<[boolean, string]> => {
    const userStore = useUserStore();
    const [userInfo, code] = await autoLoginRequest();
    if (code === 0 && userInfo) {
        // 在这里可以处理 userInfo，存储到状态管理和本地存储
        await userStore.setUser(userInfo);
        return [true, "自动登录成功"];
    } else if (code === 1) {
        userStore.logout();
        return [false, "登录失效，请重新登录"];
    } else {
        userStore.logout();
        return [false, "登录失败"];
    }
};

export const handleRegister = async (userInfo: RegisterInfo): Promise<number> => {
    const code = await registerRequest(userInfo);
    if (code === 0) {
        return 0;
    } else if (code === 1) {
        return 1;
    } else {
        return 2;
    }
};
