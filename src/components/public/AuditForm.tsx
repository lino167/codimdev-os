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
    setIsSubmitting(false)
    
    if (response.success) {
      setIsSuccess(true)
    } else {
      alert('SISTEMA: Falha na conexão de dados. Tente novamente.')
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md p-8 bg-surface border border-status-success rounded-sm flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <CheckCircle className="w-12 h-12 text-status-success animate-bounce" />
        <h3 className="text-white font-bold tracking-tight uppercase font-technical">TRANSMISSÃO CONCLUÍDA</h3>
        <p className="text-text-secondary text-xs leading-relaxed">
          Seus dados foram recebidos. Nossa engenharia entrará em contato em breve para o briefing técnico.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md p-6 bg-surface border border-border rounded-sm shadow-2xl relative">
      <div className="absolute top-0 right-0 h-12 w-12 bg-red-600/[0.01] rounded-bl-full pointer-events-none" />

      <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
        <Terminal className="w-5 h-5 text-primary animate-pulse" />
        <h2 className="text-white font-technical font-bold text-xs tracking-widest">
          INICIAR_AUDITORIA // LEAD_CAPT
        </h2>
      </div>

      <form action={handleAction} className="space-y-4">
        {/* Input: Nome */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-[9px] text-text-muted font-technical uppercase tracking-wider block">Nome do Operador</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full bg-background border border-border focus:border-border-focus text-white px-3 py-2 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
            placeholder="Ex: Zacarias Ramos"
          />
        </div>

        {/* Input: Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-[9px] text-text-muted font-technical uppercase tracking-wider block">Email Corporativo</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full bg-background border border-border focus:border-border-focus text-white px-3 py-2 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
            placeholder="operador@empresa.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Input: Empresa */}
          <div className="space-y-1">
            <label htmlFor="company" className="text-[9px] text-text-muted font-technical uppercase tracking-wider block">Empresa / Base</label>
            <input 
              type="text" 
              id="company" 
              name="company" 
              className="w-full bg-background border border-border focus:border-border-focus text-white px-3 py-2 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
              placeholder="Nome da Cia."
            />
          </div>

          {/* Input: Telefone */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-[9px] text-text-muted font-technical uppercase tracking-wider block">Contato Direto</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              className="w-full bg-background border border-border focus:border-border-focus text-white px-3 py-2 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
              placeholder="+55 (00) 00000-0000"
            />
          </div>
        </div>

        {/* Input: Budget */}
        <div className="space-y-1">
          <label htmlFor="budget" className="text-[9px] text-text-muted font-technical uppercase tracking-wider block">Budget Estimado (BRL)</label>
          <input 
            type="number" 
            id="budget" 
            name="budget" 
            className="w-full bg-background border border-border focus:border-border-focus text-white px-3 py-2 text-xs outline-none transition-all duration-100 font-technical placeholder-[#52525B]"
            placeholder="Ex: 15000"
          />
        </div>

        {/* Botão de Submissão */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-technical text-xs tracking-widest py-3 flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              PROCESSANDO...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-white" />
              SOLICITAR_ACESSO
            </>
          )}
        </button>
      </form>
    </div>
  )
}
