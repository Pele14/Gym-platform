import { useState } from "react";
import { useAuth } from "../../auth";
import ExerciseForm from "./exerciseForm";
import { useExercises } from "../hooks/useExercises";
import styles from "../exercises.module.css";
import type { CreateExercisePayload, Exercise } from "../types/exercise_types";

type ExerciseAdminView = "add" | "list";

export default function ExerciseList() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<ExerciseAdminView>("add");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    exercises,
    isLoading,
    isSubmitting,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useExercises();
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const isAdmin = user?.role === "admin";
  const systemExercisesCount = exercises.filter((exercise) => exercise.is_system).length;
  const customExercisesCount = exercises.length - systemExercisesCount;

  const handleCreate = async (
    payload: CreateExercisePayload,
    isSystem: boolean
  ) => {
    await createExercise(payload, isSystem);
  };

  const handleDelete = async (exerciseId: number, isSystem: boolean) => {
    await deleteExercise(exerciseId, isSystem);
  };

  const handleUpdate = async (
    payload: CreateExercisePayload,
    isSystem: boolean
  ) => {
    if (!editingExercise) {
      return;
    }

    await updateExercise(editingExercise.id, payload, isSystem);
    setEditingExercise(null);
  };

  const filteredExercises = exercises.filter((exercise) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [
      exercise.name,
      exercise.muscle_group,
      exercise.description ?? "",
      exercise.equipment ?? "",
      exercise.difficulty ?? "",
      exercise.is_system ? "system" : "custom",
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.message}>Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Exercise Library</h2>
          <p className={styles.subtitle}>
            Create and manage system or custom exercises for training plans.
          </p>
        </div>

        <div className={styles.viewToggle} role="tablist" aria-label="Exercise management views">
          <button
            className={`${styles.viewToggleButton} ${
              activeView === "add" ? styles.viewToggleButtonActive : ""
            }`}
            type="button"
            onClick={() => setActiveView("add")}
            role="tab"
            aria-selected={activeView === "add"}
          >
            Add Exercise
          </button>
          <button
            className={`${styles.viewToggleButton} ${
              activeView === "list" ? styles.viewToggleButtonActive : ""
            }`}
            type="button"
            onClick={() => setActiveView("list")}
            role="tab"
            aria-selected={activeView === "list"}
          >
            Exercise List
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {activeView === "add" ? (
        <section className={styles.formSectionCard}>
          <header className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Create Exercise</h3>
          </header>

          <ExerciseForm
            isAdmin={isAdmin}
            isSubmitting={isSubmitting}
            onSubmit={handleCreate}
          />
        </section>
      ) : (
        <section className={styles.listSection}>
          <header className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Existing Exercises</h3>
              <p className={styles.sectionSubtitle}>
                Showing {filteredExercises.length} of {exercises.length} · {systemExercisesCount} system · {customExercisesCount} custom
              </p>
            </div>

            <div className={styles.searchGroup}>
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search exercises"
              />
            </div>
          </header>

          {exercises.length === 0 ? (
            <p className={styles.empty}>No exercises found.</p>
          ) : filteredExercises.length === 0 ? (
            <p className={styles.empty}>No exercises match your search.</p>
          ) : (
            <div className={styles.grid}>
              {filteredExercises.map((exercise) => {
                const canDelete =
                  (exercise.is_system && isAdmin) ||
                  (!exercise.is_system && exercise.created_by_user_id === user?.id);

                const canEdit =
                  exercise.is_system
                    ? isAdmin
                    : exercise.created_by_user_id === user?.id;

                return (
                  <div
                    key={exercise.id}
                    className={`${styles.card} ${canEdit ? styles.cardClickable : ""}`}
                    onClick={() => {
                      if (canEdit) {
                        setEditingExercise(exercise);
                      }
                    }}
                    role={canEdit ? "button" : undefined}
                    tabIndex={canEdit ? 0 : -1}
                    onKeyDown={(event) => {
                      if (!canEdit) {
                        return;
                      }

                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setEditingExercise(exercise);
                      }
                    }}
                    aria-label={canEdit ? `Edit ${exercise.name}` : undefined}
                  >
                    <div className={styles.cardTop}>
                      <div>
                        <h3 className={styles.cardTitle}>{exercise.name}</h3>
                        <p className={styles.meta}>{exercise.muscle_group}</p>
                      </div>

                      <div className={styles.actions}>
                        {canDelete && (
                          <button
                            className={styles.deleteButton}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleDelete(exercise.id, exercise.is_system);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {exercise.description && (
                      <p className={styles.description}>{exercise.description}</p>
                    )}

                    <div className={styles.badges}>
                      <span
                        className={`${styles.badge} ${
                          exercise.is_system ? styles.system : styles.custom
                        }`}
                      >
                        {exercise.is_system ? "System" : "Custom"}
                      </span>

                      {exercise.equipment && (
                        <span className={styles.badge}>{exercise.equipment}</span>
                      )}

                      {exercise.difficulty && (
                        <span className={styles.badge}>{exercise.difficulty}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {editingExercise && (
        <div
          className={styles.editOverlay}
          onClick={() => setEditingExercise(null)}
          role="presentation"
        >
          <section
            className={styles.editModal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${editingExercise.name}`}
          >
            <header className={styles.editModalHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Edit Exercise</h3>
                <p className={styles.sectionSubtitle}>{editingExercise.name}</p>
              </div>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setEditingExercise(null)}
              >
                Close
              </button>
            </header>

            <ExerciseForm
              isAdmin={isAdmin}
              isSubmitting={isSubmitting}
              onSubmit={handleUpdate}
              initialData={editingExercise}
              mode="edit"
              onCancel={() => setEditingExercise(null)}
            />
          </section>
        </div>
      )}
    </div>
  );
}