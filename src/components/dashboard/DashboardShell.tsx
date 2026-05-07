"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Cpu, Database, Wifi, Clock } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [time, setTime] = useState<string>("");
  const [ping, setPing] = useState<number>(8);

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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary">
      {/* Lateral Menu */}
      <Sidebar />

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Technical Topbar */}
        <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-technical text-sm font-bold tracking-wider text-text-secondary">
              OPERATIONAL_GRID
            </h1>
            <span className="hidden md:inline-block h-4 w-px bg-border"></span>
            <div className="hidden md:flex items-center gap-1.5 font-technical text-[10px] bg-black px-2.5 py-1 border border-border">
              <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse"></span>
              <span className="text-status-success font-bold tracking-widest">SYS_SECURE_ONLINE</span>
            </div>
          </div>

          {/* Grid Indicators */}
          <div className="flex items-center gap-6">
            {/* Database Latency */}
            <div className="hidden sm:flex items-center gap-2">
              <Database size={14} className="text-text-secondary" />
              <div className="flex flex-col">
                <span className="font-technical text-[9px] leading-none text-text-muted font-bold">DB_LATENCY (SP)</span>
                <span className="font-technical text-xs font-bold text-status-success">12ms</span>
              </div>
            </div>

            {/* Ping */}
            <div className="hidden sm:flex items-center gap-2">
              <Wifi size={14} className="text-text-secondary" />
              <div className="flex flex-col">
                <span className="font-technical text-[9px] leading-none text-text-muted font-bold">SYS_PING</span>
                <span className="font-technical text-xs font-bold text-status-success">{ping}ms</span>
              </div>
            </div>

            {/* Bot Integration Status */}
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-primary animate-pulse" />
              <div className="flex flex-col">
                <span className="font-technical text-[9px] leading-none text-text-muted font-bold">BOT_KRAFLO</span>
                <span className="font-technical text-xs font-bold text-status-success">STANDBY</span>
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
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
