import styles from "../routines.module.css";
import RoutineForm from "./RoutineForm";
import RoutineDetail from "./RoutineDetail";
import { useRoutines } from "../hooks/useRoutines";

export default function RoutineList() {
  const {
    routines,
    selectedRoutine,
    isLoading,
    isSubmitting,
    error,
    selectRoutine,
    createRoutine,
    deleteRoutine,
    addExerciseToRoutine,
    deleteRoutineExercise,
    addSetToRoutineExercise,
    deleteRoutineExerciseSet,
  } = useRoutines();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Routines</h2>
        <p className={styles.message}>Loading routines...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Routines</h2>

      {error && <p className={styles.error}>{error}</p>}

      <RoutineForm
        isSubmitting={isSubmitting}
        onSubmit={async (payload) => {
          await createRoutine(payload);
        }}
      />

      <div className={styles.section}>
        <h3 className={styles.subtitle}>My routines</h3>

        <div className={styles.grid}>
          {routines.map((routine) => (
            <div key={routine.id} className={styles.card}>
              <div className={styles.row}>
                <div>
                  <h4>{routine.name}</h4>
                  <p className={styles.smallText}>
                    {routine.description || "No description"}
                  </p>
                </div>

                <div className={styles.row}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => selectRoutine(routine.id)}
                  >
                    Open
                  </button>

                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteRoutine(routine.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {routines.length === 0 && (
            <p className={styles.message}>No routines yet.</p>
          )}
        </div>
      </div>

      <RoutineDetail
        routine={selectedRoutine}
        isSubmitting={isSubmitting}
        onAddExercise={async (payload) => {
          if (!selectedRoutine) return;
          await addExerciseToRoutine(selectedRoutine.id, payload);
        }}
        onDeleteExercise={async (planExerciseId) => {
          if (!selectedRoutine) return;
          await deleteRoutineExercise(selectedRoutine.id, planExerciseId);
        }}
        onAddSet={async (planExerciseId, payload) => {
          if (!selectedRoutine) return;
          await addSetToRoutineExercise(selectedRoutine.id, planExerciseId, payload);
        }}
        onDeleteSet={async (planExerciseId, setId) => {
          if (!selectedRoutine) return;
          await deleteRoutineExerciseSet(selectedRoutine.id, planExerciseId, setId);
        }}
      />
    </div>
  );
}