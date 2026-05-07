"use client";

import Link from "next/link";
import { Cpu, ShieldCheck, Activity } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="border-t border-[#2E3A2F] bg-[#020202] py-12 text-white">
      <div className="mx-auto max-width-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-technical text-sm font-bold tracking-wider text-white">
                CODIMDEV // SYSTEMS
              </span>
            </div>
            <p className="max-w-sm text-xs text-[#A1A1AA] leading-relaxed">
              Unindo o pragmatismo do chão de fábrica à engenharia de software de elite. 
              Blindamos fluxos de trabalho e construímos ativos digitais de alta tração operacional.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-[10px] font-technical text-[#2E3A2F] border border-[#2E3A2F] px-2 py-0.5 rounded-sm bg-black">
                <Cpu className="h-3 w-3 text-[#FF0B0B]" />
                LATENCY: &lt; 85MS
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-technical text-[#2E3A2F] border border-[#2E3A2F] px-2 py-0.5 rounded-sm bg-black">
                <ShieldCheck className="h-3 w-3 text-[#10B981]" />
                ENCRYPTION: AES-256
              </div>
            </div>
          </div>

          {/* Sitemap Links */}
          <div>
            <h3 className="font-technical text-xs font-bold uppercase tracking-wider text-white mb-4">
              Mapa do Sistema
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="font-technical text-[11px] text-[#A1A1AA] hover:text-white transition-colors">
                  [ 01 ] INÍCIO
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="font-technical text-[11px] text-[#A1A1AA] hover:text-[#FF0B0B] transition-colors">
                  [ 02 ] DIAGNÓSTICO
                </Link>
              </li>
              <li>
                <Link href="/performance" className="font-technical text-[11px] text-[#A1A1AA] hover:text-[#FF0B0B] transition-colors">
                  [ 03 ] PERFORMANCE LPS
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="font-technical text-[11px] text-[#A1A1AA] hover:text-[#FF0B0B] transition-colors">
                  [ 04 ] PORTFÓLIO
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Links */}
          <div>
            <h3 className="font-technical text-xs font-bold uppercase tracking-wider text-white mb-4">
              Terminal de Controle
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dashboard" className="font-technical text-[11px] text-[#A1A1AA] hover:text-white transition-colors">
                  [ &gt;_ ] ENTRAR NO DASHBOARD
                </Link>
              </li>
              <li className="flex items-center gap-2 font-technical text-[11px] text-[#52525B]">
                <Activity className="h-3 w-3 text-[#FF0B0B] animate-pulse" />
                TELEMETRY: ACTIVE
              </li>
              <li className="font-technical text-[10px] text-[#52525B]">
                VER: v1.0.4-STABLE
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2E3A2F] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-technical text-[10px] text-[#52525B]">
            CODIMDEV © 2026. PROJETADO E DESENVOLVIDO SOB ENGENHARIA DE ALTA PERFORMANCE.
          </p>
          <div className="flex gap-4">
            <span className="font-technical text-[10px] text-[#52525B]">
              [ INDUSTRIAL PRAGMATISM ]
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
