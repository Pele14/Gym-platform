import styles from "../nutrition_log.module.css";

type AddMealCardProps = {
  showForm: boolean;
  mealName: string;
  isSubmitting: boolean;
  onOpen: () => void;
  onChangeName: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function AddMealCard({
  showForm,
  mealName,
  isSubmitting,
  onOpen,
  onChangeName,
  onSubmit,
  onCancel,
}: AddMealCardProps) {
  if (!showForm) {
    return (
      <div className={styles.addMealCard}>
        <div className={styles.addMealCardHeader}>
          <div>
            <p className={styles.addMealEyebrow}>Primary action</p>
            <h4 className={styles.addMealTitle}>Create a meal entry</h4>
            <p className={styles.addMealDescription}>
              Start a new meal, then add foods from the nutrition database.
            </p>
          </div>
          <button
            className={styles.addMealPrimaryButton}
            onClick={onOpen}
            disabled={isSubmitting}
          >
            + Add Meal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.addMealCard}>
      <div className={styles.addMealCardHeader}>
        <div>
          <p className={styles.addMealEyebrow}>Primary action</p>
          <h4 className={styles.addMealTitle}>Create a meal entry</h4>
          <p className={styles.addMealDescription}>
            Give this meal a clear name so you can quickly find and expand it later.
          </p>
        </div>
      </div>

      <div className={styles.addMealFormRow}>
        <input
          className={styles.addMealInput}
          type="text"
          placeholder="Meal name (e.g., Breakfast)"
          value={mealName}
          onChange={(e) => onChangeName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
          }}
          autoFocus
          disabled={isSubmitting}
        />
        <div className={styles.addMealActions}>
          <button
            className={styles.addMealPrimaryButton}
            onClick={onSubmit}
            disabled={isSubmitting || !mealName.trim()}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
          <button
            className={styles.addMealSecondaryButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
