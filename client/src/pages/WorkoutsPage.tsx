import { RoutineList } from "../features/routines";
import AppLayout from "../common/components/AppLayout";

export default function WorkoutsPage() {
  return (
    <AppLayout pageTitle="Workouts">
      <RoutineList />
    </AppLayout>
  );
}
