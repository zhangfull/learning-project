// stores/user.ts
import type { UserInfo } from '@/types'
import { defineStore } from 'pinia'

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
            const user = localStorage.getItem('user')
            if (user) {
                const userInfo = JSON.parse(user)
                this.username = userInfo.username
                this.isLogin = userInfo.isLogin
                console.log("重新加载了用户信息");
            }   
        }
    }
})
