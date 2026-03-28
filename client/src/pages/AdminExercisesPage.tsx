import AppLayout from "../common/components/AppLayout";
import { ExerciseList } from "../features/exercises";

export default function AdminExercisesPage() {
  return (
    <AppLayout pageTitle="Admin · Exercises">
      <ExerciseList />
    </AppLayout>
  );
}
