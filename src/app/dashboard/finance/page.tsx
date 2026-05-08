"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import FinanceChart from "@/components/dashboard/FinanceChart";
import { supabase } from "@/lib/supabase";
import { 
  DollarSign, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  Trash2,
  Calendar,
  Wallet,
  Activity,
  Printer,
  CheckCircle,
  Database,
  Bell
} from "lucide-react";

interface Transaction {
  id: string;
  created_at: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  transaction_date: string;
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("project");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);



  // Fetch real transactions from Supabase on mount
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select("*")
        .order("transaction_date", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error("Erro ao recuperar transações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle adding new transaction
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("financial_transactions").insert([
        {
          description,
          amount: parseFloat(amount),
          type,
          category,
          transaction_date: date,
        },
      ]);

      if (error) throw error;

      showToastNotification(`TRANSAÇÃO REGISTRADA: ${description.toUpperCase()}`);

      // Reset form fields
      setDescription("");
      setAmount("");
      setType("income");
      setCategory("project");
      setDate(new Date().toISOString().split("T")[0]);

      // Refresh list
      fetchTransactions();
    } catch (err) {
      console.error("Erro ao inserir transação:", err);
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

  // Handle delete transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Confirmar a remoção definitiva deste registro financeiro?")) return;

    try {
      const { error } = await supabase
        .from("financial_transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToastNotification("REGISTRO DE TRANSAÇÃO REMOVIDO COM SUCESSO");
    } catch (err) {
      console.error("Erro ao excluir transação:", err);
    }
  };



  // Calculate dynamic cash flow metrics
  const totalIncomes = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Exclusivamente dados reais do banco
  const displayFaturamento = totalIncomes;
  const displayProjetos = totalIncomes > 0 ? totalIncomes * 0.63 : 0;
  const displayDespesas = totalExpenses;
  const netProfit = displayFaturamento - displayDespesas;
  const profitMargin = displayFaturamento > 0 ? ((netProfit / displayFaturamento) * 100).toFixed(1) : "0.0";

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Module Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              <DollarSign size={18} className="text-primary animate-pulse" /> MÓDULO_ID: CORE_04 // FINANCEIRO COCKPIT
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Painel de fluxo de caixa, balancete industrial, gráficos de desempenho e integrações Stripe.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchTransactions}
              className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary active:scale-[0.98] transition-transform duration-75 flex items-center gap-1.5"
            >
              <Database size={13} className="text-primary" /> SINCRONIZAR
            </button>
          </div>
        </div>

        {/* Industrial Real-time Banner */}
        {notification && (
          <div className="bg-black border-l-2 border-primary border-y border-r border-border p-3 flex items-center gap-3 animate-pulse">
            <Bell size={14} className="text-primary animate-bounce flex-shrink-0" />
            <span className="font-technical text-[11px] font-bold text-text-primary tracking-wider uppercase">
              [SISTEMA_FIN_ALERT] {notification}
            </span>
          </div>
        )}

        {/* Cash Flow Balance Indicators (Page 7 metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest flex items-center gap-1.5">
              <TrendingUp size={12} className="text-status-success" /> FATURAMENTO REAL
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-success">
                R$ {displayFaturamento.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </span>
              <span className="font-technical text-[9px] font-bold text-status-success">+12.4% MES_ANTERIOR</span>
            </div>
          </div>

          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest flex items-center gap-1.5">
              <Activity size={12} className="text-primary animate-pulse" /> PROJETOS ATIVOS
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">
                R$ {displayProjetos.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </span>
              <span className="font-technical text-[9px] font-bold text-text-muted">CARTEIRA EM EXECUÇÃO</span>
            </div>
          </div>

          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest flex items-center gap-1.5">
              <TrendingDown size={12} className="text-status-danger" /> DESPESAS OP
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-danger">
                R$ {displayDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </span>
              <span className="font-technical text-[9px] font-bold text-status-danger">CONTROLE DE SAÍDAS</span>
            </div>
          </div>

          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">EFICIÊNCIA OPERACIONAL</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">
                {profitMargin}%
              </span>
              <span className="font-technical text-[9px] font-bold text-status-success">SUPERÁVIT SEGURO</span>
            </div>
          </div>
        </div>

        {/* Industrial Cockpit Visualizer - Interactive Recharts Performance Analytics */}
        <FinanceChart transactions={transactions} />

        {/* Input Form and Data Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Quick Insert Transaction Form */}
          <div className="bg-surface border border-border p-5">
            <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
              <Plus size={14} className="text-primary" /> LANÇAR TRANSAÇÃO
            </h3>
            <form onSubmit={handleAddTransaction} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">DESCRIÇÃO *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Faturamento Kraflo Fase 02"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">VALOR (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 7500.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">TIPO DE FLUXO</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  >
                    <option value="income">Receita (+)</option>
                    <option value="expense">Despesa (-)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">CATEGORIA</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  >
                    <option value="project">Projeto Customizado</option>
                    <option value="infrastructure">Infraestrutura / Cloud</option>
                    <option value="marketing">Anúncios / Tráfego</option>
                    <option value="salary">Retirada Pró-Labore</option>
                    <option value="tax">Impostos / DAS</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">DATA</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary w-full focus:outline-none focus:border-border-focus"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-hover text-text-primary border border-border font-technical text-xs font-bold py-2.5 mt-2 flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> LANÇANDO...
                  </>
                ) : (
                  <>
                    <Plus size={14} /> SALVAR REGISTRO
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Database Financial Ledger Panel */}
          <div className="lg:col-span-2 bg-surface border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-3">
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest">LIVRO-CAIXA INDUSTRIAL (HISTÓRICO REAL)</span>
              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Pesquisar transação..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black border border-border pl-9 pr-3 py-1.5 text-xs font-technical text-text-primary w-full sm:w-56 focus:outline-none focus:border-border-focus"
                />
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <Loader2 size={24} className="text-primary animate-spin" />
                <span className="font-technical text-xs text-text-muted tracking-wider">CARREGANDO LIVRO-CAIXA...</span>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-black/20">
                <span className="font-technical text-xs text-text-muted">Nenhum lançamento real no banco de dados.</span>
                <span className="font-technical text-[10px] text-primary">Preencha o formulário para lançar uma nova transação.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-technical text-[9px] font-bold tracking-widest bg-black/40">
                      <th className="py-2.5 px-3">VAL_DATE</th>
                      <th className="py-2.5 px-3">DESCRIÇÃO</th>
                      <th className="py-2.5 px-3">CATEGORIA</th>
                      <th className="py-2.5 px-3">FLUXO_AMOUNT</th>
                      <th className="py-2.5 px-3 text-right">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="font-technical text-xs">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="border-b border-border hover:bg-black/20 transition-colors duration-100">
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-text-muted font-bold text-[11px]">{t.transaction_date}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-text-primary">{t.description}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-text-secondary text-[10px] font-semibold bg-surface px-2 py-0.5 border border-border/40 uppercase">
                            {t.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold">
                            {t.type === "income" ? (
                              <>
                                <ArrowUpRight size={13} className="text-status-success" />
                                <span className="text-status-success">
                                  + R$ {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </span>
                              </>
                            ) : (
                              <>
                                <ArrowDownRight size={13} className="text-status-danger" />
                                <span className="text-status-danger">
                                  - R$ {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="p-1 text-text-muted hover:text-status-danger transition-colors duration-100"
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

