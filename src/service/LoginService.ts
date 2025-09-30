import { loginRequest, registerRequest } from "@/api/LoginApi";
import { useUserStore } from "@/stores/user";
import type { RegisterInfo } from "@/types";
import { openErrorNotice, openSuccessNotice, openWarningNotice } from "@/utils/noticeUtils";

export const handleLogin = async (emailOrUid: string, password: string): Promise<[boolean, string]> => {
    console.log("进入 handleLogin");
    const [userInfo, code] = await loginRequest(emailOrUid, password);
    console.log("loginRequest 返回：", userInfo, code);

    if (code === 0 && userInfo) {
        const userStore = useUserStore();
        await userStore.setUser(userInfo);
        console.log("登录成功分支");
        return [true, "登录成功"];
    } else if (code === 2) {
        console.log("密码错误分支");
        return [false, "密码错误"];
    } else if (code === 1) {
        console.log("用户不存在分支");
        return [false, "用户不存在"];
    } else {
        console.log("未知错误分支");
        return [false, "未知错误"];
    }
};


export const handleRegister = async (userInfo: RegisterInfo): Promise<[boolean, string]> => {
    const code = await registerRequest(userInfo);
    console.log("注册结果：", code);
    if (code === 0) {
        console.log("注册成功");
        return [true, "注册成功"];
    } else if (code === 1) {
        console.log("用户已存在");
        return [false, "用户已存在"];
    } else if (code === -2) {
        console.log("注册失败");
        return [false, "注册失败"];
    } else {
        console.log("未知错误");
        return [false, "未知错误"];
    }
};
