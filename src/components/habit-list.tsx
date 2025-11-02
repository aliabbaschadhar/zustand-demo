import { Box, Paper, Button, Stack, Typography, LinearProgress } from "@mui/material"
import { useHabitStore } from "../store/store"

export const HabitList = () => {
  const { habits, removeHabit, toggleHabit } = useHabitStore();
  const today = new Date().toISOString().split('T')[0];

  const calculateStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return 0;

    let streak = 0;
    const sortedDates = completedDates.sort().reverse();
    const todayDate = new Date(today);

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const expectedDate = new Date(todayDate);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (currentDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const totalStreak = habits.reduce((max, habit) => {
    return Math.max(max, calculateStreak(habit.completedDates));
  }, 0);

  return (
    <Box sx={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 2,
      mt: 4
    }}>
      {habits.map((habit) => {
        const isCompletedToday = habit.completedDates.includes(today);
        return (
          <Paper key={habit.id} elevation={2} sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <h3 style={{
                textDecoration: isCompletedToday ? 'line-through' : 'none',
                opacity: isCompletedToday ? 0.6 : 1
              }}>
                {habit.name}
              </h3>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color={isCompletedToday ? "warning" : "success"}
                size="small"
                onClick={() => toggleHabit(habit.id, today)}
              >
                {isCompletedToday ? "Undo" : "Mark Complete"}
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => removeHabit(habit.id)}
              >
                Remove
              </Button>
            </Stack>
          </Paper>
        );
      })}
      <Box sx={{ mt: 2, gridColumn: "1 / -1" }}>
        <Typography>🔥 Current Streak: <strong>{totalStreak}</strong> day{totalStreak !== 1 ? 's' : ''}</Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(totalStreak * 10, 100)}
        />
      </Box>
    </Box>
  )
}