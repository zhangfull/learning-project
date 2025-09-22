// stores/user.ts
import type { UserInfo } from '@/types'
import { defineStore } from 'pinia'
import { handleGetAvatarImg } from '@/service/ImgService'
import { openErrorNotice } from '@/utils/noticeUtils'
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
        async autoLogin() {
            console.log("ssssssssssssssssssssssssss");
            try {
                // 检查token是否存在
                const [code, data] = await refreshTokenRequest();
                if (code === 0) {
                    this.setUser(data!)
                } else {
                    localStorage.removeItem('accessToken')
                    useUserStore().logout();
                    console.log("Token 已过期，用户已登出")
                    openErrorNotice("登陆已过期，请重新登录")
                }
                // 检查
                if (this.avatarBase64 && this.avatarBase64 !== '') {
                    return true;
                } else {
                    // 尝试自动登录
                    this.avatarBase64 = await handleGetAvatarImg(this.avatarUrl)
                    console.log('尝试自动登录touxiang');
                    return true;
                }
            } catch (error) {
                console.error('autoLogin 方法执行出错:', error);
                return false;
            }

        }
    }
})
