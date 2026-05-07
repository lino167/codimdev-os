"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Terminal, 
  Users, 
  Briefcase, 
  DollarSign, 
  GitBranch, 
  FileText, 
  Cpu, 
  LayoutDashboard 
} from "lucide-react";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

const SidebarItem = ({ href, label, icon, active }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-3 py-2.5 border-l-2 text-sm transition-all duration-100 ${
        active
          ? "bg-surface-hover border-primary text-text-primary"
          : "border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary"
      }`}
    >
      <div className={`transition-colors duration-100 ${
        active ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
      }`}>
        {icon}
      </div>
      <span className="font-technical font-medium tracking-tight">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "PAINEL DE CONTROLE", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/crm", label: "CRM & LEADS", icon: <Users size={18} /> },
    { href: "/dashboard/projects", label: "PROJETOS & ETAPAS", icon: <Briefcase size={18} /> },
    { href: "/dashboard/finance", label: "FINANCEIRO & CAIXA", icon: <DollarSign size={18} /> },
    { href: "/dashboard/deploys", label: "ESTEIRA DE DEPLOI", icon: <GitBranch size={18} /> },
    { href: "/dashboard/cms", label: "CMS & CONTEÚDOS", icon: <FileText size={18} /> },
    { href: "/dashboard/automations", label: "LOGS DE AUTOMAÇÃO", icon: <Cpu size={18} /> },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border h-full flex flex-col flex-shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-border flex items-center gap-2.5">
        <Terminal className="text-primary animate-pulse" size={20} />
        <div className="flex flex-col">
          <span className="font-technical font-bold text-base tracking-widest text-text-primary">
            CODIMDEV_OS
          </span>
          <span className="font-technical text-[10px] text-text-muted font-bold tracking-wider">
            VERSÃO_SISTEMA_1.0
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <div className="px-5 mb-2 text-[10px] font-technical font-bold tracking-widest text-text-muted">
          UNIDADES OPERACIONAIS
        </div>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href}
          />
        ))}
      </nav>

      {/* Footer Operator Info */}
      <div className="p-4 border-t border-border bg-black/40 flex items-center gap-3">
        <div className="w-8 h-8 rounded-none border border-border bg-surface flex items-center justify-center font-technical font-bold text-xs text-primary">
          ZR
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-technical text-xs font-bold text-text-primary truncate">
            ZACARIAS_RAMOS
          </span>
          <span className="font-technical text-[10px] text-status-success font-semibold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-ping"></span>
            SYS_ADMIN
          </span>
        </div>
      </div>
    </aside>
  );
}
