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
import UnicornBackground from "@/components/public/UnicornBackground";

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
    <div className="bg-[#050505] text-white min-h-screen relative overflow-x-hidden flex flex-col selection:bg-primary/30 font-display">

      {/* ==========================================
          1. AMBIENT GLOWS & UNICORN BACKGROUND
          ========================================== */}
      <UnicornBackground projectId="vTTCp5g4cVl9nwjlT56Z" hueRotate={90} opacity={0.6} />

      {/* Feixes Diagonais Técnicos */}
      <div className="fixed top-0 right-0 w-[120vw] h-[120vh] pointer-events-none -z-10 overflow-hidden transform translate-x-[10%] -translate-y-[10%]">
        <div className="absolute w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-[38deg]">
          <div className="absolute top-[5%] right-[25%] w-[120px] h-[150%] bg-gradient-to-b from-transparent via-[#FF0B0B]/20 to-transparent blur-[24px]" />
          <div className="absolute top-[-5%] right-[32%] w-[180px] h-[150%] bg-gradient-to-b from-transparent via-[#FF0B0B]/30 to-transparent blur-[32px]" />
          <div className="absolute top-[15%] right-[42%] w-[140px] h-[150%] bg-gradient-to-b from-transparent via-[#5C3822]/30 to-transparent blur-[20px]" />
        </div>
      </div>

      <PublicHeader />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        {/* Content Side */}
        <div className="lg:col-span-7 space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-technical text-neutral-400 uppercase tracking-widest">
              Diagnóstico Operacional — 100% Gratuito e Prático
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.1]">
            Pare de perder tempo com <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              processos manuais e lentos.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
            A CodimDev cria softwares, sistemas e automações sob medida para organizar o dia a dia da sua empresa. Eliminamos planilhas confusas, trabalhos repetitivos e erros humanos que travam o seu crescimento. Vamos mapear os problemas da sua operação de forma rápida e desenhar a solução perfeita sem custos.
          </p>

          {/* Steps Detailed */}
          <div className="space-y-6 pt-10 border-t border-white/5">
            <h3 className="font-technical text-xs font-bold text-white tracking-widest uppercase">
              COMO FUNCIONA O NOSSO DIAGNÓSTICO:
            </h3>
            <div className="space-y-4">
              {steps.map((st, i) => {
                const Icon = st.icon;
                return (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black text-white group-hover:text-primary transition-colors">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-technical text-xs font-bold uppercase tracking-wider text-white">
                        {st.title}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed font-light">
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
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="w-full max-w-md p-8 bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-red-600/[0.02] rounded-bl-full pointer-events-none" />

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 mb-6">
                  <div className="inline-flex items-center gap-1.5 text-[9px] font-technical text-neutral-400 border border-white/10 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full uppercase">
                    <Activity className="h-3 w-3 text-primary animate-pulse" />
                    Agendar Diagnóstico Gratuito
                  </div>
                  <h2 className="text-xl font-technical font-bold uppercase tracking-wider text-white">
                    Solicitar Diagnóstico
                  </h2>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                    Preencha o formulário para garantir sua vaga e agendar uma conversa gratuita e prática sobre a rotina da sua operação.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 border border-red-900 bg-red-950/20 rounded-xl text-xs text-red-400 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block font-technical text-[9px] text-neutral-400 uppercase tracking-wider mb-1.5">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Zacarias Ramos"
                      className="w-full h-11 rounded-xl bg-black border border-white/15 focus:border-primary text-white px-4 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
                    />
                  </div>

                  <div>
                    <label className="block font-technical text-[9px] text-neutral-400 uppercase tracking-wider mb-1.5">
                      Nome da Empresa / Projeto *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ex: Kraflo CMMS"
                      className="w-full h-11 rounded-xl bg-black border border-white/15 focus:border-primary text-white px-4 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
                    />
                  </div>

                  <div>
                    <label className="block font-technical text-[9px] text-neutral-400 uppercase tracking-wider mb-1.5">
                      Seu Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@empresa.com"
                      className="w-full h-11 rounded-xl bg-black border border-white/15 focus:border-primary text-white px-4 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
                    />
                  </div>

                  <div>
                    <label className="block font-technical text-[9px] text-neutral-400 uppercase tracking-wider mb-1.5">
                      WhatsApp / Telefone (Opcional)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+55 (11) 99999-9999"
                      className="w-full h-11 rounded-xl bg-black border border-white/15 focus:border-primary text-white px-4 text-xs outline-none transition-all duration-100 placeholder-[#52525B]"
                    />
                  </div>

                  <div>
                    <label className="block font-technical text-[9px] text-neutral-400 uppercase tracking-wider mb-1.5">
                      O que mais atrapalha o seu negócio? (Opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Passamos muito tempo preenchendo planilhas manuais..."
                      rows={3}
                      className="w-full rounded-xl bg-black border border-white/15 p-4 text-xs text-white placeholder-[#52525B] focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-technical text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,11,11,0.2)]"
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
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black">
                  <Sparkles className="h-6 w-6 text-[#10B981]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-technical font-bold uppercase tracking-wider text-white">
                    Solicitação Recebida!
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto font-light">
                    Nossa equipe recebeu sua solicitação. Entraremos em contato em até **24 horas** pelo WhatsApp ou email informado para combinarmos o melhor horário para nossa conversa.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-black px-6 font-technical text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
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
