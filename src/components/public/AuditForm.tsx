'use client'

import { useState } from 'react'
import { submitAuditForm } from '@/app/actions/submitLead'
import { Terminal, Send, CheckCircle } from 'lucide-react'

export function AuditForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleAction(formData: FormData) {
    setIsSubmitting(true)
    const response = await submitAuditForm(formData)
    setIsSubmitting(true) // Forcing loading visualization state
    setIsSubmitting(false)
    
    if (response.success) {
      setIsSuccess(true)
    } else {
      alert('SISTEMA: Falha na conexão de dados. Tente novamente.')
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md p-8 bg-neutral-900/40 backdrop-blur-2xl border border-status-success rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300 shadow-2xl shadow-black/50">
        <CheckCircle className="w-12 h-12 text-status-success animate-bounce" />
        <h3 className="text-white font-bold tracking-tight uppercase font-technical">TRANSMISSÃO CONCLUÍDA</h3>
        <p className="text-neutral-400 text-xs leading-relaxed font-light">
          Seus dados foram recebidos. Nossa engenharia entrará em contato em breve para o briefing técnico.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md p-8 bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 h-16 w-16 bg-red-600/[0.02] rounded-bl-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-5">
        <Terminal className="w-5 h-5 text-primary animate-pulse" />
        <h2 className="text-white font-technical font-bold text-xs tracking-widest">
          INICIAR_AUDITORIA // LEAD_CAPT
        </h2>
      </div>

      <form action={handleAction} className="space-y-5">
        {/* Input: Nome */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[9px] text-neutral-400 font-technical uppercase tracking-wider block">Nome do Operador</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full h-11 rounded-xl bg-black border border-white/15 focus:border-primary text-white px-4 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
            placeholder="Ex: Zacarias Ramos"
          />
        </div>

        {/* Input: Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[9px] text-neutral-400 font-technical uppercase tracking-wider block">Email Corporativo</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full h-11 rounded-xl bg-black border border-white/15 focus:border-primary text-white px-4 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
            placeholder="operador@empresa.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Input: Empresa */}
          <div className="space-y-1.5">
            <label htmlFor="company" className="text-[9px] text-neutral-400 font-technical uppercase tracking-wider block">Empresa / Base</label>
            <input 
              type="text" 
              id="company" 
              name="company" 
              className="w-full h-11 rounded-xl bg-black border border-white/15 focus:border-primary text-white px-4 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
              placeholder="Nome da Cia."
            />
          </div>

          {/* Input: Telefone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-[9px] text-neutral-400 font-technical uppercase tracking-wider block">Contato Direto</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              className="w-full h-11 rounded-xl bg-black border border-white/15 focus:border-primary text-white px-4 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
              placeholder="+55 (00) 00000-0000"
            />
          </div>
        </div>

        {/* Input: Budget */}
        <div className="space-y-1.5">
          <label htmlFor="budget" className="text-[9px] text-neutral-400 font-technical uppercase tracking-wider block">Budget Estimado (BRL)</label>
          <input 
            type="number" 
            id="budget" 
            name="budget" 
            className="w-full h-11 rounded-xl bg-black border border-white/15 focus:border-primary text-white px-4 text-xs outline-none transition-all duration-100 font-technical placeholder-[#52525B]"
            placeholder="Ex: 15000"
          />
        </div>

        {/* Botão de Submissão */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full mt-8 h-12 bg-primary hover:bg-primary-hover text-white font-technical text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,11,11,0.2)]"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              PROCESSANDO...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-white" />
              SOLICITAR ACESSO
            </>
          )}
        </button>
      </form>
    </div>
  )
}
