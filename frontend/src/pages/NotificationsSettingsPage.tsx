import { useEffect, useState } from 'react'
import { notificationService } from '../services/notificationService'

export default function NotificationsSettingsPage() {
  const [form, setForm] = useState({
    emailEnabled: true,
    whatsappNumber: '',
    whatsappEnabled: false,
    smsNumber: '',
    smsEnabled: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    notificationService.getPreferences()
      .then(p => {
        setForm({
          emailEnabled: p.emailEnabled,
          whatsappNumber: p.whatsappNumber ?? '',
          whatsappEnabled: p.whatsappEnabled,
          smsNumber: p.smsNumber ?? '',
          smsEnabled: p.smsEnabled,
        })
      })
      .catch(() => setError('Erro ao carregar preferências.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await notificationService.updatePreferences({
        ...form,
        whatsappNumber: form.whatsappNumber || undefined,
        smsNumber: form.smsNumber || undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Erro ao salvar preferências.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Carregando...</div>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Preferências de Notificação</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.emailEnabled}
              onChange={e => setForm(f => ({ ...f, emailEnabled: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-900">Notificações por e-mail</p>
              <p className="text-sm text-gray-500">Receba reconhecimentos e atualizações de validações no seu e-mail.</p>
            </div>
          </label>
        </div>

        {/* WhatsApp */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.whatsappEnabled}
              onChange={e => setForm(f => ({ ...f, whatsappEnabled: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-900">Notificações por WhatsApp</p>
              <p className="text-sm text-gray-500">Requer número de telefone com código do país (ex: +5511999999999).</p>
            </div>
          </label>
          {form.whatsappEnabled && (
            <input
              type="tel"
              placeholder="+5511999999999"
              value={form.whatsappNumber}
              onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>

        {/* SMS */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.smsEnabled}
              onChange={e => setForm(f => ({ ...f, smsEnabled: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-900">Notificações por SMS</p>
              <p className="text-sm text-gray-500">Requer número de telefone com código do país (ex: +5511999999999).</p>
            </div>
          </label>
          {form.smsEnabled && (
            <input
              type="tel"
              placeholder="+5511999999999"
              value={form.smsNumber}
              onChange={e => setForm(f => ({ ...f, smsNumber: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          {saved && <span className="text-green-600 text-sm">Preferências salvas!</span>}
        </div>
      </form>
    </div>
  )
}
