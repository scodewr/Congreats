import api from './api'
import type { IntegrationView } from '../types'

export const integrationService = {
  async list(): Promise<IntegrationView[]> {
    const { data } = await api.get<IntegrationView[]>('/admin/integrations')
    return data
  },

  async create(body: {
    platform: 'GITHUB' | 'JIRA' | 'LINEAR'
    name: string
    categoryId?: string
    workspaceId?: string
  }): Promise<IntegrationView> {
    const { data } = await api.post<IntegrationView>('/admin/integrations', body)
    return data
  },

  async deactivate(id: string): Promise<void> {
    await api.delete(`/admin/integrations/${id}`)
  },

  webhookUrl(platform: string, secret: string): string {
    return `${window.location.origin}/api/webhooks/${platform.toLowerCase()}/${secret}`
  },
}
