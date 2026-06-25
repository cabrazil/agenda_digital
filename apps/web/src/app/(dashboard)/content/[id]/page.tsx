'use client'

import { useParams, useRouter } from 'next/navigation'
import { useContent, useUpdateContent, useDeleteContent } from '@/hooks/useContents'
import { useTasks, useCreateTask, useToggleTask, useDeleteTask } from '@/hooks/useTasks'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  ArrowLeft, Trash2, CheckCircle2, Circle, Plus, ExternalLink, Loader2
} from 'lucide-react'
import { CHANNEL_LABELS, STATUS_LABELS, STATUS_COLORS, STATUS_ORDER, CHANNEL_COLORS, type ContentStatus } from '@/types'
import { formatDateTime } from '@/lib/utils'
import debounce from 'lodash.debounce'

function useDebounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(fn, ms), [])
}

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()

  const { data: content, isLoading } = useContent(id)
  const { data: tasks = [] }         = useTasks(id)
  const updateContent = useUpdateContent(id)
  const deleteContent = useDeleteContent()
  const createTask    = useCreateTask()
  const toggleTask    = useToggleTask(id)
  const deleteTask    = useDeleteTask(id)

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [scriptValue, setScriptValue]  = useState<string | null>(null)

  // Auto-save do roteiro (debounce 1.5s)
  const saveScript = useDebounce((value: string) => {
    updateContent.mutate({ script: value }, {
      onSuccess: () => toast.success('Roteiro salvo automaticamente', { duration: 1500 }),
      onError: () => toast.error('Erro ao salvar roteiro'),
    })
  }, 1500)

  function handleScriptChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setScriptValue(e.target.value)
    saveScript(e.target.value)
  }

  function handleStatusChange(status: ContentStatus) {
    updateContent.mutate({ status }, {
      onSuccess: () => toast.success(`Status alterado para: ${STATUS_LABELS[status]}`),
    })
  }

  async function handleAddTask() {
    if (!newTaskTitle.trim()) return
    createTask.mutate({ title: newTaskTitle.trim(), contentId: id })
    setNewTaskTitle('')
  }

  async function handleDelete() {
    if (!confirm('Deseja realmente deletar este conteúdo?')) return
    deleteContent.mutate(id, {
      onSuccess: () => { 
        toast.success('Conteúdo removido com sucesso')
        router.push('/kanban') 
      },
      onError: () => toast.error('Erro ao deletar conteúdo'),
    })
  }

  if (isLoading) return (
    <div className="max-w-3xl space-y-5">
      <div className="skeleton h-12 w-32" />
      <div className="skeleton h-48 rounded-2xl w-full" />
      <div className="skeleton h-24 rounded-2xl w-full" />
      <div className="skeleton h-96 rounded-2xl w-full" />
    </div>
  )
  
  if (!content) return (
    <div className="p-8 text-center">
      <p style={{ color: 'var(--text-muted)' }}>Conteúdo não encontrado.</p>
    </div>
  )

  const currentScript  = scriptValue ?? content.script ?? ''
  const wordCount      = currentScript.trim() ? currentScript.trim().split(/\s+/).length : 0
  const charCount      = currentScript.length
  const completedTasks = tasks.filter(t => t.completed).length

  return (
    <div className="max-w-3xl space-y-6 animate-fadeIn pb-12">
      {/* Topo com Ações */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="btn-ghost gap-2 text-sm">
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="flex items-center gap-2.5">
          {content.publishUrl && (
            <a
              href={content.publishUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-ghost gap-1.5 text-xs font-semibold py-2 px-4"
            >
              <ExternalLink size={14} /> Ver publicado
            </a>
          )}
          <button onClick={handleDelete} className="btn-danger gap-1.5 text-xs font-semibold py-2 px-4">
            <Trash2 size={14} /> Deletar Pauta
          </button>
        </div>
      </div>

      {/* Bloco de Título e Metadados */}
      <div className="card p-6 space-y-6">
        <div className="relative group">
          <h1
            className="text-2xl font-extrabold outline-none p-2 rounded-xl transition-all duration-200 border border-transparent focus:border-purple-500/20 focus:bg-white/5"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const val = e.currentTarget.textContent || '';
              if (val.trim() && val !== content.title) {
                updateContent.mutate({ title: val.trim() })
              }
            }}
            style={{ 
              color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif',
              letterSpacing: '-0.02em'
            }}
            title="Clique para editar o título"
          >
            {content.title}
          </h1>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none text-xxs font-bold uppercase tracking-wider">
            Clique para editar
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          {/* Canal */}
          <div className="space-y-1.5">
            <p className="label">Canal</p>
            <span
              className={`badge badge-${content.channel.toLowerCase().replace('_', '-')}`}
            >
              {CHANNEL_LABELS[content.channel]}
            </span>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <p className="label">Status</p>
            <select
              value={content.status}
              onChange={(e) => handleStatusChange(e.target.value as ContentStatus)}
              className="input py-1.5 px-3 text-xs w-full max-w-[160px]"
            >
              {STATUS_ORDER.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Data de agendamento */}
          <div className="space-y-1.5">
            <p className="label">Agendado para</p>
            <input
              type="datetime-local"
              defaultValue={content.scheduledAt
                ? new Date(content.scheduledAt).toISOString().slice(0, 16)
                : ''}
              onChange={(e) =>
                updateContent.mutate({ scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })
              }
              className="input py-1.5 px-3 text-xs w-full"
            />
          </div>
        </div>

        {content.updatedAt && (
          <div className="flex justify-end">
            <span className="text-xxs font-medium" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
              Última atualização: {formatDateTime(content.updatedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Pauta */}
      <div className="card p-6">
        <h3 className="label mb-3">Pauta / Briefing</h3>
        <textarea
          className="input resize-none text-sm leading-relaxed"
          rows={3}
          defaultValue={content.briefing ?? ''}
          placeholder="Descreva a pauta, ideias secundárias, referências ou o ângulo da crítica..."
          onBlur={(e) => {
            if (e.target.value !== content.briefing) {
              updateContent.mutate({ briefing: e.target.value })
            }
          }}
        />
      </div>

      {/* Editor de Roteiro */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="label">Roteiro Principal</h3>
          <div className="flex items-center gap-3 text-xxs font-semibold tracking-wider uppercase text-gray-500" style={{ fontSize: '10px' }}>
            <span>{wordCount} palavras</span>
            <span>·</span>
            <span>{charCount} caracteres</span>
            {updateContent.isPending && (
              <>
                <span>·</span>
                <span className="text-purple-400 flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" />
                  Salvando…
                </span>
              </>
            )}
          </div>
        </div>
        
        <textarea
          className="input resize-none text-sm font-mono leading-relaxed p-4"
          style={{ 
            minHeight: '400px',
            background: 'rgba(5, 5, 9, 0.4)',
            lineHeight: '1.7'
          }}
          value={currentScript}
          onChange={handleScriptChange}
          placeholder="Escreva o roteiro da crítica ou do post aqui... Ele será salvo automaticamente enquanto você digita."
        />
      </div>

      {/* Checklist de Tasks */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="label">
            Checklist de Produção
          </h3>
          {tasks.length > 0 && (
            <span className="text-xxs font-bold text-gray-500 uppercase tracking-wider" style={{ fontSize: '10px' }}>
              {completedTasks}/{tasks.length} concluídas
            </span>
          )}
        </div>

        {/* Barra de progresso */}
        {tasks.length > 0 && (
          <div className="h-1.5 rounded-full w-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.round((completedTasks / tasks.length) * 100)}%`,
                background: `linear-gradient(to right, ${STATUS_COLORS[content.status]}, ${STATUS_COLORS[content.status]}cc)`,
              }}
            />
          </div>
        )}

        {/* Lista de Tasks */}
        {tasks.length > 0 && (
          <div className="space-y-2 py-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 py-3 px-4 rounded-xl border group transition-all duration-150"
                style={{ 
                  background: task.completed ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <button
                  onClick={() => toggleTask.mutate(task.id)}
                  className="flex-shrink-0 transition-all hover:scale-105"
                  style={{ color: task.completed ? '#10b981' : 'var(--text-muted)' }}
                >
                  {task.completed ? (
                    <CheckCircle2 size={18} className="text-emerald-500 drop-shadow-[0_0_4px_rgba(16,185,129,0.2)]" />
                  ) : (
                    <Circle size={18} className="hover:text-purple-400" />
                  )}
                </button>
                
                <span
                  className="flex-1 text-sm transition-all"
                  style={{
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </span>
                
                <button
                  onClick={() => deleteTask.mutate(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400 p-1"
                  title="Excluir tarefa"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulário de adicionar task */}
        <div className="flex gap-2.5 pt-2">
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Nova tarefa... (pressione Enter para adicionar)"
            className="input text-sm flex-1"
          />
          <button 
            onClick={handleAddTask} 
            className="btn-primary p-3"
            aria-label="Adicionar tarefa"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
