import styles from "../workoutSessions.module.css";
import WorkoutSetRow from "./workoutSetRow";
import type { WorkoutSession } from "../types/workout_session_types";

interface ActiveWorkoutViewProps {
  session: WorkoutSession | null;
  isSubmitting: boolean;
  error: string | null;
  onSaveSet: (
    sessionId: number,
    setId: number,
    payload: {
      actual_reps?: number;
      actual_weight_kg?: number;
      is_completed?: boolean;
    }
  ) => Promise<void>;
  onFinishWorkout: (sessionId: number) => Promise<void>;
}

export default function ActiveWorkoutView({
  session,
  isSubmitting,
  error,
  onSaveSet,
  onFinishWorkout,
}: ActiveWorkoutViewProps) {
  if (!session) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Workout</h2>
        <p className={styles.message}>No workout loaded.</p>
      </div>
    );
  }

  const isFinished = !!session.finished_at;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div>
          <h1 className={styles.title}>{session.name}</h1>
          <p className={styles.smallText}>Started: {session.started_at ?? "-"}</p>
          <p className={styles.smallText}>Finished: {session.finished_at ?? "-"}</p>
          <p className={styles.smallText}>
            Duration: {session.duration_seconds ?? 0}s
          </p>
          <p className={styles.smallText}>
            Total reps: {session.total_reps} | Total volume: {session.total_volume}
          </p>
        </div>

        {!isFinished && (
          <button
            className={styles.successButton}
            onClick={() => onFinishWorkout(session.id)}
            disabled={isSubmitting}
            type="button"
          >
            Finish Workout
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.section}>
        <h2 className={styles.subtitle}>
          {isFinished ? "Workout Details" : "Exercises"}
        </h2>

        <div className={styles.grid}>
          {(session.exercises || []).map((exerciseItem) => (
            <div key={exerciseItem.id} className={styles.card}>
              <h3>{exerciseItem.exercise?.name || "Unknown exercise"}</h3>
              <p className={styles.smallText}>
                Order: {exerciseItem.exercise_order}
              </p>
              <p className={styles.smallText}>
                {exerciseItem.exercise?.muscle_group || "-"}
              </p>

              <div className={styles.section}>
                <div className={styles.grid}>
                  {(exerciseItem.sets || []).map((setItem) =>
                    isFinished ? (
                      <div key={setItem.id} className={styles.setCard}>
                        <p className={styles.smallText}>Set #{setItem.set_order}</p>
                        <p className={styles.smallText}>
                          Planned: {setItem.planned_reps ?? "-"} reps /{" "}
                          {setItem.planned_weight_kg ?? "-"} kg
                        </p>
                        <p className={styles.smallText}>
                          Actual: {setItem.actual_reps ?? "-"} reps /{" "}
                          {setItem.actual_weight_kg ?? "-"} kg
                        </p>
                        <p className={styles.smallText}>
                          Previous: {setItem.previous?.reps ?? "-"} reps /{" "}
                          {setItem.previous?.weight_kg ?? "-"} kg
                        </p>
                        <p className={styles.smallText}>Volume: {setItem.volume ?? 0}</p>
                        <p className={styles.smallText}>
                          Completed: {setItem.is_completed ? "Yes" : "No"}
                        </p>
                      </div>
                    ) : (
                      <WorkoutSetRow
                        key={setItem.id}
                        sessionId={session.id}
                        setItem={setItem}
                        isSubmitting={isSubmitting}
                        onSave={onSaveSet}
                      />
                    )
                  )}

                  {(exerciseItem.sets || []).length === 0 && (
                    <p className={styles.message}>No sets found.</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(session.exercises || []).length === 0 && (
            <p className={styles.message}>No exercises in this workout.</p>
          )}
        </div>
      </div>
    </div>
  );
}