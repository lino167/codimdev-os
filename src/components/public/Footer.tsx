"use client";

import Link from "next/link";
import { Cpu, ShieldCheck, Activity, Terminal } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#050505] pt-20 pb-10 text-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start mb-16">
          {/* Logo & Manifesto */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <span className="font-technical text-xs tracking-widest uppercase text-neutral-400">
                CODIMDEV // SYSTEMS
              </span>
            </div>
            
            <p className="max-w-sm text-sm text-neutral-500 leading-relaxed font-light">
              Unindo o pragmatismo do chão de fábrica à engenharia de software de elite. 
              Blindamos fluxos de trabalho e construímos ativos digitais de alta tração operacional.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-[10px] font-technical text-neutral-500 border border-white/5 px-2.5 py-1 rounded-full bg-white/[0.02]">
                <Cpu className="h-3 w-3 text-primary animate-pulse" />
                LATÊNCIA: &lt; 12MS
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-technical text-neutral-500 border border-white/5 px-2.5 py-1 rounded-full bg-white/[0.02]">
                <ShieldCheck className="h-3 w-3 text-status-success" />
                CRIPTOGRAFIA: AES-256
              </div>
            </div>
          </div>

          {/* Sitemap Links */}
          <div>
            <h3 className="font-technical text-xs font-medium uppercase tracking-widest text-white mb-6">
              Mapa do Sistema
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="font-technical text-xs text-neutral-500 hover:text-white transition-colors">
                  [ 01 ] INÍCIO
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="font-technical text-xs text-neutral-500 hover:text-primary transition-colors">
                  [ 02 ] DIAGNÓSTICO
                </Link>
              </li>
              <li>
                <Link href="/performance" className="font-technical text-xs text-neutral-500 hover:text-primary transition-colors">
                  [ 03 ] PERFORMANCE LPS
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="font-technical text-xs text-neutral-500 hover:text-primary transition-colors">
                  [ 04 ] PORTFÓLIO
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Links */}
          <div>
            <h3 className="font-technical text-xs font-medium uppercase tracking-widest text-white mb-6">
              Terminal de Controle
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 font-technical text-xs text-neutral-500">
                <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
                TELEMETRIA: ATIVA
              </li>
              <li className="font-technical text-xs text-neutral-600">
                VERSÃO: v1.1.0-STABLE
              </li>
              <li>
                <Link href="/login" className="font-technical text-xs text-neutral-500 hover:text-white transition-colors border-b border-white/10 pb-0.5">
                  Acesso Restrito
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-technical text-[10px] text-neutral-600 tracking-wider">
            © {new Date().getFullYear()} CODIMDEV ENGENHARIA. TODOS OS DIREITOS RESERVADOS.
          </p>
          <div className="flex gap-4">
            <span className="font-technical text-[10px] text-neutral-600 uppercase tracking-widest">
              [ INDUSTRIAL PRAGMATISM // SYSTEMS ]
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
