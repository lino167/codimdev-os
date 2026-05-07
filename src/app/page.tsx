"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Activity, 
  Cpu, 
  Layers, 
  GitBranch, 
  Zap, 
  Terminal as TerminalIcon,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [simulationTime, setSimulationTime] = useState<string>("");
  const [latency, setLatency] = useState<number>(12);

  // Simular telemetria em tempo real
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSimulationTime(now.toTimeString().split(" ")[0]);
      setLatency(Math.floor(Math.random() * 8) + 8);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const techStack = [
    {
      name: "NEXT.JS",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1.066 12.186l-4.526-6.104v5.334H7.234V8.125h1.272l4.524 6.103V8.125h1.306v6.061h-1.27zm1.196-.447c-.522-.756-1.077-1.577-1.636-2.4l.872-1.232c.552.79 1.07 1.554 1.564 2.316l-.8 1.316z"/>
        </svg>
      )
    },
    {
      name: "SUPABASE",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#3ECF8E]" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.36 11.12h-7.14l3.19-8.4a.5.5 0 0 0-.8-.54L4.17 11.83a.5.5 0 0 0 .33.87h7.14l-3.19 8.4a.5.5 0 0 0 .8.54l12.44-9.65a.5.5 0 0 0-.33-.87z"/>
        </svg>
      )
    },
    {
      name: "TYPESCRIPT",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#3178C6]" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3h18v18H3V3zm11.53 10.42c-.22-.38-.56-.63-1.01-.77-.45-.13-1.03-.23-1.74-.29-.44-.04-.75-.11-.94-.21-.19-.1-.28-.27-.28-.51 0-.21.09-.37.28-.48.19-.11.49-.16.91-.16.42 0 .74.08.96.25.22.17.38.45.47.85h2.15c-.12-.91-.51-1.59-1.16-2.03-.65-.44-1.57-.66-2.75-.66-1.15 0-2.04.24-2.66.73-.62.49-.93 1.16-.93 2.01 0 .76.24 1.34.72 1.74.48.4 1.21.66 2.19.78.74.09 1.25.19 1.53.31.28.12.42.34.42.66 0 .28-.12.49-.37.63-.25.14-.64.21-1.16.21-.6 0-1.03-.11-1.29-.33-.26-.22-.44-.61-.54-1.17H7c.07 1.01.48 1.77 1.22 2.29.74.52 1.8.78 3.16.78 1.24 0 2.21-.26 2.91-.77.7-.51 1.05-1.25 1.05-2.21 0-.75-.27-1.34-.81-1.78z"/>
        </svg>
      )
    },
    {
      name: "TURBOPACK",
      logo: (
        <svg viewBox="0 0 256 256" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
          <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm0 216c-48.6 0-88-39.4-88-88s39.4-88 88-88 88 39.4 88 88-39.4 88-88 88z" fill="#0070F3"/>
          <path d="M152 72h-48l-32 56 32 56h48l32-56-32-56zm-12 84h-24l-14-28 14-28h24l14 28-14 28z" fill="#F81CE5"/>
        </svg>
      )
    },
    {
      name: "N8N",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#FF6C37]" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 8.5C.67 8.5 0 9.17 0 10v4c0 .83.67 1.5 1.5 1.5h1.59l4.5 4.5c.3.3.7.5 1.13.5h6.56c.43 0 .83-.2 1.13-.5l4.5-4.5h1.59c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5H21.2l-4.5-4.5c-.3-.3-.7-.5-1.13-.5H9.01c-.43 0-.83.2-1.13.5L3.38 8.5H1.5zm11.3 7.82V14h-1.6v2.32c-.52-.1-1.03-.31-1.48-.63l1.13-1.13c.24.11.51.18.79.19v-.75h-.75c0-.28-.07-.55-.19-.79l1.13-1.13c.32.45.53.96.63 1.48H14v1.6h-2.32c.1.52.31 1.03.63 1.48l-1.13 1.13c-.24-.11-.51-.18-.79-.19v.75h.75c0 .28.07.55.19.79l-1.13 1.13c-.32-.45-.53-.96-.63-1.48z"/>
        </svg>
      )
    },
    {
      name: "STRIPE",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#635BFF]" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.962 8.475c0-1.042-.716-1.558-1.921-1.558-1.217 0-2.316.483-3.216 1.058V3.275C9.9 2.767 11.233 2.5 12.566 2.5c3.208 0 5.375 1.542 5.375 4.542 0 4.691-6.191 3.958-6.191 6.041 0 .992.8 1.442 1.95 1.442 1.442 0 2.7-.583 3.65-1.2v4.8c-1.125.592-2.583.892-3.892.892-3.417 0-5.617-1.633-5.617-4.592.001-4.75 6.121-3.95 6.121-5.95z"/>
        </svg>
      )
    },
    {
      name: "TAILWIND CSS",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#38BDF8]" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 14.881 12 18 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 15.121 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 8.881 19 12 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.182 9.121 12 6.001 12z"/>
        </svg>
      )
    }
  ];

  const engineSteps = [
    {
      num: "01",
      name: "Signal Extraction",
      phase: "DISCOVERY & TELEMETRY",
      desc: "Mapeamos gargalos invisíveis no fluxo de dados de sua aplicação e identificamos onde a lentidão destrói sua taxa de conversão.",
      spec: "Mapeamento completo de rede, latência de servidores e comportamento do usuário final com ferramentas de telemetria customizadas.",
      icon: <Cpu className="h-5 w-5 text-[#FF0B0B]" />
    },
    {
      num: "02",
      name: "System Blueprint",
      phase: "ARCHITECTURE & DESIGN",
      desc: "Modelamos uma arquitetura sob medida, removendo redundâncias e projetando um design de alta densidade no padrão Dark Tech-Modernist.",
      spec: "Estruturação de bancos de dados otimizados, fluxos de autenticação ultra seguros e esquemas modulares reutilizáveis.",
      icon: <Layers className="h-5 w-5 text-[#FF0B0B]" />
    },
    {
      num: "03",
      name: "Precision Build",
      phase: "SOFTWARE ENGINEERING",
      desc: "Desenvolvemos sua plataforma de forma determinística utilizando Next.js, TypeScript e bancos de dados em tempo real no Supabase.",
      spec: "Geração estática estrita, compilação de código otimizada com Turbopack e 100% livre de avisos de validação.",
      icon: <TerminalIcon className="h-5 w-5 text-[#FF0B0B]" />
    },
    {
      num: "04",
      name: "Scale Protocol",
      phase: "PIPELINES & AUTOMATION",
      desc: "Implantamos fluxos contínuos de deploy com pipelines de automação eficientes e telemetria ativa para monitoramento 24/7.",
      spec: "Integração instantânea com webhooks, logs em tempo real e relatórios automatizados de integridade operacional.",
      icon: <GitBranch className="h-5 w-5 text-[#FF0B0B]" />
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF0B0B] selection:text-white flex flex-col">
      {/* Header */}
      <PublicHeader />

      <main className="overflow-x-hidden w-full max-w-full flex-1">
        
        {/* Cinematic Center Hero */}
        <section className="relative py-24 md:py-36 border-b border-[#2E3A2F] flex flex-col items-center justify-center">
          {/* Grid de Pontos Industrial e Gradiente Cinematográfico */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#2e3a2f_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-25 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF0B0B]/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="mx-auto max-w-6xl px-4 text-center relative z-10 flex flex-col items-center">
            {/* Tag de Telemetria Ativa */}
            <div className="inline-flex items-center gap-2 border border-[#2E3A2F] bg-[#0a0a0a] px-3.5 py-1.5 rounded-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0B0B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0B0B]"></span>
              </span>
              <span className="font-technical text-[10px] text-[#A1A1AA] tracking-widest uppercase">
                ENGINE RUNNING // LATENCY: {latency}MS // {simulationTime || "ACTIVE"}
              </span>
            </div>

            {/* H1 - Iron Rule of 2 Lines */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-medium leading-[1.08] tracking-tight max-w-5xl">
              Sistemas digitais de alta precisão que{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF0B0B] font-semibold">
                convertem e escalam
              </span>
              <span className="inline-block w-14 sm:w-20 h-6 sm:h-9 rounded-full align-middle bg-cover bg-center mx-2 border border-[#FF0B0B]/30 grayscale opacity-80" style={{backgroundImage: 'url("https://picsum.photos/seed/tech/400/200")'}}></span>
              sem falhas técnicas.
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#A1A1AA] leading-relaxed mt-8">
              Unimos o pragmatismo e precisão mecânica do chão de fábrica com engenharia de software de elite para blindar sua operação digital contra lentidão e ineficiência técnica.
            </p>

            {/* CTAs de Alto Contraste */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full sm:w-auto">
              <Link
                href="/diagnostico"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#FF0B0B] px-8 font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D60606] transition-all shadow-[0_0_20px_rgba(255,11,11,0.3)] group"
              >
                Garantir Diagnóstico Gratuito
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
        </section>

        {/* Infinite Tech Marquee */}
        <div className="bg-[#020202] border-b border-[#2E3A2F] py-4 overflow-hidden relative w-full flex items-center">
          <div className="flex gap-16 whitespace-nowrap animate-marquee">
            {Array(4).fill(techStack).flat().map((tech, i) => (
              <span key={i} className="font-technical text-[10px] font-bold text-text-secondary tracking-widest uppercase flex items-center gap-2">
                {tech.logo}
                {tech.name}
              </span>
            ))}
          </div>
          <style jsx global>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: inline-flex;
              animation: marquee 40s linear infinite;
            }
          `}</style>
        </div>

        {/* Interactive Engine Bento Grid Section */}
        <section className="py-24 bg-black relative border-b border-[#2E3A2F]">
          <div className="mx-auto max-w-6xl px-4 w-full">
            <div className="max-w-3xl mb-16 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF0B0B] animate-pulse" />
                <span className="font-technical text-[10px] text-[#FF0B0B] tracking-widest uppercase font-bold">
                  METODOLOGIA PROPRIETÁRIA
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight">
                CodimDev Engine™: O Protocolo de Precisão
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
                Nossa esteira técnica de engenharia elimina a adivinhação. Cada fase funciona como uma engrenagem sincronizada para extrair o máximo potencial do seu ativo digital.
              </p>
            </div>

            {/* Gapless Bento Grid Mathematically Structured */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-flow-dense gap-4">
              
              {/* Card 01 - Extraction */}
              <div className="md:col-span-2 md:row-span-1 border border-[#2E3A2F] bg-surface p-6 flex flex-col justify-between hover:border-[#FF0B0B]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#FF0B0B]/[0.01] rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-technical text-2xl font-bold text-text-muted">01</span>
                    <Cpu className="h-5 w-5 text-text-muted group-hover:text-[#FF0B0B] transition-colors" />
                  </div>
                  <h3 className="font-technical text-sm font-bold uppercase tracking-wider text-white">Signal Extraction</h3>
                  <span className="font-technical text-[9px] text-[#FF0B0B] tracking-wider uppercase block mt-1">DISCOVERY & TELEMETRY</span>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    Mapeamos gargalos invisíveis no fluxo de dados de sua aplicação e identificamos onde a lentidão destrói sua conversão.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between">
                  <span className="font-technical text-[9px] text-text-muted">TELEMETRY ANALYTICS APIS</span>
                  <span className="font-technical text-[9px] text-primary font-bold">100% OPERACIONAL</span>
                </div>
              </div>

              {/* Card 02 - Blueprint */}
              <div className="md:col-span-2 md:row-span-1 border border-[#2E3A2F] bg-surface p-6 flex flex-col justify-between hover:border-[#FF0B0B]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#FF0B0B]/[0.01] rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-technical text-2xl font-bold text-text-muted">02</span>
                    <Layers className="h-5 w-5 text-text-muted group-hover:text-[#FF0B0B] transition-colors" />
                  </div>
                  <h3 className="font-technical text-sm font-bold uppercase tracking-wider text-white">System Blueprint</h3>
                  <span className="font-technical text-[9px] text-[#FF0B0B] tracking-wider uppercase block mt-1">ARCHITECTURE & DESIGN</span>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    Modelamos uma arquitetura sob medida, removendo redundâncias e projetando um design de alta densidade no padrão Dark Tech-Modernist.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between">
                  <span className="font-technical text-[9px] text-text-muted">POSTGRES & RLS DESIGN</span>
                  <span className="font-technical text-[9px] text-primary font-bold">PREPARADO</span>
                </div>
              </div>

              {/* Card 03 - Precision Build */}
              <div className="md:col-span-2 md:row-span-1 border border-[#2E3A2F] bg-surface p-6 flex flex-col justify-between hover:border-[#FF0B0B]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#FF0B0B]/[0.01] rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-technical text-2xl font-bold text-text-muted">03</span>
                    <TerminalIcon className="h-5 w-5 text-text-muted group-hover:text-[#FF0B0B] transition-colors" />
                  </div>
                  <h3 className="font-technical text-sm font-bold uppercase tracking-wider text-white">Precision Build</h3>
                  <span className="font-technical text-[9px] text-[#FF0B0B] tracking-wider uppercase block mt-1">SOFTWARE ENGINEERING</span>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    Desenvolvemos sua plataforma utilizando Next.js, TypeScript e bancos de dados em tempo real no Supabase, garantindo código otimizado.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between">
                  <span className="font-technical text-[9px] text-text-muted">NEXT.JS 14 APP ROUTER</span>
                  <span className="font-technical text-[9px] text-primary font-bold">ESTÁVEL</span>
                </div>
              </div>

              {/* Card 04 - Scale Protocol */}
              <div className="md:col-span-2 md:row-span-1 border border-[#2E3A2F] bg-surface p-6 flex flex-col justify-between hover:border-[#FF0B0B]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#FF0B0B]/[0.01] rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-technical text-2xl font-bold text-text-muted">04</span>
                    <GitBranch className="h-5 w-5 text-text-muted group-hover:text-[#FF0B0B] transition-colors" />
                  </div>
                  <h3 className="font-technical text-sm font-bold uppercase tracking-wider text-white">Scale Protocol</h3>
                  <span className="font-technical text-[9px] text-[#FF0B0B] tracking-wider uppercase block mt-1">PIPELINES & AUTOMATION</span>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    Implantamos fluxos contínuos de deploy com pipelines de automação eficientes e telemetria ativa para monitoramento 24/7.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between">
                  <span className="font-technical text-[9px] text-text-muted">CI/CD PIPELINES & TURBOPACK</span>
                  <span className="font-technical text-[9px] text-primary font-bold">ATIVO</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Interactive CodimDev OS™ Desire Section */}
        <section className="py-24 bg-[#020202] relative border-b border-[#2E3A2F]">
          <div className="mx-auto max-w-6xl px-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-1.5 text-[9px] font-technical text-primary border border-primary/20 px-2 py-0.5 bg-[#FF0B0B]/5 rounded-sm">
                  <Activity className="h-3 w-3 text-primary animate-pulse" />
                  SYSTEM_DOGFOODING // OS_ACTIVE
                </div>
                <h3 className="text-3xl sm:text-4xl font-display font-medium leading-tight">
                  Nós rodamos nossa operação sobre a nossa própria tecnologia.
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  Não somos apenas programadores. Nós construímos o **CodimDev OS**, um sistema operacional privado de alta densidade que gerencia nossas automações, CRM e faturamento, provando nossa autoridade no "chão de fábrica" digital.
                </p>
                <div className="pt-4">
                  <Link
                    href="/diagnostico"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-[#FF0B0B] px-6 font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D60606] transition-all"
                  >
                    Mapear Gargalos de Sua Operação
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Simulated Live Admin Terminal/Screen */}
              <div className="lg:col-span-7 border border-[#2E3A2F] bg-black rounded-sm p-6 relative min-h-[350px] flex flex-col justify-between hover:border-border-focus transition-all duration-300">
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-600/30" />
                  <span className="h-2 w-2 rounded-full bg-green-500/30" />
                  <span className="h-2 w-2 rounded-full bg-[#FF0B0B] animate-pulse" />
                </div>

                <div className="space-y-6">
                  <div className="border-b border-[#2E3A2F] pb-3 flex items-center justify-between">
                    <span className="font-technical text-[10px] text-white tracking-widest font-bold">CODIMDEV_OS // LIVE TELEMETRY</span>
                    <span className="font-technical text-[9px] text-[#FF0B0B] animate-pulse font-bold">ONLINE</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-[#2E3A2F] p-3 bg-surface/50">
                      <span className="font-technical text-[9px] text-text-muted block">PIPELINES DEPLOYED</span>
                      <span className="font-technical text-xl font-bold text-white mt-1 block">148</span>
                      <span className="font-technical text-[8px] text-[#10B981] mt-1 block">99.2% SUCCESS RATE</span>
                    </div>
                    <div className="border border-[#2E3A2F] p-3 bg-surface/50">
                      <span className="font-technical text-[9px] text-text-muted block">ACTIVE AUTOMATIONS</span>
                      <span className="font-technical text-xl font-bold text-white mt-1 block">24/7</span>
                      <span className="font-technical text-[8px] text-primary mt-1 block">LATENCY &lt; 15MS</span>
                    </div>
                  </div>

                  {/* Terminal Log Output */}
                  <div className="font-technical text-[10px] bg-black border border-[#2E3A2F] p-3.5 text-text-secondary flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-[#10B981] font-bold">[OK]</span>
                      <span>Stripe: Webhook faturamento processado com sucesso.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#10B981] font-bold">[OK]</span>
                      <span>n8n: Lead de auditoria sincronizado com o banco Supabase.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#FF0B0B] font-bold animate-pulse">[WARN]</span>
                      <span>Turbopack: Recompilação automática de assets concluída em 312ms.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2E3A2F] flex justify-between font-technical text-[9px] text-text-muted">
                  <span>SYSTEM VERSION: v1.0.4-STABLE</span>
                  <span>LOCATION: CODIMDEV_SERVER_CORE</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Conversion Action Section */}
        <section className="py-24 bg-black relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(#2e3a2f_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
          <div className="mx-auto max-w-4xl px-4 text-center relative z-10 flex flex-col items-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight max-w-2xl leading-tight">
              Pronto para blindar sua operação contra falhas?
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-xl">
              Solicite nosso Diagnóstico Operacional Gratuito de 30 minutos. Analisamos de ponta a ponta seus gargalos de sistema, lentidões de banco de dados e fluxos de trabalho manuais ineficientes.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/diagnostico"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#FF0B0B] px-8 font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D60606] transition-all shadow-[0_0_20px_rgba(255,11,11,0.25)]"
              >
                Garantir Meu Diagnóstico Gratuito
                <Sparkles className="h-4 w-4 animate-pulse" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
