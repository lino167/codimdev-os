import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { AuditForm } from "@/components/public/AuditForm";
import { Clock, PhoneCall, Laptop, Activity } from "lucide-react";

export default function AuditPage() {
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
              Auditoria Operacional — 100% Gratuita e Prática
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
              COMO FUNCIONA A NOSSA AUDITORIA:
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
        <div className="lg:col-span-5 flex justify-center">
          <AuditForm />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
