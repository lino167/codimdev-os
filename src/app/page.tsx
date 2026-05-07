"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Activity, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const metrics = [
    { value: "+24", label: "PROJETOS DE ELITE ENTREGUES", desc: "Sistemas robustos de alta tração operacional." },
    { value: "100/100", label: "AUDITORIA LIGHTHOUSE", desc: "Performance, acessibilidade e SEO impecáveis." },
    { value: "+37%", label: "CONVERSÃO MÉDIA ALCANÇADA", desc: "UX orientada a dados e livre de fricção." }
  ];

  const engineSteps = [
    {
      num: "01",
      name: "Signal Extraction",
      phase: "DISCOVERY & TELEMETRY",
      desc: "Mapeamos gargalos invisíveis no fluxo de dados de sua aplicação e identificamos onde a lentidão destrói sua taxa de conversão.",
      spec: "Mapeamento completo de rede, latência de servidores e comportamento do usuário final com ferramentas de telemetria customizadas."
    },
    {
      num: "02",
      name: "System Blueprint",
      phase: "ARCHITECTURE & DESIGN",
      desc: "Modelamos uma arquitetura sob medida, removendo redundâncias e projetando um design de alta densidade no padrão Dark Tech-Modernist.",
      spec: "Estruturação de bancos de dados otimizados, fluxos de autenticação ultra seguros e esquemas modulares reutilizáveis."
    },
    {
      num: "03",
      name: "Precision Build",
      phase: "SOFTWARE ENGINEERING",
      desc: "Desenvolvemos sua plataforma de forma determinística utilizando Next.js, TypeScript e bancos de dados em tempo real no Supabase.",
      spec: "Geração estática estrita, compilação de código otimizada com Turbopack e 100% livre de avisos de validação."
    },
    {
      num: "04",
      name: "Scale Protocol",
      phase: "PIPELINES & AUTOMATION",
      desc: "Implantamos fluxos contínuos de deploy com pipelines de automação eficientes e telemetria ativa para monitoramento 24/7.",
      spec: "Integração instantânea com webhooks, logs em tempo real e relatórios automatizados de integridade operacional."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF0B0B] selection:text-white flex flex-col">
      {/* Header */}
      <PublicHeader />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center relative py-20 lg:py-32 overflow-hidden border-b border-[#2E3A2F]">
        {/* Background Dot Grid Matrix and Gradients */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#2e3a2f_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 border border-[#2E3A2F] bg-[#0a0a0a] px-3 py-1.5 rounded-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0B0B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0B0B]"></span>
              </span>
              <span className="font-technical text-[10px] text-[#A1A1AA] tracking-widest uppercase">
                CodimDev Engine™ v1.0 — Ativo e Sincronizado
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl font-display font-medium leading-tight tracking-tight">
              Projetos digitais que <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-red-500 font-semibold">convertem e escalam.</span> <br />
              <span className="font-technical text-2xl sm:text-4xl text-[#FF0B0B] font-bold block mt-3 tracking-wide uppercase">
                De Landing Pages a Plataformas SaaS.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
              Unimos o pragmatismo e precisão mecânica do chão de fábrica com engenharia de software de elite para blindar seu negócio contra falhas e ineficiência técnica.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/diagnostico"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#FF0B0B] px-8 font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D60606] transition-all shadow-[0_0_20px_rgba(255,11,11,0.25)] group"
              >
                Diagnóstico Gratuito
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/portfolio"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-sm border border-[#2E3A2F] bg-black px-8 font-technical text-xs uppercase tracking-wider text-[#A1A1AA] hover:border-white hover:text-white transition-all"
              >
                Ver Portfólio
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Metrics Strip */}
      <section className="bg-[#020202] border-b border-[#2E3A2F] py-12 relative">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {metrics.map((metric, i) => (
              <div 
                key={i} 
                className="border border-[#2E3A2F] bg-black p-6 rounded-sm relative overflow-hidden group hover:border-[#FF0B0B] transition-colors"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-red-600/[0.02] rounded-bl-full pointer-events-none" />
                <div className="font-technical text-3xl font-extrabold text-[#FF0B0B] tracking-tight mb-2">
                  {metric.value}
                </div>
                <div className="font-technical text-[11px] font-bold text-white tracking-widest uppercase mb-1">
                  {metric.label}
                </div>
                <div className="text-xs text-[#A1A1AA]">
                  {metric.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Engine Section */}
      <section className="py-20 bg-black relative border-b border-[#2E3A2F]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF0B0B] animate-pulse" />
              <span className="font-technical text-[10px] text-[#FF0B0B] tracking-widest uppercase">
                Metodologia Proprietária
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-medium">
              CodimDev Engine™: O Protocolo de Precisão
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
              Garantimos excelência em todas as fases da construção do seu sistema. Navegue interativamente pelos módulos operacionais de nossa engrenagem técnica:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Step Buttons */}
            <div className="lg:col-span-5 space-y-3">
              {engineSteps.map((step, idx) => (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full flex items-center justify-between p-5 rounded-sm border transition-all text-left group ${
                    activeStep === idx
                      ? "border-[#FF0B0B] bg-[#0a0a0a]"
                      : "border-[#2E3A2F] bg-black hover:border-[#FF0B0B]/50 hover:bg-black/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-technical text-xs font-bold ${activeStep === idx ? "text-[#FF0B0B]" : "text-[#52525B]"}`}>
                      {step.num}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-technical text-xs font-bold uppercase tracking-wider text-white">
                        {step.name}
                      </span>
                      <span className="text-[10px] text-[#A1A1AA] tracking-wider uppercase font-technical leading-none mt-1">
                        {step.phase}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    activeStep === idx ? "text-[#FF0B0B] translate-x-1" : "text-[#52525B] group-hover:text-white"
                  }`} />
                </button>
              ))}
            </div>

            {/* Display Screen */}
            <div className="lg:col-span-7 border border-[#2E3A2F] bg-[#020202] rounded-sm p-8 relative min-h-[300px] flex flex-col justify-between">
              {/* Decorative Screen Dots */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-600/20" />
                <span className="h-2 w-2 rounded-full bg-green-500/20" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/20 animate-pulse" />
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 text-[9px] font-technical text-[#2E3A2F] border border-[#2E3A2F] px-2 py-0.5 bg-black rounded-sm">
                  <Activity className="h-3 w-3 text-[#FF0B0B] animate-pulse" />
                  STATION_ACTIVE // PHASE_{engineSteps[activeStep].num}
                </div>

                <div className="space-y-3">
                  <h3 className="font-technical text-lg font-bold uppercase tracking-wider text-[#FF0B0B]">
                    {engineSteps[activeStep].name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white leading-relaxed">
                    {engineSteps[activeStep].desc}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#2E3A2F] bg-black/40 p-4 rounded-sm">
                <div className="font-technical text-[10px] text-[#52525B] uppercase tracking-wider mb-2">
                  ESPECIFICAÇÃO TÉCNICA DO MÓDULO
                </div>
                <p className="font-technical text-[11px] text-[#A1A1AA] leading-relaxed">
                  {engineSteps[activeStep].spec}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-[#020202] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#2e3a2f_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full relative z-10 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-medium">
              Pronto para blindar sua operação?
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Solicite um diagnóstico operacional gratuito para mapear gargalos de fluxo, lentidão de código e automatizar sua operação física ou digital.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/diagnostico"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#FF0B0B] px-8 font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D60606] transition-all"
              >
                Garantir Meu Diagnóstico Gratuito
                <Sparkles className="h-4 w-4 animate-pulse" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-sm border border-[#2E3A2F] bg-black px-8 font-technical text-xs uppercase tracking-wider text-[#A1A1AA] hover:text-white transition-all"
              >
                Acessar Área de Controle
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
