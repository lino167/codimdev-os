"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
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
  Trash2 
} from "lucide-react";

interface Transaction {
  id: string;
  created_at: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("project");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Fetch real financial transactions from Supabase on mount
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select("*")
        .order("date", { ascending: false });

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
          date,
        },
      ]);

      if (error) throw error;

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

  const netProfit = totalIncomes - totalExpenses;
  const profitMargin = totalIncomes > 0 ? ((netProfit / totalIncomes) * 100).toFixed(1) : "0.0";

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
              <DollarSign size={18} className="text-primary animate-pulse" /> PAINEL DE CONTROLE FINANCEIRO
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Rastreador de fluxo de caixa corporativo e liquidez da agência integrado ao Supabase.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTransactions}
              className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary active:scale-[0.98] transition-transform duration-75"
            >
              SINCRONIZAR FINANCEIRO
            </button>
          </div>
        </div>

        {/* Cash Flow Balance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest flex items-center gap-1.5">
              <TrendingUp size={12} className="text-status-success" /> RECEITA BRUTA TOTAL
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-success">
                R$ {totalIncomes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <span className="font-technical text-[9px] font-bold text-status-success">+ ENTRADAS</span>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest flex items-center gap-1.5">
              <TrendingDown size={12} className="text-status-danger animate-pulse" /> DESPESAS TOTAIS
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-danger">
                R$ {totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <span className="font-technical text-[9px] font-bold text-status-danger">- SAÍDAS</span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">SALDO LÍQUIDO GERAL</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className={`font-technical text-2xl font-bold ${
                netProfit >= 0 ? "text-text-primary" : "text-status-danger"
              }`}>
                R$ {netProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <span className={`font-technical text-[9px] font-bold ${
                netProfit >= 0 ? "text-status-success" : "text-status-danger"
              }`}>
                {netProfit >= 0 ? "SUPERÁVIT" : "DÉFICIT"}
              </span>
            </div>
          </div>

          {/* Profit Margin */}
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">MARGEM LÍQUIDA ACUMULADA</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">
                {profitMargin}%
              </span>
              <span className="font-technical text-[9px] font-bold text-status-success">EFICIÊNCIA</span>
            </div>
          </div>
        </div>

        {/* Input Form and Data Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Quick Insert Transaction Form */}
          <div className="bg-surface border border-border p-5">
            <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
              <Plus size={14} className="text-primary" /> LANÇAR NOVA TRANSAÇÃO
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
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">DATA DA TRANSAÇÃO</label>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary w-full focus:outline-none focus:border-border-focus"
                    />
                  </div>
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
                    <Plus size={14} /> SALVAR REGISTRO NO LIVRO-CAIXA
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Database Financial Ledger Panel */}
          <div className="lg:col-span-2 bg-surface border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-3">
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest">HISTÓRICO DO LIVRO-CAIXA</span>
              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Pesquisar descrição ou categoria..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black border border-border pl-9 pr-3 py-1.5 text-xs font-technical text-text-primary w-full sm:w-56 focus:outline-none focus:border-border-focus"
                />
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <Loader2 size={24} className="text-primary animate-spin" />
                <span className="font-technical text-xs text-text-muted tracking-wider">CARREGANDO LIVRO-CAIXA FINANCEIRO...</span>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-black/20">
                <span className="font-technical text-xs text-text-muted">Nenhum lançamento financeiro encontrado no livro-caixa.</span>
                <span className="font-technical text-[10px] text-primary">Poste um novo registro ao lado para iniciar o balancete.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-technical text-[9px] font-bold tracking-widest bg-black/40">
                      <th className="py-2.5 px-3">DATA VAL</th>
                      <th className="py-2.5 px-3">DESCRIÇÃO</th>
                      <th className="py-2.5 px-3">CATEGORIA</th>
                      <th className="py-2.5 px-3">VALOR DO FLUXO</th>
                      <th className="py-2.5 px-3 text-right">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="font-technical text-xs">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="border-b border-border hover:bg-black/20 transition-colors duration-100">
                        {/* Transaction Date */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-text-muted font-bold text-[11px]">{t.date}</span>
                        </td>

                        {/* Description */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-text-primary">{t.description}</span>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className="text-text-secondary text-[11px] font-semibold bg-surface px-2 py-0.5 border border-border/40 uppercase">
                            {t.category}
                          </span>
                        </td>

                        {/* Value Amount with Indicator */}
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

                        {/* Delete Action */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
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
