import type { StandaloneTask } from "@/store/standalone-tasks";
import type { DayMetadata } from "@/types/diary";
import type { Note } from "@/types/note";
import { exportToTxt } from "./exportTxt";

export type MetadataRecord = Record<string, DayMetadata>;
export type NotesRecord = Record<string, string>;

export interface ExportData {
	metadata: MetadataRecord;
	notes: NotesRecord;
	standaloneNotes: Note[];
	standaloneTasks: StandaloneTask[];
	exportDate: string;
	version: string;
}

function filterByDateRange(
	metadata: MetadataRecord,
	notes: NotesRecord,
	startDate: string,
	endDate: string,
): { metadata: MetadataRecord; notes: NotesRecord } {
	const filteredMetadata: MetadataRecord = {};
	const filteredNotes: NotesRecord = {};

	const allDates = new Set([...Object.keys(metadata), ...Object.keys(notes)]);
	const sortedDates = [...allDates].sort();

	for (const date of sortedDates) {
		if (date >= startDate && date <= endDate) {
			if (metadata[date]) filteredMetadata[date] = metadata[date];
			if (notes[date]) filteredNotes[date] = notes[date];
		}
	}

	return { metadata: filteredMetadata, notes: filteredNotes };
}

function serializeToJson(
	metadata: MetadataRecord,
	notes: NotesRecord,
	standaloneNotes: Note[],
	standaloneTasks: StandaloneTask[],
): ExportData {
	return {
		metadata,
		notes,
		standaloneNotes,
		standaloneTasks,
		exportDate: new Date().toISOString(),
		version: "1.0",
	};
}

function generateJsonBlob(data: ExportData): Blob {
	return new Blob([JSON.stringify(data, null, 2)], {
		type: "application/json",
	});
}

function generateTxtBlob(text: string): Blob {
	return new Blob([text], { type: "text/plain" });
}

function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

function getExportFilename(extension: string): string {
	const date = new Date().toISOString().split("T")[0];
	return `diario-export-${date}.${extension}`;
}

/**
 * Export data within a date range.
 * Pass a single date as both start and end to export one day.
 * Pass undefined to export everything.
 */
export function exportToJson(
	metadata: MetadataRecord,
	notes: NotesRecord,
	standaloneNotes: Note[],
	standaloneTasks: StandaloneTask[],
	startDate?: string,
	endDate?: string,
): void {
	let filteredMetadata = metadata;
	let filteredNotes = notes;

	if (startDate && endDate) {
		const result = filterByDateRange(metadata, notes, startDate, endDate);
		filteredMetadata = result.metadata;
		filteredNotes = result.notes;
	}

	const data = serializeToJson(
		filteredMetadata,
		filteredNotes,
		standaloneNotes,
		standaloneTasks,
	);
	const blob = generateJsonBlob(data);
	const filename = getExportFilename("json");
	downloadBlob(blob, filename);
}

export function exportToTxtFile(
	metadata: MetadataRecord,
	notes: NotesRecord,
	standaloneNotes: Note[],
	standaloneTasks: StandaloneTask[],
	startDate?: string,
	endDate?: string,
): void {
	let filteredMetadata = metadata;
	let filteredNotes = notes;

	if (startDate && endDate) {
		const result = filterByDateRange(metadata, notes, startDate, endDate);
		filteredMetadata = result.metadata;
		filteredNotes = result.notes;
	}

	const txt = exportToTxt(filteredMetadata, filteredNotes);
	const blob = generateTxtBlob(txt);
	const date = new Date().toISOString().split("T")[0];
	downloadBlob(blob, `diario-${date}.txt`);
}
