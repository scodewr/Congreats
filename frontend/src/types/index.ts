export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
}

export interface ProfileProject {
  id?: string
  name: string
  description?: string
  status: 'ACTIVE' | 'PAST'
  startedAt?: string
  endedAt?: string
}

export interface ProfileTeam {
  id?: string
  name: string
  role?: string
}

export interface RecognizedSkill {
  skill: string
  count: number
}

export interface ProfileView {
  userId: string
  name: string
  email: string
  bio?: string
  jobTitle?: string
  company?: string
  photoUrl?: string
  projects: ProfileProject[]
  teams: ProfileTeam[]
  topSkills: RecognizedSkill[]
  totalRecognitions: number
}

export interface CategoryRef {
  id: string
  name: string
}

export interface PersonRef {
  userId: string
  name: string
  photoUrl?: string
}

export interface RecognitionView {
  id: string
  recognizer: PersonRef
  recognized: PersonRef
  category: CategoryRef
  skills: string[]
  testimonial: string
  createdAt: string
}

export interface PageResult<T> {
  content: T[]
  total: number
  page: number
  size: number
  hasNext: boolean
}

export interface Category {
  id: string
  name: string
  description?: string
  suggestedSkills: string[]
}

export interface WorkspaceView {
  id: string
  name: string
  description?: string
  ownerId: string
  ownerName: string
  memberCount: number
  archived: boolean
  createdAt: string
}

export interface UserAdminView {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  active: boolean
  createdAt: string
}

export interface CampaignView {
  id: string
  name: string
  description?: string
  categoryId: string
  categoryName: string
  startsAt: string
  endsAt: string
  active: boolean
  createdAt: string
}

export interface EventRankingEntry {
  userId: string
  name: string
  photoUrl?: string
  recognitionCount: number
}

export interface ValidatorAssignmentView {
  id: string
  validatorId: string
  validatorName: string
  assignedAt: string
}

export interface QuestionnaireView {
  id: string
  validatorId: string
  validatorName: string
  decision: 'APPROVED' | 'REJECTED'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  levelLabel: string
  reasoning: string
  submittedAt: string
}

export interface SkillValidationView {
  id: string
  userId: string
  userName: string
  skill: string
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'
  requestedAt: string
  resolvedAt?: string
  assignments: ValidatorAssignmentView[]
  questionnaires: QuestionnaireView[]
}

export interface MedalView {
  id: string
  milestone: string
  label: string
  awardedAt: string
  recent: boolean
}

export interface TrophyView {
  id: string
  skill: string
  level: 'BRONZE' | 'SILVER' | 'GOLD'
  levelLabel: string
  awardedAt: string
  recent: boolean
}

export interface AchievementsView {
  medals: MedalView[]
  trophies: TrophyView[]
}

export interface IntegrationView {
  id: string
  platform: 'GITHUB' | 'JIRA' | 'LINEAR'
  platformLabel: string
  name: string
  webhookSecret: string
  categoryId?: string
  categoryName?: string
  workspaceId?: string
  workspaceName?: string
  ownerId: string
  ownerName?: string
  active: boolean
  createdAt: string
}

export interface NotificationPreferencesView {
  userId: string
  emailEnabled: boolean
  whatsappNumber?: string
  whatsappEnabled: boolean
  smsNumber?: string
  smsEnabled: boolean
}

export interface EventView {
  id: string
  name: string
  description?: string
  categoryId: string
  categoryName: string
  startsAt: string
  endsAt: string
  active: boolean
  createdAt: string
  ranking: EventRankingEntry[]
}
