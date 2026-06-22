import type { StandaloneTask } from "@/store/standalone-tasks";
import type { DayMetadata } from "@/types/diary";
import type { Note } from "@/types/note";
import type { ExportData, MetadataRecord, NotesRecord } from "./export";

export type ValidatedData = ExportData;

function parseJsonFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => resolve(e.target?.result as string);
		reader.onerror = () => reject(new Error("Error al leer el archivo."));
		reader.readAsText(file);
	});
}

function transformToData(json: Record<string, unknown>): ValidatedData {
	return {
		metadata: (json.metadata as MetadataRecord) || {},
		notes: (json.notes as NotesRecord) || {},
		standaloneNotes: (json.standaloneNotes as Note[]) || [],
		standaloneTasks: (json.standaloneTasks as StandaloneTask[]) || [],
		exportDate: (json.exportDate as string) || new Date().toISOString(),
		version: (json.version as string) || "1.0",
	};
}

function validateData(json: Record<string, unknown>): {
	valid: boolean;
	error?: string;
} {
	if (!json.metadata || typeof json.metadata !== "object") {
		return {
			valid: false,
			error: "El archivo no tiene el formato correcto (falta metadata).",
		};
	}
	if (!json.notes || typeof json.notes !== "object") {
		return {
			valid: false,
			error: "El archivo no tiene el formato correcto (falta notes).",
		};
	}
	return { valid: true };
}

export async function importFromJson(
	file: File,
	onSuccess: (data: ValidatedData) => void,
	onError: (message: string) => void,
): Promise<void> {
	try {
		const content = await parseJsonFile(file);
		const json = JSON.parse(content);

		const validation = validateData(json);
		if (!validation.valid) {
			onError(validation.error || "Formato inválido");
			return;
		}

		const data = transformToData(json);
		onSuccess(data);
	} catch {
		onError("Error al leer el archivo JSON.");
	}
}
