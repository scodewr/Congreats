import api from './api'
import type { SkillValidationView } from '../types'

export const validationService = {
  async requestValidation(skill: string): Promise<void> {
    await api.post('/validations', { skill })
  },

  async getMine(): Promise<SkillValidationView[]> {
    const { data } = await api.get<SkillValidationView[]>('/validations/mine')
    return data
  },

  async getAssignments(): Promise<SkillValidationView[]> {
    const { data } = await api.get<SkillValidationView[]>('/validations/assignments')
    return data
  },

  async submitQuestionnaire(
    validationId: string,
    body: { decision: 'APPROVED' | 'REJECTED'; level: string; reasoning: string }
  ): Promise<void> {
    await api.post(`/validations/${validationId}/questionnaire`, body)
  },

  async adminList(status = 'PENDING', page = 0, size = 20): Promise<{ items: SkillValidationView[]; total: number }> {
    const { data } = await api.get<{ items: SkillValidationView[]; total: number }>('/validations', {
      params: { status, page, size },
    })
    return data
  },

  async adminAssign(validationId: string, validatorId: string): Promise<void> {
    await api.post(`/validations/${validationId}/assign`, { validatorId })
  },

  async adminResolve(validationId: string, decision: 'APPROVED' | 'REJECTED'): Promise<void> {
    await api.post(`/validations/${validationId}/resolve`, { decision })
  },
}
