import { useState, useEffect } from 'react'
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Database
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { validatePassword } from '../services/authService.js'

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, signup, resetPassword, isFirebaseActive } = useAuth()

  const [mode, setMode] = useState(initialMode) // 'login' | 'signup' | 'forgot'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Sincroniza modo quando initialMode mudar
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setError('')
      setSuccessMessage('')
    }
  }, [isOpen, initialMode])

  // Fecha no Esc
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const passwordRules = validatePassword(password)
  const passwordsMatch = mode !== 'signup' || (password && password === confirmPassword)
  const isSignupValid =
    name.trim().length > 0 &&
    email.trim().includes('@') &&
    passwordRules.isValid &&
    passwordsMatch

  function resetForm() {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccessMessage('')
    setShowPassword(false)
  }

  function switchMode(newMode) {
    setMode(newMode)
    setError('')
    setSuccessMessage('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Preencha seu e-mail e sua senha.')
        return
      }

      setSubmitting(true)
      try {
        await login(email, password)
        resetForm()
        onClose()
      } catch (err) {
        setError(err.message || 'Falha ao realizar login.')
      } finally {
        setSubmitting(false)
      }
    }

    if (mode === 'signup') {
      if (!isSignupValid) {
        setError('Por favor, atenda a todos os requisitos de senha e preencha seus dados.')
        return
      }

      setSubmitting(true)
      try {
        await signup(name, email, password)
        resetForm()
        onClose()
      } catch (err) {
        setError(err.message || 'Falha ao criar conta.')
      } finally {
        setSubmitting(false)
      }
    }

    if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setError('Digite um e-mail válido.')
        return
      }

      setSubmitting(true)
      try {
        const res = await resetPassword(email)
        setSuccessMessage(res.message || 'Instruções enviadas para seu e-mail!')
      } catch (err) {
        setError(err.message || 'Falha ao solicitar recuperação de senha.')
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl z-10 overflow-hidden my-auto transition-colors duration-200">
        
        {/* Header Strip */}
        <div className="bg-stone-900 dark:bg-stone-950 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-mono text-xs tracking-wider uppercase font-bold text-amber-400">
              {mode === 'login' && 'Autenticação // Entrar'}
              {mode === 'signup' && 'Autenticação // Novo Cadastro'}
              {mode === 'forgot' && 'Autenticação // Recuperar Senha'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[85vh] overflow-y-auto">

          {/* Database / Firebase Status Pill */}
          <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 px-3 py-1.5 rounded-xl mb-5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700 dark:text-stone-300">
              <Database size={13} className={isFirebaseActive ? "text-amber-500" : "text-blue-500"} />
              <span>Banco de Dados:</span>
              <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                isFirebaseActive 
                  ? 'bg-amber-100 text-amber-900 font-black' 
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
              }`}>
                {isFirebaseActive ? 'FIREBASE CONECTADO' : 'MODO LOCAL (PRONTO P/ FIREBASE)'}
              </span>
            </div>
            <ShieldCheck size={14} className="text-stone-400" />
          </div>

          {/* Title & Subtitle */}
          <div className="mb-5">
            <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">
              {mode === 'login' && 'Acesse sua conta'}
              {mode === 'signup' && 'Crie sua conta no Resolve Aí'}
              {mode === 'forgot' && 'Recuperar acesso'}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              {mode === 'login' && 'Salve seus diagnósticos e histórico de soluções domésticas.'}
              {mode === 'signup' && 'Cadastre-se gratuitamente para gerenciar suas soluções de reparo.'}
              {mode === 'forgot' && 'Digite seu e-mail cadastrado para redefinir sua senha.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 mb-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 text-xs font-semibold rounded-xl">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-start gap-2.5 p-3 mb-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-xs font-semibold rounded-xl">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div className="leading-snug">{successMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Field: Name (Only in Signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Seu Nome
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Field: Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Field: Password (Login & Signup) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Requirements Meter for Signup */}
                {mode === 'signup' && (
                  <div className="mt-2.5 p-3 bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl">
                    <p className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                      Requisitos da Senha:
                    </p>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        {passwordRules.hasMinLength ? (
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                          <Circle size={14} className="text-stone-400 shrink-0" />
                        )}
                        <span className={passwordRules.hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-stone-500'}>
                          Mínimo de 8 caracteres
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {passwordRules.hasUppercase ? (
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                          <Circle size={14} className="text-stone-400 shrink-0" />
                        )}
                        <span className={passwordRules.hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-stone-500'}>
                          Pelo menos 1 letra maiúscula (A-Z)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Field: Confirm Password (Only Signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Confirme sua Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">
                    As senhas digitadas não são iguais.
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || (mode === 'signup' && !isSignupValid)}
              className="mt-2 w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-stone-950 font-black text-sm rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px]"
            >
              {submitting ? (
                <span>Processando...</span>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Entrar na Conta'}
                    {mode === 'signup' && 'Cadastrar e Começar'}
                    {mode === 'forgot' && 'Enviar Link de Redefinição'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Mode Switchers */}
          <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-600 dark:text-stone-400">
            {mode === 'login' && (
              <p>
                Ainda não tem uma conta?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-amber-600 dark:text-amber-400 font-bold underline hover:text-amber-700"
                >
                  Criar conta agora
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p>
                Já possui uma conta cadastrada?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-amber-600 dark:text-amber-400 font-bold underline hover:text-amber-700"
                >
                  Fazer login
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Lembrou sua senha?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-amber-600 dark:text-amber-400 font-bold underline hover:text-amber-700"
                >
                  Voltar para o login
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
