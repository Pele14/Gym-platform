import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../routines.module.css";
import RoutineForm from "./RoutineForm";
import RoutineDetail from "./RoutineDetail";
import { useRoutines } from "../hooks/useRoutines";
import { useWorkoutSession } from "../../workout_session";

type RoutineView = "home" | "create" | "detail";

export default function RoutineList() {
  const navigate = useNavigate();
  const [view, setView] = useState<RoutineView>("home");

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
    updateRoutineExercise,
    deleteRoutineExercise,
    addSetToRoutineExercise,
    updateRoutineExerciseSet,
    deleteRoutineExerciseSet,
    setSelectedRoutine,
  } = useRoutines();

  const {
    startWorkout,
    isSubmitting: isStartingWorkout,
  } = useWorkoutSession();

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

      {view === "home" && (
        <>
          <div className={styles.launcherGrid}>
            <button
              className={styles.launcherCard}
              type="button"
              onClick={() => setView("create")}
            >
              <h3 className={styles.launcherTitle}>New Routine</h3>
              <p className={styles.launcherText}>
                Build a new training plan with your own exercises and sets.
              </p>
            </button>
          </div>

          <div className={styles.quickSummaryList}>
            {routines.map((routine) => (
              <div key={routine.id} className={styles.summaryCard}>
                <div className={styles.summaryInfo}>
                  <h4>{routine.name}</h4>
                  <p className={styles.smallText}>
                    {routine.description || "No description"}
                  </p>
                  <p className={styles.smallText}>
                    Exercises: {routine.exercises?.length ?? "Open to view"}
                  </p>
                </div>

                <button
                  className={styles.button}
                  onClick={async () => {
                    await selectRoutine(routine.id);
                    setView("detail");
                  }}
                  type="button"
                >
                  Open
                </button>
              </div>
            ))}

            {routines.length === 0 && (
              <p className={styles.message}>No routines yet.</p>
            )}
          </div>
        </>
      )}

      {view === "create" && (
        <div className={styles.sectionCard}>
          <div className={styles.detailHeader}>
            <div>
              <h3 className={styles.subtitle}>Create routine</h3>
              <p className={styles.detailMeta}>Set name and description first.</p>
            </div>

            <div className={styles.detailActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setView("home")}
              >
                Back
              </button>
            </div>
          </div>

          <RoutineForm
            isSubmitting={isSubmitting}
            onSubmit={async (payload) => {
              await createRoutine(payload);
              setView("home");
            }}
          />
        </div>
      )}

      {view === "detail" && (
        <div className={styles.sectionCard}>
          <div className={styles.detailHeader}>
            <div>
              <h3 className={styles.subtitle}>Routine detail</h3>
              {selectedRoutine && (
                <p className={styles.detailMeta}>{selectedRoutine.name}</p>
              )}
            </div>

            <div className={styles.detailActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => {
                  setSelectedRoutine(null);
                  setView("home");
                }}
              >
                Back
              </button>

              {selectedRoutine && (
                <>
                  <button
                    className={styles.button}
                    onClick={async () => {
                      const session = await startWorkout(selectedRoutine.id);
                      navigate(`/workout-session/${session.id}`);
                    }}
                    disabled={isStartingWorkout}
                    type="button"
                  >
                    {isStartingWorkout ? "Starting..." : "Start Workout"}
                  </button>

                  <button
                    className={styles.deleteButton}
                    onClick={async () => {
                      await deleteRoutine(selectedRoutine.id);
                        setView("home");
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                </>
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
            onUpdateExercise={async (planExerciseId, payload) => {
              if (!selectedRoutine) return;
              await updateRoutineExercise(selectedRoutine.id, planExerciseId, payload);
            }}
            onDeleteExercise={async (planExerciseId) => {
              if (!selectedRoutine) return;
              await deleteRoutineExercise(selectedRoutine.id, planExerciseId);
            }}
            onAddSet={async (planExerciseId, payload) => {
              if (!selectedRoutine) return;
              await addSetToRoutineExercise(selectedRoutine.id, planExerciseId, payload);
            }}
            onUpdateSet={async (planExerciseId, setId, payload) => {
              if (!selectedRoutine) return;
              await updateRoutineExerciseSet(
                selectedRoutine.id,
                planExerciseId,
                setId,
                payload
              );
            }}
            onDeleteSet={async (planExerciseId, setId) => {
              if (!selectedRoutine) return;
              await deleteRoutineExerciseSet(selectedRoutine.id, planExerciseId, setId);
            }}
          />
        </div>
      )}
    </div>
  );
}