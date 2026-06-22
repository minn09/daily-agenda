import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note } from "@/types/note";
import { generateId } from "@/utils/id";

interface NoteState {
	notes: Record<string, Note>;
	activeNoteId: string | null;
	newNote: () => void;
	updateNote: (id: string, content: string) => void;
	updateNoteTitle: (id: string, title: string) => void;
	deleteNote: (id: string) => void;
	setActiveNote: (id: string | null) => void;
}

export const useNoteStore = create<NoteState>()(
	persist(
		(set, get) => ({
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

				set({ notes: { ...get().notes, [id]: newNote }, activeNoteId: id });
			},

			updateNote: (id, content) => {
				set((state) => {
					const existing = state.notes[id];
					if (!existing) return state;
					return {
						notes: {
							...state.notes,
							[id]: { ...existing, content },
						},
					};
				});
			},

			updateNoteTitle: (id, title) => {
				set((state) => {
					const existing = state.notes[id];
					if (!existing) return state;
					return {
						notes: {
							...state.notes,
							[id]: { ...existing, title },
						},
					};
				});
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
			},

			setActiveNote: (id) => {
				set({ activeNoteId: id });
			},
		}),
		{
			name: "diary-standalone-notes:v1",

			// Migrate old format (raw notes Record) to persist format
			merge: (persisted, current) => {
				const prev = persisted as Partial<NoteState>;
				if (prev.notes) {
					return { ...current, ...prev };
				}
				// Old format: persisted IS the notes record directly
				return { ...current, notes: prev as unknown as Record<string, Note> };
			},
		},
	),
);
