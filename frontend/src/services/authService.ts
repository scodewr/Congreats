import api from './api'
import type { AuthTokens } from '../types'

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>('/auth/register', { name, email, password })
    return data
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>('/auth/login', { email, password })
    return data
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken })
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/password', { currentPassword, newPassword })
  },
}
