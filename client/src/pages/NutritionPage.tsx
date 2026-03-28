import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDailyNutritionLog } from "../features/nutrition_log";
import { useCurrentUser } from "../features/user";
import { DailyLogView, DateNavigator } from "../features/nutrition_log";
import {
  DashboardNutritionGoalCard,
  nutritionService,
} from "../features/nutrition";
import AppLayout from "../common/components/AppLayout";
import styles from "./pages.module.css";

export default function NutritionPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  });
  const [isCalculatingGoal, setIsCalculatingGoal] = useState(false);
  const [nutritionGoalError, setNutritionGoalError] = useState<string | null>(null);

  const { goal, isLoading: isNutritionLoading, refetch: refetchDailyLog } =
    useDailyNutritionLog(selectedDate);
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  const hasNutritionGoal = !!goal;
  const hasRequiredNutritionFields =
    !!currentUser?.profile?.date_of_birth &&
    currentUser?.profile?.height_cm != null &&
    (currentUser.profile.height_cm ?? 0) > 0 &&
    currentUser?.profile?.weight_kg != null &&
    (currentUser.profile.weight_kg ?? 0) > 0 &&
    !!currentUser?.profile?.sex &&
    !!currentUser?.profile?.activity_level &&
    !!currentUser?.profile?.goal_type;

  const handleCalculateNutritionGoal = async () => {
    try {
      setIsCalculatingGoal(true);
      setNutritionGoalError(null);
      await nutritionService.calculateNutritionGoal();
      await refetchDailyLog();
    } catch (err) {
      setNutritionGoalError(
        err instanceof Error ? err.message : "Failed to calculate nutrition goal."
      );
    } finally {
      setIsCalculatingGoal(false);
    }
  };

  return (
    <AppLayout pageTitle="Nutrition">
      <div className={styles.dateNavigatorWrapper}>
        <DateNavigator date={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {!hasNutritionGoal ? (
        <DashboardNutritionGoalCard
          hasGoal={false}
          canCalculate={hasRequiredNutritionFields}
          isCalculating={isCalculatingGoal}
          isLoadingProfile={isCurrentUserLoading}
          error={nutritionGoalError}
          onCalculate={handleCalculateNutritionGoal}
          onGoToProfile={() => navigate("/profile")}
        />
      ) : (
        <DailyLogView date={selectedDate} />
      )}

      {isNutritionLoading && (
        <p className={styles.cardMeta}>Updating nutrition data...</p>
      )}
    </AppLayout>
  );
}
