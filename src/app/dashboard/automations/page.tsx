"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { supabase } from "@/lib/supabase";
import { 
  Cpu, 
  Play, 
  Terminal as TermIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Clock, 
  Trash2, 
  Search, 
  RefreshCw 
} from "lucide-react";

interface AutomationLog {
  id: string;
  created_at: string;
  name: string;
  status: string;
  details: string;
}

export default function AutomationsPage() {
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [triggering, setTriggering] = useState<boolean>(false);

  // Form states
  const [webhookType, setWebhookType] = useState("n8n_crm_sync");
  const [triggerStatus, setTriggerStatus] = useState("success");
  const [simulatedDetails, setSimulatedDetails] = useState("");

  // Fetch real logs from Supabase
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("automations_log")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Erro ao recuperar logs do banco:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Simulate Trigger and insert to Supabase
  const handleSimulateTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriggering(true);

    let automationName = "";
    let payloadDetails = "";

    // Mapeamento de payloads realistas em português
    if (webhookType === "n8n_crm_sync") {
      automationName = "Sincronização n8n: Registro de Lead Integrado";
      payloadDetails = JSON.stringify({
        evento: "lead.criado",
        origem: "n8n_webhook_node",
        dados: {
          empresa_cliente: "Nodus Corp",
          valor_contrato: 12500,
          autenticado: true,
          latencia_ms: 18
        }
      }, null, 2);
    } else if (webhookType === "telegram_bot") {
      automationName = "Robô Telegram: Despacho de OS de Manutenção";
      payloadDetails = JSON.stringify({
        evento: "telegram.mensagem_enviada",
        operador_destino: "ZR_Operator",
        mensagem: "ALERTA_OS_416: Falha crítica na prensa hidráulica 02. Manutenção preventiva acionada imediatamente.",
        status: "despachado"
      }, null, 2);
    } else if (webhookType === "stripe_billing") {
      automationName = "Webhook Stripe: Faturamento Verificado";
      payloadDetails = JSON.stringify({
        evento: "invoice.payment_succeeded",
        cliente: "cus_Ramos412",
        valor_pago: 7500.00,
        moeda: "brl"
      }, null, 2);
    } else {
      automationName = "Supabase Auth: Link de Perfil Automatizado";
      payloadDetails = JSON.stringify({
        evento: "auth.usuario_criado",
        esquema: "public.profiles",
        gatilho: "after_user_inserted_hook"
      }, null, 2);
    }

    try {
      const { error } = await supabase.from("automations_log").insert([
        {
          name: automationName,
          status: triggerStatus,
          details: payloadDetails
        }
      ]);

      if (error) throw error;

      // Reset simulated details visual box
      setSimulatedDetails(payloadDetails);

      // Refresh list
      fetchLogs();
    } catch (err) {
      console.error("Erro ao simular disparo de webhook:", err);
    } finally {
      setTriggering(false);
    }
  };

  // Delete log
  const handleDeleteLog = async (id: string) => {
    try {
      const { error } = await supabase.from("automations_log").delete().eq("id", id);
      if (error) throw error;
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Erro ao deletar log de automação:", err);
    }
  };

  // Metrics
  const totalLogs = logs.length;
  const successCount = logs.filter((l) => l.status === "success").length;
  const successRate = totalLogs > 0 ? ((successCount / totalLogs) * 100).toFixed(1) : "100.0";

  // Filter logs by search query
  const filteredLogs = logs.filter(
    (log) =>
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              <Cpu size={18} className="text-primary animate-pulse" /> PAINEL CENTRAL DE AUTOMACÕES
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Rastreador de logs de integração das automações ativas (n8n, Stripe, Telegram Bots e Webhooks).
            </p>
          </div>
          <button
            onClick={fetchLogs}
            className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary transition-colors"
          >
            RECARREGAR LOGS
          </button>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">TOTAL DE LOGS EXECUTADOS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{totalLogs}</span>
              <span className="font-technical text-[9px] font-bold text-status-success">ATIVO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">TAXA DE SUCESSO DO SISTEMA</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-success">{successRate}%</span>
              <span className="font-technical text-[9px] font-bold text-status-success">OTIMIZADO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">TÚNEIS DE WEBHOOK ATIVOS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">4</span>
              <span className="font-technical text-[9px] font-bold text-primary">ONLINE E SEGURO</span>
            </div>
          </div>
        </div>

        {/* Action Panel and Logs Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Action: Trigger Simulated Webhook */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface border border-border p-5">
              <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
                <Play size={14} className="text-primary" /> SIMULAR DISPARO DE WEBHOOK
              </h3>
              <form onSubmit={handleSimulateTrigger} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">TÚNEL DO WEBHOOK *</label>
                  <select
                    required
                    value={webhookType}
                    onChange={(e) => setWebhookType(e.target.value)}
                    className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  >
                    <option value="n8n_crm_sync">n8n CRM Sync (Sincronização de Lead)</option>
                    <option value="telegram_bot">Telegram Bot (Alerta de Despacho de OS)</option>
                    <option value="stripe_billing">Faturamento Stripe (Webhook de Invoice)</option>
                    <option value="supabase_auth">Gatilho Supabase (Sincronização de Perfil)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">STATUS DA RESPOSTA</label>
                  <select
                    required
                    value={triggerStatus}
                    onChange={(e) => setTriggerStatus(e.target.value)}
                    className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  >
                    <option value="success">SUCESSO (200 OK)</option>
                    <option value="failed">FALHA (500 ERR)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={triggering}
                  className="w-full bg-primary hover:bg-primary-hover text-text-primary font-technical text-xs font-bold py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {triggering ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> ENVIANDO...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} className="animate-spin-slow" /> ENVIAR PAYLOAD DE TESTE
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Embedded Terminal Payload viewer */}
            <div className="bg-black border border-border p-5 h-72 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-border/30 pb-2 mb-3 text-text-secondary">
                <span className="font-technical text-[10px] font-bold tracking-widest flex items-center gap-1.5">
                  <TermIcon size={12} className="text-primary animate-pulse" /> CONSOLE DE PAYLOAD SIMULADO
                </span>
                <span className="font-technical text-[9px] font-bold text-text-muted">JSON_SCHEMA</span>
              </div>
              
              <div className="flex-1 overflow-y-auto font-technical text-[10px] text-text-secondary leading-normal bg-black p-2 max-h-52 font-mono whitespace-pre">
                {simulatedDetails ? (
                  <span className="text-status-success">{simulatedDetails}</span>
                ) : (
                  <span className="text-text-muted italic">[CONSOLE_STANDBY] Dispare um payload ao lado para carregar o log de detalhes em JSON...</span>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Automation Logs Ledger */}
          <div className="lg:col-span-2 bg-surface border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-3">
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest flex items-center gap-1.5">
                <Clock size={14} className="text-primary" /> HISTÓRICO OPERACIONAL EM TEMPO REAL
              </span>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Pesquisar logs por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black border border-border pl-9 pr-3 py-1.5 text-xs font-technical text-text-primary w-full sm:w-56 focus:outline-none focus:border-border-focus"
                />
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <Loader2 size={24} className="text-primary animate-spin" />
                <span className="font-technical text-xs text-text-muted tracking-wider">BUSCANDO LOGS DE AUTOMAÇÕES...</span>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-black/20">
                <span className="font-technical text-xs text-text-muted">Nenhum log de automação registrado no banco.</span>
                <span className="font-technical text-[10px] text-primary">Dispare um payload de teste ao lado para iniciar.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-technical text-[9px] font-bold tracking-widest bg-black/40">
                      <th className="py-2.5 px-3">DATA VAL</th>
                      <th className="py-2.5 px-3">NOME DA AUTOMAÇÃO</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3">PRÉ-VISUALIZAÇÃO DO PAYLOAD</th>
                      <th className="py-2.5 px-3 text-right">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="font-technical text-xs">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border hover:bg-black/20 transition-colors duration-100">
                        {/* Date */}
                        <td className="py-3 px-3 whitespace-nowrap text-text-muted font-bold text-[11px]">
                          {new Date(log.created_at).toLocaleString("pt-BR", { hour12: false })}
                        </td>

                        {/* Automation Name */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-text-primary">{log.name}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold">
                            {log.status === "success" ? (
                              <>
                                <CheckCircle2 size={12} className="text-status-success" />
                                <span className="text-status-success text-[10px] tracking-widest font-bold">200_OK</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle size={12} className="text-status-danger animate-pulse" />
                                <span className="text-status-danger text-[10px] tracking-widest font-bold animate-pulse">500_ERR</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Payload Preview */}
                        <td className="py-3 px-3 max-w-xs">
                          <span className="text-text-secondary truncate block font-mono text-[10px]">
                            {log.details || "N/A"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteLog(log.id)}
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
      </div>
    </DashboardShell>
  );
}
