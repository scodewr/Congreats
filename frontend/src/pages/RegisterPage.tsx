import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-purple-500 font-bold text-3xl">◆</span>
          <h1 className="brand-gradient font-bold text-2xl tracking-tight">Congreats</h1>
          <p className="text-text-secondary text-sm mt-1">Crie sua conta</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border-subtle rounded-2xl p-8">
          {/* Error */}
          {error && (
            <div
              className="mb-4 text-sm rounded-xl px-4 py-3"
              style={{
                color: '#E83050',
                backgroundColor: 'rgba(232, 48, 80, 0.10)',
                border: '1px solid rgba(232, 48, 80, 0.20)',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Criar conta
            </Button>
          </form>

          {/* Link */}
          <p className="mt-6 text-sm text-center text-text-secondary">
            Já tem conta?{' '}
            <Link to="/login" className="text-purple-300 hover:text-purple-400">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
