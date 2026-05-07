"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Loader2, 
  AlertTriangle,
  Clock,
  PhoneCall,
  Laptop
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function DiagnosticoPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from("leads")
        .insert([
          {
            name,
            company,
            email,
            phone,
            status: "captured",
            value: 0, // Free diagnostic
            source: "diagnostico_gratuito",
            notes: `Gargalos e Dores: ${notes}`,
          },
        ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting lead:", err);
      setErrorMsg("Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: "Mapeamento de Gargalos", desc: "Analisamos as tarefas lentas e manuais que sua equipe faz no dia a dia para descobrir onde sua empresa está perdendo tempo e dinheiro.", icon: Clock },
    { title: "Conversa Direta (30 min)", desc: "Uma reunião rápida e pragmática (por chamada ou WhatsApp) para entendermos as dores e a rotina da sua operação.", icon: PhoneCall },
    { title: "Plano de Solução Gratuito", desc: "Você recebe o desenho prático do sistema ou automação ideal para organizar seus processos e economizar horas de trabalho, sem custo.", icon: Laptop },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF0B0B] selection:text-white flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/[0.03] rounded-full blur-[100px] pointer-events-none" />

        {/* Content Side */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 border border-[#2E3A2F] bg-[#0a0a0a] px-3 py-1.5 rounded-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF0B0B] animate-pulse" />
            <span className="font-technical text-[10px] text-[#A1A1AA] tracking-widest uppercase">
              Diagnóstico Operacional — 100% Gratuito e Prático
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-medium leading-tight">
            Pare de perder tempo com <span className="text-[#FF0B0B] font-semibold">processos manuais e lentos.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl">
            A CodimDev cria softwares, sistemas e automações sob medida para organizar o dia a dia da sua empresa. Eliminamos planilhas confusas, trabalhos repetitivos e erros humanos que travam o seu crescimento. Vamos mapear os problemas da sua operação de forma rápida e desenhar a solução perfeita sem custos.
          </p>

          {/* Steps Detailed */}
          <div className="space-y-6 pt-6 border-t border-[#2E3A2F]">
            <h3 className="font-technical text-xs font-bold text-white tracking-widest uppercase">
              COMO FUNCIONA O NOSSO DIAGNÓSTICO:
            </h3>
            <div className="space-y-4">
              {steps.map((st, i) => {
                const Icon = st.icon;
                return (
                  <div key={i} className="flex gap-4 p-4 border border-[#2E3A2F] bg-[#020202] rounded-sm group hover:border-[#FF0B0B] transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#2E3A2F] bg-black text-[#FF0B0B] group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-technical text-xs font-bold uppercase tracking-wider text-white">
                        {st.title}
                      </h4>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-5">
          <div className="border border-[#2E3A2F] bg-[#0a0a0a] rounded-sm p-6 sm:p-8 relative">
            <div className="absolute top-0 right-0 h-16 w-16 bg-red-600/[0.02] rounded-bl-full pointer-events-none" />

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[9px] font-technical text-[#2E3A2F] border border-[#2E3A2F] px-2 py-0.5 bg-black rounded-sm uppercase">
                    <Activity className="h-3 w-3 text-[#FF0B0B] animate-pulse" />
                    Agendar Diagnóstico Gratuito
                  </div>
                  <h2 className="text-lg font-technical font-bold uppercase tracking-wider text-white">
                    Solicitar Diagnóstico
                  </h2>
                  <p className="text-[11px] text-[#A1A1AA]">
                    Preencha o formulário para garantir sua vaga e agendar uma conversa gratuita e prática sobre a rotina da sua operação.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 border border-red-900 bg-red-950/20 rounded-sm text-xs text-red-400 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block font-technical text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Zacarias Ramos"
                      className="w-full h-10 rounded-sm border border-[#2E3A2F] bg-black px-3 font-technical text-xs text-white placeholder-[#52525B] focus:border-[#FF0B0B] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-technical text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                      Nome da Empresa / Projeto *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ex: Kraflo CMMS"
                      className="w-full h-10 rounded-sm border border-[#2E3A2F] bg-black px-3 font-technical text-xs text-white placeholder-[#52525B] focus:border-[#FF0B0B] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-technical text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                      Seu Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@empresa.com"
                      className="w-full h-10 rounded-sm border border-[#2E3A2F] bg-black px-3 font-technical text-xs text-white placeholder-[#52525B] focus:border-[#FF0B0B] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-technical text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                      WhatsApp / Telefone (Opcional)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+55 (11) 99999-9999"
                      className="w-full h-10 rounded-sm border border-[#2E3A2F] bg-black px-3 font-technical text-xs text-white placeholder-[#52525B] focus:border-[#FF0B0B] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-technical text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                      Fale um pouco sobre o que mais atrapalha o dia a dia da sua empresa (Opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Passamos muito tempo preenchendo planilhas à mão, relatórios demoram para ficar prontos..."
                      rows={3}
                      className="w-full rounded-sm border border-[#2E3A2F] bg-black p-3 font-technical text-xs text-white placeholder-[#52525B] focus:border-[#FF0B0B] focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-sm bg-[#FF0B0B] font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D60606] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando Solicitação...
                    </>
                  ) : (
                    <>
                      Agendar Conversa Gratuita
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm border border-[#2E3A2F] bg-[#020202]">
                  <Sparkles className="h-6 w-6 text-[#10B981]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-technical font-bold uppercase tracking-wider text-white">
                    Solicitação Recebida!
                  </h2>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-xs mx-auto">
                    Nossa equipe recebeu sua solicitação. Entraremos em contato em até **24 horas** pelo WhatsApp ou email informado para combinarmos o melhor horário para nossa conversa.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex h-9 items-center justify-center rounded-sm border border-[#2E3A2F] bg-black px-6 font-technical text-xs uppercase tracking-wider text-[#A1A1AA] hover:text-white transition-colors"
                  >
                    Enviar Outro
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
