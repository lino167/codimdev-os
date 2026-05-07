import React from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  GitBranch, 
  ArrowUpRight, 
  Activity, 
  AlertTriangle, 
  CheckCircle2 
} from "lucide-react";
import Link from "next/link";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, isPositive, icon }: MetricCardProps) => {
  return (
    <div className="bg-surface border border-border p-4 flex flex-col justify-between hover:border-border-focus transition-all duration-100">
      <div className="flex items-center justify-between">
        <span className="font-technical text-[10px] font-bold text-text-secondary tracking-widest">{title}</span>
        <div className="text-text-secondary">{icon}</div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="font-technical text-2xl font-bold tracking-tight text-text-primary">{value}</span>
        <span className={`font-technical text-[10px] font-bold tracking-tight ${
          isPositive ? "text-status-success" : "text-status-danger"
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  // Dados simulados representativos para o Painel Operacional
  const activeProjects = [
    { name: "Desktop Kraflo CMMS", client: "Kraflo Ind.", progress: 85, status: "em_producao" },
    { name: "SaaS Audit™ Blueprint", client: "Nodus Corp", progress: 100, status: "concluido" },
    { name: "Setup Landing Page Performance", client: "Studio Beauty", progress: 40, status: "design" },
  ];

  const recentDeploys = [
    { commit: "feat: add gatilho para execuções preventivas", hash: "a3b98c1", time: "há 10 min", status: "success" },
    { commit: "fix: solve discrepância de timezone no robô do OS", hash: "9e2f41a", time: "há 1 hora", status: "success" },
    { commit: "build: initial config para benchmarks de performance", hash: "ef821b3", time: "há 4 horas", status: "failed" },
  ];

  const automationLogs = [
    { name: "Robô Telegram: OS #416 despachada com sucesso", time: "há 5 min", status: "success" },
    { name: "Sincronização n8n: Novo lead cadastrado (Nodus)", time: "há 12 min", status: "success" },
    { name: "Stripe Webhook: Cobrança de MRR mensal verificada", time: "há 1 hora", status: "success" },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Cabeçalho da Seção */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary">
              PAINEL DE CONTROLE
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Painel de telemetria operacional unificado da CodimDev.
            </p>
          </div>
          <div className="flex items-center gap-2 font-technical text-[10px] bg-black border border-border px-3 py-1 text-text-secondary">
            <Activity size={12} className="text-primary animate-pulse" />
            <span>USO DO CORE: 2.4%</span>
          </div>
        </div>

        {/* Grade de Cartões de Métricas Técnicas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="CRM TOTAL DE LEADS"
            value="42"
            change="+12.4% (MÊS)"
            isPositive={true}
            icon={<Users size={16} />}
          />
          <MetricCard
            title="PROJETOS ATIVOS"
            value="3"
            change="SISTEMA ESTÁVEL"
            isPositive={true}
            icon={<Briefcase size={16} />}
          />
          <MetricCard
            title="MRR MENSAL"
            value="R$ 14.250"
            change="+8.2% (RECEITA)"
            isPositive={true}
            icon={<DollarSign size={16} />}
          />
          <MetricCard
            title="ESTEIRAS DE DEPLOY"
            value="148"
            change="99.2% SUCESSO"
            isPositive={true}
            icon={<GitBranch size={16} />}
          />
        </div>

        {/* Conteúdo Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Bento 1: Monitor de Projetos */}
          <div className="lg:col-span-2 bg-surface border border-border p-5 flex flex-col justify-between hover:border-border-focus transition-all duration-100">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <span className="font-technical text-xs font-bold text-text-primary tracking-widest">STATUS DO MOTOR DE PROJETOS</span>
                <Link href="/dashboard/projects" className="text-primary hover:text-primary-hover flex items-center gap-1 font-technical text-[10px] font-bold">
                  GERENCIAR <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {activeProjects.map((project, idx) => (
                  <div key={idx} className="border border-border p-3.5 bg-black/40 hover:bg-black/80 transition-colors duration-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="font-technical text-xs font-bold text-text-primary">{project.name}</span>
                        <span className="font-technical text-[10px] text-text-muted mt-0.5">{project.client}</span>
                      </div>
                      <span className={`font-technical text-[9px] font-bold tracking-widest px-2 py-0.5 border ${
                        project.status === "concluido" 
                          ? "border-status-success/30 text-status-success bg-status-success/5" 
                          : "border-status-warning/30 text-status-warning bg-status-warning/5 animate-pulse"
                      }`}>
                        {project.status === "concluido" ? "CONCLUÍDO" : project.status === "em_producao" ? "EM PRODUÇÃO" : "DESIGN"}
                      </span>
                    </div>
                    {/* Precision Progress Bar */}
                    <div className="w-full bg-surface border border-border h-2 relative">
                      <div 
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between font-technical text-[9px] text-text-secondary mt-1.5">
                      <span>FASE DO PROJETO: {project.progress === 100 ? "04_ESCALA" : project.progress >= 75 ? "03_CONSTRUÇÃO_PRECISA" : "02_SISTEMA_BLUEPRINT"}</span>
                      <span className="font-bold text-text-primary">{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Bento 2: Monitor de Deploy */}
          <div className="bg-surface border border-border p-5 flex flex-col justify-between hover:border-border-focus transition-all duration-100">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <span className="font-technical text-xs font-bold text-text-primary tracking-widest">FEED DE DEPLOYS</span>
                <Link href="/dashboard/deploys" className="text-primary hover:text-primary-hover flex items-center gap-1 font-technical text-[10px] font-bold">
                  ESTEIRAS <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {recentDeploys.map((deploy, idx) => (
                  <div key={idx} className="border border-border/60 bg-black/30 p-3 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-technical text-[11px] font-bold text-text-primary line-clamp-1 leading-snug">{deploy.commit}</span>
                      <span className="font-technical text-[9px] font-semibold text-text-muted">{deploy.hash}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-technical text-[10px] text-text-muted">{deploy.time}</span>
                      <div className="flex items-center gap-1.5">
                        {deploy.status === "success" ? (
                          <>
                            <CheckCircle2 size={12} className="text-status-success" />
                            <span className="font-technical text-[9px] font-bold text-status-success tracking-widest">SUCESSO</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={12} className="text-status-danger animate-pulse" />
                            <span className="font-technical text-[9px] font-bold text-status-danger tracking-widest animate-pulse">FALHOU</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Painel Inferior: Terminal de Automações */}
        <div className="bg-surface border border-border p-5 hover:border-border-focus transition-all duration-100">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <span className="font-technical text-xs font-bold text-text-primary tracking-widest">FLUXOS DE AUTOMAÇÃO ATIVOS</span>
            <Link href="/dashboard/automations" className="text-primary hover:text-primary-hover flex items-center gap-1 font-technical text-[10px] font-bold">
              LOGS <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="font-technical text-xs bg-black p-4 border border-border text-text-secondary flex flex-col gap-2.5 max-h-56 overflow-y-auto">
            {automationLogs.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-border/30 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="text-status-success font-bold font-technical">[OK]</span>
                  <span className="text-text-primary font-medium">{log.name}</span>
                </div>
                <span className="text-[10px] text-text-muted font-bold">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
