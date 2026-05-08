'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Terminal, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Limpa erros ao digitar
  useEffect(() => {
    if (errorMsg) setErrorMsg('')
  }, [email, password])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      // 1. Tenta autenticação real com o Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (data?.session) {
        setSuccessMsg('AUTENTICADO COM SUCESSO. INICIANDO ACESSO...')
        localStorage.setItem('codimdev_session', 'active')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
        return
      }

      // 2. Bypass de Demonstração Técnico para o Operador Local (Zacarias Ramos)
      if (email === 'admin@codimdev.com' && password === 'admin') {
        setSuccessMsg('ACESSO OPERADOR CONCEDIDO (BYPASS DE SESSÃO).')
        localStorage.setItem('codimdev_session', 'bypass')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
        return
      }

      if (error) throw error
      throw new Error('Credenciais inválidas.')
    } catch (err: any) {
      console.error('Erro de autenticação:', err)
      setErrorMsg(err.message || 'FALHA DE CONEXÃO. VERIFIQUE SUAS CREDENCIAIS.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden selection:bg-primary">
      {/* Background Matrix/Grid Aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm p-6 bg-surface border border-border rounded-sm shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">

        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8 border-b border-border pb-6">
          <div className="h-10 w-10 border border-primary flex items-center justify-center text-primary mb-3 bg-black">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <h1 className="text-white font-technical font-bold text-sm tracking-widest uppercase">
            CODIMDEV OS // LOGIN
          </h1>
          <p className="text-[10px] text-text-muted font-technical uppercase tracking-wider mt-1">
            Painel Centralizado de Automação & CRM
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-600/[0.05] border border-primary text-primary text-[10px] font-technical tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="uppercase">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-600/[0.05] border border-status-success text-status-success text-[10px] font-technical tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-status-success rounded-full animate-ping" />
            <span className="uppercase">{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[9px] text-text-muted font-technical uppercase tracking-wider block">Email Operador</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-border focus:border-border-focus text-white pl-9 pr-3 py-2 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
                placeholder="operador@codimdev.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-[9px] text-text-muted font-technical uppercase tracking-wider block">Chave de Segurança</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-border focus:border-border-focus text-white pl-9 pr-3 py-2 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
                placeholder="Sua senha mestre"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-technical text-xs tracking-widest py-3 flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                VERIFICANDO...
              </>
            ) : (
              <>
                ACESSAR TERMINAL
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
