"use client";

import { useState } from "react";
import { 
  Terminal, 
  Code2, 
  CheckCircle2, 
  Wrench, 
  Bot, 
  Database 
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function PortfolioPage() {
  const [selectedCase, setSelectedCase] = useState<number>(0);

  const cases = [
    {
      title: "Bot OS Kraflo",
      category: "AUTOMAÇÃO DE CAMPO",
      icon: Bot,
      problem: "Técnicos de campo perdiam tempo excessivo preenchendo planilhas manuais e gerando ordens de serviço físicas após manutenções industriais complexas.",
      solution: "Desenvolvimento de uma máquina de estados robusta via Telegram Bot em Python para despacho rápido de Ordens de Serviço e geração de PDFs profissionais em tempo real via fpdf2.",
      result: "Redução de 85% no tempo de preenchimento e centralização total dos despachos de manutenção.",
      code: `import os
from telegram.ext import Application, CommandHandler, MessageHandler, filters
from fpdf import FPDF

class OrdemServicoPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 12)
        self.cell(0, 10, "KRAFLO INDUSTRIAL - ORDEM DE SERVICO", border=True, ln=True, align="C")

async def start_handler(update, context):
    await update.message.reply_text(
        "📝 SISTEMA OS KRAFLO ACTIVO\\n"
        "Envie o codigo da máquina para iniciar o despacho operacional..."
    )

def generate_pdf_report(os_id, machine_code, details):
    pdf = OrdemServicoPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=10)
    pdf.cell(0, 10, f"OS ID: {os_id}", ln=True)
    pdf.cell(0, 10, f"Maquina: {machine_code}", ln=True)
    pdf.multi_cell(0, 10, f"Relatorio Tecnico: {details}")
    pdf.output(f"reports/OS_{os_id}.pdf")
`
    },
    {
      title: "CRM Imobiliário",
      category: "SISTEMAS CORPORATIVOS",
      icon: Database,
      problem: "Dificuldade na distribuição instantânea e persistente de leads capturados em campanhas de tráfego pago para corretores autônomos de imobiliárias de alto padrão.",
      solution: "Criação de um backend modular em Python integrado ao Postgres/Supabase com separação clara de rotas de handlers, controle dinâmico de pipeline de vendas e gatilhos de automação.",
      result: "Sincronização em tempo real de novos leads em menos de 100ms e aumento de 42% no tempo de resposta inicial.",
      code: `import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function insertNewLead(leadData) {
  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        name: leadData.name,
        company: leadData.company,
        email: leadData.email,
        phone: leadData.phone,
        status: "captured",
        source: "landing_page",
        value: leadData.value || 0,
        notes: leadData.notes || ""
      }
    ]);
    
  if (error) throw error;
  return data;
}`
    },
    {
      title: "Kraflo-CMMS",
      category: "SOFTWARE INDUSTRIAL",
      icon: Wrench,
      problem: "Sistemas CMMS corporativos tradicionais são lentos, excessivamente burocráticos e distantes da rotina acelerada do chão de fábrica industrial.",
      solution: "Software híbrido de controle de ativos e manutenção preditiva integrado com persistência de dados local (SQLite) e sincronização redundante com nuvem para operação offline sustentada.",
      result: "Monitoramento de mais de 150 ativos de produção com zero perda de dados durante falhas temporárias de conexão física de rede.",
      code: `import sqlite3

def init_local_database():
    conn = sqlite3.connect("database/local_assets.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS local_assets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_code TEXT UNIQUE,
            name TEXT,
            status TEXT,
            last_maintenance DATE,
            synced_to_cloud INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

def log_maintenance_activity(asset_code, technician, status):
    conn = sqlite3.connect("database/local_assets.db")
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE local_assets 
        SET status = ?, last_maintenance = datetime('now'), synced_to_cloud = 0 
        WHERE asset_code = ?
    """, (status, asset_code))
    conn.commit()
    conn.close()
`
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF0B0B] selection:text-white flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 border border-[#2E3A2F] bg-[#0a0a0a] px-3 py-1.5 rounded-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF0B0B] animate-pulse" />
            <span className="font-technical text-[10px] text-[#A1A1AA] tracking-widest uppercase">
              Provas de Autoridade Técnica
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-medium leading-tight">
            Pragmatismo Industrial & <br className="hidden sm:block" />
            <span className="text-[#FF0B0B] font-semibold">Engenharia de Precisão</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-xl">
            Nossos cases refletem a união real entre o entendimento do chão de fábrica e o desenvolvimento de software robusto. Explore as soluções construídas:
          </p>
        </div>

        {/* Case Selector and Code Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Bento Case Grid Links */}
          <div className="lg:col-span-5 space-y-4">
            {cases.map((cs, idx) => {
              const Icon = cs.icon;
              return (
                <div
                  key={cs.title}
                  onClick={() => setSelectedCase(idx)}
                  className={`border rounded-sm p-6 cursor-pointer text-left transition-all relative overflow-hidden group ${
                    selectedCase === idx
                      ? "border-[#FF0B0B] bg-[#0a0a0a]"
                      : "border-[#2E3A2F] bg-black hover:border-white/50"
                  }`}
                >
                  <div className="absolute top-0 right-0 h-16 w-16 bg-red-600/[0.01] rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="font-technical text-[10px] text-[#FF0B0B] tracking-widest uppercase font-bold">
                      {cs.category}
                    </span>
                    <Icon className={`h-4 w-4 ${selectedCase === idx ? "text-[#FF0B0B]" : "text-[#52525B]"}`} />
                  </div>

                  <h3 className="font-technical text-sm font-bold uppercase tracking-wider text-white mb-2">
                    {cs.title}
                  </h3>

                  <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                    {cs.solution}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Code Viewer and Terminal */}
          <div className="lg:col-span-7 border border-[#2E3A2F] bg-[#020202] rounded-sm relative flex flex-col min-h-[450px]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2E3A2F] bg-[#0a0a0a]">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#FF0B0B]" />
                <span className="font-technical text-[10px] text-[#A1A1AA] tracking-wider uppercase font-bold">
                  terminal_engine_preview // {cases[selectedCase].title.toLowerCase().replace(" ", "_")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              </div>
            </div>

            {/* Core Body: Info and Code */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Problem & Solution block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="font-technical text-[9px] text-[#52525B] uppercase tracking-wider">DIAGNÓSTICO</div>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed">
                      {cases[selectedCase].problem}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="font-technical text-[9px] text-[#FF0B0B] uppercase tracking-wider">ATIVO CONSTRUÍDO</div>
                    <p className="text-xs text-white leading-relaxed font-medium">
                      {cases[selectedCase].solution}
                    </p>
                  </div>
                </div>

                {/* Highlighted Result */}
                <div className="border border-[#2E3A2F] bg-black p-4 rounded-sm flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10B981] mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-technical text-[9px] text-[#10B981] uppercase tracking-wider font-bold">RESULTADO TANGÍVEL</div>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed">
                      {cases[selectedCase].result}
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="mt-8 pt-6 border-t border-[#2E3A2F]">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="h-3.5 w-3.5 text-[#52525B]" />
                  <span className="font-technical text-[9px] text-[#52525B] uppercase tracking-wider font-bold">EXTRATO DE CÓDIGO FONTE</span>
                </div>
                <div className="bg-black/80 rounded-sm p-4 border border-[#2E3A2F] overflow-x-auto max-h-52">
                  <pre className="font-technical text-[10px] text-[#A1A1AA] leading-relaxed">
                    <code>{cases[selectedCase].code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
