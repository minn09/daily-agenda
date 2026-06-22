import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/utils/id";

const STORAGE_KEY = "daily-tasks:v1";

export interface DailyTask {
	id: string;
	text: string;
	done: boolean;
}

interface DailyTasksState {
	tasks: Record<string, DailyTask[]>;

	addTask: (dateKey: string, text: string) => void;
	toggleTask: (dateKey: string, taskId: string) => void;
	deleteTask: (dateKey: string, taskId: string) => void;
	loadTasksForDate: (dateKey: string) => DailyTask[];
}

export const useDailyTasksStore = create<DailyTasksState>()(
	persist(
		(set, get) => ({
			tasks: {},

			addTask: (dateKey, text) => {
				const id = generateId();
				set((state) => ({
					tasks: {
						...state.tasks,
						[dateKey]: [
							...(state.tasks[dateKey] || []),
							{ id, text, done: false },
						],
					},
				}));
			},

			toggleTask: (dateKey, taskId) => {
				set((state) => ({
					tasks: {
						...state.tasks,
						[dateKey]: (state.tasks[dateKey] || []).map((t) =>
							t.id === taskId ? { ...t, done: !t.done } : t,
						),
					},
				}));
			},

			deleteTask: (dateKey, taskId) => {
				set((state) => ({
					tasks: {
						...state.tasks,
						[dateKey]: (state.tasks[dateKey] || []).filter(
							(t) => t.id !== taskId,
						),
					},
				}));
			},

			loadTasksForDate: (dateKey) => {
				return get().tasks[dateKey] || [];
			},
		}),
		{
			name: STORAGE_KEY,
		},
	),
);
