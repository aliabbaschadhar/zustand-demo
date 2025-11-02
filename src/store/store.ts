import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface Habit {
  id: string,
  name: string,
  frequency: "daily" | "weekly",
  completedDates: string[],
  completedAt?: string,
  createdAt: string
}

interface HabitState {
  habits: Habit[],
  addHabit: (name: string, frequency: "daily" | "weekly") => void,
  removeHabit: (id: string) => void,
  toggleHabit: (id: string, date: string) => void,
  fetchHabits: () => Promise<void>,
  isLoading: boolean,
  error: string | null,
}

export const useHabitStore = create<HabitState>()(
  devtools(
    persist(
      (set, get) => {
        return {
          habits: [] as Habit[],
          isLoading: false,
          error: null,
          addHabit: (name, frequency) => set((state) => {
            return {
              habits: [
                ...state.habits, {
                  id: crypto.randomUUID(),
                  name,
                  frequency,
                  completedDates: [],
                  createdAt: new Date().toISOString()
                }
              ]
            }
          }),
          removeHabit: (id) => set((state) => ({
            habits: state.habits.filter(habit => habit.id !== id)
          })),
          toggleHabit: (id, date) => set((state) => ({
            habits: state.habits.map(habit =>
              habit.id === id
                ? {
                  ...habit,
                  completedDates: habit.completedDates.includes(date)
                    ? habit.completedDates.filter(d => d !== date)
                    : [...habit.completedDates, date]
                }
                : habit
            )
          })),
          fetchHabits: async () => {
            set({ isLoading: true });
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              const earlyHabits = get().habits;
              const mockHabits: Habit[] = [
                {
                  id: "1",
                  name: "Exercise",
                  frequency: "daily",
                  completedDates: [],
                  createdAt: new Date().toISOString()
                },
                {
                  id: "2",
                  name: "Read a book",
                  frequency: "weekly",
                  completedDates: [],
                  createdAt: new Date().toISOString()
                }
              ];
              if (earlyHabits.length > 0) {
                set({ habits: earlyHabits, isLoading: false, error: null });
              } else {
                set({ habits: mockHabits, isLoading: false, error: null });
              }

            } catch (error) {
              set({ isLoading: false, error: "Failed to fetch Habits: " + error });
            }
          }
        }
      },
      {
        name: "Habits-local", // By default store state in localstorage but we can configure it using storage parameter
        // storage: createJSONStorage(()=>sessionStorage) // optional
      }
    )
  )
)
