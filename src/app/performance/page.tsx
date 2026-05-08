import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import Link from "next/link";
import { 
  Zap, 
  ChevronRight, 
  Lock, 
  BarChart3, 
  Cpu, 
  Layout, 
  ShieldCheck, 
  Code2, 
  Server 
} from "lucide-react";
import UnicornBackground from "@/components/public/UnicornBackground";

export default function PerformanceLPsPage() {
  const steps = [
    { title: "Velocidade e SEO Absolutos", desc: "Criamos páginas focadas em conversão que carregam instantaneamente e são programadas para aparecer nas primeiras posições de busca.", icon: Zap },
    { title: "Design Premium Impecável", desc: "Páginas exclusivas, modernas e dinâmicas que passam profissionalismo e autoridade para sua marca logo no primeiro segundo.", icon: Layout },
    { title: "Pronto para Escalar", desc: "Estrutura pronta para receber milhares de acessos simultâneos sem lentidão, integrada aos seus sistemas de automação de vendas.", icon: BarChart3 },
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
              Landing Pages de Alta Tração Operacional
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.1]">
            Landing Pages comerciais de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              velocidade extrema.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
            Não adianta anunciar se a sua página demora para carregar. A CodimDev programa Landing Pages comerciais com código limpo e arquitetura premium. Entregamos páginas que carregam de forma instantânea, com layouts deslumbrantes que passam total segurança para o seu cliente final e aumentam suas conversões drasticamente.
          </p>

          {/* Steps Detailed */}
          <div className="space-y-6 pt-10 border-t border-white/5">
            <h3 className="font-technical text-xs font-bold text-white tracking-widest uppercase">
              O QUE OFERECEMOS EM CADA PÁGINA:
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

        {/* Technical Specification HUD Side */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="w-full max-w-md p-8 bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 h-16 w-16 bg-red-600/[0.02] rounded-bl-full pointer-events-none" />

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[9px] font-technical text-neutral-400 border border-white/10 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full uppercase">
                <Cpu className="h-3 w-3 text-primary animate-pulse" />
                DADOS DE RENDIMENTO CODIMDEV
              </div>
              <h2 className="text-xl font-technical font-bold uppercase tracking-wider text-white">
                Ficha Técnica
              </h2>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                Especificações de engenharia de software aplicadas de forma rígida em todas as nossas produções.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-black/40">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                  <span className="text-xs text-neutral-400 font-light">Certificado de Segurança SSL</span>
                </div>
                <span className="text-[10px] font-technical text-[#10B981] uppercase tracking-wider">[ ATIVO ]</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-black/40">
                <div className="flex items-center gap-3">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="text-xs text-neutral-400 font-light">Código Limpo (Tailwind + React)</span>
                </div>
                <span className="text-[10px] font-technical text-primary uppercase tracking-wider">[ 100% ]</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-black/40">
                <div className="flex items-center gap-3">
                  <Server className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs text-neutral-400 font-light">Hospedagem de Alta Performance</span>
                </div>
                <span className="text-[10px] font-technical text-neutral-400 uppercase tracking-wider">[ CDNs GLOBAIS ]</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/audit"
                className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-technical text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-colors duration-100 shadow-[0_0_15px_rgba(255,11,11,0.2)]"
              >
                Garantir Minha Vaga
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
