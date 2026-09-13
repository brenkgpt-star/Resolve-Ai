import { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  CloudRain,
  Wrench,
  Trash2,
  Edit2,
  X
} from 'lucide-react'
import { historyService } from '../services/historyService.js'
import { fetchWeatherForecast, DEFAULT_LOCATION } from '../services/weatherService.js'
import { useAuth } from '../context/AuthContext.jsx'

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default function HistoryCalendarScreen({ onSwitchToDiagnosis }) {
  const { user, openLoginModal } = useAuth()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr)
  
  const [tasks, setTasks] = useState([])
  const [diagnoses, setDiagnoses] = useState([])
  const [weatherAlerts, setWeatherAlerts] = useState([])
  const [, setLoadingWeather] = useState(true)

  // Estado do Modal de Tarefa
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'Hidráulica',
    priority: 'Média',
    notes: '',
  })

  // Carrega tarefas, diagnósticos e clima
  useEffect(() => {
    setTasks(historyService.getTasks())
    setDiagnoses(historyService.getDiagnoses())

    fetchWeatherForecast()
      .then((data) => {
        setWeatherAlerts(data)
        setLoadingWeather(false)
      })
      .catch(() => {
        setLoadingWeather(false)
      })
  }, [])

  function prevMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  function nextMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  function goToToday() {
    const now = new Date()
    setCurrentDate(now)
    setSelectedDateStr(todayStr)
  }

  // Gera a matriz de dias do mês quadriculado
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const prevDaysCount = firstDayOfMonth

  const calendarDays = []

  // Dias do mês anterior
  for (let i = prevDaysCount - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const prevMonthDate = new Date(year, month - 1, d)
    calendarDays.push({
      day: d,
      dateStr: prevMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false,
    })
  }

  // Dias do mês atual
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0')
    const dStr = String(d).padStart(2, '0')
    calendarDays.push({
      day: d,
      dateStr: `${year}-${mStr}-${dStr}`,
      isCurrentMonth: true,
    })
  }

  // Dias do próximo mês para completar grid
  const remainingCells = 42 - calendarDays.length
  if (remainingCells > 0 && remainingCells < 7) {
    for (let d = 1; d <= remainingCells; d++) {
      const nextMonthDate = new Date(year, month + 1, d)
      calendarDays.push({
        day: d,
        dateStr: nextMonthDate.toISOString().split('T')[0],
        isCurrentMonth: false,
      })
    }
  }

  function getTasksForDate(dateStr) {
    return tasks.filter((t) => t.date === dateStr)
  }

  function getDiagnosesForDate(dateStr) {
    return diagnoses.filter((d) => d.date === dateStr)
  }

  function getWeatherForDate(dateStr) {
    return weatherAlerts.find((w) => w.date === dateStr)
  }

  function handleToggleTask(taskId) {
    historyService.toggleTaskCompletion(taskId)
    setTasks(historyService.getTasks())
  }

  function handleDeleteTask(taskId) {
    if (window.confirm('Tem certeza que deseja remover esta tarefa?')) {
      historyService.deleteTask(taskId)
      setTasks(historyService.getTasks())
    }
  }

  function openNewTaskModal() {
    setEditingTaskId(null)
    setTaskForm({
      title: '',
      category: 'Hidráulica',
      priority: 'Média',
      notes: '',
    })
    setIsTaskModalOpen(true)
  }

  function openEditTaskModal(task) {
    setEditingTaskId(task.id)
    setTaskForm({
      title: task.title,
      category: task.category || 'Hidráulica',
      priority: task.priority || 'Média',
      notes: task.notes || '',
    })
    setIsTaskModalOpen(true)
  }

  function handleSaveTask(e) {
    e.preventDefault()
    if (!taskForm.title.trim()) return

    if (editingTaskId) {
      historyService.updateTask(editingTaskId, {
        title: taskForm.title.trim(),
        category: taskForm.category,
        priority: taskForm.priority,
        notes: taskForm.notes.trim(),
      })
    } else {
      historyService.addTask({
        date: selectedDateStr,
        title: taskForm.title.trim(),
        category: taskForm.category,
        priority: taskForm.priority,
        notes: taskForm.notes.trim(),
      })
    }

    setTasks(historyService.getTasks())
    setIsTaskModalOpen(false)
  }

  const selectedTasks = getTasksForDate(selectedDateStr)
  const selectedDiagnoses = getDiagnosesForDate(selectedDateStr)
  const selectedWeather = getWeatherForDate(selectedDateStr)

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-6xl mx-auto transition-colors duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <CalendarIcon size={14} />
            <span>Manutenção Preventiva & Histórico Doméstico</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            Calendário da Sua Casa
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-xl">
            Acompanhe o histórico de consertos, agende manutenções para não ser pego de surpresa e receba alertas meteorológicos preventivos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openNewTaskModal}
            className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            <span>Agendar Manutenção</span>
          </button>
        </div>
      </div>

      {/* Weather Alert Banner */}
      {weatherAlerts.some((w) => w.alert) && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 p-4 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">⚡</span>
            <div>
              <h3 className="font-black text-sm text-stone-900 dark:text-white">
                Atenção preventiva: Alertas climáticos identificados pela Open-Meteo
              </h3>
              <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
                Dias de chuva volumosa ou ventos fortes foram marcados com ícone especial no calendário para você se antecipar.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-lg shrink-0">
            {DEFAULT_LOCATION.name}
          </span>
        </div>
      )}

      {/* Main Grid: Calendário Quadriculado + Painel Lateral do Dia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Coluna 1 & 2: O Calendário Grande Quadriculado ── */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden flex flex-col">
          
          {/* Barra de Navegação do Mês */}
          <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-900 dark:bg-stone-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {MONTH_NAMES[month]} <span className="text-amber-400">{year}</span>
              </h2>
              <button
                onClick={goToToday}
                className="px-2.5 py-1 text-[11px] font-bold border border-stone-700 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg transition-colors cursor-pointer"
              >
                Hoje
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                title="Mês anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                title="Próximo mês"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Dias da Semana */}
          <div className="grid grid-cols-7 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-center text-xs font-black text-stone-600 dark:text-stone-300 py-3">
            {DAYS_OF_WEEK.map((d, i) => (
              <div key={d} className={i === 0 || i === 6 ? 'text-amber-600 dark:text-amber-400' : ''}>
                {d}
              </div>
            ))}
          </div>

          {/* Células Quadriculadas dos Dias */}
          <div className="grid grid-cols-7 auto-rows-[90px] sm:auto-rows-[105px] divide-x divide-y divide-stone-100 dark:divide-stone-800/80">
            {calendarDays.map((cell, idx) => {
              const dayTasks = getTasksForDate(cell.dateStr)
              const dayDiagnoses = getDiagnosesForDate(cell.dateStr)
              const dayWeather = getWeatherForDate(cell.dateStr)

              const isSelected = cell.dateStr === selectedDateStr
              const isToday = cell.dateStr === todayStr

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`p-1.5 sm:p-2 flex flex-col justify-between transition-colors cursor-pointer relative overflow-hidden ${
                    cell.isCurrentMonth 
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100' 
                      : 'bg-stone-50/60 dark:bg-stone-950/60 text-stone-400 dark:text-stone-600'
                  } ${
                    isSelected
                      ? 'ring-2 ring-inset ring-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/60'
                  }`}
                >
                  {/* Top Day Number & Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-black w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-amber-400 text-stone-950 shadow-sm'
                          : isSelected
                          ? 'font-black text-stone-900 dark:text-white'
                          : cell.isCurrentMonth
                          ? 'text-stone-800 dark:text-stone-200'
                          : 'text-stone-400 dark:text-stone-600'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {/* Ícone de alerta climático se houver */}
                    {dayWeather && dayWeather.alert && (
                      <span
                        className="text-xs shrink-0 cursor-help"
                        title={dayWeather.alert.title}
                      >
                        {dayWeather.alert.icon}
                      </span>
                    )}
                  </div>

                  {/* Marcadores de tarefas e consertos no dia */}
                  <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate border ${
                          t.completed
                            ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 line-through border-stone-300 dark:border-stone-700'
                            : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}

                    {dayDiagnoses.slice(0, 1).map((d) => (
                      <div
                        key={d.id}
                        className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                      >
                        🔧 {d.label}
                      </div>
                    ))}

                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-stone-500 dark:text-stone-400 font-bold">
                        +{dayTasks.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legenda do Calendário */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-4 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Manutenção Agendada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Diagnóstico / Reparo Realizado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Alerta Climático Preventivo</span>
            </div>
          </div>
        </div>

        {/* ── Coluna 3: Painel de Detalhes do Dia Selecionado ── */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden flex flex-col justify-between">
          
          <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-850">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Dia Selecionado
              </span>
              {selectedDateStr === todayStr && (
                <span className="bg-amber-400 text-stone-950 px-2 py-0.5 text-[10px] font-black uppercase rounded-md shadow-sm">
                  Hoje
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white capitalize">
              {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h3>
          </div>

          {/* Conteúdo do Dia */}
          <div className="p-5 sm:p-6 flex-1 overflow-y-auto max-h-[480px] flex flex-col gap-5">
            
            {/* 1. Alerta Meteorológico do Dia (se houver) */}
            {selectedWeather && (
              <div className="rounded-xl border border-stone-200 dark:border-stone-700/80 p-3.5 bg-stone-50 dark:bg-stone-800/60">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <CloudRain size={14} className="text-blue-500" />
                    <span>Previsão do Tempo</span>
                  </span>
                  <span>{selectedWeather.tMin}°C a {selectedWeather.tMax}°C</span>
                </div>

                {selectedWeather.alert ? (
                  <div className="bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 dark:text-amber-200">
                      <span>{selectedWeather.alert.icon}</span>
                      <span>{selectedWeather.alert.title}</span>
                    </div>
                    <p className="text-[11px] text-amber-900 dark:text-amber-300 mt-1 leading-snug">
                      {selectedWeather.alert.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Condições climáticas amenas. Ótimo dia para manutenções preventivas em casa!
                  </p>
                )}
              </div>
            )}

            {/* 2. Lista de Tarefas do Dia */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Tarefas e Cuidados ({selectedTasks.length})
                </h4>
                <button
                  onClick={openNewTaskModal}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Adicionar</span>
                </button>
              </div>

              {selectedTasks.length === 0 ? (
                <div className="text-center py-7 px-4 border border-dashed border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-800/30 flex flex-col items-center gap-2">
                  <span className="text-xl">📅</span>
                  <p className="text-stone-500 dark:text-stone-400 text-xs font-medium">
                    Nenhuma manutenção agendada para este dia.
                  </p>
                  <button
                    onClick={openNewTaskModal}
                    className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline cursor-pointer"
                  >
                    + Agendar novo cuidado
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {selectedTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-xl border border-stone-200 dark:border-stone-700/80 p-3.5 transition-all flex flex-col gap-2 ${
                        t.completed ? 'bg-stone-100 dark:bg-stone-800/40 opacity-75' : 'bg-stone-50 dark:bg-stone-800/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          onClick={() => handleToggleTask(t.id)}
                          className="flex items-start gap-2.5 text-left cursor-pointer group"
                        >
                          {t.completed ? (
                            <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Circle size={18} className="text-stone-400 dark:text-stone-500 group-hover:text-stone-900 dark:group-hover:text-white shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span
                              className={`text-sm font-bold leading-snug block ${
                                t.completed ? 'line-through text-stone-500 dark:text-stone-400' : 'text-stone-900 dark:text-white'
                              }`}
                            >
                              {t.title}
                            </span>
                            {t.notes && (
                              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                                {t.notes}
                              </p>
                            )}
                          </div>
                        </button>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditTaskModal(t)}
                            className="p-1 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                            title="Editar"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="p-1 text-stone-500 dark:text-stone-400 hover:text-red-500"
                            title="Excluir"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-700/50 pt-2">
                        <span className="bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded-md text-stone-800 dark:text-stone-200">
                          {t.category}
                        </span>
                        <span>
                          Prioridade: {t.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Diagnósticos Feitos no Dia */}
            {selectedDiagnoses.length > 0 && (
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-3">
                  Diagnósticos do Dia ({selectedDiagnoses.length})
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedDiagnoses.map((d) => (
                    <div
                      key={d.id}
                      className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 p-3.5"
                    >
                      <div className="flex items-center gap-2 font-black text-xs text-amber-950 dark:text-amber-200 mb-1">
                        <Wrench size={13} className="text-amber-600 dark:text-amber-400" />
                        <span>{d.label}</span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                        {d.diagnosis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer CTA do Painel Lateral */}
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between">
            <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              Precisa de outro conserto?
            </span>
            <button
              onClick={() => {
                if (!user) {
                  openLoginModal()
                  return
                }
                if (onSwitchToDiagnosis) onSwitchToDiagnosis()
              }}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Fazer Diagnóstico →
            </button>
          </div>

        </div>

      </div>

      {/* ── Modal de Adicionar / Editar Tarefa ── */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsTaskModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl z-10 overflow-hidden my-auto">
            
            <div className="bg-stone-900 dark:bg-stone-950 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                {editingTaskId ? 'Editar Manutenção' : 'Nova Manutenção Preventiva'}
              </span>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-5 sm:p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  O que precisa ser feito / comprado?
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Ex: Comprar resistência reserva ou limpar sifão"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Hidráulica">Hidráulica</option>
                    <option value="Elétrica">Elétrica</option>
                    <option value="Portas & Janelas">Portas & Janelas</option>
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Prioridade
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta (Urgente)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Observações / Dica de Compra
                </label>
                <textarea
                  rows={2}
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                  placeholder="Ex: Medida 1/2 volta ou comprar fita veda rosca junto"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
                >
                  {editingTaskId ? 'Salvar Alterações' : 'Adicionar ao Calendário'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
