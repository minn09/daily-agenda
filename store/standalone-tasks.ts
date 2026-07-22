import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/utils/id";

const STORAGE_KEY = "standalone-tasks:v1";

export interface StandaloneTask {
	id: string;
	text: string;
	done: boolean;
	createdAt: string;
}

interface StandaloneTasksState {
	tasks: StandaloneTask[];
	addTask: (text: string) => void;
	toggleTask: (taskId: string) => void;
	deleteTask: (taskId: string) => void;
}

export const useStandaloneTasksStore = create<StandaloneTasksState>()(
	persist(
		(set) => ({
			tasks: [],

			addTask: (text) => {
				const newTask: StandaloneTask = {
					id: generateId(),
					text,
					done: false,
					createdAt: new Date().toISOString(),
				};
				set((state) => ({
					tasks: [...state.tasks, newTask],
				}));
			},

			toggleTask: (taskId) => {
				set((state) => ({
					tasks: state.tasks.map((t) =>
						t.id === taskId ? { ...t, done: !t.done } : t,
					),
				}));
			},

			deleteTask: (taskId) => {
				set((state) => ({
					tasks: state.tasks.filter((t) => t.id !== taskId),
				}));
			},
		}),
		{
			name: STORAGE_KEY,
		},
	),
);
