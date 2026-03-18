'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', icon: '🏠', label: 'Dashboard' },
  { href: '/nova', icon: '➕', label: 'Nova Entrevista' },
  { href: '/guia', icon: '📘', label: 'Material Instrutivo' },
  { href: '/admin/perguntas', icon: '⚙️', label: 'Perguntas' },
  { href: '/admin/cargos', icon: '🏢', label: 'Cargos' },
  { href: '/lixeira', icon: '🗑️', label: 'Lixeira' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed left-0 top-0 bottom-0 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'open' : ''}`}
        style={{ background: 'var(--c-sidebar)', width: '260px' }}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-white font-bold text-lg leading-tight">
            Extração de<br />Desafios
          </h1>
          <p className="text-white/50 text-xs mt-1.5 font-normal">Gerência de Inovação — IDG</p>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-white/35 text-[10px] uppercase tracking-widest font-semibold px-3 py-3">Navegação</p>
          {navItems.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${
                pathname === href
                  ? 'bg-blue-500/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 text-white/30 text-[11px]">
          Campanha de Inovação IDG<br />Challenge Canvas + Entrevista Estruturada
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 w-10 h-10 bg-[var(--c-primary)] text-white rounded-lg flex items-center justify-center shadow-md"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Main content */}
      <div className="main-content flex-1 min-h-screen">
        {children}
      </div>
    </div>
  );
}
