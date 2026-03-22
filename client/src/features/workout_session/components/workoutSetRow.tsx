import { useEffect, useState } from "react";
import styles from "../workoutSessions.module.css";
import type { WorkoutSessionSet } from "../types/workout_session_types";

interface WorkoutSetRowProps {
  sessionId: number;
  setItem: WorkoutSessionSet;
  isSubmitting: boolean;
  onSave: (
    sessionId: number,
    setId: number,
    payload: {
      actual_reps?: number;
      actual_weight_kg?: number;
      is_completed?: boolean;
    }
  ) => Promise<void>;
}

export default function WorkoutSetRow({
  sessionId,
  setItem,
  isSubmitting,
  onSave,
}: WorkoutSetRowProps) {
  const [actualReps, setActualReps] = useState<string>(
    setItem.actual_reps != null ? String(setItem.actual_reps) : ""
  );
  const [actualWeight, setActualWeight] = useState<string>(
    setItem.actual_weight_kg != null ? String(setItem.actual_weight_kg) : ""
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(setItem.is_completed);

  useEffect(() => {
    setActualReps(setItem.actual_reps != null ? String(setItem.actual_reps) : "");
    setActualWeight(
      setItem.actual_weight_kg != null ? String(setItem.actual_weight_kg) : ""
    );
    setIsCompleted(setItem.is_completed);
  }, [setItem]);

  const handleSave = async () => {
    await onSave(sessionId, setItem.id, {
      actual_reps: actualReps ? Number(actualReps) : undefined,
      actual_weight_kg: actualWeight ? Number(actualWeight) : undefined,
      is_completed: isCompleted,
    });
  };

  const handleQuickComplete = async () => {
    const nextCompleted = !isCompleted;
    setIsCompleted(nextCompleted);

    await onSave(sessionId, setItem.id, {
      actual_reps: actualReps ? Number(actualReps) : undefined,
      actual_weight_kg: actualWeight ? Number(actualWeight) : undefined,
      is_completed: nextCompleted,
    });
  };

  return (
    <div className={styles.setCard}>
      <div className={styles.row}>
        <div>
          <p className={styles.smallText}>Set #{setItem.set_order}</p>
          <p className={styles.smallText}>
            Planned: {setItem.planned_reps ?? "-"} reps /{" "}
            {setItem.planned_weight_kg ?? "-"} kg
          </p>
          <p className={styles.smallText}>
            Previous: {setItem.previous?.reps ?? "-"} reps /{" "}
            {setItem.previous?.weight_kg ?? "-"} kg
          </p>
          <p className={styles.smallText}>Volume: {setItem.volume ?? 0}</p>
        </div>

        <div className={styles.grid}>
          <input
            className={styles.input}
            type="number"
            placeholder="Actual reps"
            value={actualReps}
            onChange={(e) => setActualReps(e.target.value)}
            disabled={isSubmitting}
          />

          <input
            className={styles.input}
            type="number"
            step="0.5"
            placeholder="Actual kg"
            value={actualWeight}
            onChange={(e) => setActualWeight(e.target.value)}
            disabled={isSubmitting}
          />

          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={handleQuickComplete}
              disabled={isSubmitting}
            />
            <span className={styles.smallText}>Completed</span>
          </div>

          <button
            className={styles.secondaryButton}
            onClick={handleSave}
            disabled={isSubmitting}
            type="button"
          >
            Save set
          </button>
        </div>
      </div>
    </div>
  );
}