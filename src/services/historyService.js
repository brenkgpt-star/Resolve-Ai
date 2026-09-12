/**
 * Service para persistência de Histórico de Diagnósticos e Calendário de Manutenção.
 * Salva localmente com suporte a sincronização via Firebase Firestore no futuro.
 */

const STORAGE_DIAGNOSES_KEY = 'resolve_ai_history_diagnoses'
const STORAGE_TASKS_KEY = 'resolve_ai_calendar_tasks'

export const historyService = {
  // Diagnósticos realizados
  getDiagnoses() {
    try {
      const raw = localStorage.getItem(STORAGE_DIAGNOSES_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  saveDiagnosis(diagnosisRecord) {
    try {
      const list = this.getDiagnoses()
      const record = {
        id: 'diag_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        ...diagnosisRecord,
      }
      list.unshift(record)
      localStorage.setItem(STORAGE_DIAGNOSES_KEY, JSON.stringify(list))
      return record
    } catch (e) {
      console.error('Erro ao salvar diagnóstico:', e)
      return null
    }
  },

  // Tarefas / Manutenções Preventivas do Calendário
  getTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_TASKS_KEY)
      if (raw) return JSON.parse(raw)

      // Se não houver tarefas salvas ainda, adiciona tarefas de exemplo inteligentes
      const today = new Date()
      const fmt = (d) => d.toISOString().split('T')[0]
      
      const in3Days = new Date(today)
      in3Days.setDate(today.getDate() + 3)

      const in8Days = new Date(today)
      in8Days.setDate(today.getDate() + 8)

      const initial = [
        {
          id: 'task_1',
          date: fmt(in3Days),
          title: 'Limpar copo do sifão e ralos',
          category: 'Hidráulica',
          priority: 'Média',
          completed: false,
          notes: 'Prevenção periódica contra mau cheiro e acúmulo de gordura.',
        },
        {
          id: 'task_2',
          date: fmt(in8Days),
          title: 'Lubrificar dobradiças das portas',
          category: 'Geral',
          priority: 'Baixa',
          completed: false,
          notes: 'Aplicar desengripante com caninho aplicador para não ranger.',
        }
      ]
      this.saveAllTasks(initial)
      return initial
    } catch {
      return []
    }
  },

  saveAllTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks))
    } catch (e) {
      console.error('Erro ao salvar tarefas:', e)
    }
  },

  addTask({ date, title, category = 'Geral', priority = 'Média', notes = '' }) {
    const tasks = this.getTasks()
    const newTask = {
      id: 'task_' + Date.now(),
      date, // YYYY-MM-DD
      title,
      category,
      priority,
      notes,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    tasks.push(newTask)
    this.saveAllTasks(tasks)
    return newTask
  },

  updateTask(id, updates) {
    const tasks = this.getTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates }
      this.saveAllTasks(tasks)
      return tasks[index]
    }
    return null
  },

  deleteTask(id) {
    const tasks = this.getTasks()
    const filtered = tasks.filter((t) => t.id !== id)
    this.saveAllTasks(filtered)
    return true
  },

  toggleTaskCompleted(id) {
    const tasks = this.getTasks()
    const task = tasks.find((t) => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveAllTasks(tasks)
      return task
    }
    return null
  }
}
