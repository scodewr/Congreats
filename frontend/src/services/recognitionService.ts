import api from './api'
import type { Category, PageResult, RecognitionView } from '../types'

export const recognitionService = {
  async create(body: {
    recognizedId: string
    categoryName: string
    skills: string[]
    testimonial: string
    projectId?: string
    teamId?: string
    workspaceId?: string
  }): Promise<RecognitionView> {
    const { data } = await api.post<RecognitionView>('/recognitions', body)
    return data
  },

  async listByProfessional(professionalId: string, page = 0, size = 10): Promise<PageResult<RecognitionView>> {
    const { data } = await api.get<PageResult<RecognitionView>>('/recognitions', {
      params: { professionalId, page, size },
    })
    return data
  },

  async listCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories')
    return data
  },

  async searchCategories(q: string, limit = 10): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories', { params: { q, limit } })
    return data
  },
}
