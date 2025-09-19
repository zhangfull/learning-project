// stores/user.ts
import type { UserInfo } from '@/types'
import { defineStore } from 'pinia'
import { handleAutoLogin } from '@/service/LoginService'
import { handleGetImg } from '@/service/ImgService'

interface UserState {
    userName: string
    email: string
    uid: string
    avatarUrl: string
    avatarBase64: string
    token: string | null
    isLogin: boolean
    expireTime: Date
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userName: '',
        email: '',
        uid: '',
        avatarUrl: '',
        avatarBase64: '',
        token: null,
        isLogin: false,
        expireTime: new Date()
    }),
    actions: {
        async setUser(userInfo: UserInfo) {
            this.userName = userInfo.userName
            this.email = userInfo.email
            this.uid = userInfo.uid
            this.avatarUrl = userInfo.avatarUrl
            this.avatarBase64 = await handleGetImg(this.avatarUrl)  
            this.isLogin = true
            // 持久化 token 到 localStorage
            localStorage.setItem('user', JSON.stringify({
                userName: userInfo.userName,
                avatarUrl: userInfo.avatarUrl,
                isLogin: true,
                expireTime: new Date((new Date()).getTime() + 604800000)// 默认一周后过期
            }))
            localStorage.setItem('token', userInfo.token)
        },
        logout() {
            this.userName = ''
            this.email = ''
            this.uid = ''
            this.avatarUrl = ''
            this.token = null
            this.isLogin = false
            this.avatarBase64 = ''
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        loadTokenFromStorage() {
            const token = localStorage.getItem('token')
            if (token) {
                this.token = token
                console.log("重新加载了 token");
            }
        },
        loadUserFromStorage() {
            const userData = localStorage.getItem('user')
            if (userData) {
                const { userName, avatarUrl, isLogin, expireTime } = JSON.parse(userData)
                this.userName = userName
                this.isLogin = isLogin
                this.avatarUrl = avatarUrl
                this.expireTime = expireTime
                console.log("重新加载了用户信息");
            }
        },
        updateUserName(newName: string) {
            this.userName = newName
            const userData = localStorage.getItem('user')
            if (userData) {
                const parsedData = JSON.parse(userData)
                parsedData.userName = newName
                localStorage.setItem('user', JSON.stringify(parsedData))
            }
        },
        async autoLogin() {
            // 检查token是否存在
            this.loadTokenFromStorage();
            if (!this.token) {
                this.logout();
                return false;
            }
            // 检查本地存储的登录信息和过期时间
            this.loadUserFromStorage();
            if (new Date() < new Date(this.expireTime) && this.isLogin) {
                console.log("本地登录有效");
                this.avatarBase64 = await handleGetImg(this.avatarUrl)
                return true;
            } else {
                // 尝试自动登录
                const [result, message] = await handleAutoLogin();
                if (result) {
                    this.isLogin = true;
                    console.log("自动登录成功");
                    return true;
                } else {
                    this.logout();
                    throw new Error(message);
                }
            }

        }
    }
})
