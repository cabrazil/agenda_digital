'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateContent } from '@/hooks/useContents'
import {
  CHANNEL_LABELS,
  STATUS_LABELS,
  STATUS_ORDER,
  type Channel,
  type ContentStatus,
} from '@/types'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'

const CHANNELS: Channel[] = [
  'INSTAGRAM',
  'TIKTOK',
  'YOUTUBE_SHORTS',
  'YOUTUBE_LONGO',
  'BLOG',
]

export default function NewContentPage() {
  const router = useRouter()
  const createContent = useCreateContent()
  const [showPresets, setShowPresets] = useState(false)

  const [form, setForm] = useState({
    title: '',
    channel: 'BLOG' as Channel,
    status: 'IDEIA' as ContentStatus,
    briefing: '',
    scheduledAt: '',
    tags: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  function validate() {
    const e: typeof errors = {}
    if (!form.title.trim()) e.title = 'Título é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof form]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function applyPreset(hoursOffset: number, setHours?: number, setMinutes?: number, daysOffset: number = 0, nextDayOfWeek?: number) {
    const target = new Date()
    
    if (nextDayOfWeek !== undefined) {
      const diff = (nextDayOfWeek - target.getDay() + 7) % 7
      target.setDate(target.getDate() + (diff === 0 ? 7 : diff))
    } else if (daysOffset > 0) {
      target.setDate(target.getDate() + daysOffset)
    }

    if (hoursOffset > 0) {
      target.setHours(target.getHours() + hoursOffset)
    }

    if (setHours !== undefined) {
      target.setHours(setHours, setMinutes ?? 0, 0, 0)
    }

    const year = target.getFullYear()
    const month = String(target.getMonth() + 1).padStart(2, '0')
    const day = String(target.getDate()).padStart(2, '0')
    const hours = String(target.getHours()).padStart(2, '0')
    const minutes = String(target.getMinutes()).padStart(2, '0')
    
    setForm(prev => ({ ...prev, scheduledAt: `${year}-${month}-${day}T${hours}:${minutes}` }))
    setShowPresets(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const tagsArray = form.tags
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    createContent.mutate(
      {
        title: form.title.trim(),
        channel: form.channel,
        status: form.status,
        briefing: form.briefing || undefined,
        scheduledAt: form.scheduledAt
          ? new Date(form.scheduledAt).toISOString()
          : undefined,
        tags: tagsArray,
        notes: form.notes || undefined,
      },
      {
        onSuccess: (data) => {
          toast.success('Conteúdo criado com sucesso!')
          router.push(`/content/${data.id}`)
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Erro ao criar conteúdo')
        },
      },
    )
  }

  return (
    <div className="max-w-2xl animate-fadeIn">
      {/* Topo */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="btn-ghost gap-2 text-sm" type="button">
          <ArrowLeft size={15} />
          Voltar
        </button>
        <div
          className="h-4 w-px"
          style={{ background: 'var(--border)' }}
        />
        <h1 className="page-title">Novo Conteúdo</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div className="card p-5">
          <label htmlFor="title" className="label">
            Título <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex: Top 10 filmes de terror de 2025"
            className="input"
            autoFocus
          />
          {errors.title && (
            <p className="mt-1.5 text-xs" style={{ color: '#f87171' }}>
              {errors.title}
            </p>
          )}
        </div>

        {/* Canal + Status */}
        <div className="card p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="channel" className="label">
                Canal
              </label>
              <select
                id="channel"
                name="channel"
                value={form.channel}
                onChange={handleChange}
                className="input"
              >
                {CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>
                    {CHANNEL_LABELS[ch]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="label">
                Status inicial
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pauta + Data + Tags */}
        <div className="card p-5 space-y-5">
          <div>
            <label htmlFor="briefing" className="label">
              Pauta / Briefing
            </label>
            <textarea
              id="briefing"
              name="briefing"
              value={form.briefing}
              onChange={handleChange}
              rows={3}
              placeholder="Descreva o tema, ângulo ou ideia principal..."
              className="input resize-none"
            />
          </div>

          {/* Agendar para com Dropdown */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="scheduledAt" className="label mb-0">
                Agendar para (opcional)
              </label>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-xxs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 p-1 px-2 rounded-lg"
                  style={{ background: 'rgba(124, 106, 247, 0.08)', fontSize: '10px' }}
                >
                  🕒 Sugestões de Data ▾
                </button>
                
                {showPresets && (
                  <div 
                    className="absolute right-0 mt-2.5 w-48 rounded-xl border z-20 shadow-2xl p-1.5 flex flex-col gap-0.5 animate-fadeIn"
                    style={{ 
                      background: 'rgba(15, 15, 25, 0.95)', 
                      backdropFilter: 'blur(16px)',
                      borderColor: 'var(--border)' 
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => applyPreset(3)}
                      className="w-full text-left text-xs p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white font-medium"
                    >
                      Mais tarde (+3h)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(0, 10, 0, 1)}
                      className="w-full text-left text-xs p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white font-medium"
                    >
                      Amanhã às 10h
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(0, 18, 0, 1)}
                      className="w-full text-left text-xs p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white font-medium"
                    >
                      Amanhã às 18h
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(0, 10, 0, 0, 6)}
                      className="w-full text-left text-xs p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white font-medium"
                    >
                      Sábado às 10h
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(0, 9, 0, 0, 1)}
                      className="w-full text-left text-xs p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white font-medium"
                    >
                      Segunda às 9h
                    </button>
                    {form.scheduledAt && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm(prev => ({ ...prev, scheduledAt: '' }))
                          setShowPresets(false)
                        }}
                        className="w-full text-left text-xs p-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 font-bold border-t border-white/5 mt-1"
                      >
                        Limpar Data
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="tags" className="label">
              Tags{' '}
              <span className="font-normal" style={{ color: 'var(--text-muted)' }}>
                (separadas por vírgula)
              </span>
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={form.tags}
              onChange={handleChange}
              placeholder="Ex: review, terror, 2025"
              className="input"
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 py-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createContent.isPending}
            className="btn-primary gap-2"
            style={{
              opacity: createContent.isPending ? 0.7 : 1,
              cursor: createContent.isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {createContent.isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Criando…
              </>
            ) : (
              <>
                <Plus size={15} />
                Criar Conteúdo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
