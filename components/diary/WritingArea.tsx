"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDailyPrompt } from "@/constants/prompts";
import { useDiaryStore } from "@/store/diary";
import { useNoteStore } from "@/store/note";
import { useUIStore } from "@/store/ui";
import { cn } from "@/utils";
import { getDateKey } from "@/utils/date";
import { BulletBar } from "./BulletBar";
import { StreakCalendar } from "./StreakCalendar";

function countWords(text: string): number {
	return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function WordCount({ text, visible }: { text: string; visible: boolean }) {
	const words = useMemo(() => countWords(text), [text]);

	if (!visible) return null;

	return (
		<motion.p
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="text-xs text-muted-foreground/40 select-none pointer-events-none"
		>
			{words} {words === 1 ? "palabra" : "palabras"}
		</motion.p>
	);
}

function SavedIndicator({ lastSavedAt }: { lastSavedAt: number }) {
	const [visible, setVisible] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		if (!lastSavedAt) return;
		setVisible(true);
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => setVisible(false), 1500);
		return () => clearTimeout(timerRef.current);
	}, [lastSavedAt]);

	if (!visible) return null;

	return (
		<motion.span
			initial={{ opacity: 0, y: 4 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0 }}
			className="text-xs text-green-600/60 dark:text-green-400/60 flex items-center gap-1 select-none"
		>
			<CheckCircle2 className="w-3 h-3" />
			Guardado
		</motion.span>
	);
}

function DailyPrompt({ date, visible }: { date: Date; visible: boolean }) {
	const prompt = useMemo(() => getDailyPrompt(date), [date]);

	if (!visible) return null;

	return (
		<motion.p
			initial={{ opacity: 0, y: -4 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-sm text-muted-foreground/40 italic select-none leading-relaxed"
		>
			{prompt}
		</motion.p>
	);
}

function ZenTextarea({
	value,
	onChange,
	placeholder,
	zenMode,
	serifMode,
	inputRef,
}: {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder: string;
	zenMode: boolean;
	serifMode: boolean;
	inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
	return (
		<textarea
			ref={inputRef}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className={cn(
				"w-full flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground p-0 transition-all duration-300",
				zenMode
					? "text-2xl leading-[2] max-w-3xl mx-auto focus:text-foreground"
					: "text-lg leading-relaxed",
			)}
			style={{ fontFamily: serifMode ? "Georgia, serif" : "inherit" }}
		/>
	);
}

export function WritingArea() {
	const { currentDate, direction, noteContent, updateNote, lastSavedAt } =
		useDiaryStore();
	const {
		notes,
		activeNoteId,
		updateNote: updateNoteStore,
		updateNoteTitle,
	} = useNoteStore();
	const { zenMode, serifMode } = useUIStore();

	const dateKey = getDateKey(currentDate);
	const content = noteContent[dateKey] || "";

	const activeNote = activeNoteId ? notes[activeNoteId] : null;

	const showPrompt = zenMode && !content.trim() && !activeNote;
	const [showZenCalendar, setShowZenCalendar] = useState(true);

	const diaryInputRef = useRef<HTMLTextAreaElement>(null);
	const noteInputRef = useRef<HTMLTextAreaElement>(null);

	const insertBullet = useCallback(
		(
			ref: React.RefObject<HTMLTextAreaElement | null>,
			currentValue: string,
			symbol: string,
			setter: (v: string) => void,
		) => {
			const el = ref.current;
			const cursorPos = el?.selectionStart ?? currentValue.length;
			const before = currentValue.slice(0, cursorPos);
			const after = currentValue.slice(cursorPos);
			const needsNewline = before.length > 0 && !before.endsWith("\n");
			const prefix = needsNewline ? "\n" : "";
			const newValue = `${before}${prefix}${symbol} ${after}`;
			setter(newValue);
			requestAnimationFrame(() => {
				if (el) {
					const newPos = cursorPos + prefix.length + symbol.length + 1;
					el.setSelectionRange(newPos, newPos);
					el.focus();
				}
			});
		},
		[],
	);

	const handleDiaryBullet = useCallback(
		(symbol: string) => {
			insertBullet(diaryInputRef, content, symbol, updateNote);
		},
		[content, updateNote, insertBullet],
	);

	const handleNoteBullet = useCallback(
		(symbol: string) => {
			if (!activeNote) return;
			insertBullet(noteInputRef, activeNote.content, symbol, (v) =>
				updateNoteStore(activeNote.id, v),
			);
		},
		[activeNote, updateNoteStore, insertBullet],
	);

	const wrapperCn = cn(
		"flex-1 overflow-y-auto transition-all duration-300",
		zenMode ? "p-12 flex flex-col" : "p-8",
	);

	if (activeNote) {
		return (
			<div className={wrapperCn}>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className={cn(
						"h-full flex flex-col",
						zenMode && "w-full max-w-3xl mx-auto",
					)}
				>
					<input
						type="text"
						value={activeNote.title}
						onChange={(e) => updateNoteTitle(activeNote.id, e.target.value)}
						className={cn(
							"bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground mb-6 p-0 transition-all duration-300",
							zenMode
								? "text-3xl font-light text-center"
								: "text-2xl font-semibold",
						)}
						style={{ fontFamily: serifMode ? "Georgia, serif" : "inherit" }}
						placeholder="Título de la nota..."
					/>
					<div className="flex-1 flex flex-col gap-4">
						<BulletBar onInsert={handleNoteBullet} zenMode={zenMode} />
						<ZenTextarea
							value={activeNote.content}
							onChange={(e) => updateNoteStore(activeNote.id, e.target.value)}
							placeholder="Escribe tu nota..."
							zenMode={zenMode}
							serifMode={serifMode}
							inputRef={noteInputRef}
						/>
						<div
							className={cn(
								"flex items-center gap-3",
								zenMode ? "justify-center" : "justify-end",
							)}
						>
							<SavedIndicator lastSavedAt={lastSavedAt} />
							<WordCount text={activeNote.content} visible={zenMode} />
						</div>
					</div>
				</motion.div>
			</div>
		);
	}

	return activeNoteId === null ? (
		<div className={wrapperCn}>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={dateKey}
					initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
					transition={{ duration: 0.3 }}
					className={cn(
						"h-full flex flex-col gap-4",
						zenMode && "w-full max-w-3xl mx-auto",
					)}
				>
					<DailyPrompt date={currentDate} visible={showPrompt} />
					<BulletBar onInsert={handleDiaryBullet} zenMode={zenMode} />
					<ZenTextarea
						value={content}
						onChange={(e) => updateNote(e.target.value)}
						placeholder={
							showPrompt
								? "Escribe algo..."
								: "Escribe aquí tus pensamientos del día..."
						}
						zenMode={zenMode}
						serifMode={serifMode}
						inputRef={diaryInputRef}
					/>
					<div
						className={cn(
							"flex items-center gap-3",
							zenMode ? "justify-center" : "justify-end",
						)}
					>
						<SavedIndicator lastSavedAt={lastSavedAt} />
						<WordCount text={content} visible={zenMode} />
					</div>
					{zenMode && (
						<>
							<button
								type="button"
								onClick={() => setShowZenCalendar((v) => !v)}
								className="mt-4 mx-auto flex items-center gap-1.5 text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
							>
								<Calendar className="w-3.5 h-3.5" />
								{showZenCalendar ? "Ocultar calendario" : "Mostrar calendario"}
								{showZenCalendar ? (
									<ChevronUp className="w-3 h-3" />
								) : (
									<ChevronDown className="w-3 h-3" />
								)}
							</button>
							{showZenCalendar && (
								<motion.div
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									className="mt-2 max-w-xs mx-auto w-full"
								>
									<StreakCalendar />
								</motion.div>
							)}
						</>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	) : null;
}
