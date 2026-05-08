"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Cpu, Database, Wifi, Clock, Menu, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const [time, setTime] = useState<string>("");
  const [ping, setPing] = useState<number>(8);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      // 1. Verifica bypass de sessão local (demo)
      const bypassSession = localStorage.getItem("codimdev_session");
      if (bypassSession === "active" || bypassSession === "bypass") {
        setAuthChecking(false);
        return;
      }

      // 2. Verifica sessão real do Supabase
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setAuthChecking(false);
        return;
      }

      // Se não autenticado, redireciona de forma reativa
      router.push("/login");
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    // Responsive auto-collapse (Page 10 of PDF: < 1024px auto-collapse)
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Live update clock
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pt-BR", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Live fluctuate ping for realism
    const pingInterval = setInterval(() => {
      setPing(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 4 ? 4 : next > 15 ? 15 : next;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
    };
  }, []);

  if (authChecking) {
    return (
      <div className="flex flex-col h-screen w-screen bg-black items-center justify-center font-technical text-xs tracking-widest text-text-muted select-none gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <span>CONECTANDO // AUTENTICANDO OPERADOR NO CODIMDEV OS...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary">
      {/* Lateral Menu */}
      <Sidebar 
        collapsed={isSidebarCollapsed} 
        mobileOpen={isMobileOpen} 

        onMobileClose={() => setIsMobileOpen(false)} 
      />

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Technical Topbar */}
        <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover md:hidden flex items-center justify-center mr-2"
              title="Abrir Menu"
            >
              <Menu size={16} />
            </button>

            {/* Manual Toggle Desktop */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover items-center justify-center mr-2"
              title={isSidebarCollapsed ? "Expandir Painel" : "Recolher Painel"}
            >
              {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <h1 className="font-technical text-sm font-bold tracking-wider text-text-secondary whitespace-nowrap">
              GRADE OPERACIONAL
            </h1>
            <span className="hidden md:inline-block h-4 w-px bg-border"></span>
            <div className="hidden lg:flex items-center gap-1.5 font-technical text-[10px] bg-black px-2.5 py-1 border border-border">
              <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse"></span>
              <span className="text-status-success font-bold tracking-widest">SISTEMA ATIVO & CONECTADO</span>
            </div>
          </div>

          {/* Grid Indicators */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Database Latency */}
            <div className="hidden sm:flex items-center gap-2">
              <Database size={14} className="text-text-secondary" />
              <div className="flex flex-col">
                <span className="font-technical text-[9px] leading-none text-text-muted font-bold">LATÊNCIA BANCO (SP)</span>
                <span className="font-technical text-xs font-bold text-status-success">12ms</span>
              </div>
            </div>

            {/* Ping */}
            <div className="hidden sm:flex items-center gap-2">
              <Wifi size={14} className="text-text-secondary" />
              <div className="flex flex-col">
                <span className="font-technical text-[9px] leading-none text-text-muted font-bold">PING DO SISTEMA</span>
                <span className="font-technical text-xs font-bold text-status-success">{ping}ms</span>
              </div>
            </div>

            {/* Bot Integration Status */}
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-primary animate-pulse" />
              <div className="flex flex-col">
                <span className="font-technical text-[9px] leading-none text-text-muted font-bold">ROBÔ KRAFLO</span>
                <span className="font-technical text-xs font-bold text-status-success">EM ESPERA</span>
              </div>
            </div>

            <span className="h-4 w-px bg-border"></span>

            {/* Technical Clock */}
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-text-secondary" />
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest w-16">
                {time || "00:00:00"}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Section Contents */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

