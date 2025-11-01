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
  toggleHabit: (id: string, date: string) => void
}

export const useHabitStore = create<HabitState>()(
  devtools(
    persist(
      (set, get) => {
        return {
          habits: [],
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
          }))
        }
      },
      {
        name: "Habits-local", // By default store state in localstorage but we can configure it using storage parameter
        // storage: createJSONStorage(()=>sessionStorage) // optional
      }
    )
  )
)
