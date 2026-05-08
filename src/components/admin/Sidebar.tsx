"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Terminal, 
  Users, 
  Briefcase, 
  DollarSign, 
  GitBranch, 
  FileText, 
  Cpu, 
  LayoutDashboard,
  X,
  LogOut
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ href, label, icon, active, collapsed }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-3 py-2.5 border-l-2 text-sm transition-all duration-100 ${
        active
          ? "bg-surface-hover border-primary text-text-primary"
          : "border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary"
      } ${collapsed ? "justify-center px-0 border-l-0 md:border-l-2" : ""}`}
      title={collapsed ? label : undefined}
    >
      <div className={`transition-colors duration-100 flex-shrink-0 ${
        active ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
      }`}>
        {icon}
      </div>
      {!collapsed && <span className="font-technical font-medium tracking-tight whitespace-nowrap">{label}</span>}
    </Link>
  );
};

export default function Sidebar({ collapsed = false, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("codimdev_session");
    router.push("/login");
  };

  const menuItems = [
    { href: "/dashboard", label: "PAINEL DE CONTROLE", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/crm", label: "CRM & LEADS", icon: <Users size={18} /> },
    { href: "/dashboard/projects", label: "PROJETOS & ETAPAS", icon: <Briefcase size={18} /> },
    { href: "/dashboard/finance", label: "FINANCEIRO & CAIXA", icon: <DollarSign size={18} /> },
    { href: "/dashboard/deploys", label: "ESTEIRA DE DEPLOI", icon: <GitBranch size={18} /> },
    { href: "/dashboard/cms", label: "CMS & CONTEÚDOS", icon: <FileText size={18} /> },
    { href: "/dashboard/automations", label: "LOGS DE AUTOMAÇÃO", icon: <Cpu size={18} /> },
  ];

  const sidebarClasses = `
    bg-surface border-r border-border h-full flex flex-col flex-shrink-0 transition-all duration-200 z-40 relative
    ${collapsed ? "w-16" : "w-64"}
    ${mobileOpen ? "fixed inset-y-0 left-0 w-64 translate-x-0" : "hidden md:flex"}
    ${mobileOpen ? "" : ""}
  `;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
          onClick={onMobileClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Brand Header */}
        <div className={`p-5 border-b border-border flex items-center justify-between`}>
          <div className={`flex items-center ${collapsed ? "justify-center w-full" : "gap-2.5"}`}>
            <Terminal className="text-primary animate-pulse flex-shrink-0" size={20} />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-technical font-bold text-base tracking-widest text-text-primary">
                  CODIMDEV_OS
                </span>
                <span className="font-technical text-[10px] text-text-muted font-bold tracking-wider">
                  VERSÃO_SISTEMA_1.0
                </span>
              </div>
            )}
          </div>
          {/* Close Mobile Menu Button */}
          {mobileOpen && (
            <button 
              onClick={onMobileClose}
              className="p-1 border border-border hover:bg-surface-hover text-text-secondary md:hidden"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {!collapsed && (
            <div className="px-5 mb-2 text-[10px] font-technical font-bold tracking-widest text-text-muted">
              UNIDADES OPERACIONAIS
            </div>
          )}
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Footer Operator Info */}
        <div className={`p-4 border-t border-border bg-black/40 flex items-center justify-between ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-none border border-border bg-surface flex items-center justify-center font-technical font-bold text-xs text-primary flex-shrink-0">
              ZR
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-technical text-xs font-bold text-text-primary truncate">
                  ZACARIAS_RAMOS
                </span>
                <span className="font-technical text-[10px] text-status-success font-semibold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-ping"></span>
                  SYS_ADMIN
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button 
              onClick={handleLogout}
              className="p-1.5 border border-border bg-surface text-text-secondary hover:text-primary hover:border-primary flex items-center justify-center transition-colors"
              title="Encerrar Sessão"
            >
              <LogOut size={14} />
            </button>
          )}
          {collapsed && (
            <button 
              onClick={handleLogout}
              className="p-1.5 border border-border bg-surface text-text-secondary hover:text-primary hover:border-primary flex items-center justify-center transition-colors mt-2"
              title="Encerrar Sessão"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}


