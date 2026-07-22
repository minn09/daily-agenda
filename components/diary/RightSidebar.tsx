"use client";

import { motion } from "framer-motion";
import {
	Minus,
	PanelRightClose,
	Plus,
	Trash2,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MOOD_OPTIONS } from "@/constants/diary";
import { useDailyTasksStore } from "@/store/daily-tasks";
import { useDiaryStore } from "@/store/diary";
import { useUIStore } from "@/store/ui";
import { getDateKey } from "@/utils/date";

export function RightSidebar() {
	const { rightSidebarOpen, setRightSidebarOpen, isMobile } = useUIStore();

	const { getCurrentMetadata, updateMood, handleStatusClick, currentDate } =
		useDiaryStore();

	const { addTask, toggleTask, deleteTask, loadTasksForDate } =
		useDailyTasksStore();

	const [newTaskText, setNewTaskText] = useState("");

	const dateKey = getDateKey(currentDate);
	const dailyTasks = loadTasksForDate(dateKey);

	const handleAddTask = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTaskText.trim()) {
			addTask(dateKey, newTaskText.trim());
			setNewTaskText("");
		}
	};

	const metadata = getCurrentMetadata();

	return (
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
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setRightSidebarOpen(false)}
				>
					<PanelRightClose className="w-4 h-4" />
				</Button>
			</div>
			<div className="p-6 space-y-6 overflow-y-auto">
				<div className="space-y-3">
					<Label className="text-sm font-medium text-card-foreground">
						¿Cómo te sientes hoy?
					</Label>
					<div className="grid grid-cols-2 gap-2">
						{MOOD_OPTIONS.map((option) => {
							const Icon = option.icon;
							const isSelected = metadata.mood === option.value;
							return (
								<Button
									key={option.value}
									variant={isSelected ? "default" : "outline"}
									size="sm"
									onClick={() => updateMood(option.value)}
									className={`justify-start gap-2 ${
										isSelected
											? "bg-primary text-primary-foreground"
											: "hover:bg-accent"
									}`}
								>
									<Icon
										className={`w-4 h-4 ${!isSelected ? option.color : ""}`}
									/>
									<span className="text-xs">{option.label}</span>
								</Button>
							);
						})}
					</div>
				</div>

				<Separator />

				<div className="space-y-3">
					<Label className="text-sm font-medium text-card-foreground">
						¿Cómo te encuentras ahora?
					</Label>
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

					{metadata.statusChecks.length > 0 && (
						<div className="mt-3 space-y-2">
							<p className="text-xs text-muted-foreground">
								Historial del día:
							</p>
							<div className="space-y-1.5">
								{metadata.statusChecks.map((check, idx) => (
									<div
										key={idx}
										className="flex flex-col gap-1 text-xs bg-accent/50 rounded-md p-2"
									>
										<div className="flex items-center gap-2">
											<span className="text-muted-foreground font-mono">
												{check.time}
											</span>
											<span className="text-card-foreground font-medium inline-flex items-center gap-1">
												{check.status === "mejor" && (
													<>
														<TrendingUp className="w-3.5 h-3.5 text-green-600" />{" "}
														Mejor
													</>
												)}
												{check.status === "igual" && (
													<>
														<Minus className="w-3.5 h-3.5 text-yellow-600" />{" "}
														Igual
													</>
												)}
												{check.status === "peor" && (
													<>
														<TrendingDown className="w-3.5 h-3.5 text-red-600" />{" "}
														Peor
													</>
												)}
											</span>
										</div>
										{check.note && (
											<p className="text-muted-foreground italic ml-2 border-l-2 border-primary/20 pl-2">
												&ldquo;{check.note}&rdquo;
											</p>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<Separator />

				<div className="space-y-3">
					<Label className="text-sm font-medium text-card-foreground">
						Tareas del día
					</Label>
					<form onSubmit={handleAddTask} className="flex gap-2">
						<input
							type="text"
							value={newTaskText}
							onChange={(e) => setNewTaskText(e.target.value)}
							placeholder="Nueva tarea..."
							className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
						/>
						<Button type="submit" size="icon" variant="outline">
							<Plus className="w-4 h-4" />
						</Button>
					</form>
					<div className="space-y-1.5 max-h-48 overflow-y-auto">
						{dailyTasks.length === 0 ? (
							<p className="text-xs text-muted-foreground py-2">
								Sin tareas para hoy
							</p>
						) : (
							dailyTasks.map((task) => (
								<div key={task.id} className="flex items-center gap-2 group">
									<input
										type="checkbox"
										checked={task.done}
										onChange={() => toggleTask(dateKey, task.id)}
										className="w-4 h-4 rounded border-input"
									/>
									<span
										className={`flex-1 text-sm cursor-pointer ${
											task.done
												? "line-through text-muted-foreground"
												: "text-card-foreground"
										}`}
										onClick={() => toggleTask(dateKey, task.id)}
									>
										{task.text}
									</span>
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 opacity-0 group-hover:opacity-100"
										onClick={() => deleteTask(dateKey, task.id)}
									>
										<Trash2 className="w-3 h-3" />
									</Button>
								</div>
							))
						)}
					</div>
				</div>

				<Separator />

				<div className="space-y-3">
					<Label className="text-sm font-medium text-card-foreground">
						Otros detalles
					</Label>
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
	);
}
