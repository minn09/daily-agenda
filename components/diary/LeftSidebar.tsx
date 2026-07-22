"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Calendar,
	CalendarDays,
	ChevronDown,
	ChevronUp,
	Download,
	File,
	PanelLeftClose,
	Plus,
	TestTube,
	Trash2,
	Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Separator } from "@/components/ui/separator";
import { exportToJson, exportToTxtFile } from "@/services/export";
import { importFromJson } from "@/services/import";
import { useDiaryStore } from "@/store/diary";
import { useNoteStore } from "@/store/note";
import { useStandaloneTasksStore } from "@/store/standalone-tasks";
import { useUIStore } from "@/store/ui";
import { useUserPreferencesStore } from "@/store/user-preferences";
import { getDateKey } from "@/utils/date";

import { StreakCalendar } from "./StreakCalendar";

export function LeftSidebar() {
	const { leftSidebarOpen, setLeftSidebarOpen, isMobile } = useUIStore();
	const { confirmBeforeDelete } = useUserPreferencesStore();
	const [showCalendar, setShowCalendar] = useState(true);
	const [showRangeExport, setShowRangeExport] = useState(false);
	const [rangeStart, setRangeStart] = useState("");
	const [rangeEnd, setRangeEnd] = useState("");
	const [backfillDate, setBackfillDate] = useState("");

	const { currentDate, setCurrentDate, metadata, noteContent } =
		useDiaryStore();

	const {
		notes,
		activeNoteId,
		setActiveNote,
		newNote: newNoteStore,
		deleteNote,
	} = useNoteStore();

	const { tasks: standaloneTasks } = useStandaloneTasksStore();

	const handleNoteClick = (noteId: string) => {
		setActiveNote(noteId);
		if (isMobile) setLeftSidebarOpen(false);
	};

	const handleDeleteNote = (noteId: string) => {
		deleteNote(noteId);
		toast.success("Nota eliminada");
	};

	// --- Export handlers ---

	const handleExportAllJson = () => {
		const notesArray = Object.values(notes);
		exportToJson(metadata, noteContent, notesArray, standaloneTasks);
		toast.success("Todos los datos exportados (JSON)");
	};

	const handleExportAllTxt = () => {
		const notesArray = Object.values(notes);
		exportToTxtFile(metadata, noteContent, notesArray, standaloneTasks);
		toast.success("Todos los datos exportados (TXT)");
	};

	const handleExportCurrentDayJson = () => {
		const dateKey = getDateKey(currentDate);
		const notesArray = Object.values(notes);
		exportToJson(
			metadata,
			noteContent,
			notesArray,
			standaloneTasks,
			dateKey,
			dateKey,
		);
		toast.success(`Día exportado: ${dateKey} (JSON)`);
	};

	const handleExportCurrentDayTxt = () => {
		const dateKey = getDateKey(currentDate);
		const notesArray = Object.values(notes);
		exportToTxtFile(
			metadata,
			noteContent,
			notesArray,
			standaloneTasks,
			dateKey,
			dateKey,
		);
		toast.success(`Día exportado: ${dateKey} (TXT)`);
	};

	const handleExportRangeJson = () => {
		if (!rangeStart || !rangeEnd) {
			toast.error("Seleccioná ambas fechas");
			return;
		}
		if (rangeStart > rangeEnd) {
			toast.error("La fecha inicial debe ser anterior a la final");
			return;
		}
		const notesArray = Object.values(notes);
		exportToJson(
			metadata,
			noteContent,
			notesArray,
			standaloneTasks,
			rangeStart,
			rangeEnd,
		);
		toast.success(`Rango exportado: ${rangeStart} → ${rangeEnd} (JSON)`);
	};

	const handleExportRangeTxt = () => {
		if (!rangeStart || !rangeEnd) {
			toast.error("Seleccioná ambas fechas");
			return;
		}
		if (rangeStart > rangeEnd) {
			toast.error("La fecha inicial debe ser anterior a la final");
			return;
		}
		const notesArray = Object.values(notes);
		exportToTxtFile(
			metadata,
			noteContent,
			notesArray,
			standaloneTasks,
			rangeStart,
			rangeEnd,
		);
		toast.success(`Rango exportado: ${rangeStart} → ${rangeEnd} (TXT)`);
	};

	// --- Import handler ---

	const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		importFromJson(
			file,
			(data) => {
				useDiaryStore.setState((state) => ({
					metadata: { ...state.metadata, ...data.metadata },
					noteContent: { ...state.noteContent, ...data.notes },
				}));

				if (data.standaloneNotes?.length > 0) {
					const notesMap = Object.fromEntries(
						data.standaloneNotes.map((n) => [n.id, n]),
					);
					useNoteStore.setState((state) => ({
						notes: { ...state.notes, ...notesMap },
					}));
				}

				if (data.standaloneTasks?.length > 0) {
					const existingIds = new Set(
						useStandaloneTasksStore.getState().tasks.map((t) => t.id),
					);
					const newTasks = data.standaloneTasks.filter(
						(t) => !existingIds.has(t.id),
					);
					if (newTasks.length > 0) {
						useStandaloneTasksStore.setState((state) => ({
							tasks: [...state.tasks, ...newTasks],
						}));
					}
				}

				toast.success("Datos importados correctamente");
			},
			(error) => toast.error(error),
		);
		event.target.value = "";
	};

	// --- Backfill handler ---

	const handleBackfill = (e: React.FormEvent) => {
		e.preventDefault();
		if (!backfillDate) return;
		const [y, m, d] = backfillDate.split("-").map(Number);
		const date = new Date(y!, m! - 1, d!);
		setCurrentDate(date);
		setActiveNote(null);
		setBackfillDate("");
		if (isMobile) setLeftSidebarOpen(false);
		toast.success(`Navegando al ${backfillDate}`);
	};

	// --- Calendar date select ---

	const handleDateSelect = (date: Date) => {
		setActiveNote(null);
		if (isMobile) setLeftSidebarOpen(false);
	};

	return (
		<motion.aside
			initial={{ width: 0, opacity: 0, x: isMobile ? -340 : 0 }}
			animate={{
				width: 340,
				opacity: 1,
				x: 0,
				position: isMobile ? "fixed" : "relative",
				zIndex: isMobile ? 50 : 0,
				height: "100%",
			}}
			exit={{
				width: 0,
				opacity: 0,
				x: isMobile ? -340 : 0,
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
				{/* Calendar */}
				<div className="space-y-2">
					<button
						type="button"
						onClick={() => setShowCalendar((v) => !v)}
						className="w-full flex items-center justify-between text-xs font-semibold text-sidebar-foreground/50 uppercase px-2"
					>
						<span className="flex items-center gap-1.5">
							<Calendar className="w-3.5 h-3.5" />
							Calendario
						</span>
						{showCalendar ? (
							<ChevronUp className="w-3 h-3" />
						) : (
							<ChevronDown className="w-3 h-3" />
						)}
					</button>
					{showCalendar && (
						<div className="px-1">
							<StreakCalendar onDateSelect={handleDateSelect} />
						</div>
					)}
				</div>

				{/* Backfill: Agregar día */}
				<div className="space-y-2">
					<p className="text-xs font-semibold text-sidebar-foreground/50 uppercase px-2 flex items-center gap-1.5">
						<CalendarDays className="w-3.5 h-3.5" />
						Agregar día
					</p>
					<form onSubmit={handleBackfill} className="flex gap-2 px-2">
						<input
							type="date"
							value={backfillDate}
							onChange={(e) => setBackfillDate(e.target.value)}
							className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
						/>
						<Button type="submit" size="icon" variant="outline">
							<Plus className="w-4 h-4" />
						</Button>
					</form>
				</div>

				{/* Notes */}
				<div className="space-y-2">
					<p className="text-xs font-semibold text-sidebar-foreground/50 uppercase flex items-center gap-2">
						Notas
						<Button
							variant="ghost"
							className="text-sidebar-foreground hover:bg-sidebar-accent"
							onClick={() => newNoteStore()}
						>
							<Plus className="w-4 h-4" />
						</Button>
					</p>
					<div className="flex items-start justify-start flex-col gap-1">
						{Object.values(notes).map((note) => (
							<div
								key={note.id}
								className={`flex items-center gap-1 w-full group ${
									activeNoteId === note.id ? "bg-accent rounded-md" : ""
								}`}
							>
								<Button
									variant="ghost"
									className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
									onClick={() => handleNoteClick(note.id)}
								>
									<File className="w-4 h-4 mr-2" />
									<span className="truncate">{note.title}</span>
								</Button>
								{confirmBeforeDelete ? (
									<ConfirmDialog
										title="Eliminar nota"
										description={`¿Estás seguro de que quieres eliminar "${note.title}"? Esta acción no se puede deshacer.`}
										onConfirm={() => handleDeleteNote(note.id)}
									>
										<Button
											variant="ghost"
											size="icon"
											className="opacity-0 group-hover:opacity-100 text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
										>
											<Trash2 className="w-3 h-3" />
										</Button>
									</ConfirmDialog>
								) : (
									<Button
										variant="ghost"
										size="icon"
										className="opacity-0 group-hover:opacity-100 text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
										onClick={() => handleDeleteNote(note.id)}
									>
										<Trash2 className="w-3 h-3" />
									</Button>
								)}
							</div>
						))}
					</div>
				</div>

				<Separator className="my-4" />

				{/* Export section */}
				<div className="space-y-2">
					<p className="text-xs font-semibold text-sidebar-foreground/50 uppercase px-2">
						Datos
					</p>

					{/* Current day export */}
					<div className="px-2">
						<p className="text-[10px] text-sidebar-foreground/40 mb-1">
							Día actual
						</p>
						<div className="flex gap-1">
							<Button
								variant="ghost"
								size="sm"
								className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
								onClick={handleExportCurrentDayJson}
							>
								<Download className="w-3.5 h-3.5 mr-1.5" />
								JSON
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
								onClick={handleExportCurrentDayTxt}
							>
								<Download className="w-3.5 h-3.5 mr-1.5" />
								TXT
							</Button>
						</div>
					</div>

					<Separator className="my-2" />

					{/* Range export */}
					<div className="px-2">
						<button
							type="button"
							onClick={() => setShowRangeExport((v) => !v)}
							className="w-full flex items-center justify-between text-[10px] text-sidebar-foreground/40 mb-1"
						>
							<span>Rango de fechas</span>
							{showRangeExport ? (
								<ChevronUp className="w-3 h-3" />
							) : (
								<ChevronDown className="w-3 h-3" />
							)}
						</button>
						{showRangeExport && (
							<div className="space-y-2">
								<div className="flex gap-2">
									<div className="flex-1">
										<label
											htmlFor="range-start"
											className="text-[10px] text-sidebar-foreground/30"
										>
											Desde
										</label>
										<input
											id="range-start"
											type="date"
											value={rangeStart}
											onChange={(e) => setRangeStart(e.target.value)}
											className="w-full bg-background border border-input rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
										/>
									</div>
									<div className="flex-1">
										<label
											htmlFor="range-end"
											className="text-[10px] text-sidebar-foreground/30"
										>
											Hasta
										</label>
										<input
											id="range-end"
											type="date"
											value={rangeEnd}
											onChange={(e) => setRangeEnd(e.target.value)}
											className="w-full bg-background border border-input rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
										/>
									</div>
								</div>
								<div className="flex gap-1">
									<Button
										variant="ghost"
										size="sm"
										className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
										onClick={handleExportRangeJson}
									>
										<Download className="w-3.5 h-3.5 mr-1.5" />
										JSON
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
										onClick={handleExportRangeTxt}
									>
										<Download className="w-3.5 h-3.5 mr-1.5" />
										TXT
									</Button>
								</div>
							</div>
						)}
					</div>

					<Separator className="my-2" />

					{/* Full export */}
					<div className="px-2">
						<p className="text-[10px] text-sidebar-foreground/40 mb-1">Todo</p>
						<div className="flex gap-1">
							<Button
								variant="ghost"
								size="sm"
								className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
								onClick={handleExportAllJson}
							>
								<Download className="w-3.5 h-3.5 mr-1.5" />
								JSON
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
								onClick={handleExportAllTxt}
							>
								<Download className="w-3.5 h-3.5 mr-1.5" />
								TXT
							</Button>
						</div>
					</div>

					<Separator className="my-2" />

					{/* Import */}
					<div className="relative px-2">
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
							onChange={handleImportJson}
							className="absolute inset-0 opacity-0 cursor-pointer"
							title="Importar archivo JSON"
						/>
					</div>

					{process.env.NODE_ENV === "development" && (
						<>
							<Separator className="my-4" />
							<a
								href="/sandbox"
								className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors rounded-md hover:bg-sidebar-accent"
							>
								<TestTube className="w-3.5 h-3.5" />
								Sandbox
							</a>
						</>
					)}
				</div>
			</div>
		</motion.aside>
	);
}
