import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { useHabitStore } from "../store/store";

export const AddHabitForm = () => {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const { habits, addHabit } = useHabitStore();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addHabit(name, frequency);
      setName("");
    }
    console.log(useHabitStore.getState().habits)
  }

  return <form onSubmit={handleSubmit}>
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2
    }}>
      <TextField
        label="Habit Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter habit name"
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel id="frequency">Frequency</InputLabel>
        <Select
          value={frequency}
          label="Frequency"
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
        >
          <MenuItem value={"daily"}>Daily</MenuItem>
          <MenuItem value={"weekly"}>Weekly</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
      >Add Habit</Button>
    </Box>
  </form>
}