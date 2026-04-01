import { useState } from "react";
import styles from "../routines.module.css";
import { useExercises } from "../../exercises";
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
      target_reps: number;
      target_weight_kg: number;
    }
  ) => Promise<void>;
  onUpdateSet: (
    planExerciseId: number,
    setId: number,
    payload: {
      set_order: number;
      target_reps: number;
      target_weight_kg: number;
    }
  ) => Promise<void>;
  onDeleteSet: (planExerciseId: number, setId: number) => Promise<void>;
}

interface ExerciseEditState {
  planExerciseId: number;
  exercise_id: string;
  exercise_order: string;
  notes: string;
}

interface SetEditState {
  planExerciseId: number;
  setId: number;
  set_order: string;
  target_reps: string;
  target_weight_kg: string;
}

interface AddSetState {
  planExerciseId: number;
  target_reps: string;
  target_weight_kg: string;
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
  const { exercises, isLoading: exercisesLoading } = useExercises();

  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [editExerciseModal, setEditExerciseModal] = useState<ExerciseEditState | null>(null);
  const [editSetModal, setEditSetModal] = useState<SetEditState | null>(null);
  const [addSetModal, setAddSetModal] = useState<AddSetState | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const [addExerciseId, setAddExerciseId] = useState("");
  const [addExerciseNotes, setAddExerciseNotes] = useState("");
  const [addExerciseSearchQuery, setAddExerciseSearchQuery] = useState("");
  const [editExerciseSearchQuery, setEditExerciseSearchQuery] = useState("");

  const moveExercise = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= exerciseList.length) {
      return;
    }

    const reordered = [...exerciseList];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    for (let i = 0; i < reordered.length; i += 1) {
      const item = reordered[i];
      await onUpdateExercise(item.id, {
        exercise_id: item.exercise_id,
        exercise_order: i + 1,
        notes: item.notes || undefined,
      });
    }
  };

  const moveSet = async (
    planExerciseId: number,
    sets: NonNullable<Routine["exercises"]>[number]["sets"],
    index: number,
    direction: -1 | 1
  ) => {
    const safeSets = sets || [];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= safeSets.length) {
      return;
    }

    const current = safeSets[index];
    const target = safeSets[targetIndex];

    await onUpdateSet(planExerciseId, current.id, {
      set_order: target.set_order,
      target_reps: current.target_reps,
      target_weight_kg: current.target_weight_kg,
    });

    await onUpdateSet(planExerciseId, target.id, {
      set_order: current.set_order,
      target_reps: target.target_reps,
      target_weight_kg: target.target_weight_kg,
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!routine) {
    return <p className={styles.message}>Select a routine to view details.</p>;
  }

  const exerciseList = routine.exercises || [];

  const addExerciseQuery = addExerciseSearchQuery.trim().toLowerCase();
  const editExerciseQuery = editExerciseSearchQuery.trim().toLowerCase();

  const filteredAddExercises = exercises.filter((exercise) => {
    if (!addExerciseQuery) {
      return true;
    }

    return [
      exercise.name,
      exercise.muscle_group,
      exercise.description ?? "",
      exercise.equipment ?? "",
      exercise.difficulty ?? "",
    ].some((value) => value.toLowerCase().includes(addExerciseQuery));
  });

  const filteredEditExercises = exercises.filter((exercise) => {
    if (!editExerciseQuery) {
      return true;
    }

    return [
      exercise.name,
      exercise.muscle_group,
      exercise.description ?? "",
      exercise.equipment ?? "",
      exercise.difficulty ?? "",
    ].some((value) => value.toLowerCase().includes(editExerciseQuery));
  });

  const selectedAddExercise = exercises.find((exercise) => String(exercise.id) === addExerciseId);
  const selectedEditExercise = editExerciseModal
    ? exercises.find((exercise) => String(exercise.id) === editExerciseModal.exercise_id)
    : null;

  const getNextSetOrder = (planExerciseId: number) => {
    const targetExercise = exerciseList.find((item) => item.id === planExerciseId);
    const sets = targetExercise?.sets || [];

    return sets.length > 0 ? Math.max(...sets.map((item) => item.set_order)) + 1 : 1;
  };

  const closeAddExerciseModal = () => {
    setShowAddExercise(false);
    setAddExerciseId("");
    setAddExerciseNotes("");
    setAddExerciseSearchQuery("");
  };

  const closeEditExerciseModal = () => {
    setEditExerciseModal(null);
    setEditExerciseSearchQuery("");
  };

  return (
    <div className={styles.detailBody}>
      {/* Routine info */}
      <div className={styles.routineInfoCard}>
        <h3 className={styles.routineInfoName}>{routine.name}</h3>
        {routine.description && (
          <p className={styles.routineInfoDesc}>{routine.description}</p>
        )}
      </div>

      {/* Exercise list */}
      <div className={styles.exerciseList}>
        {exerciseList.map((planExercise, exerciseIndex) => {
          const isExpanded = expandedIds.has(planExercise.id);
          const sets = planExercise.sets || [];

          return (
            <div key={planExercise.id} className={styles.exerciseCard}>
              {/* Header — always visible, click to collapse/expand */}
              <div
                className={styles.exerciseHeader}
                onClick={() => toggleExpand(planExercise.id)}
              >
                <div className={styles.exerciseHeaderLeft}>
                  <span className={styles.chevron}>{isExpanded ? "▾" : "▸"}</span>
                  <span className={styles.exerciseName}>
                    {planExercise.exercise?.name || "Unknown exercise"}
                  </span>
                  {planExercise.exercise?.muscle_group && (
                    <span className={styles.muscleBadge}>
                      {planExercise.exercise.muscle_group}
                    </span>
                  )}
                </div>

                <div
                  className={styles.exerciseHeaderActions}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className={styles.setCount}>
                    {sets.length} {sets.length === 1 ? "set" : "sets"}
                  </span>
                  <button
                    className={styles.iconButton}
                    type="button"
                    title="Move up"
                    disabled={exerciseIndex === 0 || isSubmitting}
                    onClick={() => moveExercise(exerciseIndex, -1)}
                  >
                    ↑
                  </button>
                  <button
                    className={styles.iconButton}
                    type="button"
                    title="Move down"
                    disabled={exerciseIndex === exerciseList.length - 1 || isSubmitting}
                    onClick={() => moveExercise(exerciseIndex, 1)}
                  >
                    ↓
                  </button>
                  <button
                    className={styles.iconButton}
                    type="button"
                    title="Edit exercise"
                    onClick={() =>
                      setEditExerciseModal({
                        planExerciseId: planExercise.id,
                        exercise_id: String(planExercise.exercise_id),
                        exercise_order: String(planExercise.exercise_order),
                        notes: planExercise.notes || "",
                      })
                    }
                  >
                    ✎
                  </button>
                  <button
                    className={styles.iconButtonDanger}
                    type="button"
                    title="Delete exercise"
                    onClick={() => onDeleteExercise(planExercise.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div className={styles.exerciseBody}>
                  {planExercise.notes && (
                    <p className={styles.exerciseNotes}>{planExercise.notes}</p>
                  )}

                  {sets.length > 0 && (
                    <div className={styles.setsTable}>
                      <div className={styles.setsTableHeader}>
                        <span>Set</span>
                        <span>Reps</span>
                        <span>Weight (kg)</span>
                        <span></span>
                      </div>
                      {sets.map((setItem, setIndex) => (
                        <div key={setItem.id} className={styles.setRow}>
                          <span>{setItem.set_order}</span>
                          <span>{setItem.target_reps ?? "—"}</span>
                          <span>{setItem.target_weight_kg ?? "—"}</span>
                          <div className={styles.setRowActions}>
                            <button
                              className={styles.iconButton}
                              type="button"
                              title="Move set up"
                              disabled={setIndex === 0 || isSubmitting}
                              onClick={() => moveSet(planExercise.id, sets, setIndex, -1)}
                            >
                              ↑
                            </button>
                            <button
                              className={styles.iconButton}
                              type="button"
                              title="Move set down"
                              disabled={setIndex === sets.length - 1 || isSubmitting}
                              onClick={() => moveSet(planExercise.id, sets, setIndex, 1)}
                            >
                              ↓
                            </button>
                            <button
                              className={styles.iconButton}
                              type="button"
                              title="Edit set"
                              onClick={() =>
                                setEditSetModal({
                                  planExerciseId: planExercise.id,
                                  setId: setItem.id,
                                  set_order: String(setItem.set_order),
                                  target_reps: setItem.target_reps
                                      != null
                                      ? String(setItem.target_reps)
                                      : "",
                                  target_weight_kg: setItem.target_weight_kg
                                      != null
                                      ? String(setItem.target_weight_kg)
                                      : "",
                                })
                              }
                            >
                              ✎
                            </button>
                            <button
                              className={styles.iconButtonDanger}
                              type="button"
                              title="Delete set"
                              onClick={() => onDeleteSet(planExercise.id, setItem.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {sets.length === 0 && (
                    <p className={styles.noSetsText}>No sets yet.</p>
                  )}

                  <button
                    className={styles.addRowButton}
                    type="button"
                    onClick={() =>
                      setAddSetModal({
                        planExerciseId: planExercise.id,
                        target_reps: "",
                        target_weight_kg: "",
                      })
                    }
                  >
                    + Add set
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {exerciseList.length === 0 && (
          <p className={styles.message}>No exercises yet. Add one below.</p>
        )}
      </div>

      {/* Add exercise */}
      <button
        className={styles.addExerciseButton}
        type="button"
        onClick={() => {
          setShowAddExercise(true);
          setAddExerciseSearchQuery("");
        }}
      >
        + Add Exercise
      </button>

      {showAddExercise && (
        <div className={styles.modalOverlay} onClick={closeAddExerciseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add Exercise</h3>
              <button
                className={styles.modalClose}
                type="button"
                onClick={closeAddExerciseModal}
              >
                ✕
              </button>
            </div>

            <form
              className={styles.form}
              onSubmit={async (e) => {
                e.preventDefault();

                const nextExerciseOrder =
                  exerciseList.length > 0
                    ? Math.max(...exerciseList.map((item) => item.exercise_order)) + 1
                    : 1;

                await onAddExercise({
                  exercise_id: Number(addExerciseId),
                  exercise_order: nextExerciseOrder,
                  notes: addExerciseNotes.trim() || undefined,
                });
                closeAddExerciseModal();
              }}
            >
              <label className={styles.modalLabel} htmlFor="add-exercise-search">Search exercise</label>
              <input
                id="add-exercise-search"
                className={styles.input}
                type="search"
                placeholder="Search exercise..."
                value={addExerciseSearchQuery}
                onChange={(e) => setAddExerciseSearchQuery(e.target.value)}
                disabled={isSubmitting || exercisesLoading}
              />

              <div className={styles.exercisePickerList}>
                {filteredAddExercises.length > 0 ? (
                  filteredAddExercises.map((exercise) => {
                    const isSelected = addExerciseId === String(exercise.id);

                    return (
                      <button
                        key={exercise.id}
                        className={`${styles.exercisePickerOption} ${
                          isSelected ? styles.exercisePickerOptionSelected : ""
                        }`}
                        type="button"
                        onClick={() => setAddExerciseId(String(exercise.id))}
                        disabled={isSubmitting || exercisesLoading}
                      >
                        <div className={styles.exercisePickerInfo}>
                          <span className={styles.exercisePickerName}>{exercise.name}</span>
                          <span className={styles.exercisePickerMeta}>
                            {exercise.muscle_group}
                            {exercise.equipment ? ` • ${exercise.equipment}` : ""}
                            {exercise.difficulty ? ` • ${exercise.difficulty}` : ""}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p className={styles.exercisePickerEmpty}>
                    {addExerciseSearchQuery.trim()
                      ? "No exercises match your search."
                      : "Exercises will appear here."}
                  </p>
                )}
              </div>

              {selectedAddExercise && (
                <div className={styles.exercisePickerSelectedCard}>
                  <span className={styles.exercisePickerSelectedLabel}>Selected</span>
                  <strong className={styles.exercisePickerSelectedName}>
                    {selectedAddExercise.name}
                  </strong>
                  <span className={styles.exercisePickerSelectedMeta}>
                    {selectedAddExercise.muscle_group}
                    {selectedAddExercise.equipment ? ` • ${selectedAddExercise.equipment}` : ""}
                    {selectedAddExercise.difficulty ? ` • ${selectedAddExercise.difficulty}` : ""}
                  </span>
                </div>
              )}

              <label className={styles.modalLabel}>Notes</label>
              <textarea
                className={styles.textarea}
                placeholder="Optional"
                value={addExerciseNotes}
                onChange={(e) => setAddExerciseNotes(e.target.value)}
                disabled={isSubmitting}
              />

              <div className={styles.modalActions}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={closeAddExerciseModal}
                >
                  Cancel
                </button>
                <button
                  className={styles.button}
                  type="submit"
                  disabled={isSubmitting || !addExerciseId}
                >
                  {isSubmitting ? "Adding..." : "Add Exercise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Exercise Modal */}
      {editExerciseModal && (
        <div
          className={styles.modalOverlay}
          onClick={closeEditExerciseModal}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Exercise</h3>
              <button
                className={styles.modalClose}
                type="button"
                onClick={closeEditExerciseModal}
              >
                ✕
              </button>
            </div>
            <form
              className={styles.form}
              onSubmit={async (e) => {
                e.preventDefault();
                await onUpdateExercise(editExerciseModal.planExerciseId, {
                  exercise_id: Number(editExerciseModal.exercise_id),
                  exercise_order: Number(editExerciseModal.exercise_order),
                  notes: editExerciseModal.notes.trim() || undefined,
                });
                closeEditExerciseModal();
              }}
            >
              <label className={styles.modalLabel} htmlFor="edit-exercise-search">Search exercise</label>
              <input
                id="edit-exercise-search"
                className={styles.input}
                type="search"
                placeholder="Search exercise..."
                value={editExerciseSearchQuery}
                onChange={(e) => setEditExerciseSearchQuery(e.target.value)}
                disabled={isSubmitting || exercisesLoading}
              />

              <div className={styles.exercisePickerList}>
                {filteredEditExercises.length > 0 ? (
                  filteredEditExercises.map((exercise) => {
                    const isSelected = editExerciseModal.exercise_id === String(exercise.id);

                    return (
                      <button
                        key={exercise.id}
                        className={`${styles.exercisePickerOption} ${
                          isSelected ? styles.exercisePickerOptionSelected : ""
                        }`}
                        type="button"
                        onClick={() =>
                          setEditExerciseModal((prev) =>
                            prev ? { ...prev, exercise_id: String(exercise.id) } : prev
                          )
                        }
                        disabled={isSubmitting || exercisesLoading}
                      >
                        <div className={styles.exercisePickerInfo}>
                          <span className={styles.exercisePickerName}>{exercise.name}</span>
                          <span className={styles.exercisePickerMeta}>
                            {exercise.muscle_group}
                            {exercise.equipment ? ` • ${exercise.equipment}` : ""}
                            {exercise.difficulty ? ` • ${exercise.difficulty}` : ""}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p className={styles.exercisePickerEmpty}>
                    {editExerciseSearchQuery.trim()
                      ? "No exercises match your search."
                      : "Exercises will appear here."}
                  </p>
                )}
              </div>

              {selectedEditExercise && (
                <div className={styles.exercisePickerSelectedCard}>
                  <span className={styles.exercisePickerSelectedLabel}>Selected</span>
                  <strong className={styles.exercisePickerSelectedName}>
                    {selectedEditExercise.name}
                  </strong>
                  <span className={styles.exercisePickerSelectedMeta}>
                    {selectedEditExercise.muscle_group}
                    {selectedEditExercise.equipment ? ` • ${selectedEditExercise.equipment}` : ""}
                    {selectedEditExercise.difficulty ? ` • ${selectedEditExercise.difficulty}` : ""}
                  </span>
                </div>
              )}

              <label className={styles.modalLabel}>Order</label>
              <input
                className={styles.input}
                type="number"
                value={editExerciseModal.exercise_order}
                onChange={(e) =>
                  setEditExerciseModal((prev) =>
                    prev ? { ...prev, exercise_order: e.target.value } : prev
                  )
                }
                required
              />

              <label className={styles.modalLabel}>Notes</label>
              <textarea
                className={styles.textarea}
                placeholder="Optional"
                value={editExerciseModal.notes}
                onChange={(e) =>
                  setEditExerciseModal((prev) =>
                    prev ? { ...prev, notes: e.target.value } : prev
                  )
                }
              />

              <div className={styles.modalActions}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={closeEditExerciseModal}
                >
                  Cancel
                </button>
                <button
                  className={styles.button}
                  type="submit"
                  disabled={isSubmitting || !editExerciseModal.exercise_id}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Set Modal */}
      {editSetModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setEditSetModal(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Set</h3>
              <button
                className={styles.modalClose}
                type="button"
                onClick={() => setEditSetModal(null)}
              >
                ✕
              </button>
            </div>
            <form
              className={styles.form}
              onSubmit={async (e) => {
                e.preventDefault();
                await onUpdateSet(editSetModal.planExerciseId, editSetModal.setId, {
                  set_order: Number(editSetModal.set_order),
                  target_reps: Number(editSetModal.target_reps),
                  target_weight_kg: Number(editSetModal.target_weight_kg),
                });
                setEditSetModal(null);
              }}
            >
              <label className={styles.modalLabel}>Set Order</label>
              <input
                className={styles.input}
                type="number"
                value={editSetModal.set_order}
                onChange={(e) =>
                  setEditSetModal((prev) =>
                    prev ? { ...prev, set_order: e.target.value } : prev
                  )
                }
                required
              />

              <label className={styles.modalLabel}>Target Reps</label>
              <input
                className={styles.input}
                type="number"
                value={editSetModal.target_reps}
                onChange={(e) =>
                  setEditSetModal((prev) =>
                    prev ? { ...prev, target_reps: e.target.value } : prev
                  )
                }
                required
              />

              <label className={styles.modalLabel}>Weight (kg)</label>
              <input
                className={styles.input}
                type="number"
                step="0.5"
                value={editSetModal.target_weight_kg}
                onChange={(e) =>
                  setEditSetModal((prev) =>
                    prev ? { ...prev, target_weight_kg: e.target.value } : prev
                  )
                }
                required
              />

              <div className={styles.modalActions}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => setEditSetModal(null)}
                >
                  Cancel
                </button>
                <button
                  className={styles.button}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Set Modal */}
      {addSetModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setAddSetModal(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add Set</h3>
              <button
                className={styles.modalClose}
                type="button"
                onClick={() => setAddSetModal(null)}
              >
                ✕
              </button>
            </div>

            <form
              className={styles.form}
              onSubmit={async (e) => {
                e.preventDefault();

                const nextSetOrder = getNextSetOrder(addSetModal.planExerciseId);

                await onAddSet(addSetModal.planExerciseId, {
                  set_order: nextSetOrder,
                  target_reps: Number(addSetModal.target_reps),
                  target_weight_kg: Number(addSetModal.target_weight_kg),
                });
                setAddSetModal(null);
              }}
            >
              <label className={styles.modalLabel}>Target Reps</label>
              <input
                className={styles.input}
                type="number"
                value={addSetModal.target_reps}
                onChange={(e) =>
                  setAddSetModal((prev) =>
                    prev ? { ...prev, target_reps: e.target.value } : prev
                  )
                }
                required
              />

              <label className={styles.modalLabel}>Weight (kg)</label>
              <input
                className={styles.input}
                type="number"
                step="0.5"
                value={addSetModal.target_weight_kg}
                onChange={(e) =>
                  setAddSetModal((prev) =>
                    prev ? { ...prev, target_weight_kg: e.target.value } : prev
                  )
                }
                required
              />

              <div className={styles.modalActions}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => setAddSetModal(null)}
                >
                  Cancel
                </button>
                <button
                  className={styles.button}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Set"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
