import { useAuth } from "../../auth";
import ExerciseForm from "./exerciseForm";
import { useExercises } from "../hooks/useExercises";
import styles from "../exercises.module.css";
import type { CreateExercisePayload } from "../types/exercise_types";

export default function ExerciseList() {
  const { user } = useAuth();
  const {
    exercises,
    isLoading,
    isSubmitting,
    error,
    createExercise,
    deleteExercise,
  } = useExercises();

  const isAdmin = user?.role === "admin";

  const handleCreate = async (
    payload: CreateExercisePayload,
    isSystem: boolean
  ) => {
    await createExercise(payload, isSystem);
  };

  const handleDelete = async (exerciseId: number, isSystem: boolean) => {
    await deleteExercise(exerciseId, isSystem);
  };

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
        <h2 className={styles.title}>Exercises</h2>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <ExerciseForm
        isAdmin={isAdmin}
        isSubmitting={isSubmitting}
        onSubmit={handleCreate}
      />

      {exercises.length === 0 ? (
        <p className={styles.empty}>No exercises found.</p>
      ) : (
        <div className={styles.grid}>
          {exercises.map((exercise) => {
            const canDelete =
              (exercise.is_system && isAdmin) ||
              (!exercise.is_system && exercise.created_by_user_id === user?.id);

            return (
              <div key={exercise.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.cardTitle}>{exercise.name}</h3>
                    <p className={styles.meta}>{exercise.muscle_group}</p>
                  </div>

                  <div className={styles.actions}>
                    {canDelete && (
                      <button
                        className={styles.deleteButton}
                        onClick={() =>
                          handleDelete(exercise.id, exercise.is_system)
                        }
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
    </div>
  );
}