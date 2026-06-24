import api from './api'
import type { NotificationPreferencesView } from '../types'

export const notificationService = {
  async getPreferences(): Promise<NotificationPreferencesView> {
    const { data } = await api.get<NotificationPreferencesView>('/notifications/preferences')
    return data
  },

  async updatePreferences(body: {
    emailEnabled: boolean
    whatsappNumber?: string
    whatsappEnabled: boolean
    smsNumber?: string
    smsEnabled: boolean
  }): Promise<NotificationPreferencesView> {
    const { data } = await api.put<NotificationPreferencesView>('/notifications/preferences', body)
    return data
  },
}
