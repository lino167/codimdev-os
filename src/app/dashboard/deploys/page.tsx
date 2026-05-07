"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { supabase } from "@/lib/supabase";
import { 
  GitBranch, 
  Play, 
  Terminal as TermIcon, 
  Loader2, 
  Clock, 
  Trash2 
} from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface Deploy {
  id: string;
  created_at: string;
  project_id: string;
  commit_message: string;
  commit_hash: string;
  status: string;
  build_log: string;
  projects?: Project;
}

export default function DeploysPage() {
  const [deploys, setDeploys] = useState<Deploy[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [building, setBuilding] = useState<boolean>(false);

  // Form states
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [buildLogs, setBuildLogs] = useState<string[]>([]);

  // Fetch real data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch projects for selector
      const { data: projectsData } = await supabase
        .from("projects")
        .select("id, name");
      setProjects(projectsData || []);

      // 2. Fetch deploys with related project names
      const { data: deploysData, error } = await supabase
        .from("deploys")
        .select(`
          *,
          projects (
            id,
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeploys(deploysData || []);
    } catch (err) {
      console.error("Erro ao buscar histórico de deploys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Simulate Build Pipeline and write to DB
  const handleLaunchDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !commitMessage) return;

    setBuilding(true);
    setBuildLogs([]);

    const randHash = Math.random().toString(16).substring(2, 9);
    
    // Step-by-step logs simulation in Portuguese
    const logSteps = [
      `[LOG] Inicializando pipeline de compilação para o commit ${randHash}...`,
      `[LOG] Carregando variáveis de ambiente de produção (.env.production)...`,
      `[LOG] Resolvendo dependências com o gerenciador de pacotes npm...`,
      `[LOG] Compilando módulos TypeScript com motor Turbopack de alta velocidade...`,
      `[LOG] Executando testes automatizados e análises estáticas do código...`,
      `[LOG] Otimizando carregamento de imagens e renderização estática...`,
      `[LOG] Deploy publicado com sucesso na CDN Edge Network Global de baixa latência.`,
      `[LOG] Processo concluído. STATUS: EM EXECUÇÃO.`
    ];

    try {
      // 1. Create initial queued/building deploy record in Supabase
      const { data: newDeploy, error: insertError } = await supabase
        .from("deploys")
        .insert([
          {
            project_id: selectedProjectId,
            commit_message: commitMessage,
            commit_hash: randHash,
            status: "building",
            build_log: logSteps[0]
          }
        ])
        .select();

      if (insertError) throw insertError;
      const createdDeploy = newDeploy?.[0];

      // Refresh list optimistically showing building state
      fetchData();

      // 2. Output logs progressively to console for visual Wow factor
      const currentLogs: string[] = [];
      for (let i = 0; i < logSteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        currentLogs.push(logSteps[i]);
        setBuildLogs([...currentLogs]);
      }

      // 3. Update status in database to 'success'
      if (createdDeploy) {
        const { error: updateError } = await supabase
          .from("deploys")
          .update({ 
            status: "success", 
            build_log: logSteps.join("\n") 
          })
          .eq("id", createdDeploy.id);

        if (updateError) throw updateError;
      }

      setCommitMessage("");
      setSelectedProjectId("");
      fetchData();
    } catch (err) {
      console.error("Erro ao executar compilação de deploy:", err);
    } finally {
      setBuilding(false);
    }
  };

  // Delete deploy record
  const handleDeleteDeploy = async (id: string) => {
    if (!confirm("Confirmar a exclusão do histórico deste deploy?")) return;

    try {
      const { error } = await supabase.from("deploys").delete().eq("id", id);
      if (error) throw error;
      setDeploys((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Erro ao deletar registro de deploy:", err);
    }
  };

  // Metrics
  const totalDeploys = deploys.length;
  const successDeploys = deploys.filter((d) => d.status === "success").length;
  const successRate = totalDeploys > 0 ? Math.round((successDeploys / totalDeploys) * 100) : 100;
  const failedDeploys = deploys.filter((d) => d.status === "failed").length;

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              <GitBranch size={18} className="text-primary animate-pulse" /> ESTEIRAS E PIPELINES DE DEPLOY
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Painel de disparo de deploys e acompanhamento de logs de compilação em tempo real.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary transition-colors"
          >
            RECARREGAR COMPILAÇÕES
          </button>
        </div>

        {/* Deploy Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">COMPILAÇÕES LANÇADAS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{totalDeploys}</span>
              <span className="font-technical text-[9px] font-bold text-primary">SISTEMA ATIVO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">TAXA DE SUCESSO</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-success">{successRate}%</span>
              <span className="font-technical text-[9px] font-bold text-status-success">OTIMIZADO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">PIPELINES COM FALHA</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-danger">{failedDeploys}</span>
              <span className="font-technical text-[9px] font-bold text-status-danger">ALERTAS ZERO</span>
            </div>
          </div>
        </div>

        {/* Input Trigger & Live Build Console Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Action Trigger Form */}
          <div className="bg-surface border border-border p-5">
            <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
              <Play size={14} className="text-primary" /> DISPARAR DEPLOY EM PRODUÇÃO
            </h3>
            <form onSubmit={handleLaunchDeploy} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">PROJETO DE DESTINO *</label>
                <select
                  required
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                >
                  <option value="">-- SELECIONE O PROJETO --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">MENSAGEM DO COMMIT *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: feat: add real-time billing indicators"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                />
              </div>

              <button
                type="submit"
                disabled={building}
                className="w-full bg-primary hover:bg-primary-hover text-text-primary border border-border font-technical text-xs font-bold py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {building ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> COMPILANDO CÓDIGO...
                  </>
                ) : (
                  <>
                    <Play size={14} /> ACIONAR PIPELINE DE DEPLOY
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Embedded Build Console Terminal */}
          <div className="lg:col-span-2 bg-black border border-border p-5 h-64 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-border/30 pb-2 mb-3 text-text-secondary">
              <span className="font-technical text-[10px] font-bold tracking-widest flex items-center gap-1.5">
                <TermIcon size={12} className="text-primary" /> TERMINAL DO COMPILADOR EM TEMPO REAL
              </span>
              <span className="font-technical text-[9px] font-bold text-text-muted">MOTOR TURBOPACK</span>
            </div>
            
            {/* Live Logs Stream */}
            <div className="flex-1 overflow-y-auto font-technical text-[11px] text-text-secondary flex flex-col gap-1.5 leading-relaxed bg-black p-2 max-h-44">
              {buildLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-text-muted italic">
                  [SISTEMA EM ESPERA] Aguardando o disparo de um novo deploy...
                </div>
              ) : (
                buildLogs.map((log, idx) => (
                  <div key={idx} className={`${
                    log.includes("STATUS: EM EXECUÇÃO") ? "text-status-success font-bold" : "text-text-primary"
                  }`}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Database Build Ledger History */}
        <div className="bg-surface border border-border p-5">
          <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
            <Clock size={14} className="text-primary" /> HISTÓRICO DE DEPLOYS EM PRODUÇÃO
          </h3>

          {loading ? (
            <div className="h-32 flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="text-primary animate-spin" />
              <span className="font-technical text-xs text-text-muted tracking-wider">CARREGANDO HISTÓRICO DE DEPLOYS...</span>
            </div>
          ) : deploys.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-black/20">
              <span className="font-technical text-xs text-text-muted">Nenhum registro de deploy localizado na base de dados.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-text-muted font-technical text-[9px] font-bold tracking-widest bg-black/40">
                    <th className="py-2.5 px-3">DATA VAL</th>
                    <th className="py-2.5 px-3">PROJETO DE DESTINO</th>
                    <th className="py-2.5 px-3">MENSAGEM DO COMMIT</th>
                    <th className="py-2.5 px-3">HASH</th>
                    <th className="py-2.5 px-3">STATUS DO DEPLOY</th>
                    <th className="py-2.5 px-3 text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="font-technical text-xs">
                  {deploys.map((d) => (
                    <tr key={d.id} className="border-b border-border hover:bg-black/20 transition-colors duration-100">
                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-text-muted font-bold text-[11px]">
                        {new Date(d.created_at).toLocaleString("pt-BR", { hour12: false })}
                      </td>

                      {/* Project Target */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-text-primary">{d.projects?.name || "N/A"}</span>
                      </td>

                      {/* Commit Message */}
                      <td className="py-3 px-3">
                        <span className="text-text-secondary font-medium">{d.commit_message}</span>
                      </td>

                      {/* Hash */}
                      <td className="py-3 px-3">
                        <span className="text-text-muted text-[11px] font-semibold">{d.commit_hash}</span>
                      </td>

                      {/* Build Status */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest bg-black ${
                          d.status === "success"
                            ? "border-status-success/30 text-status-success"
                            : d.status === "failed"
                            ? "border-status-danger/30 text-status-danger"
                            : "border-border text-text-secondary animate-pulse"
                        }`}>
                          {d.status === "success" ? "SUCESSO" : d.status === "failed" ? "FALHOU" : "COMPILANDO"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteDeploy(d.id)}
                          className="p-1 text-text-muted hover:text-status-danger transition-all border border-transparent duration-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
