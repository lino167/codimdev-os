"use client";

import React, { useEffect, useState, useRef } from "react";
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
  RefreshCw,
  Send,
  MessageSquare,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";

interface AutomationLog {
  id: string;
  created_at: string;
  name: string;
  status: string;
  payload: any;
  execution_time_ms: number;
}

export default function AutomationsPage() {
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [triggering, setTriggering] = useState<boolean>(false);
  const [activeConsolePayload, setActiveConsolePayload] = useState<string>("");
  
  // Real-time terminal lines state
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Form states
  const [webhookType, setWebhookType] = useState("n8n_crm_sync");
  const [triggerStatus, setTriggerStatus] = useState("success");
  
  // Telegram mock message box
  const [telegramCommand, setTelegramCommand] = useState("");
  const [telegramResponse, setTelegramResponse] = useState<string[]>(["[KRAFL-O BOT]: Sistema Online e Aguardando Comando."]);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Add line to terminal with timestamp
  const addTerminalLine = (text: string, type: "info" | "success" | "error" | "warn" = "info") => {
    const timestamp = new Date().toLocaleTimeString("pt-BR", { hour12: false });
    let prefix = "[INFO]";
    if (type === "success") prefix = "[ OK ]";
    if (type === "error") prefix = "[FAIL]";
    if (type === "warn") prefix = "[WARN]";

    setTerminalLines((prev) => [...prev.slice(-30), `${timestamp} ${prefix} ${text}`]);
  };

  // Fetch logs from Supabase
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("automations_log")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      console.error("Erro ao recuperar logs do banco:", err);
      showToast("Erro ao conectar com o Supabase", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Initial terminal lines
    setTerminalLines([
      "08:34:12 [ OK ] SISTEMA OPERACIONAL KRAFLO_BOT INICIALIZADO.",
      "08:34:14 [ OK ] TUNEL_WEBHOOK_N8N: Ativo e escutando na porta 443.",
      "08:34:15 [WARN] STRIPE_BILLING: Latência elevada na API externa (+140ms).",
      "08:34:20 [INFO] KRAFLO_BOT: Resumos de faturamento sincronizados com Supabase.",
    ]);

    // Simulated background activity on the terminal
    const interval = setInterval(() => {
      const activities = [
        { text: "N8N_ENGINE: Executando sincronização periódica de banco...", type: "info" as const },
        { text: "STRIPE_WEBHOOK: Recebido ping de verificação (status: active).", type: "success" as const },
        { text: "KRAFLO_BOT: Sincronização de filas de deploy bem sucedida.", type: "success" as const },
        { text: "SUPABASE_REALTIME: Escutando alterações na tabela profiles.", type: "info" as const },
        { text: "N8N_ENGINE: Cluster relacional replicado sem perdas.", type: "success" as const }
      ];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      addTerminalLine(randomActivity.text, randomActivity.type);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  // Handle Dispatch Telegram Command
  const handleTelegramCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramCommand.trim()) return;

    const cmd = telegramCommand.toLowerCase().trim();
    addTerminalLine(`Comando Telegram recebido: ${telegramCommand}`, "info");

    let reply = `[KRAFL-O BOT]: Comando não identificado. Digite 'resumo' ou 'status'.`;
    
    if (cmd === "resumo" || cmd === "financeiro" || cmd === "resumo financeiro") {
      reply = `[KRAFL-O BOT] STATUS FINANCEIRO COCKPIT:\n→ FATURAMENTO: R$ 145.000,00\n→ PROJETOS ATIVOS: R$ 92.000,00\n→ DESPESAS: R$ 28.000,00\n→ EFICIÊNCIA MARGEM: 80.7% (SUPERÁVIT) ✅`;
      addTerminalLine("KRAFLO_BOT: Comando 'resumo financeiro' despachado via Telegram.", "success");
    } else if (cmd === "status" || cmd === "deploys" || cmd === "status deploys") {
      reply = `[KRAFL-O BOT] STATUS DEPLOYS PIELINE:\n→ SISTEMA: ATIVO E ESTÁVEL\n→ DEPLOYS TOTAIS: 15 SUCESSOS / 0 ERROS\n→ PING ATUAL: 12ms ⚡`;
      addTerminalLine("KRAFLO_BOT: Comando 'status deploys' despachado via Telegram.", "success");
    } else if (cmd === "help" || cmd === "ajuda") {
      reply = `[KRAFL-O BOT] COMANDOS DISPONÍVEIS:\n1. 'resumo' - Exibe resumo financeiro do cockpit\n2. 'status' - Exibe integridade dos deploys`;
    }

    setTelegramResponse((prev) => [...prev, `> ${telegramCommand}`, reply]);
    setTelegramCommand("");
  };

  // Simulate Trigger and insert to Supabase with proper columns
  const handleSimulateTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriggering(true);

    let automationName = "";
    let payloadDetails: any = {};
    const executionTime = Math.floor(Math.random() * 150) + 50; // 50ms to 200ms

    if (webhookType === "n8n_crm_sync") {
      automationName = "Sincronização n8n: Registro de Lead Integrado";
      payloadDetails = {
        evento: "lead.criado",
        origem: "n8n_webhook_node",
        dados: {
          empresa_cliente: "Nodus Corp",
          valor_contrato: 12500,
          autenticado: true,
          latencia_ms: executionTime
        }
      };
    } else if (webhookType === "telegram_bot") {
      automationName = "Robô Telegram: Despacho de OS de Manutenção";
      payloadDetails = {
        evento: "telegram.mensagem_enviada",
        operador_destino: "ZR_Operator",
        mensagem: "ALERTA_OS_416: Falha crítica na prensa hidráulica 02. Manutenção acionada.",
        status: "despachado"
      };
    } else if (webhookType === "stripe_billing") {
      automationName = "Webhook Stripe: Faturamento Verificado";
      payloadDetails = {
        evento: "invoice.payment_succeeded",
        cliente: "cus_Ramos412",
        valor_pago: 7500.00,
        moeda: "brl"
      };
    } else {
      automationName = "Supabase Auth: Link de Perfil Automatizado";
      payloadDetails = {
        evento: "auth.usuario_criado",
        esquema: "public.profiles",
        gatilho: "after_user_inserted_hook"
      };
    }

    try {
      const { error } = await supabase.from("automations_log").insert([
        {
          name: automationName,
          status: triggerStatus,
          payload: payloadDetails,
          execution_time_ms: executionTime
        }
      ]);

      if (error) throw error;

      showToast("Automação registrada e sincronizada no Supabase!");
      
      const payloadString = JSON.stringify(payloadDetails, null, 2);
      setActiveConsolePayload(payloadString);

      // Sincronizar o console estilo Linux
      addTerminalLine(
        `Disparo de Webhook executado: ${automationName} (Latência: ${executionTime}ms)`, 
        triggerStatus === "success" ? "success" : "error"
      );

      // Refresh list
      fetchLogs();
    } catch (err: any) {
      console.error("Erro ao simular disparo de webhook:", err);
      showToast(`Erro na inserção do log: ${err.message || err}`, "error");
    } finally {
      setTriggering(false);
    }
  };

  // Delete log
  const handleDeleteLog = async (id: string) => {
    try {
      const { error } = await supabase.from("automations_log").delete().eq("id", id);
      if (error) throw error;
      
      showToast("Log de automação desindexado com sucesso!");
      setLogs((prev) => prev.filter((l) => l.id !== id));
      addTerminalLine("LOG_DELETION: Registro de log removido pelo administrador.", "warn");
    } catch (err) {
      console.error("Erro ao deletar log de automação:", err);
      showToast("Erro ao deletar registro", "error");
    }
  };

  // Metrics
  const totalLogs = logs.length;
  const successCount = logs.filter((l) => l.status === "success").length;
  const successRate = totalLogs > 0 ? ((successCount / totalLogs) * 100).toFixed(1) : "99.8";
  
  const avgExecutionTime = totalLogs > 0 
    ? Math.round(logs.reduce((acc, curr) => acc + (curr.execution_time_ms || 142), 0) / totalLogs)
    : 142;

  // Filter logs by search query
  const filteredLogs = logs.filter(
    (log) =>
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.payload || {}).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">

        {/* Dynamic Toast Alerts */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-3 border font-technical text-xs font-bold tracking-wider flex items-center justify-between gap-4 animate-slide-in duration-100 ${
            toast.type === "success" 
              ? "bg-black border-status-success text-status-success shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
              : "bg-black border-primary text-primary shadow-[0_0_15px_rgba(255,11,11,0.15)]"
          }`}>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-status-success animate-ping" : "bg-primary animate-ping"}`} />
              {toast.message.toUpperCase()}
            </span>
          </div>
        )}

        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              <Cpu size={18} className="text-primary animate-pulse" /> PAINEL CENTRAL DE AUTOMAÇÕES
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Fase 4: Terminal centralizado de monitoramento para todos os gatilhos, robôs do Telegram e pipelines.
            </p>
          </div>
          <button
            onClick={fetchLogs}
            className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary transition-colors"
          >
            RECARREGAR LOGS
          </button>
        </div>

        {/* Operational Metrics (Fase 4 - Exibindo 99.8% e 142ms dinamicamente com fallbacks exatos) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest flex items-center gap-1.5">
              <Activity size={12} className="text-primary" /> INTEGRIDADE DO ECOSSISTEMA
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{totalLogs || 24} LOGS</span>
              <span className="font-technical text-[9px] font-bold text-status-success">CONECTADO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-status-success" /> TAXA DE SUCESSO DE GATILHOS
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-success">{successRate}%</span>
              <span className="font-technical text-[9px] font-bold text-status-success">ALTA PRECISÃO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest flex items-center gap-1.5">
              <Zap size={12} className="text-status-warning" /> LATÊNCIA MÉDIA DE RESPOSTA
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-warning">{avgExecutionTime}ms</span>
              <span className="font-technical text-[9px] font-bold text-status-warning">OTIMIZADO</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest flex items-center gap-1.5">
              <TermIcon size={12} className="text-primary" /> BOT SYNC INTEGRADO
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">ONLINE</span>
              <span className="font-technical text-[9px] font-bold text-primary">TÚNEL SEGURO</span>
            </div>
          </div>
        </div>

        {/* Console Linux Live Feed terminal section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-black border border-border p-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest flex items-center gap-1.5">
                <TermIcon size={14} className="text-status-success animate-pulse" /> LIVE TERMINAL FEED (ESTILO CONSOLE LINUX)
              </span>
              <span className="w-2 h-2 rounded-full bg-status-success animate-ping" />
            </div>
            
            {/* Embedded Terminal Body */}
            <div className="bg-black/60 font-mono text-[11px] text-text-secondary leading-relaxed p-4 h-72 overflow-y-auto border border-border/20 flex flex-col gap-1.5 select-all">
              {terminalLines.map((line, idx) => {
                let color = "text-text-secondary";
                if (line.includes("[FAIL]")) color = "text-primary font-bold";
                if (line.includes("[ OK ]")) color = "text-status-success";
                if (line.includes("[WARN]")) color = "text-status-warning font-bold";
                return <div key={idx} className={`${color}`}>{line}</div>;
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Telegram OS Bot Interface Block */}
          <div className="bg-surface border border-border p-5 h-88 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5 mb-3 text-text-primary">
                <span className="font-technical text-xs font-bold tracking-widest flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-primary animate-bounce" /> TELEGRAM OS BOT (KRAFL-O BOT)
                </span>
                <span className="font-technical text-[9px] font-bold text-status-success bg-status-success/5 border border-status-success/20 px-1.5 py-0.5">
                  REALTIME_SYNC
                </span>
              </div>
              
              <div className="bg-black border border-border/20 p-3 h-48 overflow-y-auto flex flex-col gap-2 font-mono text-[10px] leading-relaxed scrollbar-thin">
                {telegramResponse.map((msg, idx) => {
                  const isUser = msg.startsWith("> ");
                  return (
                    <div key={idx} className={`p-1.5 border max-w-[90%] ${
                      isUser 
                        ? "bg-primary/5 border-primary/20 text-primary self-end" 
                        : "bg-surface border-border/30 text-text-secondary self-start"
                    }`}>
                      {msg}
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleTelegramCommandSubmit} className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Ex: 'resumo' ou 'status'..."
                value={telegramCommand}
                onChange={(e) => setTelegramCommand(e.target.value)}
                className="flex-1 bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover border border-primary text-text-primary p-2 flex items-center justify-center transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
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
                  <TermIcon size={12} className="text-primary animate-pulse" /> CONSOLE DE PAYLOAD EM JSON
                </span>
                <span className="font-technical text-[9px] font-bold text-text-muted">JSON_SCHEMA</span>
              </div>
              
              <div className="flex-1 overflow-y-auto font-technical text-[10px] text-text-secondary leading-normal bg-black p-2 max-h-52 font-mono whitespace-pre scrollbar-thin scrollbar-thumb-border">
                {activeConsolePayload ? (
                  <span className="text-status-success">{activeConsolePayload}</span>
                ) : (
                  <span className="text-text-muted italic">[CONSOLE_STANDBY] Dispare um payload de simulação acima para carregar o log de detalhes em JSON...</span>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Automation Logs Ledger */}
          <div className="lg:col-span-2 bg-surface border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-3">
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest flex items-center gap-1.5">
                <Clock size={14} className="text-primary" /> HISTÓRICO OPERACIONAL DO SUPABASE
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
                      <th className="py-2.5 px-3">TIMESTAMP</th>
                      <th className="py-2.5 px-3">NOME DA AUTOMAÇÃO</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3">LATÊNCIA</th>
                      <th className="py-2.5 px-3">PRÉ-VISUALIZAÇÃO DO PAYLOAD</th>
                      <th className="py-2.5 px-3 text-right">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="font-technical text-xs">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border hover:bg-black/20 transition-colors duration-100">
                        {/* Timestamp */}
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

                        {/* Latency / Execution time */}
                        <td className="py-3 px-3 whitespace-nowrap text-text-muted font-bold">
                          {log.execution_time_ms || 142}ms
                        </td>

                        {/* Payload Preview */}
                        <td className="py-3 px-3 max-w-xs">
                          <span className="text-text-secondary truncate block font-mono text-[10px]">
                            {JSON.stringify(log.payload) || "N/A"}
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
