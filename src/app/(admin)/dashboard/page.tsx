"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  GitBranch, 
  ArrowUpRight, 
  Activity, 
  AlertTriangle, 
  CheckCircle2,
  Loader2,
  RefreshCw
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
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    totalDeploys: 0
  });

  const [activeProjectsList, setActiveProjectsList] = useState<any[]>([]);
  const [recentDeploys, setRecentDeploys] = useState<any[]>([]);
  const [automationLogs, setAutomationLogs] = useState<any[]>([]);

  // Carregar dados dinâmicos do Supabase
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Leads
      const { count: leadsCount, error: leadsErr } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true });

      // 2. Projetos Ativos
      const { count: activeProjCount, data: projData, error: projErr } = await supabase
        .from("projects")
        .select("*, clients(company_name)")
        .neq("status", "deployed");

      // 3. Faturamento Acumulado (Receitas)
      const { data: finData, error: finErr } = await supabase
        .from("financial_transactions")
        .select("amount")
        .eq("type", "income");

      const totalRevenue = finData ? finData.reduce((sum, item) => sum + Number(item.amount), 0) : 0;

      // 4. Deploys Totais e Feed
      const { count: deploysCount, data: deploysData, error: deploysErr } = await supabase
        .from("deploys")
        .select("*, projects(name)")
        .order("created_at", { ascending: false })
        .limit(3);

      // 5. Automations Log Feed
      const { data: automationsData, error: automationsErr } = await supabase
        .from("automations_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      // Atualizar estados
      setMetrics({
        totalLeads: leadsCount || 0,
        activeProjects: activeProjCount || 0,
        monthlyRevenue: totalRevenue,
        totalDeploys: deploysCount || 0
      });

      setActiveProjectsList(projData || []);
      setRecentDeploys(deploysData || []);
      setAutomationLogs(automationsData || []);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const displayProjects = activeProjectsList.map(p => ({
    name: p.name,
    client_company: p.clients?.company_name || "Cliente Interno",
    progress: p.progress,
    status: p.status
  }));

  const displayDeploys = recentDeploys.map(d => ({
    commit_message: d.commit_message || "Deploy acionado manualmente",
    commit_hash: d.commit_hash || "custom_h",
    created_at: d.created_at,
    status: d.status,
    project_name: d.projects?.name || "Projeto Customizado"
  }));

  const displayAutomations = automationLogs;

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.round(diffMs / 60000);
      if (diffMins < 1) return "agora mesmo";
      if (diffMins < 60) return `há ${diffMins} min`;
      const diffHours = Math.round(diffMins / 60);
      if (diffHours < 24) return `há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
      return new Date(isoString).toLocaleDateString("pt-BR");
    } catch {
      return "há algum tempo";
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              PAINEL DE CONTROLE CENTRAL
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Telemetria operacional unificada e monitoramento de banco de dados do CodimDev OS.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="p-1.5 border border-border bg-black hover:bg-surface-hover text-text-secondary transition-colors"
              title="Recarregar Dados"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-primary" : ""} />
            </button>
            <div className="flex items-center gap-2 font-technical text-[10px] bg-black border border-border px-3 py-1.5 text-text-secondary">
              <Activity size={12} className="text-primary animate-pulse" />
              <span>SISTEMA ONLINE & SINCRONIZADO</span>
            </div>
          </div>
        </div>

        {loading && activeProjectsList.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="text-primary animate-spin" />
            <span className="font-technical text-xs text-text-muted tracking-widest">SINCRONIZANDO PAINEL DE CONTROLE...</span>
          </div>
        ) : (
          <>
            {/* Grade de Cartões de Métricas Dinâmicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="CRM TOTAL DE LEADS"
                value={String(metrics.totalLeads)}
                change="REGISTROS ATIVOS"
                isPositive={true}
                icon={<Users size={16} />}
              />
              <MetricCard
                title="PROJETOS ATIVOS"
                value={String(metrics.activeProjects)}
                change="EM CONSTRUÇÃO"
                isPositive={true}
                icon={<Briefcase size={16} />}
              />
              <MetricCard
                title="FATURAMENTO"
                value={`R$ ${metrics.monthlyRevenue.toLocaleString("pt-BR")}`}
                change="SOMA DAS TRANSAÇÕES"
                isPositive={true}
                icon={<DollarSign size={16} />}
              />
              <MetricCard
                title="DEPLOYS EXECUTADOS"
                value={String(metrics.totalDeploys)}
                change="REGISTROS REAIS"
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
                    {displayProjects.map((project, idx) => (
                      <div key={idx} className="border border-border p-3.5 bg-black/40 hover:bg-black/80 transition-colors duration-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-col">
                            <span className="font-technical text-xs font-bold text-text-primary">{project.name}</span>
                            <span className="font-technical text-[10px] text-text-muted mt-0.5">{project.client_company}</span>
                          </div>
                          <span className={`font-technical text-[9px] font-bold tracking-widest px-2 py-0.5 border ${
                            project.progress === 100 
                              ? "border-status-success/30 text-status-success bg-status-success/5" 
                              : "border-status-warning/30 text-status-warning bg-status-warning/5 animate-pulse"
                          }`}>
                            {project.status === "deployed" || project.progress === 100 ? "CONCLUÍDO" : "EM DESENVOLVIMENTO"}
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
                          <span>FASE DO PROJETO: {project.progress === 100 ? "04_ESCALA" : project.progress >= 51 ? "03_CONSTRUÇÃO_PRECISA" : "02_SISTEMA_BLUEPRINT"}</span>
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
                    {displayDeploys.map((deploy, idx) => (
                      <div key={idx} className="border border-border/60 bg-black/30 p-3 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-technical text-[11px] font-bold text-text-primary line-clamp-1 leading-snug">{deploy.commit_message}</span>
                          <span className="font-technical text-[9px] font-semibold text-text-muted">{deploy.commit_hash}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-technical text-[10px] text-text-muted">{formatTimeAgo(deploy.created_at)}</span>
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
                {displayAutomations.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-border/30 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className={log.status === "failed" ? "text-status-danger font-bold font-technical animate-pulse" : "text-status-success font-bold font-technical"}>
                        {log.status === "failed" ? "[FALHA]" : "[OK]"}
                      </span>
                      <span className="text-text-primary font-medium">{log.name}</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-bold">{formatTimeAgo(log.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
