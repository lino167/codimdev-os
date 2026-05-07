"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { supabase } from "@/lib/supabase";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Sliders, 
  ExternalLink, 
  GitBranch, 
  Users, 
  Loader2, 
  Trash2, 
  Percent 
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
}

interface Project {
  id: string;
  created_at: string;
  client_id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  repo_url: string;
  preview_url: string;
  clients?: Client; // Relation loaded via Supabase
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Create Client Form State
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [creatingClient, setCreatingClient] = useState(false);

  // Create Project Form State
  const [projName, setProjName] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projClientId, setProjClientId] = useState("");
  const [projRepoUrl, setProjRepoUrl] = useState("");
  const [projPreviewUrl, setProjPreviewUrl] = useState("");
  const [projStatus, setProjStatus] = useState("building");
  const [projProgress, setProjProgress] = useState(10);
  const [creatingProject, setCreatingProject] = useState(false);

  // Load everything from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch clients for the dropdown selector
      const { data: clientsData, error: clientsErr } = await supabase
        .from("clients")
        .select("*")
        .order("company", { ascending: true });

      if (clientsErr) throw clientsErr;
      setClients(clientsData || []);

      // 2. Fetch projects with related client company
      const { data: projectsData, error: projectsErr } = await supabase
        .from("projects")
        .select(`
          *,
          clients (
            id,
            name,
            company,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (projectsErr) throw projectsErr;
      setProjects(projectsData || []);
    } catch (err) {
      console.error("Error retrieving data stream:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Client creation
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientCompany) return;

    setCreatingClient(true);
    try {
      const { error } = await supabase.from("clients").insert([
        {
          name: clientName,
          company: clientCompany,
          email: clientEmail,
          phone: clientPhone,
          status: "active",
        },
      ]);

      if (error) throw error;

      setClientName("");
      setClientCompany("");
      setClientEmail("");
      setClientPhone("");

      fetchData();
    } catch (err) {
      console.error("Error inserting client:", err);
    } finally {
      setCreatingClient(false);
    }
  };

  // Handle Project creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName || !projClientId) return;

    setCreatingProject(true);
    try {
      const { error } = await supabase.from("projects").insert([
        {
          name: projName,
          description: projDescription,
          client_id: projClientId,
          status: projStatus,
          progress: projProgress,
          repo_url: projRepoUrl,
          preview_url: projPreviewUrl,
        },
      ]);

      if (error) throw error;

      setProjName("");
      setProjDescription("");
      setProjClientId("");
      setProjRepoUrl("");
      setProjPreviewUrl("");
      setProjStatus("building");
      setProjProgress(10);

      fetchData();
    } catch (err) {
      console.error("Error inserting project:", err);
    } finally {
      setCreatingProject(false);
    }
  };

  // Update dynamic progress in database on slide end
  const handleProgressChange = async (id: string, newProgress: number) => {
    try {
      // Optimistic local update
      setProjects((prev) =>
        prev.map((proj) => (proj.id === id ? { ...proj, progress: newProgress } : proj))
      );

      const { error } = await supabase
        .from("projects")
        .update({ progress: newProgress })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating project progress:", err);
    }
  };

  // Update dynamic status in database
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setProjects((prev) =>
        prev.map((proj) => (proj.id === id ? { ...proj, status: newStatus } : proj))
      );

      const { error } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating project status:", err);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    if (!confirm("Confirmar a remoção deste projeto no monitor?")) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // Calculated Metrics
  const activeProjectsCount = projects.filter((p) => p.status !== "deployed").length;
  const totalClientsCount = clients.length;
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  // Filter projects by search
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.clients?.company || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              <Briefcase size={18} className="text-primary animate-pulse" /> ENGINE DE CONTROLE DE PROJETOS
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Rastreador de progresso físico de projetos de engenharia de software da agência.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary transition-colors duration-75"
          >
            SINCRONIZAR BANCO
          </button>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">PROJETOS EM EXECUÇÃO</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{activeProjectsCount}</span>
              <span className="font-technical text-[10px] font-bold text-primary">FASE DE CONSTRUÇÃO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">CLIENTES CADASTRADOS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{totalClientsCount}</span>
              <span className="font-technical text-[10px] font-bold text-status-success">CONTRATOS ATIVOS</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">PROGRESSO MÉDIO GERAL</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{avgProgress}%</span>
              <span className="font-technical text-[10px] font-bold text-status-success flex items-center gap-1">
                <Percent size={10} /> EFICIÊNCIA GERAL
              </span>
            </div>
          </div>
        </div>

        {/* Input Forms and Track Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Action Panel: Client & Project Creation */}
          <div className="flex flex-col gap-6">
            {/* 1. Register Client Form */}
            <div className="bg-surface border border-border p-5">
              <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
                <Users size={14} className="text-primary" /> CADASTRAR CLIENTE
              </h3>
              <form onSubmit={handleCreateClient} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">NOME DO CLIENTE</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do Ponto de Contato"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="bg-black border border-border px-3 py-1.5 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">EMPRESA / MARCA</label>
                  <input
                    type="text"
                    required
                    placeholder="Empresa / Marca Contratante"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="bg-black border border-border px-3 py-1.5 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">EMAIL</label>
                    <input
                      type="email"
                      placeholder="admin@marca.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="bg-black border border-border px-3 py-1.5 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">TELEFONE</label>
                    <input
                      type="text"
                      placeholder="(11) 99999-9999"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="bg-black border border-border px-3 py-1.5 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={creatingClient}
                  className="bg-surface-hover hover:bg-black text-text-primary border border-border font-technical text-[10px] font-bold py-2 mt-2 flex items-center justify-center gap-1.5 transition-colors duration-100 disabled:opacity-50"
                >
                  {creatingClient ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} REGISTRAR NOVO CLIENTE
                </button>
              </form>
            </div>

            {/* 2. Register Project Form */}
            <div className="bg-surface border border-border p-5">
              <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
                <GitBranch size={14} className="text-primary" /> INICIAR NOVO PROJETO
              </h3>
              <form onSubmit={handleCreateProject} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">NOME DO PROJETO</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kraflo CMMS Desktop"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    className="bg-black border border-border px-3 py-1.5 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">VINCULAR AO CLIENTE</label>
                  <select
                    required
                    value={projClientId}
                    onChange={(e) => setProjClientId(e.target.value)}
                    className="bg-black border border-border px-2.5 py-1.5 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  >
                    <option value="">-- SELECIONE O CLIENTE --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">ESCOPO / DESCRIÇÃO TÉCNICA</label>
                  <input
                    type="text"
                    placeholder="Breve escopo técnico do produto"
                    value={projDescription}
                    onChange={(e) => setProjDescription(e.target.value)}
                    className="bg-black border border-border px-3 py-1.5 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">REPOSITÓRIO REPO</label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={projRepoUrl}
                      onChange={(e) => setProjRepoUrl(e.target.value)}
                      className="bg-black border border-border px-3 py-1.5 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">URL PREVIEW</label>
                    <input
                      type="text"
                      placeholder="https://app.codim.dev"
                      value={projPreviewUrl}
                      onChange={(e) => setProjPreviewUrl(e.target.value)}
                      className="bg-black border border-border px-3 py-1.5 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">STATUS INICIAL</label>
                    <select
                      value={projStatus}
                      onChange={(e) => setProjStatus(e.target.value)}
                      className="bg-black border border-border px-2 py-1.5 text-xs font-technical text-text-primary focus:outline-none"
                    >
                      <option value="scoping">DEFINIÇÃO DE ESCOPO</option>
                      <option value="designing">PROTOTIPAÇÃO / DESIGN</option>
                      <option value="building">DESENVOLVIMENTO</option>
                      <option value="deployed">IMPLANTADO / ATIVO</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-technical text-[9px] font-bold text-text-secondary tracking-wider">PROGRESSO ({projProgress}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={projProgress}
                      onChange={(e) => setProjProgress(parseInt(e.target.value))}
                      className="bg-black accent-primary border border-border h-8 px-2 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={creatingProject}
                  className="w-full bg-primary hover:bg-primary-hover text-text-primary font-technical text-[10px] font-bold py-2.5 mt-2 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {creatingProject ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} LANÇAR NOVO PROJETO
                </button>
              </form>
            </div>
          </div>

          {/* Real-time Project Grid/List Tracker */}
          <div className="lg:col-span-2 bg-surface border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-3">
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest flex items-center gap-1.5">
                <Sliders size={14} className="text-primary" /> MONITOR DE PROJETOS EM TEMPO REAL
              </span>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Pesquisar projeto ou cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black border border-border pl-9 pr-3 py-1.5 text-xs font-technical text-text-primary w-full sm:w-56 focus:outline-none focus:border-border-focus"
                />
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <Loader2 size={24} className="text-primary animate-spin" />
                <span className="font-technical text-xs text-text-muted tracking-wider">CARREGANDO DADOS DO BANCO...</span>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-black/20">
                <span className="font-technical text-xs text-text-muted">Nenhum projeto ativo mapeado no rastreador.</span>
                <span className="font-technical text-[10px] text-primary">Preencha os formulários ao lado para iniciar.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredProjects.map((project) => {
                  // Phase detection based on progress percentage
                  const phaseLabel = 
                    project.progress === 100 
                      ? "04_CONCLUÍDO_ESCALA" 
                      : project.progress >= 51 
                      ? "03_DESENVOLVIMENTO_PRECISO" 
                      : project.progress >= 26 
                      ? "02_ESTRUTURAÇÃO_SISTEMA" 
                      : "01_EXTRAÇÃO_REQUISITOS";

                  return (
                    <div key={project.id} className="border border-border p-4 bg-black/40 hover:bg-black/80 hover:border-border-focus transition-all duration-100 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="font-technical text-sm font-bold text-text-primary">{project.name}</span>
                          <span className="font-technical text-[10px] text-text-muted mt-0.5">
                            CLIENTE: {project.clients?.company || "N/A"} ({project.clients?.name || "N/A"})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={project.status}
                            onChange={(e) => handleStatusChange(project.id, e.target.value)}
                            className="bg-black border border-border text-[9px] font-technical font-bold tracking-widest px-2 py-0.5"
                          >
                            <option value="scoping">DEFINIÇÃO DE ESCOPO</option>
                            <option value="designing">DESIGN</option>
                            <option value="building">DESENVOLVIMENTO</option>
                            <option value="deployed">IMPLANTADO / ATIVO</option>
                            <option value="paused">PAUSADO</option>
                          </select>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-text-muted hover:text-status-danger p-0.5"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {project.description && (
                        <p className="font-technical text-xs text-text-secondary leading-relaxed bg-surface/50 p-2 border border-border/40">
                          {project.description}
                        </p>
                      )}

                      {/* Interactive Progress Bar */}
                      <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex items-center justify-between text-[9px] font-technical font-bold tracking-wider">
                          <span className="text-primary">FASE: {phaseLabel}</span>
                          <span className="text-text-primary">{project.progress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={project.progress}
                          onChange={(e) => handleProgressChange(project.id, parseInt(e.target.value))}
                          className="w-full bg-surface accent-primary h-1.5 cursor-ew-resize border border-border"
                        />
                      </div>

                      {/* Code Repository and Live Preview Actions */}
                      <div className="flex items-center gap-4 mt-1 border-t border-border/20 pt-2.5 font-technical text-[10px] font-bold">
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-text-primary flex items-center gap-1"
                          >
                            <ExternalLink size={11} /> REPOSITÓRIO CÓDIGO
                          </a>
                        )}
                        {project.preview_url && (
                          <a
                            href={project.preview_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-text-primary flex items-center gap-1"
                          >
                            <ExternalLink size={11} /> AMBIENTE DE PREVIEW
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
