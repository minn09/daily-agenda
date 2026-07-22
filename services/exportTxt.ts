import type { DayMetadata } from "@/types/diary";

const defaultMeta: DayMetadata = {
	mood: null,
	statusChecks: [],
	energy: null,
	tags: [],
};

export function exportToTxt(
	metadata: Record<string, DayMetadata>,
	notes: Record<string, string>,
) {
	const lines: string[] = [];
	// Global metadata
	lines.push("@v=1.0");
	lines.push(`@export=${new Date().toISOString()}`);
	lines.push("");

	const allDates = new Set([...Object.keys(metadata), ...Object.keys(notes)]);
	const dates = [...allDates].sort();
	for (const date of dates) {
		const dayMeta = metadata[date] ?? defaultMeta;
		const note = notes[date] ?? "";
		if (!metadata[date] && !note.trim()) continue;

		lines.push(`# ${date}`);
		lines.push(`mood: ${dayMeta.mood ?? "-"} `);
		lines.push(`energy: ${dayMeta.energy ?? "-"} `);
		lines.push(
			`tags: ${dayMeta.tags?.length ? dayMeta.tags.join(", ") : "-"} `,
		);
		lines.push("");
		if (note) {
			lines.push(`> ${note}`);
			lines.push("");
		}
		if (dayMeta.statusChecks.length) {
			for (const check of dayMeta.statusChecks) {
				const notePart = check.note ? ` | ${check.note}` : "";
				lines.push(`~ ${check.time} ${check.status}${notePart}`);
			}
			lines.push("");
		}
	}
	return lines.join("\n");
}
