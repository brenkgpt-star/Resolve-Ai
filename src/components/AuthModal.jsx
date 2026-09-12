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

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Por favor, informe seu nome completo.')
        return
      }
      if (!passwordRules.hasMinLength) {
        setError('A senha deve ter no mínimo 8 dígitos.')
        return
      }
      if (!passwordRules.hasUppercase) {
        setError('A senha deve conter pelo menos 1 letra maiúscula.')
        return
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.')
        return
      }

      setSubmitting(true)
      try {
        await signup(name, email, password)
        resetForm()
        onClose()
      } catch (err) {
        setError(err.message || 'Erro ao realizar cadastro.')
      } finally {
        setSubmitting(false)
      }
    } else if (mode === 'login') {
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
        setError(err.message || 'Erro ao fazer login. Verifique seus dados.')
      } finally {
        setSubmitting(false)
      }
    } else if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setError('Digite um e-mail válido para recuperação.')
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-stone-100 border-2 border-stone-900 shadow-neo z-10 overflow-hidden my-auto">
        
        {/* Header Strip */}
        <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-stone-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-mono text-xs tracking-wider uppercase font-bold text-amber-400">
              {mode === 'login' && 'Autenticação // Entrar'}
              {mode === 'signup' && 'Autenticação // Novo Cadastro'}
              {mode === 'forgot' && 'Autenticação // Recuperar Senha'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 hover:bg-stone-800 transition-colors"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[85vh] overflow-y-auto">

          {/* Database / Firebase Status Pill */}
          <div className="flex items-center justify-between bg-white border-2 border-stone-900 px-3 py-1.5 mb-5 shadow-neo-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700">
              <Database size={13} className={isFirebaseActive ? "text-amber-500" : "text-blue-500"} />
              <span>Banco de Dados:</span>
              <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                isFirebaseActive 
                  ? 'bg-amber-100 text-amber-900 font-black' 
                  : 'bg-stone-200 text-stone-800'
              }`}>
                {isFirebaseActive ? 'FIREBASE CONECTADO' : 'MODO LOCAL (PRONTO P/ FIREBASE)'}
              </span>
            </div>
            <ShieldCheck size={14} className="text-stone-400" />
          </div>

          {/* Title & Subtitle */}
          <div className="mb-5">
            <h2 className="text-2xl font-black tracking-tight text-stone-900">
              {mode === 'login' && 'Acesse sua conta'}
              {mode === 'signup' && 'Crie sua conta no Resolve Aí'}
              {mode === 'forgot' && 'Recuperar acesso'}
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              {mode === 'login' && 'Salve seus diagnósticos e histórico de soluções domésticas.'}
              {mode === 'signup' && 'Cadastre-se gratuitamente para gerenciar suas soluções de reparo.'}
              {mode === 'forgot' && 'Digite seu e-mail cadastrado para redefinir sua senha.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 mb-4 bg-red-100 border-2 border-red-900 text-red-900 text-xs font-semibold">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-700" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-start gap-2.5 p-3 mb-4 bg-emerald-100 border-2 border-emerald-900 text-emerald-950 text-xs font-semibold">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-700" />
              <div className="leading-snug">{successMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Field: Name (Only in Signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Seu Nome
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-stone-900 focus:outline-none focus:bg-amber-50 shadow-neo-sm"
                  />
                </div>
              </div>
            )}

            {/* Field: Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-stone-900 focus:outline-none focus:bg-amber-50 shadow-neo-sm"
                />
              </div>
            </div>

            {/* Field: Password (Login & Signup) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-stone-600 hover:text-stone-900 font-bold underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border-2 border-stone-900 focus:outline-none focus:bg-amber-50 shadow-neo-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-stone-900"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Requirements Meter for Signup */}
                {mode === 'signup' && (
                  <div className="mt-2.5 p-3 bg-stone-200/80 border border-stone-400 rounded-sm">
                    <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Requisitos da Senha:
                    </p>
                    <div className="flex flex-col gap-1 text-xs">
                      {/* Rule 1: Min 8 digits */}
                      <div className="flex items-center gap-1.5">
                        {passwordRules.hasMinLength ? (
                          <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                        ) : (
                          <Circle size={14} className="text-stone-400 shrink-0" />
                        )}
                        <span className={passwordRules.hasMinLength ? 'text-emerald-800 font-bold' : 'text-stone-600'}>
                          Mínimo de 8 caracteres
                        </span>
                      </div>

                      {/* Rule 2: At least 1 uppercase */}
                      <div className="flex items-center gap-1.5">
                        {passwordRules.hasUppercase ? (
                          <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                        ) : (
                          <Circle size={14} className="text-stone-400 shrink-0" />
                        )}
                        <span className={passwordRules.hasUppercase ? 'text-emerald-800 font-bold' : 'text-stone-600'}>
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
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Confirme sua Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-stone-900 focus:outline-none focus:bg-amber-50 shadow-neo-sm"
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-[11px] text-red-600 font-bold mt-1">
                    As senhas digitadas não são iguais.
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || (mode === 'signup' && !isSignupValid)}
              className="mt-2 w-full py-3.5 px-4 bg-stone-900 hover:bg-orange-700 active:scale-[0.99] text-white font-black text-sm border-2 border-stone-900 shadow-neo neo-btn flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px]"
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
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Mode Switchers */}
          <div className="mt-5 pt-4 border-t-2 border-stone-300 text-center text-xs text-stone-600">
            {mode === 'login' && (
              <p>
                Ainda não tem uma conta?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-stone-900 font-black underline hover:text-orange-700 transition-colors"
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
                  className="text-stone-900 font-black underline hover:text-orange-700 transition-colors"
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
                  className="text-stone-900 font-black underline hover:text-orange-700 transition-colors"
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
