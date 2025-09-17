import { getPersonalInfoRequest } from "@/api/UserApi";
import type { PersonalInfo } from "@/types";
import { useUserStore } from "@/stores/user";

export const handleGetUserInfo = async (): Promise<PersonalInfo | null> => {
    const userStore = useUserStore();
    const [data, code] = await getPersonalInfoRequest()
    if (code === 0) {
        return data
    } else {
        console.error("获取用户信息失败，错误码：", code)
        userStore.logout();
        return null
    }
};