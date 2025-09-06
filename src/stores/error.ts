// stores/error.ts
import { defineStore } from 'pinia'

interface ErrorState {
  message: string | null
}

export const useErrorStore = defineStore('error', {
  state: (): ErrorState => ({
    message: null
  }),
  actions: {
    setError(msg: string) {
      this.message = msg
    },
    clearError() {
      this.message = null
    }
  }
})
