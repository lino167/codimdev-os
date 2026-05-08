"use client";

import { useState } from "react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { 
  Terminal, 
  Code2, 
  Cpu, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import UnicornBackground from "@/components/public/UnicornBackground";

interface Project {
  id: string;
  title: string;
  category: string;
  tag: string;
  status: string;
  desc: string;
  techs: string[];
  codeSnippet: string;
}

export default function PortfolioPage() {
  const projects: Project[] = [
    {
      id: "kraflo-cmms",
      title: "Kraflo CMMS",
      category: "Sistema de Gestão Industrial",
      tag: "CMMS / Manutenção Preventiva",
      status: "Em Produção (v1.4.0)",
      desc: "Software de controle de manutenção industrial completo. Gerenciamento de ordens de serviço, cadastro de ativos de fábrica, telemetria em tempo real e gráficos de faturamento integrados diretamente ao banco Supabase.",
      techs: ["Next.js", "Supabase", "Tailwind CSS", "TypeScript", "Recharts"],
      codeSnippet: `// Kraflo CMMS - Telemetry Engine
import { supabase } from "@/lib/supabase";

export async function fetchLiveAssets() {
  const { data, error } = await supabase
    .from("assets")
    .select("id, name, health_score, status")
    .order("health_score", { ascending: false });
    
  if (error) throw new Error(error.message);
  return data;
}`
    },
    {
      id: "manservel-lp",
      title: "Manservel Landing Page",
      category: "Landing Page Comercial",
      tag: "Alta Conversão & Velocidade",
      status: "Publicado",
      desc: "Landing page desenvolvida para a Manservel utilizando o design tático de alta performance. Otimizada para carregamento em menos de 100ms e focada em converter leads qualificados para projetos industriais.",
      techs: ["Next.js", "Tailwind CSS", "Framer Motion", "SEO Otimizado"],
      codeSnippet: `// Manservel LP - Performance Check
export const config = {
  unstable_runtimeJS: false, // Zero JS option for static speed
};

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white font-technical">
      <h1>Manservel // Engenharia de Elite</h1>
    </main>
  );
}`
    }
  ];

  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

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

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-20 relative z-10 space-y-16">
        
        {/* Intro Header */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-technical text-neutral-400 uppercase tracking-widest">
              Ativos de Software e Sistemas de Alta Complexidade
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.1]">
            Nossos cases e <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              sistemas práticos.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
            Desenvolvemos soluções de software reais que resolvem dores industriais e comerciais. Explore a arquitetura técnica e o código-fonte de alguns dos nossos principais sistemas em produção.
          </p>
        </div>

        {/* Portfolio Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Projects Selector Column */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-technical text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-4 pl-2">
              SELECIONE UM SISTEMA OPERACIONAL:
            </h3>
            
            {projects.map((proj) => {
              const isSelected = selectedProject.id === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all relative overflow-hidden group flex flex-col gap-3 ${
                    isSelected 
                      ? "border-primary/40 bg-neutral-900/50 shadow-lg shadow-black/30" 
                      : "border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 h-16 w-16 bg-red-600/[0.03] rounded-bl-full pointer-events-none animate-fade-in" />
                  )}
                  
                  <div className="flex justify-between items-start w-full">
                    <span className="text-[10px] font-technical text-neutral-500 uppercase tracking-widest">
                      {proj.category}
                    </span>
                    <span className={`text-[9px] font-technical px-2 py-0.5 rounded-full border ${
                      isSelected 
                        ? "border-primary/30 bg-primary/10 text-primary" 
                        : "border-white/10 bg-white/5 text-neutral-400"
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg font-medium text-white group-hover:text-primary transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-neutral-400 font-light line-clamp-2">
                      {proj.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer & Details Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="w-full p-8 bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 h-16 w-16 bg-red-600/[0.02] rounded-bl-full pointer-events-none" />

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[9px] font-technical text-neutral-400 border border-white/10 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full uppercase">
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                  VISUALIZAÇÃO DE ATIVO DIGITAL
                </div>
                <h2 className="text-2xl font-technical font-bold uppercase tracking-wider text-white">
                  {selectedProject.title}
                </h2>
                <span className="text-xs font-technical text-primary tracking-widest block uppercase">
                  {selectedProject.tag}
                </span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                {selectedProject.desc}
              </p>

              {/* Technologies Pill Grid */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <span className="text-[10px] font-technical text-neutral-400 uppercase tracking-widest block">
                  TECNOLOGIAS APLICADAS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techs.map((tech) => (
                    <span key={tech} className="text-[10px] font-technical px-3 py-1 rounded-full border border-white/10 bg-white/5 text-neutral-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Code Mockup Terminal */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center pl-1">
                  <span className="text-[10px] font-technical text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5 text-primary" />
                    ARQUITETURA DE CÓDIGO FONTE (SIMULADO)
                  </span>
                  <span className="text-[9px] font-technical text-neutral-600 uppercase tracking-wider">
                    index.ts
                  </span>
                </div>
                
                <div className="rounded-2xl border border-white/5 bg-black/80 p-5 font-mono text-[11px] leading-relaxed overflow-x-auto text-neutral-300 shadow-inner">
                  <pre>{selectedProject.codeSnippet}</pre>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/audit"
                  className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-technical text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-colors duration-100 shadow-[0_0_15px_rgba(255,11,11,0.2)]"
                >
                  Construir Sistema Sob Medida
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
