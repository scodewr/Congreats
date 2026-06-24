import api from './api'
import type { CampaignView, EventView, PageResult, UserAdminView, WorkspaceView } from '../types'

export const adminService = {
  // Users
  async listUsers(page = 0, size = 20): Promise<PageResult<UserAdminView>> {
    const { data } = await api.get<PageResult<UserAdminView>>('/admin/users', { params: { page, size } })
    return data
  },

  async createUser(body: { name: string; email: string; role: 'ADMIN' | 'USER' }): Promise<{ user: UserAdminView; temporaryPassword: string }> {
    const { data } = await api.post('/admin/users', body)
    return data
  },

  async updateUser(id: string, body: { name?: string; email?: string; role?: 'ADMIN' | 'USER' }): Promise<UserAdminView> {
    const { data } = await api.put<UserAdminView>(`/admin/users/${id}`, body)
    return data
  },

  async deactivateUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`)
  },

  // Workspaces
  async listWorkspaces(page = 0, size = 20): Promise<PageResult<WorkspaceView>> {
    const { data } = await api.get<PageResult<WorkspaceView>>('/admin/workspaces', { params: { page, size } })
    return data
  },

  async archiveWorkspace(id: string): Promise<void> {
    await api.delete(`/admin/workspaces/${id}`)
  },

  async addWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
    await api.post(`/admin/workspaces/${workspaceId}/members`, { userId })
  },

  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
    await api.delete(`/admin/workspaces/${workspaceId}/members/${userId}`)
  },

  // Campaigns
  async createCampaign(body: {
    name: string; description?: string; categoryId: string; startsAt: string; endsAt: string
  }): Promise<CampaignView> {
    const { data } = await api.post<CampaignView>('/campaigns', body)
    return data
  },

  async getActiveCampaigns(): Promise<CampaignView[]> {
    const { data } = await api.get<CampaignView[]>('/campaigns/active')
    return data
  },

  // Events
  async createEvent(body: {
    name: string; description?: string; categoryId: string; startsAt: string; endsAt: string
  }): Promise<EventView> {
    const { data } = await api.post<EventView>('/events', body)
    return data
  },

  async getEventRanking(eventId: string): Promise<EventView> {
    const { data } = await api.get<EventView>(`/events/${eventId}/ranking`)
    return data
  },
}
