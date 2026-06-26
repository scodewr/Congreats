import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Compass,
  Star,
  Layers,
  CheckCircle,
  Shield,
  Users,
  FolderKanban,
  Megaphone,
  CalendarDays,
  ClipboardList,
  Plug,
  ChevronDown,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Avatar from './ui/Avatar'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Início',      to: '/dashboard',        icon: <LayoutDashboard size={16} /> },
  { label: 'Descobrir',   to: '/discovery',         icon: <Compass size={16} /> },
  { label: 'Reconhecer',  to: '/recognitions/new',  icon: <Star size={16} /> },
  { label: 'Workspaces',  to: '/workspaces',        icon: <Layers size={16} /> },
  { label: 'Validações',  to: '/validations/mine',  icon: <CheckCircle size={16} /> },
]

const adminItems = [
  { label: 'Usuários',    to: '/admin/users',        icon: <Users size={14} /> },
  { label: 'Workspaces',  to: '/admin/workspaces',   icon: <FolderKanban size={14} /> },
  { label: 'Campanhas',   to: '/admin/campaigns',    icon: <Megaphone size={14} /> },
  { label: 'Eventos',     to: '/admin/events',       icon: <CalendarDays size={14} /> },
  { label: 'Validações',  to: '/admin/validations',  icon: <ClipboardList size={14} /> },
  { label: 'Integrações', to: '/admin/integrations', icon: <Plug size={14} /> },
]

function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return { open, setOpen, ref }
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const adminDropdown = useDropdown()
  const userDropdown = useDropdown()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (to: string) => {
    if (to === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(to)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border-subtle backdrop-blur-sm h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <span className="text-purple-500 font-bold text-xl leading-none">◆</span>
            <div className="flex flex-col leading-none gap-0.5">
              <span className="brand-gradient font-bold text-xl tracking-tight leading-none">Congreats</span>
              <span className="text-text-tertiary text-[10px] italic tracking-wide leading-none">Drived by Orbix</span>
            </div>
          </Link>

          {/* Nav items — md+ only */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                className={[
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150',
                  isActive(item.to)
                    ? 'bg-purple-900 text-purple-300 border border-purple-700'
                    : 'text-text-secondary hover:text-text-primary hover:bg-overlay',
                ].join(' ')}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side — md+ only */}
          <div className="hidden md:flex items-center gap-2 shrink-0">

            {/* Admin dropdown */}
            {user?.role === 'ADMIN' && (
              <div className="relative" ref={adminDropdown.ref}>
                <button
                  onClick={() => adminDropdown.setOpen(o => !o)}
                  title="Admin"
                  className={[
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150',
                    location.pathname.startsWith('/admin')
                      ? 'bg-wine-900 text-wine-300 border border-wine-700'
                      : 'text-text-secondary hover:text-text-primary hover:bg-overlay',
                  ].join(' ')}
                >
                  <Shield size={16} />
                  <span className="hidden lg:inline">Admin</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${adminDropdown.open ? 'rotate-180' : ''}`}
                  />
                </button>

                {adminDropdown.open && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-elevated border border-border-subtle rounded-xl shadow-lg overflow-hidden z-50">
                    {adminItems.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => adminDropdown.setOpen(false)}
                        className={[
                          'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150',
                          location.pathname === item.to
                            ? 'bg-wine-900 text-wine-300'
                            : 'text-text-secondary hover:text-text-primary hover:bg-overlay',
                        ].join(' ')}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* User avatar dropdown */}
            {user && (
              <div className="relative" ref={userDropdown.ref}>
                <button
                  onClick={() => userDropdown.setOpen(o => !o)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-full"
                >
                  <Avatar src={undefined} name={user.name} size="md" border="default" />
                  <ChevronDown
                    size={14}
                    className={`text-text-secondary transition-transform duration-200 ${userDropdown.open ? 'rotate-180' : ''}`}
                  />
                </button>

                {userDropdown.open && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-elevated border border-border-subtle rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border-subtle">
                      <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                      <p className="text-xs text-text-secondary truncate">{user.email}</p>
                    </div>
                    <Link
                      to={`/profile/${user.id}`}
                      onClick={() => userDropdown.setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-overlay transition-colors duration-150"
                    >
                      <User size={14} />
                      Ver Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-error hover:bg-overlay transition-colors duration-150"
                    >
                      <LogOut size={14} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-text-secondary hover:text-text-primary hover:bg-overlay transition-colors duration-150"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed top-16 left-0 right-0 z-40 bg-surface border-b border-border-subtle shadow-xl md:hidden overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <div className="px-4 py-3">

              {/* Nav items */}
              <nav className="space-y-1">
                {navItems.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={[
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150',
                      isActive(item.to)
                        ? 'bg-purple-900 text-purple-300 border border-purple-700'
                        : 'text-text-secondary hover:text-text-primary hover:bg-overlay',
                    ].join(' ')}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Admin section */}
              {user?.role === 'ADMIN' && (
                <>
                  <div className="border-t border-border-subtle my-3" />
                  <p className="text-xs text-text-tertiary px-4 mb-1 uppercase tracking-wider">Admin</p>
                  <nav className="space-y-1">
                    {adminItems.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={[
                          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors duration-150',
                          location.pathname === item.to
                            ? 'bg-wine-900 text-wine-300 border border-wine-700'
                            : 'text-text-secondary hover:text-text-primary hover:bg-overlay',
                        ].join(' ')}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </>
              )}

              {/* User section */}
              {user && (
                <>
                  <div className="border-t border-border-subtle my-3" />
                  <div className="flex items-center gap-3 px-4 py-2 mb-1">
                    <Avatar src={undefined} name={user.name} size="sm" border="default" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                      <p className="text-xs text-text-tertiary truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${user.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-overlay transition-colors duration-150"
                  >
                    <User size={15} />
                    Ver Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-error hover:bg-overlay transition-colors duration-150"
                  >
                    <LogOut size={15} />
                    Sair
                  </button>
                </>
              )}

              <div className="h-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
