import { useNutritionGoal } from "../hooks/useNutritionGoal";
import styles from "../../user/userSettings.module.css";

type NutritionGoalCardProps = {
  canCalculate: boolean;
  isDisabled?: boolean;
};

function round(value: number, decimals = 0): number {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

export default function NutritionGoalCard({
  canCalculate,
  isDisabled = false,
}: NutritionGoalCardProps) {
  const { goal, isLoading, isCalculating, error, notCalculatedYet, calculateGoal } =
    useNutritionGoal();

  return (
    <div className={styles.nutritionCard}>
      <h3 className={styles.nutritionCardTitle}>Nutrition goal</h3>

      {isLoading && <p className={styles.message}>Loading nutrition goal...</p>}

      {!isLoading && notCalculatedYet && (
        <p className={styles.message}>Not calculated yet.</p>
      )}

      {!isLoading && error && <p className={styles.error}>{error}</p>}

      {!isLoading && goal && (
        <div className={styles.goalGrid}>
          <div className={styles.goalItem}>
            <span className={styles.goalLabel}>BMI</span>
            <strong>{round(goal.bmi, 2)}</strong>
          </div>
          <div className={styles.goalItem}>
            <span className={styles.goalLabel}>Maintenance calories</span>
            <strong>{round(goal.maintenance_calories)} kcal</strong>
          </div>
          <div className={styles.goalItem}>
            <span className={styles.goalLabel}>Target calories</span>
            <strong>{round(goal.target_calories)} kcal</strong>
          </div>
          <div className={styles.goalItem}>
            <span className={styles.goalLabel}>Protein</span>
            <strong>{round(goal.target_protein)} g</strong>
          </div>
          <div className={styles.goalItem}>
            <span className={styles.goalLabel}>Carbs</span>
            <strong>{round(goal.target_carbs)} g</strong>
          </div>
          <div className={styles.goalItem}>
            <span className={styles.goalLabel}>Fat</span>
            <strong>{round(goal.target_fat)} g</strong>
          </div>
        </div>
      )}

      {!canCalculate && (
        <p className={styles.message}>
          Fill required profile fields first: date of birth, height, weight, sex,
          activity level and goal type.
        </p>
      )}

      <button
        className={styles.button}
        type="button"
        disabled={!canCalculate || isCalculating || isDisabled}
        onClick={async () => {
          await calculateGoal();
        }}
      >
        {isCalculating ? "Calculating..." : "Calculate nutrition goal"}
      </button>
    </div>
  );
}