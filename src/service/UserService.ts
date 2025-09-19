import { getPersonalInfoRequest, updateUserInfoRequest, updateUserPasswordRequest } from "@/api/UserApi";
import type { PersonalInfo } from "@/types";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
export const handleGetUserInfo = async (): Promise<PersonalInfo | null> => {
    const [data, code] = await getPersonalInfoRequest()
    if (code === 0) {
        return data
    } else {
        console.error("获取用户信息失败，错误码：", code)
        return null
    }
};

export const handleUpdateUserInfo = async (info: PersonalInfo): Promise<number> => {
    console.log('更改：', info.name, info.briefIntroduction)
    if (!info.name || info.name.trim() === '' || info.name.includes(" ")) {
        return 1
    }
    const result = await updateUserInfoRequest(info)
    if (result === 0) {
        userStore.updateUserName(info.name)
        console.log("更新用户信息成功")
    }
    return result
};

export const handleUpdateUserPassword = async (oldPassword: string, newPassword: string): Promise<number> => {
    if (!oldPassword || oldPassword.trim() === '' || oldPassword.includes(" ")) {
        return 1
    }
    return await updateUserPasswordRequest(oldPassword, newPassword)
};