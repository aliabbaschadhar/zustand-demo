import { Box, Paper, Stack, Typography, LinearProgress, IconButton, Tooltip } from "@mui/material"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useEffect } from "react";
import { useHabitStore } from "../store/store"

export const HabitList = () => {
  const { habits, removeHabit, toggleHabit, fetchHabits } = useHabitStore();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

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
              <Tooltip title={isCompletedToday ? "Undo" : "Mark Complete"}>
                <Stack
                  direction="column"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => toggleHabit(habit.id, today)}
                >
                  <IconButton
                    color={isCompletedToday ? "warning" : "success"}
                    size="small"
                    aria-label={isCompletedToday ? "undo" : "mark complete"}
                  >
                    {isCompletedToday ? <UndoIcon /> : <CheckCircleOutlineIcon />}
                  </IconButton>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {isCompletedToday ? "Undo" : "Mark Done"}
                  </Typography>
                </Stack>
              </Tooltip>

              <Tooltip title="Remove">
                <Stack
                  direction="column"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => removeHabit(habit.id)}
                >
                  <IconButton
                    color="error"
                    size="small"
                    aria-label="remove"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    Remove
                  </Typography>
                </Stack>
              </Tooltip>
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