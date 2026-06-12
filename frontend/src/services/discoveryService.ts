import api from './api'
import type { PageResult, ProfileView, RecognitionView } from '../types'

export const discoveryService = {
  async getFeed(page = 0, size = 20): Promise<PageResult<RecognitionView>> {
    const { data } = await api.get<PageResult<RecognitionView>>('/discovery/feed', { params: { page, size } })
    return data
  },

  async getRanking(page = 0, size = 20): Promise<PageResult<ProfileView>> {
    const { data } = await api.get<PageResult<ProfileView>>('/discovery/ranking', { params: { page, size } })
    return data
  },
}
