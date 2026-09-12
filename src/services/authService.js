import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth'
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig.js'

// Validador de senha: Mínimo 8 dígitos e pelo menos 1 maiúscula
export function validatePassword(password) {
  const p = password || ''
  const hasMinLength = p.length >= 8
  const hasUppercase = /[A-Z]/.test(p)
  return {
    hasMinLength,
    hasUppercase,
    isValid: hasMinLength && hasUppercase,
  }
}

// Traduz códigos de erro do Firebase para mensagens amigáveis em português
function formatFirebaseError(err) {
  if (!err) return 'Ocorreu um erro inesperado.'
  const code = err.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado no Firebase.'
    case 'auth/invalid-email':
      return 'O formato do e-mail é inválido.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.'
    case 'auth/weak-password':
      return 'A senha fornecida é considerada fraca pelo Firebase.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Aguarde alguns instantes antes de tentar novamente.'
    case 'auth/network-request-failed':
      return 'Erro de conexão com o Firebase. Verifique sua internet.'
    case 'auth/operation-not-allowed':
      return 'O método de login por E-mail/Senha não está ativado no Firebase Console. Ative em Authentication > Sign-in method.'
    default:
      return err.message || 'Erro ao comunicar com o Firebase.'
  }
}

// Inicializa Firebase apenas se estiver configurado
let auth = null
const isConfigured = isFirebaseConfigured()

if (isConfigured) {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
  } catch (err) {
    console.warn('Erro ao inicializar Firebase Auth, operando em modo local:', err)
    auth = null
  }
}

// ─── Local Mock Auth Storage (Fallback quando Firebase ainda não tem credenciais) ───
const LOCAL_STORAGE_USERS_KEY = 'resolve_ai_users_db'
const LOCAL_STORAGE_CURRENT_USER = 'resolve_ai_current_user'

function getLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users))
  } catch (e) {
    console.error('Falha ao salvar usuários locais', e)
  }
}

function getLocalCurrentUser() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setLocalCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER)
    }
  } catch (e) {
    console.error('Falha ao salvar sessão local', e)
  }
}

const localAuthListeners = new Set()

function notifyLocalListeners(user) {
  localAuthListeners.forEach((listener) => {
    try {
      listener(user)
    } catch (err) {
      console.error(err)
    }
  })
}

// ─── Unified Auth Service Interface ───────────────────────────────

export const authService = {
  isFirebaseActive() {
    return Boolean(auth)
  },

  // Cadastro de Novo Usuário
  async signUp(name, email, password) {
    const { isValid, hasMinLength, hasUppercase } = validatePassword(password)
    if (!hasMinLength) {
      throw new Error('A senha deve ter no mínimo 8 caracteres.')
    }
    if (!hasUppercase) {
      throw new Error('A senha deve conter pelo menos 1 letra maiúscula.')
    }

    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanName = (name || '').trim() || cleanEmail.split('@')[0]

    // Modo Firebase Real
    if (auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password)
        if (cleanName) {
          await updateProfile(userCredential.user, { displayName: cleanName })
        }
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: cleanName || userCredential.user.displayName,
        }
      } catch (err) {
        throw new Error(formatFirebaseError(err))
      }
    }

    // Modo Local Simulado (Fallback até configurar Firebase)
    await new Promise((r) => setTimeout(r, 250)) // simula rede
    const users = getLocalUsers()
    const existing = users.find((u) => u.email === cleanEmail)
    if (existing) {
      throw new Error('Este e-mail já está cadastrado no sistema.')
    }

    const newUser = {
      uid: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      name: cleanName,
      displayName: cleanName,
      email: cleanEmail,
      password: password, // em modo local mock para teste
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveLocalUsers(users)

    const sessionUser = {
      uid: newUser.uid,
      displayName: newUser.displayName,
      email: newUser.email,
    }
    setLocalCurrentUser(sessionUser)
    notifyLocalListeners(sessionUser)
    return sessionUser
  },

  // Login de Usuário
  async signIn(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase()

    if (auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password)
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || cleanEmail.split('@')[0],
        }
      } catch (err) {
        throw new Error(formatFirebaseError(err))
      }
    }

    // Modo Local Simulado
    await new Promise((r) => setTimeout(r, 200))
    const users = getLocalUsers()
    const found = users.find((u) => u.email === cleanEmail && u.password === password)

    if (!found) {
      throw new Error('E-mail ou senha incorretos. Verifique suas credenciais.')
    }

    const sessionUser = {
      uid: found.uid,
      displayName: found.displayName || found.name,
      email: found.email,
    }
    setLocalCurrentUser(sessionUser)
    notifyLocalListeners(sessionUser)
    return sessionUser
  },

  // Logout
  async signOutUser() {
    if (auth) {
      await signOut(auth)
      return
    }

    setLocalCurrentUser(null)
    notifyLocalListeners(null)
  },

  // Recuperação de Senha
  async resetPassword(email) {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail) {
      throw new Error('Informe o e-mail cadastrado.')
    }

    if (auth) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail)
        return { success: true, message: 'E-mail de recuperação enviado via Firebase!' }
      } catch (err) {
        throw new Error(formatFirebaseError(err))
      }
    }

    // Modo Local Simulado
    await new Promise((r) => setTimeout(r, 300))
    const users = getLocalUsers()
    const found = users.find((u) => u.email === cleanEmail)
    if (!found) {
      // Por segurança, avisa de forma genérica ou que foi simulado
      return { success: true, message: 'Se o e-mail estiver cadastrado, as instruções foram enviadas!' }
    }
    return { success: true, message: 'Link de redefinição enviado para ' + cleanEmail }
  },

  // Observador do Estado de Autenticação
  onAuthStateChange(callback) {
    if (auth) {
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          callback({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
          })
        } else {
          callback(null)
        }
      })
    }

    // Modo Local
    localAuthListeners.add(callback)
    // Dispara imediatamente o usuário atual
    callback(getLocalCurrentUser())

    return () => {
      localAuthListeners.delete(callback)
    }
  },
}
