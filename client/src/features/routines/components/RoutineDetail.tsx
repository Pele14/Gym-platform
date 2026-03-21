import styles from "../routines.module.css";
import AddExerciseToRoutineForm from "./AddExerciseToRoutineForm";
import AddSetForm from "./AddSetForm";
import type { Routine } from "../types/routine_types";

interface RoutineDetailProps {
  routine: Routine | null;
  isSubmitting: boolean;
  onAddExercise: (payload: {
    exercise_id: number;
    exercise_order: number;
    notes?: string;
  }) => Promise<void>;
  onDeleteExercise: (planExerciseId: number) => Promise<void>;
  onAddSet: (
    planExerciseId: number,
    payload: {
      set_order: number;
      target_reps?: number;
      target_weight_kg?: number;
    }
  ) => Promise<void>;
  onDeleteSet: (planExerciseId: number, setId: number) => Promise<void>;
}

export default function RoutineDetail({
  routine,
  isSubmitting,
  onAddExercise,
  onDeleteExercise,
  onAddSet,
  onDeleteSet,
}: RoutineDetailProps) {
  if (!routine) {
    return <p className={styles.message}>Select a routine to view details.</p>;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.subtitle}>{routine.name}</h2>
      <p className={styles.smallText}>{routine.description || "No description."}</p>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>Add exercise</h3>
        <AddExerciseToRoutineForm
          isSubmitting={isSubmitting}
          onSubmit={onAddExercise}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>Exercises</h3>

        <div className={styles.grid}>
          {(routine.exercises || []).map((planExercise) => (
            <div key={planExercise.id} className={styles.card}>
              <div className={styles.row}>
                <div>
                  <h4>{planExercise.exercise?.name || "Unknown exercise"}</h4>
                  <p className={styles.smallText}>
                    Order: {planExercise.exercise_order}
                  </p>
                  <p className={styles.smallText}>
                    {planExercise.notes || "No notes"}
                  </p>
                </div>

                <button
                  className={styles.deleteButton}
                  onClick={() => onDeleteExercise(planExercise.id)}
                >
                  Delete exercise
                </button>
              </div>

              <div className={styles.section}>
                <h4 className={styles.subtitle}>Add set</h4>
                <AddSetForm
                  isSubmitting={isSubmitting}
                  onSubmit={(payload) => onAddSet(planExercise.id, payload)}
                />
              </div>

              <div className={styles.section}>
                <h4 className={styles.subtitle}>Sets</h4>
                <div className={styles.grid}>
                  {(planExercise.sets || []).map((setItem) => (
                    <div key={setItem.id} className={styles.setCard}>
                      <div className={styles.row}>
                        <div>
                          <p className={styles.smallText}>Set #{setItem.set_order}</p>
                          <p className={styles.smallText}>
                            Reps: {setItem.target_reps ?? "-"}
                          </p>
                          <p className={styles.smallText}>
                            Weight: {setItem.target_weight_kg ?? "-"} kg
                          </p>
                        </div>

                        <button
                          className={styles.deleteButton}
                          onClick={() => onDeleteSet(planExercise.id, setItem.id)}
                        >
                          Delete set
                        </button>
                      </div>
                    </div>
                  ))}

                  {(planExercise.sets || []).length === 0 && (
                    <p className={styles.smallText}>No sets added yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(routine.exercises || []).length === 0 && (
            <p className={styles.message}>No exercises in this routine yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}