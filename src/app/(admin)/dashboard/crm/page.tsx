"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Plus, 
  Search, 
  TrendingUp, 
  Loader2, 
  Trash2,
  Kanban,
  TableProperties,
  ArrowRight,
  ArrowLeft,
  Bell,
  CheckCircle,
  Database,
  ArrowUpRight
} from "lucide-react";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  budget: number;
  source: string;
  notes: string;
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"kanban" | "table">("kanban");
  const [notification, setNotification] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("captured");
  const [source, setSource] = useState("landing_page");
  const [notes, setNotes] = useState("");

  // Fetch real leads from Supabase on mount
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handle adding new lead
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("leads")
        .insert([
          {
            name,
            company,
            email,
            phone,
            status,
            budget: value ? parseFloat(value) : 0,
            source,
            notes,
          },
        ]);

      if (error) throw error;

      // Trigger industrial notification simulation
      showToastNotification(`NOVO LEAD CAPTURADO: ${company.toUpperCase()}`);

      // Reset form fields
      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setValue("");
      setStatus("captured");
      setSource("landing_page");
      setNotes("");

      // Refresh list
      fetchLeads();
    } catch (err) {
      console.error("Error inserting lead:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to trigger a technical alert banner
  const showToastNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Update local state for immediate feedback
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
      );

      // Trigger status update alert
      const targetLead = leads.find(l => l.id === id);
      if (targetLead) {
        showToastNotification(`STATUS ATUALIZADO: ${targetLead.company.toUpperCase()} -> ${newStatus.toUpperCase()}`);
      }
    } catch (err) {
      console.error("Error updating lead status:", err);
    }
  };

  // Handle delete lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Confirmar a exclusão permanente deste lead?")) return;

    try {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;

      // Update local state
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      showToastNotification("REGISTRO REMOVIDO DO BANCO DE DADOS");
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  // Move lead forward/backward in the Kanban Pipeline
  const moveLead = (lead: Lead, direction: "next" | "prev") => {
    const statuses = ["captured", "contacted", "audit_proposed", "won"];
    const currentIndex = statuses.indexOf(lead.status);
    
    if (direction === "next" && currentIndex < statuses.length - 1) {
      handleUpdateStatus(lead.id, statuses[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      handleUpdateStatus(lead.id, statuses[currentIndex - 1]);
    }
  };

  // Calculate dynamic metrics
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === "won").length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";
  const pipelineValue = leads.reduce((sum, l) => sum + (l.budget || 0), 0);
  const activeValue = leads
    .filter((l) => ["captured", "contacted", "audit_proposed", "negotiating"].includes(l.status))
    .reduce((sum, l) => sum + (l.budget || 0), 0);

  // Filter leads based on search query
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Segment leads for the Kanban Columns (Page 3 of Fase 3 PDF)
  const extractionLeads = filteredLeads.filter(l => l.status === "captured" || l.status === "extraction");
  const contactedLeads = filteredLeads.filter(l => l.status === "contacted");
  const blueprintLeads = filteredLeads.filter(l => l.status === "audit_proposed" || l.status === "negotiating" || l.status === "blueprint");
  const wonLeadsList = filteredLeads.filter(l => l.status === "won");

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Module Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              <Users size={18} className="text-primary" /> MÓDULO_ID: CORE_03 // CRM INDUSTRIAL
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Pipeline de alta densidade técnica para gerenciar leads, propostas e o funil de aquisição CodimDev.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Sync Button */}
            <button
              onClick={fetchLeads}
              className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary active:scale-[0.98] transition-transform duration-75 flex items-center gap-1.5"
            >
              <Database size={13} className="text-primary" /> SINCRONIZAR
            </button>

            {/* Simulated Lead Sync */}
            <button
              onClick={() => {
                showToastNotification("CAPTURA ATIVA: CONECTADO COM AUDIT_FORM™");
              }}
              className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary active:scale-[0.98] transition-transform duration-75"
            >
              SYNC_AUDIT_FORM™
            </button>
          </div>
        </div>

        {/* Industrial Real-time Banner */}
        {notification && (
          <div className="bg-black border-l-2 border-primary border-y border-r border-border p-3 flex items-center gap-3 animate-pulse">
            <Bell size={14} className="text-primary animate-bounce flex-shrink-0" />
            <span className="font-technical text-[11px] font-bold text-text-primary tracking-wider uppercase">
              [SISTEMA_NOTIF] {notification}
            </span>
          </div>
        )}

        {/* Technical Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">TOTAL DE LEADS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{totalLeads}</span>
              <span className="font-technical text-[10px] font-bold text-status-success">FLUXO ATIVO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">TAXA DE CONVERSÃO</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{conversionRate}%</span>
              <span className="font-technical text-[10px] font-bold text-status-success flex items-center gap-1">
                <TrendingUp size={10} /> EFICIÊNCIA FUNIL
              </span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">VALOR DO FUNIL ATIVO</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">
                R$ {activeValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </span>
              <span className="font-technical text-[10px] font-bold text-status-warning">NEGOCIAÇÃO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">VALOR CONTRATADO WON</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">
                R$ {wonLeadsList.reduce((sum, l) => sum + (l.budget || 0), 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </span>
              <span className="font-technical text-[10px] font-bold text-primary">RECEITA CONQUISTADA</span>
            </div>
          </div>
        </div>

        {/* View Selection Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-3">
          {/* Tab Selection */}
          <div className="flex items-center gap-1.5 bg-black p-1 border border-border self-start">
            <button
              onClick={() => setActiveTab("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1 font-technical text-[10px] font-bold transition-all duration-100 ${
                activeTab === "kanban"
                  ? "bg-surface text-primary border border-border"
                  : "text-text-secondary hover:text-text-primary border border-transparent"
              }`}
            >
              <Kanban size={12} /> KANBAN PIPELINE
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`flex items-center gap-1.5 px-3 py-1 font-technical text-[10px] font-bold transition-all duration-100 ${
                activeTab === "table"
                  ? "bg-surface text-primary border border-border"
                  : "text-text-secondary hover:text-text-primary border border-transparent"
              }`}
            >
              <TableProperties size={12} /> TABELA DE LEADS
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Filtrar por nome ou empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black border border-border pl-9 pr-3 py-1.5 text-xs font-technical text-text-primary w-full sm:w-64 focus:outline-none focus:border-border-focus"
            />
          </div>
        </div>

        {/* Dynamic Panel View */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          {/* Main Visualizer Panel */}
          <div className="xl:col-span-3">
            {loading ? (
              <div className="bg-surface border border-border h-96 flex flex-col items-center justify-center gap-2">
                <Loader2 size={24} className="text-primary animate-spin" />
                <span className="font-technical text-xs text-text-muted tracking-wider">CARREGANDO REGISTROS DE LEADS...</span>
              </div>
            ) : activeTab === "kanban" ? (
              /* KANBAN PIPELINE (Page 3 of PDF) */
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                {/* 01. EXTRACTION */}
                <div className="flex flex-col gap-3">
                  <div className="bg-surface border border-border p-3 flex items-center justify-between">
                    <span className="font-technical text-[10px] font-bold text-text-primary tracking-widest">01. EXTRACTION</span>
                    <span className="font-technical text-[9px] bg-black px-1.5 py-0.5 border border-border text-primary font-bold">
                      {extractionLeads.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 min-h-[300px]">
                    {extractionLeads.length === 0 ? (
                      <div className="border border-dashed border-border/40 p-5 text-center text-text-muted font-technical text-[10px]">
                        SEM LEADS NESTA ETAPA
                      </div>
                    ) : (
                      extractionLeads.map((lead) => (
                        <KanbanCard key={lead.id} lead={lead} onMove={moveLead} onDelete={handleDeleteLead} />
                      ))
                    )}
                  </div>
                </div>

                {/* 02. CONTACTED */}
                <div className="flex flex-col gap-3">
                  <div className="bg-surface border border-border p-3 flex items-center justify-between">
                    <span className="font-technical text-[10px] font-bold text-text-primary tracking-widest">02. CONTACTED</span>
                    <span className="font-technical text-[9px] bg-black px-1.5 py-0.5 border border-border text-status-warning font-bold">
                      {contactedLeads.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 min-h-[300px]">
                    {contactedLeads.length === 0 ? (
                      <div className="border border-dashed border-border/40 p-5 text-center text-text-muted font-technical text-[10px]">
                        SEM LEADS NESTA ETAPA
                      </div>
                    ) : (
                      contactedLeads.map((lead) => (
                        <KanbanCard key={lead.id} lead={lead} onMove={moveLead} onDelete={handleDeleteLead} />
                      ))
                    )}
                  </div>
                </div>

                {/* 03. BLUEPRINT */}
                <div className="flex flex-col gap-3">
                  <div className="bg-surface border border-border p-3 flex items-center justify-between">
                    <span className="font-technical text-[10px] font-bold text-text-primary tracking-widest">03. BLUEPRINT</span>
                    <span className="font-technical text-[9px] bg-black px-1.5 py-0.5 border border-border text-primary font-bold animate-pulse">
                      {blueprintLeads.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 min-h-[300px]">
                    {blueprintLeads.length === 0 ? (
                      <div className="border border-dashed border-border/40 p-5 text-center text-text-muted font-technical text-[10px]">
                        SEM LEADS NESTA ETAPA
                      </div>
                    ) : (
                      blueprintLeads.map((lead) => (
                        <KanbanCard key={lead.id} lead={lead} onMove={moveLead} onDelete={handleDeleteLead} />
                      ))
                    )}
                  </div>
                </div>

                {/* 04. WON */}
                <div className="flex flex-col gap-3">
                  <div className="bg-surface border border-border p-3 flex items-center justify-between">
                    <span className="font-technical text-[10px] font-bold text-text-primary tracking-widest">04. WON</span>
                    <span className="font-technical text-[9px] bg-black px-1.5 py-0.5 border border-border text-status-success font-bold">
                      {wonLeadsList.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 min-h-[300px]">
                    {wonLeadsList.length === 0 ? (
                      <div className="border border-dashed border-border/40 p-5 text-center text-text-muted font-technical text-[10px]">
                        NENHUM LEAD CONVERTIDO AINDA
                      </div>
                    ) : (
                      wonLeadsList.map((lead) => (
                        <KanbanCard key={lead.id} lead={lead} onMove={moveLead} onDelete={handleDeleteLead} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* TABELA DE LEADS */
              <div className="bg-surface border border-border p-5 overflow-x-auto">
                {filteredLeads.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-black/20">
                    <span className="font-technical text-xs text-text-muted">Nenhum registro correspondente encontrado.</span>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-text-muted font-technical text-[9px] font-bold tracking-widest bg-black/40">
                        <th className="py-2.5 px-3">LEAD</th>
                        <th className="py-2.5 px-3">EMPRESA</th>
                        <th className="py-2.5 px-3">ORIGEM</th>
                        <th className="py-2.5 px-3">VALOR DO NEGÓCIO</th>
                        <th className="py-2.5 px-3">STATUS DO FUNIL</th>
                        <th className="py-2.5 px-3 text-right">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody className="font-technical text-xs">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="border-b border-border hover:bg-black/20 transition-colors duration-100">
                          <td className="py-3 px-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-text-primary">{lead.name}</span>
                              <span className="text-[10px] text-text-muted mt-0.5">{lead.email || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-text-secondary">{lead.company}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] text-text-muted uppercase bg-black px-1.5 py-0.5 border border-border/40">
                              {lead.source}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-text-primary">
                              R$ {(lead.budget || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                              className={`px-1.5 py-0.5 border text-[10px] font-bold tracking-tight bg-black ${
                                lead.status === "won"
                                  ? "border-status-success/30 text-status-success"
                                  : lead.status === "lost"
                                  ? "border-status-danger/30 text-status-danger"
                                  : lead.status === "audit_proposed" || lead.status === "negotiating"
                                  ? "border-primary/40 text-primary"
                                  : "border-border text-text-secondary"
                              }`}
                            >
                              <option value="captured">EXTRACTION</option>
                              <option value="contacted">CONTACTED</option>
                              <option value="audit_proposed">BLUEPRINT</option>
                              <option value="won">WON</option>
                            </select>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1 text-text-muted hover:text-status-danger transition-colors duration-100"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* Form Side Panel */}
          <div className="bg-surface border border-border p-5">
            <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
              <Plus size={14} className="text-primary" /> ENTRADA DE LEADS
            </h3>
            <form onSubmit={handleAddLead} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">NOME COMPLETO *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">EMPRESA / MARCA *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kraflo Indústrias"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">EMAIL</label>
                <input
                  type="email"
                  placeholder="joao@kraflo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">TELEFONE</label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">VALOR (R$)</label>
                  <input
                    type="number"
                    placeholder="Ex: 5000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">ORIGEM</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="bg-black border border-border px-2 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  >
                    <option value="landing_page">Landing Page</option>
                    <option value="outreach">Outreach Ativo</option>
                    <option value="referral">Indicação</option>
                    <option value="ads">Anúncios Pagos</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">ESTÁGIO FUNIL</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                >
                  <option value="captured">EXTRACTION (CAPTURADO)</option>
                  <option value="contacted">CONTACTED (CONTATO)</option>
                  <option value="audit_proposed">BLUEPRINT (PROPOSTA)</option>
                  <option value="won">WON (CONVERTIDO)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">NOTAS TÉCNICAS</label>
                <textarea
                  placeholder="Especificação técnica..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary resize-none focus:outline-none focus:border-border-focus"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-hover text-text-primary font-technical text-xs font-bold py-2.5 mt-2 flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> REGISTRANDO...
                  </>
                ) : (
                  <>
                    <Plus size={14} /> REGISTRAR NOVO LEAD
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

/* KANBAN CARD SUBCOMPONENT */
interface KanbanCardProps {
  lead: Lead;
  onMove: (lead: Lead, direction: "next" | "prev") => void;
  onDelete: (id: string) => void;
}

const KanbanCard = ({ lead, onMove, onDelete }: KanbanCardProps) => {
  return (
    <div className="bg-surface border border-border p-3 flex flex-col gap-2 group hover:border-primary/50 transition-all duration-150">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="font-technical text-xs font-bold text-text-primary truncate">{lead.company.toUpperCase()}</span>
          <span className="font-technical text-[10px] text-text-secondary mt-0.5 truncate">{lead.name}</span>
        </div>
        <button
          onClick={() => onDelete(lead.id)}
          className="text-text-muted hover:text-status-danger p-0.5 hover:bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex-shrink-0"
          title="Excluir Lead"
        >
          <Trash2 size={11} />
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-2 mt-1">
        <span className="font-technical text-[11px] font-bold text-primary">
          R$ {(lead.budget || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
        </span>
        <span className="font-technical text-[9px] text-text-muted uppercase">
          {lead.source.replace("_", " ")}
        </span>
      </div>

      {/* Manual Column Shifter Controls */}
      <div className="flex items-center justify-between border-t border-border/40 pt-2 mt-1">
        <button
          onClick={() => onMove(lead, "prev")}
          disabled={lead.status === "captured" || lead.status === "extraction"}
          className="p-1 border border-border bg-black/40 text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
          title="Mover para Etapa Anterior"
        >
          <ArrowLeft size={10} />
        </button>
        <span className="font-technical text-[8px] text-text-muted tracking-widest uppercase">PIPELINE</span>
        <button
          onClick={() => onMove(lead, "next")}
          disabled={lead.status === "won"}
          className="p-1 border border-border bg-black/40 text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
          title="Avançar Etapa"
        >
          <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
};

