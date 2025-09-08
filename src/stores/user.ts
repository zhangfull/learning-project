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
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        username: '',
        email: '',
        avatarUrl: '',
        token: null,
        isLogin: false
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
                isLogin: true
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
                const { username, isLogin } = JSON.parse(userData)
                this.username = username
                this.isLogin = isLogin
                console.log("重新加载了用户信息");
            }
        },
        async autoLogin() {
            this.loadTokenFromStorage();
            if (!this.token) return false;
            
            this.loadUserFromStorage();
            if (this.isLogin) return true;
            
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
