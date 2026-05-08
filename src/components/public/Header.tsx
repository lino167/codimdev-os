"use client";

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import logoHorizontal from '@/assets/logo-horizontal.png'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Sobre', href: '/about' },
  { label: 'Serviços', href: '/services' },
  { label: 'Portfólio', href: '/#portfolio' },
  { label: 'Contato', href: '/#contato' },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-8 left-0 right-0 z-40">
      <div className="container mx-auto px-4">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-between py-4 px-6 glass rounded-full border border-white/10 bg-black/10 backdrop-blur-md"
        >
          <a href="/" className="flex items-center">
            <Image src={logoHorizontal} alt="CODIM DEV" className="h-8 w-auto object-contain" placeholder="blur" />
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="font-mono text-sm text-neutral-400 hover:text-white transition-colors duration-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contato"
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-display font-medium text-sm hover:bg-red-600 transition-colors duration-300 rounded-full"
          >
            Iniciar Projeto
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-2 glass rounded-2xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-md"
            >
              <ul className="flex flex-col p-4 gap-4">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block font-mono text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#contato"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-primary text-white font-display font-medium text-sm rounded-full"
                  >
                    Iniciar Projeto
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header
