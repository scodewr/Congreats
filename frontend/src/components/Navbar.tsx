import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-primary-600">
          Congreats
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/discovery" className="text-sm text-gray-600 hover:text-primary-600">
            Descobrir
          </Link>
          <Link to="/workspaces" className="text-sm text-gray-600 hover:text-primary-600">
            Workspaces
          </Link>
          <Link to="/recognitions/new" className="text-sm text-gray-600 hover:text-primary-600">
            Reconhecer
          </Link>
          {user && (
            <Link to={`/profile/${user.id}`} className="text-sm text-gray-600 hover:text-primary-600">
              {user.name}
            </Link>
          )}
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500">
            Sair
          </button>
        </nav>
      </div>
    </header>
  )
}
