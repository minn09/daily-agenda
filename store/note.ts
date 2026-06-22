import { create } from "zustand";
import type { Note } from "@/types/note";
import { generateId } from "@/utils/id";

const STORAGE_KEY = "diary-standalone-notes:v1";

interface NoteState {
	notes: Record<string, Note>;
	activeNoteId: string | null;
	newNote: () => void;
	updateNote: (id: string, content: string) => void;
	updateNoteTitle: (id: string, title: string) => void;
	deleteNote: (id: string) => void;
	setActiveNote: (id: string | null) => void;
	loadFromStorage: () => void;
	saveToStorage: () => void;
}

const loadNotesFromStorage = (): Record<string, Note> => {
	if (typeof window === "undefined") return {};
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved ? JSON.parse(saved) : {};
	} catch {
		return {};
	}
};

export const useNoteStore = create<NoteState>((set, get) => ({
	notes: {},
	activeNoteId: null,

	newNote: () => {
		const id = generateId();

		const untitledCount = Object.values(get().notes).filter((n) =>
			n.title.startsWith("Nota-"),
		).length;

		const newNote: Note = {
			id,
			title: `Nota ${untitledCount + 1}`,
			content: "",
			createdAt: new Date().toISOString(),
		};

		set((state) => ({
			notes: { ...state.notes, [id]: newNote },
			activeNoteId: id,
		}));
		get().saveToStorage();
	},

	updateNote: (id, content) => {
		set((state) => {
			const existing = state.notes[id];
			if (!existing) return state;
			return {
				notes: {
					...state.notes,
					[id]: {
						...existing,
						content,
					},
				},
			};
		});
		get().saveToStorage();
	},

	updateNoteTitle: (id, title) => {
		set((state) => {
			const existing = state.notes[id];
			if (!existing) return state;
			return {
				notes: {
					...state.notes,
					[id]: {
						...existing,
						title,
					},
				},
			};
		});
		get().saveToStorage();
	},

	deleteNote: (id) => {
		set((state) => {
			const newNotes = { ...state.notes };
			delete newNotes[id];
			return {
				notes: newNotes,
				activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
			};
		});
		get().saveToStorage();
	},

	setActiveNote: (id) => {
		set({ activeNoteId: id });
	},

	loadFromStorage: () => {
		const notes = loadNotesFromStorage();
		set({ notes });
	},

	saveToStorage: () => {
		if (typeof window === "undefined") return;
		try {
			const { notes } = get();
			localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
		} catch {
			// localStorage unavailable (incognito, quota exceeded)
		}
	},
}));
