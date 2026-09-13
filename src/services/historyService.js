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
      if (raw) {
        const parsed = JSON.parse(raw)
        // Filtra quaisquer tarefas de exemplo pré-definidas anteriores (task_1, task_2)
        const cleaned = parsed.filter((t) => t.id !== 'task_1' && t.id !== 'task_2')
        if (cleaned.length !== parsed.length) {
          this.saveAllTasks(cleaned)
        }
        return cleaned
      }
      return []
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
  },

  toggleTaskCompletion(id) {
    return this.toggleTaskCompleted(id)
  }
}
