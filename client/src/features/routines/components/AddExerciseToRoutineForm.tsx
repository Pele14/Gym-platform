import { useState } from "react";
import styles from "../routines.module.css";
import { useExercises } from "../../exercises";

interface AddExerciseToRoutineFormProps {
  isSubmitting: boolean;
  onSubmit: (payload: {
    exercise_id: number;
    exercise_order: number;
    notes?: string;
  }) => Promise<void>;
}

export default function AddExerciseToRoutineForm({
  isSubmitting,
  onSubmit,
}: AddExerciseToRoutineFormProps) {
  const { exercises, isLoading } = useExercises();

  const [exerciseId, setExerciseId] = useState("");
  const [exerciseOrder, setExerciseOrder] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      exercise_id: Number(exerciseId),
      exercise_order: Number(exerciseOrder),
      notes: notes.trim() || undefined,
    });

    setExerciseId("");
    setExerciseOrder("");
    setNotes("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <select
        className={styles.select}
        value={exerciseId}
        onChange={(e) => setExerciseId(e.target.value)}
        disabled={isSubmitting || isLoading}
        required
      >
        <option value="">Select exercise</option>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name} ({exercise.muscle_group})
          </option>
        ))}
      </select>

      <input
        className={styles.input}
        type="number"
        placeholder="Exercise order"
        value={exerciseOrder}
        onChange={(e) => setExerciseOrder(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <textarea
        className={styles.textarea}
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={isSubmitting}
      />

      <button className={styles.secondaryButton} type="submit" disabled={isSubmitting}>
        Add exercise
      </button>
    </form>
  );
}