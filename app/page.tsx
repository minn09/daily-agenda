"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  BookOpen,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  TrendingDown,
  Minus,
  PanelLeftClose,
  PanelRightClose,
  PanelLeftOpen,
  PanelRightOpen,
  Download,
  Upload,
} from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { exportToTxt } from "@/lib/exportTxt"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "@/hooks/use-media-query"

type MoodType = "excelente" | "bien" | "neutral" | "mal" | "terrible" | null
type StatusChange = "mejor" | "igual" | "peor" | null

interface DayMetadata {
  mood: MoodType
  statusChecks: {
    time: string
    status: StatusChange
    note?: string
  }[]
  energy: number | null
  tags: string[]
}

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [direction, setDirection] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile)
  const [isMoodDialogOpen, setIsMoodDialogOpen] = useState(false)

  useEffect(() => {
    setLeftSidebarOpen(!isMobile)
    setRightSidebarOpen(!isMobile)
  }, [isMobile])
  const [pendingStatus, setPendingStatus] = useState<StatusChange>(null)
  const [statusNote, setStatusNote] = useState("")

  const [metadata, setMetadata] = useState<Record<string, DayMetadata>>({})
  const [noteContent, setNoteContent] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedMetadata = localStorage.getItem("diary-metadata")
    const savedNotes = localStorage.getItem("diary-notes")

    if (savedMetadata) {
      try {
        setMetadata(JSON.parse(savedMetadata))
      } catch (e) {
        console.error("Failed to parse metadata:", e)
      }
    }

    if (savedNotes) {
      try {
        setNoteContent(JSON.parse(savedNotes))
      } catch (e) {
        console.error("Failed to parse notes:", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("diary-metadata", JSON.stringify(metadata))
  }, [metadata])

  useEffect(() => {
    localStorage.setItem("diary-notes", JSON.stringify(noteContent))
  }, [noteContent])

  const navigateDay = useCallback((delta: number) => {
    setDirection(delta)
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + delta))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLTextAreaElement || document.activeElement instanceof HTMLInputElement) {
        return
      }

      if (e.key === "ArrowLeft") {
        navigateDay(-1)
      } else if (e.key === "ArrowRight") {
        navigateDay(1)
      } else if (e.key.toLowerCase() === "t") {
        setCurrentDate(new Date())
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [navigateDay])

  const formatSpanishDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("es-ES", options)
  }

  const dateKey = currentDate.toISOString().split("T")[0]
  const currentMetadata = metadata[dateKey] || {
    mood: null,
    statusChecks: [],
    energy: null,
    tags: [],
  }

  const updateMood = (mood: MoodType) => {
    setMetadata((prev) => ({
      ...prev,
      [dateKey]: {
        ...currentMetadata,
        mood,
      },
    }))
  }

  const handleStatusClick = (status: StatusChange) => {
    setPendingStatus(status)
    setStatusNote("")
    setIsMoodDialogOpen(true)
  }

  const addStatusCheck = () => {
    if (!pendingStatus) return

    const now = new Date()
    const timeString = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })

    setMetadata((prev) => ({
      ...prev,
      [dateKey]: {
        ...currentMetadata,
        statusChecks: [...currentMetadata.statusChecks, { time: timeString, status: pendingStatus, note: statusNote }],
      },
    }))
    setIsMoodDialogOpen(false)
    setPendingStatus(null)
  }

  const moodOptions = [
    { value: "excelente" as const, label: "Excelente", icon: Smile, color: "text-green-600" },
    { value: "bien" as const, label: "Bien", icon: Smile, color: "text-green-500" },
    { value: "neutral" as const, label: "Neutral", icon: Meh, color: "text-yellow-600" },
    { value: "mal" as const, label: "Mal", icon: Frown, color: "text-orange-600" },
    { value: "terrible" as const, label: "Terrible", icon: Frown, color: "text-red-600" },
  ]

  const exportTxtData = () => {
    const txt = exportToTxt(metadata, noteContent)
    const blob = new Blob([txt], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `diario-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportData = () => {
    const data = {
      metadata,
      notes: noteContent,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `diario-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        if (json.metadata && json.notes) {
          if (confirm("Esto reemplazará tus datos actuales. ¿Deseas continuar?")) {
            setMetadata(json.metadata)
            setNoteContent(json.notes)
            alert("Datos importados con éxito.")
          }
        } else {
          alert("El archivo no tiene el formato correcto.")
        }
      } catch (error) {
        console.error("Error parsing JSON:", error)
        alert("Error al leer el archivo JSON.")
      }
    }
    reader.readAsText(file)
    // reset input
    event.target.value = ""
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background">
      {/* Left Sidebar - Navigation */}
      <AnimatePresence initial={false}>
        {leftSidebarOpen && (
          <>
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLeftSidebarOpen(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              />
            )}
            <motion.aside
              initial={{ width: 0, opacity: 0, x: isMobile ? -256 : 0 }}
              animate={{
                width: 256,
                opacity: 1,
                x: 0,
                position: isMobile ? "fixed" : "relative",
                zIndex: isMobile ? 50 : 0,
                height: "100%",
              }}
              exit={{
                width: 0,
                opacity: 0,
                x: isMobile ? -256 : 0,
                transition: { duration: 0.2 },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden shrink-0"
            >
              <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-sidebar-foreground">
                  <BookOpen className="w-5 h-5" />
                  <h1 className="font-semibold text-lg">Mi Diario</h1>
                </div>
                <div className="flex items-center gap-1">
                  <ModeToggle />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLeftSidebarOpen(false)}
                    className="text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => {
                      setCurrentDate(new Date())
                      if (isMobile) setLeftSidebarOpen(false)
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Hoy
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase px-2">Datos</p>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={exportData}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar JSON
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={exportTxtData}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar TXT
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importar JSON
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Importar archivo JSON"
                    />
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content - Writing Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Zen Mode Toggle Overlay */}
        {/* Date Navigation Header */}
        <header className="border-b border-border px-4 py-4 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-2">
            {!leftSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLeftSidebarOpen(true)}
                className="text-foreground hover:bg-accent"
                aria-label="Abrir menú lateral"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDay(-1)}
              className="text-foreground hover:bg-accent"
              aria-label="Día anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={dateKey}
              initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-medium text-foreground capitalize"
            >
              {formatSpanishDate(currentDate)}
            </motion.h2>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDay(1)}
              className="text-foreground hover:bg-accent"
              aria-label="Día siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            {!rightSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRightSidebarOpen(true)}
                className="text-foreground hover:bg-accent"
                aria-label="Abrir panel de detalles"
              >
                <PanelRightOpen className="w-5 h-5" />
              </Button>
            )}
          </div>
        </header>

        {/* Writing Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <textarea
                value={noteContent[dateKey] || ""}
                onChange={(e) =>
                  setNoteContent((prev) => ({
                    ...prev,
                    [dateKey]: e.target.value,
                  }))
                }
                placeholder="Escribe aquí tus pensamientos del día..."
                className="w-full h-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-lg leading-relaxed p-0"
                style={{ fontFamily: "inherit" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Right Panel - Metadata */}
      <AnimatePresence initial={false}>
        {rightSidebarOpen && (
          <>
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRightSidebarOpen(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              />
            )}
            <motion.aside
              initial={{ width: 0, opacity: 0, x: isMobile ? 320 : 0 }}
              animate={{
                width: 320,
                opacity: 1,
                x: 0,
                position: isMobile ? "fixed" : "relative",
                right: 0,
                zIndex: isMobile ? 50 : 0,
                height: "100%",
              }}
              exit={{
                width: 0,
                opacity: 0,
                x: isMobile ? 320 : 0,
                transition: { duration: 0.2 },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-card border-l border-border flex flex-col overflow-hidden shrink-0 shadow-xl"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground">Detalles</h3>
                <Button variant="ghost" size="icon" onClick={() => setRightSidebarOpen(false)}>
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Mood Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-card-foreground">¿Cómo te sientes hoy?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {moodOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = currentMetadata.mood === option.value
                      return (
                        <Button
                          key={option.value}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateMood(option.value)}
                          className={`justify-start gap-2 ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                            }`}
                        >
                          <Icon className={`w-4 h-4 ${!isSelected ? option.color : ""}`} />
                          <span className="text-xs">{option.label}</span>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Status Check-ins */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-card-foreground">¿Cómo te encuentras ahora?</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusClick("mejor")}
                      className="flex-1 gap-2 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-xs">Mejor</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusClick("igual")}
                      className="flex-1 gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                    >
                      <Minus className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs">Igual</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusClick("peor")}
                      className="flex-1 gap-2 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-xs">Peor</span>
                    </Button>
                  </div>

                  {/* Status History */}
                  {currentMetadata.statusChecks.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-muted-foreground">Historial del día:</p>
                      <div className="space-y-1.5">
                        {currentMetadata.statusChecks.map((check, idx) => (
                          <div key={idx} className="flex flex-col gap-1 text-xs bg-accent/50 rounded-md p-2">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-mono">{check.time}</span>
                              <span className="text-card-foreground font-medium">
                                {check.status === "mejor" && "📈 Mejor"}
                                {check.status === "igual" && "➡️ Igual"}
                                {check.status === "peor" && "📉 Peor"}
                              </span>
                            </div>
                            {check.note && (
                              <p className="text-muted-foreground italic ml-2 border-l-2 border-primary/20 pl-2">
                                "{check.note}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Additional Metadata Placeholder */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-card-foreground">Otros detalles</Label>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <div className="bg-muted/50 rounded-md p-3">
                      <p className="font-medium mb-1">Nivel de energía</p>
                      <p className="text-muted-foreground">Próximamente...</p>
                    </div>
                    <div className="bg-muted/50 rounded-md p-3">
                      <p className="font-medium mb-1">Etiquetas</p>
                      <p className="text-muted-foreground">Próximamente...</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mood Context Dialog */}
      <Dialog open={isMoodDialogOpen} onOpenChange={setIsMoodDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 capitalize">
              {pendingStatus === "mejor" && <TrendingUp className="w-5 h-5 text-green-600" />}
              {pendingStatus === "igual" && <Minus className="w-5 h-5 text-yellow-600" />}
              {pendingStatus === "peor" && <TrendingDown className="w-5 h-5 text-red-600" />}
              Te sientes {pendingStatus}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="status-note">¿Por qué te sientes así?</Label>
            <Textarea
              id="status-note"
              placeholder="Explica brevemente la razón de este cambio..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsMoodDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addStatusCheck}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
