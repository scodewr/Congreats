import api from './api'
import type { AchievementsView, ProfileView } from '../types'

export const profileService = {
  async getMe(): Promise<ProfileView> {
    const { data } = await api.get<ProfileView>('/profiles/me')
    return data
  },

  async getById(userId: string): Promise<ProfileView> {
    const { data } = await api.get<ProfileView>(`/profiles/${userId}`)
    return data
  },

  async search(page = 0, size = 20): Promise<ProfileView[]> {
    const { data } = await api.get<ProfileView[]>('/profiles', { params: { page, size } })
    return data
  },

  async update(userId: string, body: Partial<ProfileView>): Promise<ProfileView> {
    const { data } = await api.put<ProfileView>(`/profiles/${userId}`, body)
    return data
  },

  async uploadPhoto(userId: string, file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post<{ photoUrl: string }>(`/profiles/${userId}/photo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.photoUrl
  },

  async getAchievements(userId: string): Promise<AchievementsView> {
    const { data } = await api.get<AchievementsView>(`/profiles/${userId}/achievements`)
    return data
  },
}
