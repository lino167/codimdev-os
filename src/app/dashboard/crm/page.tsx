"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Plus, 
  Search, 
  DollarSign, 
  TrendingUp, 
  Loader2, 
  Briefcase, 
  ChevronRight, 
  Trash2 
} from "lucide-react";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  value: number;
  source: string;
  notes: string;
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

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
      const { data, error } = await supabase
        .from("leads")
        .insert([
          {
            name,
            company,
            email,
            phone,
            status,
            value: value ? parseFloat(value) : 0,
            source,
            notes,
          },
        ])
        .select();

      if (error) throw error;

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
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  // Calculate dynamic metrics
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === "won").length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";
  const pipelineValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
  const activeValue = leads
    .filter((l) => ["captured", "contacted", "audit_proposed", "negotiating"].includes(l.status))
    .reduce((sum, l) => sum + (l.value || 0), 0);

  // Filter leads based on search query
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Module Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              <Users size={18} className="text-primary" /> CRM_LEADS_DATABASE
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Motor de funil de vendas integrado ao Supabase Realtime para captação de novos projetos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLeads}
              className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary active:scale-[0.98] transition-transform duration-75"
            >
              SYNC_REFRESH
            </button>
          </div>
        </div>

        {/* Technical Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">TOTAL_LEADS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{totalLeads}</span>
              <span className="font-technical text-[10px] font-bold text-status-success">ACTIVE_FLOW</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">CONVERSION_RATE</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{conversionRate}%</span>
              <span className="font-technical text-[10px] font-bold text-status-success flex items-center gap-1">
                <TrendingUp size={10} /> WIN_RATIO
              </span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">ACTIVE_PIPELINE_VALUE</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">
                R$ {activeValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </span>
              <span className="font-technical text-[10px] font-bold text-status-warning">NEGOTIATING</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">TOTAL_CONTRACTED</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">
                R$ {pipelineValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </span>
              <span className="font-technical text-[10px] font-bold text-primary">WON_REVENUE</span>
            </div>
          </div>
        </div>

        {/* Input Form and Data Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Quick Insert Lead Form */}
          <div className="bg-surface border border-border p-5">
            <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
              <Plus size={14} className="text-primary" /> INSERT_NEW_LEAD
            </h3>
            <form onSubmit={handleAddLead} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">FULL_NAME *</label>
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
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">COMPANY_BRAND *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kraflo Indústrias"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">EMAIL_ADDRESS</label>
                  <input
                    type="email"
                    placeholder="joao@kraflo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">CONTACT_PHONE</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">DEAL_VALUE (R$)</label>
                  <input
                    type="number"
                    placeholder="Ex: 5000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">ACQUISITION_SOURCE</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  >
                    <option value="landing_page">Landing Page</option>
                    <option value="outreach">Outreach Ativo</option>
                    <option value="referral">Indicação</option>
                    <option value="ads">Anúncios Tráfego</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">PIPELINE_STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  >
                    <option value="captured">CAPTURED (Capturado)</option>
                    <option value="contacted">CONTACTED (Contato Inicial)</option>
                    <option value="audit_proposed">AUDIT_PROPOSED (Proposta de Auditoria)</option>
                    <option value="negotiating">NEGOTIATING (Negociação)</option>
                    <option value="won">WON (Fechado/Ganho)</option>
                    <option value="lost">LOST (Perdido)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">NOTES_TECHNICAL</label>
                <textarea
                  placeholder="Detalhamento técnico da dor ou necessidade..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary resize-none focus:outline-none focus:border-border-focus"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-hover text-text-primary font-technical text-xs font-bold py-2.5 mt-2 flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> EXECUTING...
                  </>
                ) : (
                  <>
                    <Plus size={14} /> INSERT_LEAD_RECORD
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Database Leads Table Panel */}
          <div className="lg:col-span-2 bg-surface border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-3">
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest">DATABASE_QUERY_RECORDS</span>
              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou empresa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black border border-border pl-9 pr-3 py-1.5 text-xs font-technical text-text-primary w-full sm:w-56 focus:outline-none focus:border-border-focus"
                />
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <Loader2 size={24} className="text-primary animate-spin" />
                <span className="font-technical text-xs text-text-muted tracking-wider">RETRIEVING_DATA_STREAM...</span>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-black/20">
                <span className="font-technical text-xs text-text-muted">Nenhum registro de lead encontrado.</span>
                <span className="font-technical text-[10px] text-primary">Insira um novo registro ao lado para iniciar.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-technical text-[9px] font-bold tracking-widest bg-black/40">
                      <th className="py-2.5 px-3">RECORD_LEAD</th>
                      <th className="py-2.5 px-3">COMPANY</th>
                      <th className="py-2.5 px-3">DEAL_VALUE</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="font-technical text-xs">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border hover:bg-black/20 transition-colors duration-100">
                        {/* Lead Info */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-text-primary">{lead.name}</span>
                            <span className="text-[10px] text-text-muted mt-0.5">{lead.email || "N/A"}</span>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="py-3 px-3">
                          <span className="text-text-secondary">{lead.company}</span>
                        </td>

                        {/* Deal Value */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-text-primary">
                            R$ {(lead.value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                          </span>
                        </td>

                        {/* Status Selection / Badge */}
                        <td className="py-3 px-3">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                            className={`px-1.5 py-0.5 border text-[10px] font-bold tracking-tight bg-black ${
                              lead.status === "won"
                                ? "border-status-success/30 text-status-success"
                                : lead.status === "lost"
                                ? "border-status-danger/30 text-status-danger"
                                : lead.status === "audit_proposed"
                                ? "border-primary/40 text-primary"
                                : lead.status === "negotiating"
                                ? "border-status-warning/30 text-status-warning"
                                : "border-border text-text-secondary"
                            }`}
                          >
                            <option value="captured">CAPTURED</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="audit_proposed">PROPOSED</option>
                            <option value="negotiating">NEGOTIATING</option>
                            <option value="won">WON</option>
                            <option value="lost">LOST</option>
                          </select>
                        </td>

                        {/* Quick Delete */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1 text-text-muted hover:text-status-danger hover:border-status-danger/20 transition-all border border-transparent duration-100"
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
      </div>
    </DashboardShell>
  );
}
