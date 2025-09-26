// stores/user.ts
import type { UserInfo } from '@/types'
import { defineStore } from 'pinia'
import { handleGetAvatarImg } from '@/service/ImgService'
import { openErrorNotice, openWarningNotice } from '@/utils/noticeUtils'
import { refreshTokenRequest } from '@/api/LoginApi'

interface UserState {
    userName: string
    email: string
    uid: string
    avatarUrl: string
    avatarBase64: string
    accessToken: string | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userName: '',
        email: '',
        uid: '',
        avatarUrl: '',
        avatarBase64: '',
        accessToken: null
    }),
    actions: {
        async setUser(userInfo: UserInfo) {
            localStorage.setItem('accessToken', userInfo.accessToken)
            this.userName = userInfo.userName
            this.email = userInfo.email
            this.uid = userInfo.uid
            this.avatarUrl = userInfo.avatarUrl
            this.avatarBase64 = await handleGetAvatarImg(this.avatarUrl)
        },
        logout() {
            this.userName = ''
            this.email = ''
            this.uid = ''
            this.avatarUrl = ''
            this.accessToken = null
            this.avatarBase64 = ''
            localStorage.removeItem('accessToken')
        },
        loadTokenFromStorage() {
            const token = localStorage.getItem('accessToken')
            if (token) {
                this.accessToken = token
                console.log("重新加载了 token");
            }
        },
        async refreshLogin() {
            try {
                // 检查token是否存在
                console.log("开始调用 refreshTokenRequest...");
                const [code, data] = await refreshTokenRequest();
                console.log("refreshTokenRequest 返回结果:", { code, data });
                
                if (code === 0) {
                    console.log("Token 刷新成功，设置用户信息");
                    await this.setUser(data!)
                    console.log("用户信息设置完成");
                } else {
                    console.log("Token 刷新失败，执行登出操作");
                    localStorage.removeItem('accessToken')
                    this.avatarBase64 = await handleGetAvatarImg(this.avatarUrl)
                    this.logout();
                    console.log("Token 已过期，用户已登出")
                    openErrorNotice("登陆已过期，请重新登录")
                }
                console.log("autoLogin 执行完成，返回 true");
                return true
            } catch (error) {
                console.error('autoLogin 方法执行出错:', error);
                console.error('错误详情:', error);
                return false;
            }

        }
    }
})
