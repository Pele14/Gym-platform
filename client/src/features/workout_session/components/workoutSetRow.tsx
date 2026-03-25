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
  const [actualRepsInput, setActualRepsInput] = useState<string>(
    setItem.actual_reps != null ? String(setItem.actual_reps) : ""
  );
  const [actualWeightInput, setActualWeightInput] = useState<string>(
    setItem.actual_weight_kg != null ? String(setItem.actual_weight_kg) : ""
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(setItem.is_completed);

  useEffect(() => {
    setActualRepsInput(setItem.actual_reps != null ? String(setItem.actual_reps) : "");
    setActualWeightInput(
      setItem.actual_weight_kg != null ? String(setItem.actual_weight_kg) : ""
    );
    setIsCompleted(setItem.is_completed);
  }, [setItem]);

  const parseActualReps = (): number | undefined => {
    const trimmed = actualRepsInput.trim();
    if (!trimmed) return undefined;

    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed <= 0) return undefined;
    return parsed;
  };

  const parseActualWeight = (): number | undefined => {
    const trimmed = actualWeightInput.trim();
    if (!trimmed) return undefined;

    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 500) return undefined;
    return parsed;
  };

  const hasRepsValue = actualRepsInput.trim().length > 0;
  const hasWeightValue = actualWeightInput.trim().length > 0;
  const parsedReps = parseActualReps();
  const parsedWeight = parseActualWeight();

  const hasInvalidReps = hasRepsValue && parsedReps == null;
  const hasInvalidWeight = hasWeightValue && parsedWeight == null;

  const buildActualsPayload = (): {
    actual_reps?: number;
    actual_weight_kg?: number;
  } => {
    const payload: { actual_reps?: number; actual_weight_kg?: number } = {};

    if (parsedReps != null) payload.actual_reps = parsedReps;
    if (parsedWeight != null) payload.actual_weight_kg = parsedWeight;

    return payload;
  };

  const handleQuickComplete = async () => {
    const nextCompleted = !isCompleted;

    if (nextCompleted && (hasInvalidReps || hasInvalidWeight)) {
      return;
    }

    setIsCompleted(nextCompleted);

    await onSave(sessionId, setItem.id, {
      ...(nextCompleted ? buildActualsPayload() : {}),
      is_completed: nextCompleted,
    });
  };

  return (
    <div
      className={`${styles.setTableRow} ${isCompleted ? styles.setTableRowCompleted : ""}`}
    >
      <div className={styles.setCellMeta}>
        <p className={styles.setIndex}>#{setItem.set_order}</p>
        <p className={styles.smallText}>
          Planned {setItem.planned_reps} / {setItem.planned_weight_kg}kg
        </p>
        <p className={styles.smallText}>
          Prev {setItem.previous?.reps ?? "-"} / {setItem.previous?.weight_kg ?? "-"}kg
        </p>
      </div>

      <div>
        <input
          className={`${styles.input} ${isCompleted ? styles.inputCompleted : ""}`}
          type="number"
          min={1}
          step={1}
          placeholder={String(setItem.planned_reps)}
          value={actualRepsInput}
          onChange={(event) => setActualRepsInput(event.target.value)}
          disabled={isSubmitting}
        />
        {hasInvalidReps && <p className={styles.inputHintError}>Use a positive whole number.</p>}
      </div>

      <div>
        <input
          className={`${styles.input} ${isCompleted ? styles.inputCompleted : ""}`}
          type="number"
          min={0}
          max={500}
          step={0.5}
          placeholder={String(setItem.planned_weight_kg)}
          value={actualWeightInput}
          onChange={(event) => setActualWeightInput(event.target.value)}
          disabled={isSubmitting}
        />
        {hasInvalidWeight && <p className={styles.inputHintError}>Use a value from 0 to 500.</p>}
      </div>

      <div className={styles.setRowActions}>
        <label
          className={`${styles.setDoneToggleInline} ${isCompleted ? styles.setDoneToggleInlineCompleted : ""}`}
        >
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleQuickComplete}
            disabled={isSubmitting}
          />
          <span>Done</span>
        </label>
      </div>
    </div>
  );
}