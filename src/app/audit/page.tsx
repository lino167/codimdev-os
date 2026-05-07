"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Loader2, 
  DollarSign, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function SaasAuditPage() {
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
            value: 1997,
            source: "saas_audit",
            notes: `Gargalo Relatado: ${notes}`,
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

  const auditBenefits = [
    "Identificação exata de gargalos de rede e latência de servidor.",
    "Mapeamento de quebras de conversão e atrito de experiência (UX).",
    "Auditoria rigorosa de segurança contra invasões e brechas de dados.",
    "Relatório definitivo com plano de ação acionável em formato de Blueprint.",
    "Garantia Incondicional de Reembolso caso nada relevante seja identificado."
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
              Diagnóstico Operacional de 72 horas
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-medium leading-tight">
            Sua infraestrutura está <span className="text-[#FF0B0B] font-semibold">matando sua tração?</span>
          </h1>

          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl">
            Sistemas lentos e interfaces confusas aumentam o churn e reduzem suas vendas. O **SaaS Audit™** é uma radiografia técnica rigorosa executada sob demanda.
          </p>

          {/* Core Info Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="border border-[#2E3A2F] bg-[#020202] p-4 rounded-sm">
              <Clock className="h-5 w-5 text-[#FF0B0B] mb-2" />
              <div className="font-technical text-[10px] font-bold text-[#A1A1AA] tracking-wider uppercase">Entrega</div>
              <div className="text-xs font-bold mt-1">EM APENAS 72 HORAS</div>
            </div>
            <div className="border border-[#2E3A2F] bg-[#020202] p-4 rounded-sm">
              <DollarSign className="h-5 w-5 text-[#FF0B0B] mb-2" />
              <div className="font-technical text-[10px] font-bold text-[#A1A1AA] tracking-wider uppercase">Preço Único</div>
              <div className="text-xs font-bold mt-1">R$ 1.997 à vista</div>
            </div>
            <div className="border border-[#2E3A2F] bg-[#020202] p-4 rounded-sm">
              <ShieldCheck className="h-5 w-5 text-[#10B981] mb-2" />
              <div className="font-technical text-[10px] font-bold text-[#A1A1AA] tracking-wider uppercase">Garantia</div>
              <div className="text-xs font-bold mt-1">100% REEMBOLSÁVEL</div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-4 pt-4 border-t border-[#2E3A2F]">
            <h3 className="font-technical text-xs font-bold text-white tracking-widest uppercase">
              O QUE ESTÁ INCLUÍDO NO ESCOPO DO DIAGNÓSTICO:
            </h3>
            <ul className="space-y-3">
              {auditBenefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-[#2E3A2F] bg-[#0a0a0a]">
                    <Check className="h-3 w-3 text-[#FF0B0B]" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
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
                    Solicitação de Entrada
                  </div>
                  <h2 className="text-lg font-technical font-bold uppercase tracking-wider text-white">
                    Garantir Meu Audit™
                  </h2>
                  <p className="text-[11px] text-[#A1A1AA]">
                    Preencha o formulário técnico abaixo para iniciar sua extração de sinal.
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
                      Nome do Solicitante *
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
                      Email Corporativo *
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
                      Principais Sintomas / Gargalo (Opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Lentidão no carregamento, quebra de pagamentos ou vazamento de dados..."
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
                      Processando Entrada...
                    </>
                  ) : (
                    <>
                      Enviar Solicitação de Audit™
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
                    Solicitação Registrada!
                  </h2>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-xs mx-auto">
                    A extração de sinal foi iniciada. Nós entraremos em contato nas próximas **24 horas** no email cadastrado para agendar o início do diagnóstico.
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
