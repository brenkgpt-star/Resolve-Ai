import { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  AlertTriangle,
  CloudRain,
  Wind,
  Zap,
  Wrench,
  Trash2,
  Edit2,
  Clock,
  ShieldCheck,
  Tag,
  X
} from 'lucide-react'
import { historyService } from '../services/historyService.js'
import { fetchWeatherForecast, DEFAULT_LOCATION } from '../services/weatherService.js'

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default function HistoryCalendarScreen({ onSwitchToDiagnosis }) {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr)
  
  const [tasks, setTasks] = useState([])
  const [diagnoses, setDiagnoses] = useState([])
  const [weatherAlerts, setWeatherAlerts] = useState([])
  const [loadingWeather, setLoadingWeather] = useState(true)

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
      .catch(() => setLoadingWeather(false))
  }, [])

  // Navegação do Mês
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

  // Dias do mês anterior para completar o grid inicial
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
    const currentMonthDate = new Date(year, month, d)
    // Garantir formato YYYY-MM-DD local
    const mStr = String(month + 1).padStart(2, '0')
    const dStr = String(d).padStart(2, '0')
    calendarDays.push({
      day: d,
      dateStr: `${year}-${mStr}-${dStr}`,
      isCurrentMonth: true,
    })
  }

  // Dias do próximo mês para completar grid de 35 ou 42 células
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

  // Helpers para checar eventos no dia
  function getTasksForDate(dateStr) {
    return tasks.filter((t) => t.date === dateStr)
  }

  function getDiagnosesForDate(dateStr) {
    return diagnoses.filter((d) => d.date === dateStr)
  }

  function getWeatherForDate(dateStr) {
    return weatherAlerts.find((w) => w.date === dateStr)
  }

  // Manipulação de Tarefas
  function handleToggleTask(id) {
    historyService.toggleTaskCompleted(id)
    setTasks(historyService.getTasks())
  }

  function handleDeleteTask(id) {
    historyService.deleteTask(id)
    setTasks(historyService.getTasks())
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
      category: task.category || 'Geral',
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
    <div className="py-8 sm:py-10 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase mb-1">
            <CalendarIcon size={14} />
            <span>Manutenção Preventiva & Histórico Doméstico</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Calendário da Sua Casa
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Acompanhe o histórico de consertos, agende manutenções para não ser pego de surpresa e receba alertas meteorológicos preventivos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openNewTaskModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-black text-xs sm:text-sm border-2 border-stone-900 shadow-neo neo-btn transition-all"
          >
            <Plus size={16} />
            <span>Agendar Manutenção</span>
          </button>
        </div>
      </div>

      {/* Weather Alert Banner (Se houver alerta nos próximos dias) */}
      {weatherAlerts.some((w) => w.alert) && (
        <div className="border-2 border-stone-900 bg-amber-50 p-4 mb-8 shadow-neo-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-black text-sm text-stone-900">
                Atenção preventiva: Alertas climáticos identificados pela Open-Meteo
              </h3>
              <p className="text-xs text-stone-700 mt-0.5">
                Dias de chuva volumosa ou ventos fortes foram marcados com ícone especial no calendário para você se antecipar.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold bg-white border border-stone-900 px-2 py-1 shrink-0">
            {DEFAULT_LOCATION.name}
          </span>
        </div>
      )}

      {/* Main Grid: Calendário Quadriculado + Painel Lateral do Dia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Coluna 1 & 2: O Calendário Grande Quadriculado ── */}
        <div className="lg:col-span-2 border-2 border-stone-900 bg-white shadow-neo">
          
          {/* Barra de Navegação do Mês */}
          <div className="p-4 sm:p-5 border-b-2 border-stone-900 bg-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {MONTH_NAMES[month]} <span className="text-amber-400">{year}</span>
              </h2>
              <button
                onClick={goToToday}
                className="px-2.5 py-1 text-[11px] font-bold border border-stone-700 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-sm transition-colors"
              >
                Hoje
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Mês anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Próximo mês"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Dias da Semana (Cabeçalho do Grid) */}
          <div className="grid grid-cols-7 border-b-2 border-stone-900 bg-stone-100 text-center text-xs font-black text-stone-700 py-2.5">
            {DAYS_OF_WEEK.map((d, i) => (
              <div key={d} className={i === 0 || i === 6 ? 'text-orange-700' : ''}>
                {d}
              </div>
            ))}
          </div>

          {/* Células Quadriculadas dos Dias */}
          <div className="grid grid-cols-7 auto-rows-[90px] sm:auto-rows-[105px] divide-x divide-y divide-stone-200">
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
                    cell.isCurrentMonth ? 'bg-white' : 'bg-stone-50/60 text-stone-400'
                  } ${
                    isSelected
                      ? 'ring-2 ring-inset ring-amber-500 bg-amber-50/40'
                      : 'hover:bg-stone-100/70'
                  }`}
                >
                  {/* Top Day Number & Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-black w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-amber-400 text-stone-900 border border-stone-900'
                          : isSelected
                          ? 'font-black text-stone-900'
                          : cell.isCurrentMonth
                          ? 'text-stone-800'
                          : 'text-stone-400'
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

                  {/* Badges / Marcadores de tarefas e consertos no dia */}
                  <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[9px] sm:text-[10px] font-bold px-1 py-0.5 rounded-sm truncate border ${
                          t.completed
                            ? 'bg-stone-200 text-stone-600 line-through border-stone-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}

                    {dayDiagnoses.slice(0, 1).map((d) => (
                      <div
                        key={d.id}
                        className="text-[9px] sm:text-[10px] font-bold px-1 py-0.5 rounded-sm truncate bg-orange-100 text-orange-900 border border-orange-300"
                      >
                        🔧 {d.label}
                      </div>
                    ))}

                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-stone-500 font-bold">
                        +{dayTasks.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legenda do Calendário */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Manutenção Agendada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Diagnóstico / Reparo Realizado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Alerta Climático Preventivo</span>
            </div>
          </div>
        </div>

        {/* ── Coluna 3: Painel de Detalhes do Dia Selecionado ── */}
        <div className="border-2 border-stone-900 bg-white shadow-neo flex flex-col justify-between">
          
          <div className="p-5 sm:p-6 border-b-2 border-stone-900 bg-stone-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Dia Selecionado
              </span>
              {selectedDateStr === todayStr && (
                <span className="bg-amber-400 border border-stone-900 px-2 py-0.5 text-[10px] font-black uppercase">
                  Hoje
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black text-stone-900">
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
              <div className="border-2 border-stone-900 p-3.5 bg-stone-50">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-2">
                  <span className="flex items-center gap-1">
                    <CloudRain size={14} className="text-blue-500" />
                    <span>Previsão do Tempo</span>
                  </span>
                  <span>{selectedWeather.tMin}°C a {selectedWeather.tMax}°C</span>
                </div>

                {selectedWeather.alert ? (
                  <div className="bg-amber-100 border border-amber-400 p-2.5 rounded-sm">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                      <span>{selectedWeather.alert.icon}</span>
                      <span>{selectedWeather.alert.title}</span>
                    </div>
                    <p className="text-[11px] text-amber-900 mt-1 leading-snug">
                      {selectedWeather.alert.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-600">
                    Condições climáticas amenas. Ótimo dia para manutenções preventivas em casa!
                  </p>
                )}
              </div>
            )}

            {/* 2. Lista de Tarefas do Dia */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                  Tarefas e Cuidados ({selectedTasks.length})
                </h4>
                <button
                  onClick={openNewTaskModal}
                  className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Adicionar</span>
                </button>
              </div>

              {selectedTasks.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-stone-200 rounded-sm text-stone-400 text-xs">
                  Nenhuma manutenção agendada para este dia.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {selectedTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`border-2 border-stone-900 p-3 shadow-neo-sm transition-all flex flex-col gap-2 ${
                        t.completed ? 'bg-stone-100 opacity-75' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          onClick={() => handleToggleTask(t.id)}
                          className="flex items-start gap-2 text-left cursor-pointer group"
                        >
                          {t.completed ? (
                            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Circle size={18} className="text-stone-400 group-hover:text-stone-900 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span
                              className={`text-sm font-black leading-snug block ${
                                t.completed ? 'line-through text-stone-500' : 'text-stone-900'
                              }`}
                            >
                              {t.title}
                            </span>
                            {t.notes && (
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                                {t.notes}
                              </p>
                            )}
                          </div>
                        </button>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditTaskModal(t)}
                            className="p-1 text-stone-500 hover:text-stone-900"
                            title="Editar"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="p-1 text-stone-500 hover:text-red-700"
                            title="Excluir"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 border-t border-stone-100 pt-1.5">
                        <span className="bg-stone-200 px-1.5 py-0.5 rounded-sm text-stone-800">
                          {t.category}
                        </span>
                        <span className="text-stone-400">
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
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 mb-3">
                  Diagnósticos do Dia ({selectedDiagnoses.length})
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedDiagnoses.map((d) => (
                    <div
                      key={d.id}
                      className="border-2 border-stone-900 bg-orange-50/70 p-3 shadow-neo-sm"
                    >
                      <div className="flex items-center gap-2 font-black text-xs text-stone-900 mb-1">
                        <Wrench size={13} className="text-orange-700" />
                        <span>{d.label}</span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {d.diagnosis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer CTA do Painel Lateral */}
          <div className="p-4 border-t-2 border-stone-900 bg-stone-50 flex items-center justify-between">
            <span className="text-xs text-stone-600 font-medium">
              Precisa resolver outro perrengue?
            </span>
            <button
              onClick={onSwitchToDiagnosis}
              className="text-xs font-black text-stone-900 underline hover:text-orange-700 cursor-pointer"
            >
              Fazer Diagnóstico →
            </button>
          </div>

        </div>

      </div>

      {/* ── Modal de Adicionar / Editar Tarefa ── */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsTaskModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-stone-100 border-2 border-stone-900 shadow-neo z-10 overflow-hidden my-auto">
            
            <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-stone-900">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                {editingTaskId ? 'Editar Manutenção' : 'Nova Manutenção Preventiva'}
              </span>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-5 sm:p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  O que precisa ser feito / comprado?
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Ex: Comprar resistência reserva ou limpar sifão"
                  className="w-full px-3 py-2.5 text-sm bg-white border-2 border-stone-900 focus:outline-none focus:bg-amber-50 shadow-neo-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-stone-900 focus:outline-none shadow-neo-sm"
                  >
                    <option value="Hidráulica">Hidráulica</option>
                    <option value="Elétrica">Elétrica</option>
                    <option value="Portas & Janelas">Portas & Janelas</option>
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-stone-900 focus:outline-none shadow-neo-sm"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta (Urgente)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Observações / Dica de Compra
                </label>
                <textarea
                  rows={2}
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                  placeholder="Ex: Medida 1/2 volta ou comprar fita veda rosca junto"
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-stone-900 focus:outline-none focus:bg-amber-50 shadow-neo-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-200 border border-stone-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-orange-700 text-white font-black text-xs border-2 border-stone-900 shadow-neo neo-btn transition-all"
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
