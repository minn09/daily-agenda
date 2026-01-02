"use client"

import { Info, MessageCircle } from "lucide-react"

export function MetadataPanel() {
  return (
    <aside className="w-80 border-l bg-card text-card-foreground p-6 flex flex-col h-screen sticky top-0 shrink-0 overflow-y-auto">
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
            <Info className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-wider">Metadatos</h2>
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground uppercase mb-1">Estado de Ánimo</p>
              <div className="flex gap-2">
                {["😊", "😐", "😔", "😫"].map((emoji) => (
                  <button key={emoji} className="text-xl hover:scale-110 transition-transform">
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
            <MessageCircle className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-wider">Seguimiento</h2>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-sm font-medium mb-3">¿Cómo te sientes en este momento?</p>
            <div className="grid grid-cols-1 gap-2">
              <button className="text-xs py-2 px-3 rounded-md bg-background border hover:border-primary transition-colors">
                Mejor que antes
              </button>
              <button className="text-xs py-2 px-3 rounded-md bg-background border hover:border-primary transition-colors">
                Igual
              </button>
              <button className="text-xs py-2 px-3 rounded-md bg-background border hover:border-primary transition-colors">
                Peor
              </button>
            </div>
          </div>
        </section>
      </div>
    </aside>
  )
}
