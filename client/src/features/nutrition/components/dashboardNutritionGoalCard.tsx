import styles from "./dashboardNutritionGoalCard.module.css";

type DashboardNutritionGoalCardProps = {
  hasGoal: boolean;
  canCalculate: boolean;
  isCalculating: boolean;
  isLoadingProfile?: boolean;
  error?: string | null;
  onCalculate: () => void | Promise<void>;
  onGoToProfile: () => void;
};

export default function DashboardNutritionGoalCard({
  hasGoal,
  canCalculate,
  isCalculating,
  isLoadingProfile = false,
  error,
  onCalculate,
  onGoToProfile,
}: DashboardNutritionGoalCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Nutrition Goal</h3>

      {hasGoal ? (
        <p className={styles.message}>
          Goal is calculated. You can log meals and track progress.
        </p>
      ) : (
        <p className={styles.message}>
          Nutrition is locked until your goal is calculated.
        </p>
      )}

      {!canCalculate && !isLoadingProfile && (
        <p className={styles.message}>
          Complete profile fields first: date of birth, height, weight, sex,
          activity level and goal type.
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          className={styles.primaryButton}
          type="button"
          disabled={isCalculating || !canCalculate || isLoadingProfile}
          onClick={() => {
            void onCalculate();
          }}
        >
          {isCalculating
            ? "Calculating..."
            : hasGoal
              ? "Recalculate Goal"
              : "Calculate Goal"}
        </button>

        <button
          className={styles.secondaryButton}
          type="button"
          onClick={onGoToProfile}
        >
          Open Profile
        </button>
      </div>
    </div>
  );
}
