import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { AuditForm } from "@/components/public/AuditForm";
import { Clock, PhoneCall, Laptop } from "lucide-react";
import UnicornBackground from "@/components/public/UnicornBackground";

export default function AuditPage() {
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
              Auditoria Operacional — 100% Gratuita e Prática
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
              COMO FUNCIONA A NOSSA AUDITORIA:
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
          <AuditForm />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
