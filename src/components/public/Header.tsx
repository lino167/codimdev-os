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
    <header className="flex z-50 w-full pt-8 pr-6 pl-6 relative justify-center sticky top-0 bg-black/10 backdrop-blur-md">
      <div className="flex w-full max-w-[1400px] items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition duration-300">
          <Terminal className="w-5 h-5 text-white" />
        </Link>

        {/* Center Nav Pill */}
        <nav className="hidden md:flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-3.5 gap-6 text-sm font-medium text-neutral-400 shadow-xl shadow-black/50">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.name} className="flex items-center gap-6">
                <Link
                  href={item.href}
                  className={`hover:text-white transition duration-200 text-xs font-technical uppercase tracking-wider ${
                    isActive ? "text-primary font-bold" : "text-neutral-400"
                  }`}
                >
                  {item.name}
                </Link>
                {idx < navItems.length - 1 && (
                  <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                )}
              </div>
            );
          })}
        </nav>

        {/* CTA Pill */}
        <div className="hidden md:flex items-center">
          <Link href="/audit" className="text-xs font-bold text-white bg-primary hover:bg-primary-hover border border-primary-hover backdrop-blur-md rounded-full px-7 py-3.5 transition duration-300 uppercase tracking-wider font-technical">
            Iniciar Projeto
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-neutral-400 hover:text-white transition-all"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-24 left-6 right-6 z-50 md:hidden border border-white/10 bg-black/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl space-y-4">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-technical uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
            <Link
              href="/audit"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 items-center justify-center rounded-full bg-primary font-technical text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition-colors"
            >
              Iniciar Projeto
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
