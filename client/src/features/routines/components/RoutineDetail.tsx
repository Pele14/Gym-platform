import { useState } from "react";
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
  onUpdateExercise: (
    planExerciseId: number,
    payload: {
      exercise_id: number;
      exercise_order: number;
      notes?: string;
    }
  ) => Promise<void>;
  onDeleteExercise: (planExerciseId: number) => Promise<void>;
  onAddSet: (
    planExerciseId: number,
    payload: {
      set_order: number;
      target_reps?: number;
      target_weight_kg?: number;
    }
  ) => Promise<void>;
  onUpdateSet: (
    planExerciseId: number,
    setId: number,
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
  onUpdateExercise,
  onDeleteExercise,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
}: RoutineDetailProps) {
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);
  const [editingSetId, setEditingSetId] = useState<number | null>(null);

  const [exerciseEditData, setExerciseEditData] = useState({
    exercise_id: "",
    exercise_order: "",
    notes: "",
  });

  const [setEditData, setSetEditData] = useState({
    set_order: "",
    target_reps: "",
    target_weight_kg: "",
  });

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

                <div className={styles.row}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => {
                      setEditingExerciseId(planExercise.id);
                      setExerciseEditData({
                        exercise_id: String(planExercise.exercise_id),
                        exercise_order: String(planExercise.exercise_order),
                        notes: planExercise.notes || "",
                      });
                    }}
                  >
                    Edit exercise
                  </button>

                  <button
                    className={styles.deleteButton}
                    onClick={() => onDeleteExercise(planExercise.id)}
                  >
                    Delete exercise
                  </button>
                </div>
              </div>

              {editingExerciseId === planExercise.id && (
                <form
                  className={styles.form}
                  onSubmit={async (e) => {
                    e.preventDefault();

                    await onUpdateExercise(planExercise.id, {
                      exercise_id: Number(exerciseEditData.exercise_id),
                      exercise_order: Number(exerciseEditData.exercise_order),
                      notes: exerciseEditData.notes.trim() || undefined,
                    });

                    setEditingExerciseId(null);
                  }}
                >
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Exercise ID"
                    value={exerciseEditData.exercise_id}
                    onChange={(e) =>
                      setExerciseEditData((prev) => ({
                        ...prev,
                        exercise_id: e.target.value,
                      }))
                    }
                  />

                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Exercise order"
                    value={exerciseEditData.exercise_order}
                    onChange={(e) =>
                      setExerciseEditData((prev) => ({
                        ...prev,
                        exercise_order: e.target.value,
                      }))
                    }
                  />

                  <textarea
                    className={styles.textarea}
                    placeholder="Notes"
                    value={exerciseEditData.notes}
                    onChange={(e) =>
                      setExerciseEditData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />

                  <div className={styles.row}>
                    <button className={styles.button} type="submit" disabled={isSubmitting}>
                      Save exercise
                    </button>

                    <button
                      className={styles.deleteButton}
                      type="button"
                      onClick={() => setEditingExerciseId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

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

                        <div className={styles.row}>
                          <button
                            className={styles.secondaryButton}
                            onClick={() => {
                              setEditingSetId(setItem.id);
                              setSetEditData({
                                set_order: String(setItem.set_order),
                                target_reps: setItem.target_reps
                                  ? String(setItem.target_reps)
                                  : "",
                                target_weight_kg: setItem.target_weight_kg
                                  ? String(setItem.target_weight_kg)
                                  : "",
                              });
                            }}
                          >
                            Edit set
                          </button>

                          <button
                            className={styles.deleteButton}
                            onClick={() => onDeleteSet(planExercise.id, setItem.id)}
                          >
                            Delete set
                          </button>
                        </div>
                      </div>

                      {editingSetId === setItem.id && (
                        <form
                          className={styles.form}
                          onSubmit={async (e) => {
                            e.preventDefault();

                            await onUpdateSet(planExercise.id, setItem.id, {
                              set_order: Number(setEditData.set_order),
                              target_reps: setEditData.target_reps
                                ? Number(setEditData.target_reps)
                                : undefined,
                              target_weight_kg: setEditData.target_weight_kg
                                ? Number(setEditData.target_weight_kg)
                                : undefined,
                            });

                            setEditingSetId(null);
                          }}
                        >
                          <input
                            className={styles.input}
                            type="number"
                            placeholder="Set order"
                            value={setEditData.set_order}
                            onChange={(e) =>
                              setSetEditData((prev) => ({
                                ...prev,
                                set_order: e.target.value,
                              }))
                            }
                          />

                          <input
                            className={styles.input}
                            type="number"
                            placeholder="Target reps"
                            value={setEditData.target_reps}
                            onChange={(e) =>
                              setSetEditData((prev) => ({
                                ...prev,
                                target_reps: e.target.value,
                              }))
                            }
                          />

                          <input
                            className={styles.input}
                            type="number"
                            step="0.5"
                            placeholder="Target weight (kg)"
                            value={setEditData.target_weight_kg}
                            onChange={(e) =>
                              setSetEditData((prev) => ({
                                ...prev,
                                target_weight_kg: e.target.value,
                              }))
                            }
                          />

                          <div className={styles.row}>
                            <button className={styles.button} type="submit" disabled={isSubmitting}>
                              Save set
                            </button>

                            <button
                              className={styles.deleteButton}
                              type="button"
                              onClick={() => setEditingSetId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
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