"use client"

import { Calendar, History, Settings, User } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight">Agenda Diaria</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground font-medium">
          <Calendar className="w-4 h-4" />
          Hoy
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors">
          <History className="w-4 h-4" />
          Historial
        </button>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors">
          <Settings className="w-4 h-4" />
          Ajustes
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors">
          <User className="w-4 h-4" />
          Perfil
        </button>
      </div>
    </aside>
  )
}
