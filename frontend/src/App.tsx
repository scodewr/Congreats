import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import CreateRecognitionPage from './pages/CreateRecognitionPage'
import DiscoveryPage from './pages/DiscoveryPage'
import WorkspacesPage from './pages/WorkspacesPage'
import WorkspacePage from './pages/WorkspacePage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminWorkspacesPage from './pages/admin/AdminWorkspacesPage'
import AdminCampaignsPage from './pages/admin/AdminCampaignsPage'
import AdminEventsPage from './pages/admin/AdminEventsPage'
import AdminValidationsPage from './pages/admin/AdminValidationsPage'
import MyValidationsPage from './pages/MyValidationsPage'
import ValidatorAssignmentsPage from './pages/ValidatorAssignmentsPage'
import NotificationsSettingsPage from './pages/NotificationsSettingsPage'
import Layout from './components/Layout'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="flex items-center justify-center h-screen">Carregando...</div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/discovery" element={<DiscoveryPage />} />
            <Route path="/workspaces" element={<WorkspacesPage />} />
            <Route path="/workspaces/:id" element={<WorkspacePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/recognitions/new" element={<CreateRecognitionPage />} />
            <Route path="/validations/mine" element={<MyValidationsPage />} />
            <Route path="/validations/assignments" element={<ValidatorAssignmentsPage />} />
            <Route path="/settings/notifications" element={<NotificationsSettingsPage />} />
            <Route path="/admin/users" element={<RequireAdmin><AdminUsersPage /></RequireAdmin>} />
            <Route path="/admin/workspaces" element={<RequireAdmin><AdminWorkspacesPage /></RequireAdmin>} />
            <Route path="/admin/campaigns" element={<RequireAdmin><AdminCampaignsPage /></RequireAdmin>} />
            <Route path="/admin/events" element={<RequireAdmin><AdminEventsPage /></RequireAdmin>} />
            <Route path="/admin/validations" element={<RequireAdmin><AdminValidationsPage /></RequireAdmin>} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
