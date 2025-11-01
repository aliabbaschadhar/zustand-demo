import { Box, Container, Typography } from '@mui/material'
import { AddHabitForm } from './components/add-habit-form';
import { HabitList } from './components/habit-list';

function App() {

  return (
    <Container>
      <Box>
        <Typography variant='h2' component="h1" gutterBottom align='center'>
          Habit Tracker
        </Typography>
        {/* Form */}
        <AddHabitForm />
        {/* list */}
        <HabitList />
        {/* stats */}
      </Box>
    </Container>
  )
}

export default App;