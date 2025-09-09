// stores/user.ts
import type { UserInfo } from '@/types'
import { defineStore } from 'pinia'
import { handleAutoLogin } from '@/service/LoginService'

interface UserState {
    username: string
    email: string
    avatarUrl: string
    token: string | null
    isLogin: boolean
    expireTime: Date
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        username: '',
        email: '',
        avatarUrl: '',
        token: null,
        isLogin: false,
        expireTime: new Date()
    }),
    actions: {
        setUser(userInfo: UserInfo) {
            this.username = userInfo.username
            this.email = userInfo.email
            this.avatarUrl = userInfo.avatarUrl
            this.isLogin = true
            // 持久化 token 到 localStorage
            localStorage.setItem('user', JSON.stringify({
                username: userInfo.username,
                isLogin: true,
                expireTime: new Date((new Date()).getTime() + 604800000)// 默认一周后过期
            }))
            localStorage.setItem('token', userInfo.token)
        },
        logout() {
            this.username = ''
            this.email = ''
            this.avatarUrl = ''
            this.token = null
            this.isLogin = false
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
                const { username, isLogin, expireTime } = JSON.parse(userData)
                this.username = username
                this.isLogin = isLogin
                this.expireTime = expireTime
                console.log("重新加载了用户信息");
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
                return true;
            }
            // 尝试自动登录
            const [result, message] = await handleAutoLogin(this.token);
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
})
