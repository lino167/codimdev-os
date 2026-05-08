import Link from 'next/link';
import { 
  Terminal, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Server, 
  BarChart3, 
  Cpu
} from 'lucide-react';
import UnicornBackground from '@/components/public/UnicornBackground';

export default function Home() {
  return (
    <div className="bg-[#050505] text-white min-h-screen relative overflow-x-hidden flex flex-col selection:bg-primary/30 font-display">

      {/* ==========================================
          1. AMBIENT GLOWS & UNICORN BACKGROUND
          ========================================== */}
      <UnicornBackground projectId="vTTCp5g4cVl9nwjlT56Z" hueRotate={90} opacity={0.65} />

      {/* Feixes Diagonais Técnicos */}
      <div className="fixed top-0 right-0 w-[120vw] h-[120vh] pointer-events-none -z-10 overflow-hidden transform translate-x-[10%] -translate-y-[10%]">
        <div className="absolute w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-[38deg]">
          <div className="absolute top-[5%] right-[25%] w-[120px] h-[150%] bg-gradient-to-b from-transparent via-[#FF0B0B]/20 to-transparent blur-[24px]" />
          <div className="absolute top-[-5%] right-[32%] w-[180px] h-[150%] bg-gradient-to-b from-transparent via-[#FF0B0B]/30 to-transparent blur-[32px]" />
          <div className="absolute top-[15%] right-[42%] w-[140px] h-[150%] bg-gradient-to-b from-transparent via-[#5C3822]/30 to-transparent blur-[20px]" />
        </div>
      </div>

      {/* ==========================================
          2. NAVEGAÇÃO GLASSMORPHIC (PILL)
          ========================================== */}
      <header className="flex z-50 w-full pt-8 pr-6 pl-6 relative justify-center sticky top-0">
        <div className="flex w-full max-w-[1400px] items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition duration-300">
            <Terminal className="w-5 h-5 text-white" />
          </Link>

          {/* Center Nav Pill */}
          <nav className="hidden lg:flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-3.5 gap-6 text-sm font-medium text-neutral-400 shadow-xl shadow-black/50">
            <Link href="#about" className="hover:text-white transition duration-200">Metodologia</Link>
            <div className="w-1 h-1 bg-neutral-600 rounded-full" />
            <Link href="#product" className="hover:text-white transition duration-200">OS Interno</Link>
            <div className="w-1 h-1 bg-neutral-600 rounded-full" />
            <Link href="#features" className="hover:text-white transition duration-200">Engenharia</Link>
            <div className="w-1 h-1 bg-neutral-600 rounded-full" />
            <Link href="#pricing" className="hover:text-white transition duration-200">High-Ticket</Link>
          </nav>

          {/* CTA Pill */}
          <Link href="/audit" className="text-sm font-bold text-white bg-primary hover:bg-primary-hover border border-primary-hover backdrop-blur-md rounded-full px-7 py-3.5 transition duration-300">
            INICIAR AUDITORIA
          </Link>
        </div>
      </header>

      {/* ==========================================
          3. HERO SECTION ASSIMÉTRICO
          ========================================== */}
      <main className="w-full max-w-[1400px] mx-auto px-6 flex-grow flex flex-col justify-center relative z-10 pb-24 lg:pb-12 pt-16 lg:pt-8 min-h-[90vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-end h-full">
          
          {/* Esquerda: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col lg:pt-24 h-full pt-12 pb-12 justify-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight text-white leading-[1.05] mb-10">
                Sistemas para<br />Máquinas de Vendas.
              </h1>
              <div className="flex flex-wrap items-center gap-5">
                <Link href="/audit" className="bg-white text-black px-9 py-4 rounded-full text-lg font-bold hover:bg-neutral-200 transition duration-300 flex items-center gap-2">
                  AGENDE UM DIAGNÓSTICO
                </Link>
                <Link href="#product" className="bg-transparent text-white border border-white/20 px-9 py-4 rounded-full text-lg font-medium hover:bg-white/5 transition duration-300">
                  VER METODOLOGIA
                </Link>
              </div>
            </div>

            {/* Bottom Left: Detalhes & Stats */}
            <div className="mt-24 lg:mt-32 flex flex-col xl:flex-row xl:items-end justify-between gap-12 pr-0 lg:pr-12">
              <div className="max-w-md">
                <div className="flex items-center gap-3 text-sm font-technical text-white mb-3 tracking-widest uppercase">
                  <span>Supabase PG</span>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <span>Next.js Engine</span>
                </div>
                <p className="text-neutral-400 text-lg leading-relaxed font-normal">
                  Não criamos vitrines estáticas. Desenvolvemos ecossistemas web robustos, reativos e orientados a conversão para empresas de elite.
                </p>
              </div>

              {/* Ping Metric */}
              <div className="flex items-center gap-6 shrink-0">
                <div className="flex flex-col">
                  <span className="text-neutral-500 font-technical text-xs mb-1 uppercase tracking-widest">Latência de Sistema</span>
                  <div className="flex items-start text-white leading-none">
                    <span className="text-5xl font-technical tracking-tight">12</span>
                    <div className="flex flex-col ml-1 pt-1.5">
                      <span className="text-xl font-technical text-status-success animate-pulse">ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direita: Mockup do OS (Card UI) */}
          <div id="product" className="lg:col-span-5 relative w-full flex justify-end items-end h-full">
            <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 pb-0 w-full max-w-[440px] relative overflow-hidden shadow-2xl shadow-[#FF0B0B]/10">
              
              <div className="flex justify-between items-start mb-10">
                <h3 className="text-3xl font-medium text-white tracking-tight leading-[1.2] max-w-[220px]">
                  Controle total da operação
                </h3>
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(255,11,11,0.2)]">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              {/* Mini-Dashboard Mockup */}
              <div className="w-full bg-[#0a0a0a] border-[4px] border-neutral-800 rounded-t-[2.5rem] pt-5 px-5 h-[320px] relative mt-4 shadow-inner">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-full flex items-center justify-between px-3 border border-white/5">
                  <span className="text-[10px] font-technical text-status-success uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    OS Active
                  </span>
                </div>

                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Terminal className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-white font-medium text-lg tracking-tight">Krafl-o Daemon</h4>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="bg-neutral-800/60 backdrop-blur-md rounded-2xl rounded-tl-sm p-4 w-[85%] border border-white/5 font-technical text-xs leading-relaxed text-neutral-300">
                      &gt; Lead capturado via /audit<br/>
                      &gt; Orçamento: R$ 45.000<br/>
                      &gt; Status: Injetado no Kanban
                    </div>
                    
                    <Link href="/audit" className="bg-primary/10 hover:bg-primary/20 transition border border-primary/20 rounded-xl p-3 w-[70%] flex items-center justify-between self-end mt-2">
                      <span className="text-white text-sm font-bold">Ver no CRM</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ==========================================
          4. METODOLOGIA (ABOUT)
          ========================================== */}
      <section id="about" className="w-full relative py-32 border-t border-white/5 bg-gradient-to-b from-transparent to-neutral-950/50">
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="flex flex-col">
            <span className="text-primary font-technical text-xs tracking-widest uppercase mb-4">Metodologia</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 leading-[1.1]">
              Construído para escalar,<br />movido a lógica.
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-lg">
              A CodimDev nasceu de uma observação simples: empresas gastam tempo demais lidando com integrações quebradas. Nós projetamos uma arquitetura (CodimDev OS) que centraliza sua operação e automatiza seu fluxo de ponta a ponta.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-4xl font-technical tracking-tight text-white block mb-2">100%</span>
                <span className="text-neutral-500 text-sm font-normal">Serverless Architecture</span>
              </div>
              <div>
                <span className="text-4xl font-technical tracking-tight text-white block mb-2">24/7</span>
                <span className="text-neutral-500 text-sm font-normal">Monitoramento Ativo</span>
              </div>
            </div>
          </div>
          
          <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-neutral-900/30 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF0B0B]/5 to-transparent opacity-50 group-hover:opacity-100 transition duration-700" />
            <div className="w-24 h-24 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center relative z-10 shadow-2xl">
              <Code2 className="w-10 h-10 text-white" />
            </div>
            {/* Círculos Concêntricos */}
            <div className="absolute w-[120%] h-[120%] border border-white/5 rounded-full z-0" />
            <div className="absolute w-[80%] h-[80%] border border-white/5 rounded-full z-0" />
            <div className="absolute w-[40%] h-[40%] border border-white/5 rounded-full z-0" />
          </div>
        </div>
      </section>

      {/* ==========================================
          5. FEATURES GRID (BENTO BOX)
          ========================================== */}
      <section id="features" className="w-full relative py-32 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16 lg:mb-24">
            <span className="text-primary font-technical text-xs tracking-widest mb-4 block uppercase">Infraestrutura</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6">
              Tudo o que uma operação de elite precisa
            </h2>
            <p className="text-neutral-400 text-lg mx-auto max-w-2xl">
              Primitivas poderosas projetadas para lidar com a complexidade de negócios de alto faturamento, sem a poluição de sistemas legados.
            </p>
          </div>

          <div id="pricing" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Zap} 
              title="Next.js Engine" 
              desc="Frontend gerado estaticamente para carregamento instantâneo. Zero latência para os seus clientes finais."
            />
            <FeatureCard 
              icon={Server} 
              title="PostgreSQL Relacional" 
              desc="Estrutura de dados rígida, normalizada e blindada com Row-Level Security via Supabase."
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Segurança Militar" 
              desc="Prevenção contra injeções, cabeçalhos HTTP estritos e criptografia de ponta a ponta nativa."
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Dashboards Realtime" 
              desc="Acompanhe o faturamento, deploys e leads com gráficos interativos que reagem em milissegundos."
            />
            <FeatureCard 
              icon={Cpu} 
              title="Automação N8N" 
              desc="Orquestração de webhooks conectando o seu novo site diretamente ao seu CRM e Telegram corporativo."
            />
            <FeatureCard 
              icon={Terminal} 
              title="Gestão Centralizada" 
              desc="Adeus dezenas de abas. Gerencie conteúdo, leads e finanças de um único cockpit desenvolvido sob medida."
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          6. FOOTER
          ========================================== */}
      <footer className="w-full border-t border-white/5 bg-[#050505] pt-20 pb-10">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-neutral-500 font-technical text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} CodimDev Engenharia.
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-technical text-xs text-neutral-600 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              Sistemas Operacionais
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Componente Auxiliar para os Cards de Features
function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition duration-300 rounded-2xl p-8 group">
      <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mb-6 text-white group-hover:text-primary transition">
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-medium tracking-tight text-white mb-3">{title}</h3>
      <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
