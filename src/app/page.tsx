"use client";

import { useState, useEffect, useRef } from "react";
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
  ArrowUpRight,
  Database,
  Workflow,
  Layout
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw active connections
      ctx.strokeStyle = "rgba(46, 58, 47, 0.2)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing precision particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 11, 11, 0.35)";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const techStack = [
    {
      name: "NEXT.JS",
      logo: (
        <svg viewBox="0 0 128 128" className="w-4.5 h-4.5 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M64 0C28.66 0 0 28.66 0 64s28.66 64 64 64 64-28.66 64-64S99.34 0 64 0zm37.6 96.4L58.12 40.16h-5.6v47.68h4.64V47.36l38.24 53.6c2.08-1.44 4.08-3.04 5.6-4.56zm4.8-12.8V40.16h-4.64V80l4.64 3.6z"/>
        </svg>
      )
    },
    {
      name: "SUPABASE",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
          <path fill="#3ECF8E" d="M21.362 11.104h-7.143l3.19-8.4a.5.5 0 0 0-.8-.543L4.172 11.815a.5.5 0 0 0 .33.869h7.143l-3.19 8.4a.5.5 0 0 0 .8.543l12.438-9.654a.5.5 0 0 0-.33-.869z"/>
        </svg>
      )
    },
    {
      name: "TYPESCRIPT",
      logo: (
        <svg viewBox="0 0 128 128" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 1.5h125v125H1.5z" fill="#3178c6"/>
          <path d="M117.2 96.6c-1.5-2.2-4.1-3.6-7.7-4.1-3.7-.6-8.5-.8-14.4-.8-3.6 0-6.2.6-7.8 1.7-1.6 1.1-2.4 2.8-2.4 5.1 0 2.1.8 3.7 2.3 4.8 1.5 1.1 4.1 1.7 7.7 1.8l12.6.4c5.9.2 10.5 1.4 13.9 3.5 3.4 2.1 5.1 5.7 5.1 10.7 0 5.4-2.1 9.5-6.3 12.3-4.2 2.8-10.4 4.2-18.5 4.2-8.5 0-14.9-1.5-19.3-4.5-4.4-3-6.8-8-7.2-15h17.9c.3 2.7 1.4 4.8 3.3 6.1 1.9 1.3 5 1.9 9.3 1.9 3.9 0 6.6-.5 8.1-1.5s2.2-2.5 2.2-4.5c0-1.9-.7-3.3-2.1-4.2-1.4-.9-3.9-1.5-7.5-1.6l-12.7-.4c-5.7-.2-10.2-1.3-13.3-3.4-3.1-2.1-4.7-5.5-4.7-10.3 0-5 2-8.9 5.9-11.6s10-4.1 18.2-4.1c7.7 0 13.7 1.3 18 3.9s6.6 6.9 6.9 12.9H117.2zm-67.7-1.8H31.6v45.4H13.1V94.8h-18v-15H49.5v15z" fill="#fff"/>
        </svg>
      )
    },
    {
      name: "TURBOPACK",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg" fill="none">
          <path d="M12 2L2 14h9l-2 8 10-12h-9l2-8z" fill="url(#turbo-gradient)" stroke="#FF007A" strokeWidth="1" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="turbo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF007A" />
              <stop offset="100%" stopColor="#7928CA" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      name: "N8N",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FF6C37" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1.75 6.25a.75.75 0 0 0-1.5 0v3.086l-2.18-2.18a.75.75 0 1 0-1.06 1.06l3.47 3.47a.75.75 0 0 0 1.06 0l3.47-3.47a.75.75 0 1 0-1.06-1.06l-2.18 2.18V8.25zm-3.5 7.5a.75.75 0 0 1 1.5 0v-3.086l2.18 2.18a.75.75 0 1 1 1.06-1.06l-3.47-3.47a.75.75 0 0 1-1.06 0l-3.47 3.47a.75.75 0 1 1 1.06 1.06l2.18-2.18v3.086z" clipRule="evenodd"/>
        </svg>
      )
    },
    {
      name: "STRIPE",
      logo: (
        <svg viewBox="0 0 40 16" className="w-9 h-4.5" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.686 6.304C4.686 5.158 5.485 4.7 6.824 4.7c1.353 0 2.574.532 3.574 1.164V1.063C9.398.508 7.915.215 6.42.215 2.854.215.41 1.91.41 5.222c0 5.161 6.88 4.357 6.88 6.645 0 1.092-.885 1.583-2.167 1.583-1.603 0-3-.642-4.055-1.32v5.121c1.25.653 2.871.982 4.324.982 3.797 0 6.242-1.796 6.242-5.052 0-5.226-6.884-4.354-6.884-6.877zM18.81 12.06c.451-.013.784-.044.784-.044v3.541s-.493.125-1.127.125c-1.332 0-1.897-.681-1.897-1.879V5.203h-2.115V1.272h2.115V.04l4.316-1.29v2.522h2.247v3.931h-2.247v5.334c0 .445.197.625.592.625.432 0 .911-.088.911-.088zm4.417-6.857h4.093v1.89s1.085-2.292 3.763-2.292c.559 0 1.083.09 1.083.09v4.208s-.701-.157-1.425-.157c-2.152 0-3.418 1.25-3.418 3.548v5.529h-4.096V5.203zm10.155-2.73a1.472 1.472 0 1 1-.002-2.943 1.472 1.472 0 0 1 .002 2.943zm-2.047 2.73h4.096v12.812h-4.096V5.203zM40 9.2c0-2.853-2.11-4.341-4.784-4.341-1.31 0-2.522.42-3.418 1.09V.052L27.7.99v17.025h4.096v-1.774s1.248 2.049 3.826 2.049C38.16 18.29 40 16.481 40 13.593V9.2zm-4.096 4.317c0 1.053-.611 1.7-1.644 1.7-1.223 0-2.078-1.022-2.078-2.316v-2.045c0-1.293.855-2.315 2.078-2.315 1.033 0 1.644.646 1.644 1.7v3.276z" fill="#635BFF"/>
        </svg>
      )
    },
    {
      name: "TAILWIND CSS",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 3.2c-2.4 0-4.8 1.2-4.8 3.6 0 2.4 2.4 2.4 2.4 4.8 0 2.4-2.4 2.4-2.4 4.8 0 2.4 2.4 3.6 4.8 3.6 2.4 0 4.8-1.2 4.8-3.6 0-2.4-2.4-2.4-2.4-4.8 0-2.4 2.4-2.4 2.4-4.8 0-2.4-2.4-3.6-4.8-3.6zm-6 7.2c-2.4 0-4.8 1.2-4.8 3.6 0 2.4 2.4 2.4 2.4 4.8 0 2.4-2.4 2.4-2.4 4.8 0 2.4 2.4 3.6 4.8 3.6 2.4 0 4.8-1.2 4.8-3.6 0-2.4-2.4-2.4-2.4-4.8 0-2.4 2.4-2.4 2.4-4.8 0-2.4-2.4-3.6-4.8-3.6z" fill="#38BDF8"/>
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
        <section className="relative py-28 md:py-40 border-b border-[#2E3A2F] flex flex-col items-center justify-center overflow-hidden">
          {/* Grid de Pontos Industrial e Gradiente Cinematográfico Ativo */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#2e3a2f_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-25 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FF0B0B]/5 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
          
          {/* Laser Scanline Animated */}
          <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF0B0B]/30 to-transparent pointer-events-none" style={{ animation: 'scanline 10s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />



          <div className="mx-auto max-w-6xl px-4 text-center relative z-10 flex flex-col items-center">
            {/* Tag de Telemetria Ativa - Fade up 1 */}
            <div className="inline-flex items-center gap-2 border border-[#2E3A2F] bg-[#0a0a0a] px-3.5 py-1.5 rounded-sm mb-8 animate-fade-up-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0B0B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0B0B]"></span>
              </span>
              <span className="font-technical text-[10px] text-[#A1A1AA] tracking-widest uppercase font-bold">
                SISTEMAS SOB MEDIDA // OPERAÇÃO CENTRALIZADA // AUTOMAÇÃO ATIVA
              </span>
            </div>

            {/* H1 - Balanced and Impactful - Fade up 2 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-[1.15] tracking-tight max-w-4xl animate-fade-up-2">
              Construímos os sistemas e{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF0B0B] font-semibold">
                automações sob medida
              </span>
              <span className="inline-block w-10 sm:w-16 h-5 sm:h-8 rounded-full align-middle bg-cover bg-center mx-2 border border-[#FF0B0B]/30 grayscale opacity-80" style={{backgroundImage: 'url("https://picsum.photos/seed/industrial/400/200")'}}></span>
              que eliminam o caos operacional.
            </h1>

            {/* Subtitle - Fade up 3 */}
            <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#A1A1AA] leading-relaxed mt-8 animate-fade-up-3">
              Substitua planilhas lentas, retrabalho e tarefas manuais confusas por softwares rápidos, integrados e extremamente estáveis que organizam sua operação e blindam sua empresa contra falhas humanas.
            </p>

            {/* CTAs de Alto Contraste - Fade up 4 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full sm:w-auto animate-fade-up-4">
              <Link
                href="/diagnostico"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#FF0B0B] px-8 font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D60606] transition-all shadow-[0_0_25px_rgba(255,11,11,0.35)] group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                Garantir Diagnóstico Gratuito
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-white" />
              </Link>
              <Link
                href="/portfolio"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-sm border border-[#2E3A2F] bg-black px-8 font-technical text-xs font-bold uppercase tracking-wider text-[#A1A1AA] hover:border-white hover:text-white transition-all relative group"
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
            @keyframes fade-up {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes scanline {
              0% { top: 0%; }
              100% { top: 100%; }
            }
            @keyframes video-loop {
              0%, 100% { opacity: 0; }
              8%, 92% { opacity: 0.22; }
            }
            @keyframes pulse-glow {
              0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
            }
            .animate-marquee {
              display: inline-flex;
              animation: marquee 40s linear infinite;
            }
            .animate-fade-up-1 {
              animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-fade-up-2 {
              opacity: 0;
              animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
            }
            .animate-fade-up-3 {
              opacity: 0;
              animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            }
            .animate-fade-up-4 {
              opacity: 0;
              animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
            }
            .animate-pulse-glow {
              animation: pulse-glow 6s ease-in-out infinite;
            }
            .animate-video-loop {
              animation: video-loop 7s ease-in-out infinite;
            }
          `}</style>
        </div>

        {/* What We Build Section */}
        <section className="py-24 bg-black border-b border-[#2E3A2F]">
          <div className="mx-auto max-w-6xl px-4 w-full">
            <div className="max-w-3xl mb-16 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF0B0B] animate-pulse" />
                <span className="font-technical text-[10px] text-[#FF0B0B] tracking-widest uppercase font-bold">
                  NOSSAS SOLUÇÕES
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight">
                O que construímos para o seu negócio
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
                Desenvolvemos ferramentas digitais focadas em eficiência e praticidade. Se você precisa de qualquer uma dessas soluções, a CodimDev sabe exatamente como construir:
              </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Solution 1 - ERPs & Internal Systems */}
              <div className="col-span-12 md:col-span-7 border border-[#2E3A2F] bg-[#050505] p-8 flex flex-col justify-between hover:border-[#FF0B0B]/50 hover:shadow-[0_0_30px_rgba(255,11,11,0.05)] transition-all duration-500 relative overflow-hidden group min-h-[380px]">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(46,58,47,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(46,58,47,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute -right-10 -bottom-10 h-48 w-48 bg-[#FF0B0B]/[0.02] rounded-full blur-3xl pointer-events-none group-hover:bg-[#FF0B0B]/[0.04] transition-all duration-500" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-sm border border-[#2E3A2F] bg-black flex items-center justify-center group-hover:border-[#FF0B0B]/30 group-hover:bg-[#FF0B0B]/[0.03] transition-colors duration-300">
                      <Database className="h-4.5 w-4.5 text-[#FF0B0B]" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white tracking-wide">Sistemas Internos & ERPs</h3>
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-md">
                    Centralize estoque, ordens de serviço, clientes ou contratos em um só lugar. Desenvolvemos softwares rápidos e ultra-estáveis que se moldam perfeitamente à sua rotina comercial, sem cobrar mensalidades abusivas por usuário.
                  </p>
                </div>

                {/* SVG Visualizer - Nodes linking */}
                <div className="relative z-10 my-6 h-28 border border-[#2E3A2F]/40 bg-black/40 rounded-sm overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full max-w-sm px-4" viewBox="0 0 300 80">
                    <g className="opacity-40 group-hover:opacity-80 transition-opacity duration-500">
                      {/* Connection lines */}
                      <line x1="40" y1="40" x2="150" y2="40" stroke="#2E3A2F" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="150" y1="40" x2="260" y2="40" stroke="#2E3A2F" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="150" y1="40" x2="150" y2="15" stroke="#2E3A2F" strokeWidth="1" />
                      
                      {/* Interactive Pulses */}
                      <circle cx="100" cy="40" r="2" fill="#FF0B0B">
                        <animate attributeName="cx" values="40;150" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="205" cy="40" r="2" fill="#FF0B0B">
                        <animate attributeName="cx" values="150;260" dur="2.5s" repeatCount="indefinite" />
                      </circle>

                      {/* Main Node */}
                      <circle cx="150" cy="40" r="8" fill="black" stroke="#FF0B0B" strokeWidth="2" />
                      <circle cx="150" cy="40" r="4" fill="#FF0B0B" />
                      <text x="150" y="60" textAnchor="middle" className="font-technical text-[8px] fill-[#A1A1AA]">BANCO DE DADOS</text>

                      {/* Sub Node Left */}
                      <rect x="15" y="25" width="50" height="30" rx="2" fill="black" stroke="#2E3A2F" strokeWidth="1" />
                      <text x="40" y="42" textAnchor="middle" className="font-technical text-[8px] fill-[#FF0B0B]">ESTOQUE</text>

                      {/* Sub Node Right */}
                      <rect x="235" y="25" width="50" height="30" rx="2" fill="black" stroke="#2E3A2F" strokeWidth="1" />
                      <text x="260" y="42" textAnchor="middle" className="font-technical text-[8px] fill-[#FF0B0B]">PEDIDOS</text>
                    </g>
                  </svg>
                </div>

                <div className="relative z-10 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between font-technical text-[9px] text-[#71717A]">
                  <span>ESTRUTURA: NATIVA E VELOZ</span>
                  <span className="text-[#FF0B0B] font-bold uppercase tracking-wider">SOB MEDIDA</span>
                </div>
              </div>

              {/* Solution 2 - Dashboards */}
              <div className="col-span-12 md:col-span-5 border border-[#2E3A2F] bg-[#050505] p-8 flex flex-col justify-between hover:border-[#FF0B0B]/50 hover:shadow-[0_0_30px_rgba(255,11,11,0.05)] transition-all duration-500 relative overflow-hidden group min-h-[380px]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(46,58,47,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(46,58,47,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute -right-10 -bottom-10 h-48 w-48 bg-[#FF0B0B]/[0.02] rounded-full blur-3xl pointer-events-none group-hover:bg-[#FF0B0B]/[0.04] transition-all duration-500" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-sm border border-[#2E3A2F] bg-black flex items-center justify-center group-hover:border-[#FF0B0B]/30 group-hover:bg-[#FF0B0B]/[0.03] transition-colors duration-300">
                      <Layout className="h-4.5 w-4.5 text-[#FF0B0B]" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white tracking-wide">Dashboards & Painéis</h3>
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Aposente de vez as planilhas confusas e desatualizadas. Integre suas vendas, faturamento e despesas em um painel visual unificado em tempo real.
                  </p>
                </div>

                {/* SVG Visualizer - Glowing Neon Chart */}
                <div className="relative z-10 my-6 h-28 border border-[#2E3A2F]/40 bg-black/40 rounded-sm overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full p-4" viewBox="0 0 200 80" preserveAspectRatio="none">
                    <g className="opacity-50 group-hover:opacity-90 transition-opacity duration-500">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="200" y2="20" stroke="#1A241B" strokeWidth="0.5" />
                      <line x1="0" y1="40" x2="200" y2="40" stroke="#1A241B" strokeWidth="0.5" />
                      <line x1="0" y1="60" x2="200" y2="60" stroke="#1A241B" strokeWidth="0.5" />
                      
                      {/* Glowing Path */}
                      <path d="M0,60 Q30,55 60,40 T120,45 T180,15 L200,10" fill="none" stroke="#FF0B0B" strokeWidth="2.5" className="drop-shadow-[0_0_4px_rgba(255,11,11,0.5)]" />
                      <path d="M0,60 Q30,55 60,40 T120,45 T180,15 L200,10 L200,80 L0,80 Z" fill="url(#chart-glow)" opacity="0.1" />
                      
                      {/* Interactive Dot */}
                      <circle cx="180" cy="15" r="3.5" fill="#FF0B0B">
                        <animate attributeName="r" values="3.5;5;3.5" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <text x="175" y="32" className="font-technical text-[7px] fill-[#FF0B0B] font-bold">+94.8% EFICIÊNCIA</text>

                      <defs>
                        <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF0B0B" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </g>
                  </svg>
                </div>

                <div className="relative z-10 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between font-technical text-[9px] text-[#71717A]">
                  <span>FUTURO: DECISÕES COM DADOS</span>
                  <span className="text-[#FF0B0B] font-bold uppercase tracking-wider">TEMPO REAL</span>
                </div>
              </div>

              {/* Solution 3 - Automations */}
              <div className="col-span-12 md:col-span-5 border border-[#2E3A2F] bg-[#050505] p-8 flex flex-col justify-between hover:border-[#FF0B0B]/50 hover:shadow-[0_0_30px_rgba(255,11,11,0.05)] transition-all duration-500 relative overflow-hidden group min-h-[380px]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(46,58,47,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(46,58,47,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute -right-10 -bottom-10 h-48 w-48 bg-[#FF0B0B]/[0.02] rounded-full blur-3xl pointer-events-none group-hover:bg-[#FF0B0B]/[0.04] transition-all duration-500" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-sm border border-[#2E3A2F] bg-black flex items-center justify-center group-hover:border-[#FF0B0B]/30 group-hover:bg-[#FF0B0B]/[0.03] transition-colors duration-300">
                      <Workflow className="h-4.5 w-4.5 text-[#FF0B0B]" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white tracking-wide">Automações & WhatsApp</h3>
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Conectamos suas vendas, WhatsApp, CRMs e meios de pagamento para que as tarefas repetitivas rodem sozinhas 24h por dia, sem erros de digitação.
                  </p>
                </div>

                {/* SVG Visualizer - Active workflow nodes */}
                <div className="relative z-10 my-6 h-28 border border-[#2E3A2F]/40 bg-black/40 rounded-sm overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full p-4" viewBox="0 0 200 80">
                    <g className="opacity-40 group-hover:opacity-80 transition-opacity duration-500">
                      {/* Active Ring */}
                      <circle cx="40" cy="40" r="14" fill="black" stroke="#2E3A2F" strokeWidth="1" />
                      <circle cx="40" cy="40" r="6" fill="#FF0B0B" opacity="0.3">
                        <animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <path d="M37 40 L39 42 L43 38" fill="none" stroke="#FF0B0B" strokeWidth="1.5" />

                      {/* Connection arrow */}
                      <path d="M60 40 L134 40" fill="none" stroke="#2E3A2F" strokeWidth="1" strokeDasharray="3 3" />
                      <polygon points="134,37 140,40 134,43" fill="#2E3A2F" />

                      <circle cx="95" cy="40" r="3" fill="#FF0B0B">
                        <animate attributeName="cx" values="54;134" dur="2s" repeatCount="indefinite" />
                      </circle>

                      {/* End Node */}
                      <rect x="140" y="25" width="45" height="30" rx="2" fill="black" stroke="#FF0B0B" strokeWidth="1.5" />
                      <text x="162.5" y="42" textAnchor="middle" className="font-technical text-[7px] fill-white">DISPARO</text>
                    </g>
                  </svg>
                </div>

                <div className="relative z-10 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between font-technical text-[9px] text-[#71717A]">
                  <span>FALHAS MINIMIZADAS: 0.00%</span>
                  <span className="text-[#FF0B0B] font-bold uppercase tracking-wider">100% AUTOMÁTICO</span>
                </div>
              </div>

              {/* Solution 4 - Customer Portals */}
              <div className="col-span-12 md:col-span-7 border border-[#2E3A2F] bg-[#050505] p-8 flex flex-col justify-between hover:border-[#FF0B0B]/50 hover:shadow-[0_0_30px_rgba(255,11,11,0.05)] transition-all duration-500 relative overflow-hidden group min-h-[380px]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(46,58,47,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(46,58,47,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute -right-10 -bottom-10 h-48 w-48 bg-[#FF0B0B]/[0.02] rounded-full blur-3xl pointer-events-none group-hover:bg-[#FF0B0B]/[0.04] transition-all duration-500" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-sm border border-[#2E3A2F] bg-black flex items-center justify-center group-hover:border-[#FF0B0B]/30 group-hover:bg-[#FF0B0B]/[0.03] transition-colors duration-300">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#FF0B0B]" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white tracking-wide">Portais de Autoatendimento</h3>
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-md">
                    Construímos portais exclusivos para seus clientes e parceiros (consulta de faturas, downloads de relatórios e controle de chamados) integrados ao seu banco de dados de forma ágil.
                  </p>
                </div>

                {/* SVG Visualizer - Active Portal UI Mockup */}
                <div className="relative z-10 my-6 h-28 border border-[#2E3A2F]/40 bg-black/40 rounded-sm overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full px-8" viewBox="0 0 260 80">
                    <g className="opacity-40 group-hover:opacity-80 transition-opacity duration-500">
                      {/* Top bar mockup */}
                      <rect x="10" y="10" width="240" height="60" rx="3" fill="black" stroke="#2E3A2F" strokeWidth="1" />
                      <line x1="10" y1="24" x2="250" y2="24" stroke="#2E3A2F" strokeWidth="1" />
                      
                      {/* Window Dots */}
                      <circle cx="20" cy="17" r="2" fill="#E11D48" />
                      <circle cx="27" cy="17" r="2" fill="#D97706" />
                      <circle cx="34" cy="17" r="2" fill="#059669" />

                      {/* Content Columns */}
                      <rect x="20" y="32" width="60" height="30" rx="2" fill="#0A0A0A" stroke="#2E3A2F" strokeWidth="0.5" />
                      <circle cx="32" cy="42" r="5" fill="#2E3A2F" />
                      <line x1="42" y1="40" x2="70" y2="40" stroke="#A1A1AA" strokeWidth="1" />
                      <line x1="42" y1="45" x2="60" y2="45" stroke="#2E3A2F" strokeWidth="1" />

                      <rect x="90" y="32" width="150" height="30" rx="2" fill="#0A0A0A" stroke="#FF0B0B" strokeWidth="0.5" strokeOpacity="0.5" />
                      <line x1="100" y1="42" x2="180" y2="42" stroke="#FF0B0B" strokeWidth="1" strokeOpacity="0.7" />
                      <line x1="100" y1="48" x2="230" y2="48" stroke="#A1A1AA" strokeWidth="1" />
                    </g>
                  </svg>
                </div>

                <div className="relative z-10 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between font-technical text-[9px] text-[#71717A]">
                  <span>PORTAIS INTEGRADOS</span>
                  <span className="text-[#FF0B0B] font-bold uppercase tracking-wider">PLATAFORMAS WEB</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Engine Bento Grid Section */}
        <section className="py-24 bg-black relative border-b border-[#2E3A2F]">
          <div className="mx-auto max-w-6xl px-4 w-full">
            <div className="max-w-3xl mb-16 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF0B0B] animate-pulse" />
                <span className="font-technical text-[10px] text-[#FF0B0B] tracking-widest uppercase font-bold">
                  COMO TRABALHAMOS
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight">
                CodimDev Engine™: O Caminho para a Eficiência
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
                Nossa esteira de desenvolvimento garante que o software seja entregue exatamente como sua empresa precisa, sem surpresas ou atrasos:
              </p>
            </div>

            {/* Gapless Bento Grid Mathematically Structured */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-flow-dense gap-4">
              
              {/* Card 01 - Extraction */}
              <div className="md:col-span-2 md:row-span-1 border border-[#2E3A2F] bg-[#050505] p-6 flex flex-col justify-between hover:border-[#FF0B0B]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#FF0B0B]/[0.01] rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-technical text-2xl font-bold text-text-muted">01</span>
                    <Cpu className="h-5 w-5 text-text-muted group-hover:text-[#FF0B0B] transition-colors" />
                  </div>
                  <h3 className="font-technical text-sm font-bold uppercase tracking-wider text-white">Diagnóstico Operacional</h3>
                  <span className="font-technical text-[9px] text-[#FF0B0B] tracking-wider uppercase block mt-1">MAPEAMENTO DE PROCESSOS</span>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    Mapeamos os processos atuais da sua empresa e identificamos onde você está perdendo tempo e dinheiro devido a planilhas lentas e tarefas manuais repetitivas.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between">
                  <span className="font-technical text-[9px] text-text-muted">IDENTIFICAÇÃO DE GARGALOS</span>
                  <span className="font-technical text-[9px] text-primary font-bold">RELEVANTE</span>
                </div>
              </div>

              {/* Card 02 - Blueprint */}
              <div className="md:col-span-2 md:row-span-1 border border-[#2E3A2F] bg-[#050505] p-6 flex flex-col justify-between hover:border-[#FF0B0B]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#FF0B0B]/[0.01] rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-technical text-2xl font-bold text-text-muted">02</span>
                    <Layers className="h-5 w-5 text-text-muted group-hover:text-[#FF0B0B] transition-colors" />
                  </div>
                  <h3 className="font-technical text-sm font-bold uppercase tracking-wider text-white">Desenho da Solução</h3>
                  <span className="font-technical text-[9px] text-[#FF0B0B] tracking-wider uppercase block mt-1">BLUEPRINT E FLUXOS</span>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    Modelamos o seu sistema ou automação sob medida, mostrando de forma visual e simples como as informações vão fluir entre suas áreas de forma 100% organizada.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between">
                  <span className="font-technical text-[9px] text-text-muted">ESTRUTURAÇÃO ORGANIZADA</span>
                  <span className="font-technical text-[9px] text-primary font-bold">PREPARADO</span>
                </div>
              </div>

              {/* Card 03 - Precision Build */}
              <div className="md:col-span-2 md:row-span-1 border border-[#2E3A2F] bg-[#050505] p-6 flex flex-col justify-between hover:border-[#FF0B0B]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#FF0B0B]/[0.01] rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-technical text-2xl font-bold text-text-muted">03</span>
                    <TerminalIcon className="h-5 w-5 text-text-muted group-hover:text-[#FF0B0B] transition-colors" />
                  </div>
                  <h3 className="font-technical text-sm font-bold uppercase tracking-wider text-white">Construção de Precisão</h3>
                  <span className="font-technical text-[9px] text-[#FF0B0B] tracking-wider uppercase block mt-1">DESENVOLVIMENTO ÁGIL</span>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    Desenvolvemos o software de forma ágil, utilizando tecnologias seguras e modernas para garantir telas rápidas, limpas e sem travamentos no seu dia a dia comercial.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between">
                  <span className="font-technical text-[9px] text-text-muted">INTERFACE RÁPIDA E LIMPA</span>
                  <span className="font-technical text-[9px] text-primary font-bold">ESTÁVEL</span>
                </div>
              </div>

              {/* Card 04 - Scale Protocol */}
              <div className="md:col-span-2 md:row-span-1 border border-[#2E3A2F] bg-[#050505] p-6 flex flex-col justify-between hover:border-[#FF0B0B]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#FF0B0B]/[0.01] rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-technical text-2xl font-bold text-text-muted">04</span>
                    <GitBranch className="h-5 w-5 text-text-muted group-hover:text-[#FF0B0B] transition-colors" />
                  </div>
                  <h3 className="font-technical text-sm font-bold uppercase tracking-wider text-white">Integração Total</h3>
                  <span className="font-technical text-[9px] text-[#FF0B0B] tracking-wider uppercase block mt-1">CONEXÃO DE SISTEMAS</span>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    Conectamos seu novo software com as ferramentas que você já utiliza na sua empresa, automatizando dados de estoque, CRM e notas fiscais de forma sincronizada.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2E3A2F]/40 flex items-center justify-between">
                  <span className="font-technical text-[9px] text-text-muted">SINCRONISMO AUTOMÁTICO</span>
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
