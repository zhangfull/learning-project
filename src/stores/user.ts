// stores/user.ts
import type { UserInfo } from '@/types'
import { defineStore } from 'pinia'

interface UserState {
    username: string
    email: string
    avatarUrl: string
    token: string | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        username: '',
        email: '',
        avatarUrl: '',
        token: null,
    }),
    actions: {
        setUser(userInfo: UserInfo) {
            this.username = userInfo.username
            this.email = userInfo.email
            this.avatarUrl = userInfo.avatarUrl
            // 持久化 token 到 localStorage
            localStorage.setItem('token', userInfo.token)
        },
        logout() {
            this.username = ''
            this.email = ''
            this.avatarUrl = ''
            this.token = null
            localStorage.removeItem('token')
        },
        loadTokenFromStorage() {
            const token = localStorage.getItem('token')
            if (token) {
                this.token = token
                console.log("重新加载了 token");
            }
        }
    }
})
