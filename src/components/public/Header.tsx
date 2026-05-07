"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Diagnóstico", href: "/diagnostico" },
    { name: "Performance LPs", href: "/performance" },
    { name: "Portfólio", href: "/portfolio" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2E3A2F] bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-width-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-sm border border-[#2E3A2F] bg-[#0a0a0a] group-hover:border-[#FF0B0B] transition-colors">
                <Terminal className="h-4 w-4 text-[#FF0B0B] group-hover:scale-110 transition-transform" />
                <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#FF0B0B] animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-technical text-sm font-bold tracking-wider text-white">
                  CODIMDEV
                </span>
                <span className="font-technical text-[10px] text-[#A1A1AA] tracking-widest leading-none">
                  SYSTEM ENGINE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-technical text-xs tracking-wider uppercase transition-colors ${
                    isActive
                      ? "text-[#FF0B0B] font-bold"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-sm border border-[#2E3A2F] bg-black px-4 font-technical text-xs uppercase tracking-wider text-[#A1A1AA] hover:border-[#FF0B0B] hover:text-white transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/diagnostico"
              className="inline-flex h-9 items-center justify-center rounded-sm bg-[#FF0B0B] px-4 font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D60606] transition-all shadow-[0_0_15px_rgba(255,11,11,0.2)]"
            >
              Diagnóstico Gratuito
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-sm border border-[#2E3A2F] text-[#A1A1AA] hover:text-white hover:border-[#FF0B0B] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#2E3A2F] bg-black px-4 py-4 space-y-3">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-technical text-xs tracking-wider uppercase transition-colors ${
                    isActive
                      ? "text-[#FF0B0B] font-bold"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-[#2E3A2F]">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 items-center justify-center rounded-sm border border-[#2E3A2F] bg-[#0a0a0a] font-technical text-xs uppercase tracking-wider text-[#A1A1AA] hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/diagnostico"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 items-center justify-center rounded-sm bg-[#FF0B0B] font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-[#D60606] transition-colors"
            >
              Diagnóstico Gratuito
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
