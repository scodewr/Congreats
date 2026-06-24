import api from './api'
import type { PageResult, RecognitionView, WorkspaceView } from '../types'

export const workspaceService = {
  async create(body: { name: string; description?: string }): Promise<WorkspaceView> {
    const { data } = await api.post<WorkspaceView>('/workspaces', body)
    return data
  },

  async listMine(): Promise<WorkspaceView[]> {
    const { data } = await api.get<WorkspaceView[]>('/workspaces')
    return data
  },

  async addMember(workspaceId: string, userId: string): Promise<void> {
    await api.post(`/workspaces/${workspaceId}/members`, { userId })
  },

  async getFeed(workspaceId: string, page = 0, size = 20): Promise<PageResult<RecognitionView>> {
    const { data } = await api.get<PageResult<RecognitionView>>(
      `/workspaces/${workspaceId}/feed`, { params: { page, size } })
    return data
  },
}
