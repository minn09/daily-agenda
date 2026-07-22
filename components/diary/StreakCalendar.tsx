"use client";

import { useMemo, useState } from "react";

import { es } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { useDiaryStore } from "@/store/diary";

type StreakCalendarProps = {
	onDateSelect?: (date: Date) => void;
};

export function StreakCalendar({ onDateSelect }: StreakCalendarProps) {
	const { noteContent, currentDate, setCurrentDate } = useDiaryStore();
	const [month, setMonth] = useState<Date>(() => new Date());

	const datesWithEntries = useMemo(() => {
		const dates: Date[] = [];
		for (const [key, content] of Object.entries(noteContent)) {
			if (!content?.trim()) continue;
			const parts = key.split("-").map(Number);
			if (parts.length < 3) continue;
			const y = parts[0]!,
				m = parts[1]!,
				d = parts[2]!;
			dates.push(new Date(y, m - 1, d));
		}
		return dates;
	}, [noteContent]);

	return (
		<Calendar
			mode="single"
			selected={currentDate}
			onSelect={(date) => {
				if (!date) return;
				setCurrentDate(date);
				onDateSelect?.(date);
			}}
			month={month}
			onMonthChange={setMonth}
			locale={es}
			modifiers={{
				hasEntry: datesWithEntries,
			}}
			// 1. ANULACIÓN INMORTAL DE BORDES VÍA ESTILOS EN LÍNEA (Anula cualquier CSS externo)
			styles={{
				day: { border: "none", boxShadow: "none", outline: "none" },
			}}
			classNames={{
				// Forzamos forma redonda exacta e invariable
				day: "h-9 w-9 p-0 flex items-center justify-center m-auto !rounded-full transition-colors !border-0 !border-none !outline-none !shadow-none",

				// DÍA SELECCIONADO: Fondo blanco sólido sin rastro de bordes
				selected:
					"bg-white text-black font-bold hover:bg-white focus:bg-white !border-0 !border-none !rounded-full h-9 w-9 !shadow-none",

				// DÍA DE HOY
				today:
					"text-amber-500 font-semibold !border-0 !border-none !shadow-none",
			}}
			modifiersClassNames={{
				// DÍA CON DATOS: Círculo gris liso, absolutamente sin bordes
				hasEntry:
					"bg-white/20 text-white !border-0 !border-none h-9 w-9 !rounded-full !shadow-none",
			}}
			// Separación física entre los círculos
			className="w-full border-0 [&_td]:p-1 [&_td>button]:!rounded-full [&_td>button]:!border-none [&_td>button]:!shadow-none"
		/>
	);
}
