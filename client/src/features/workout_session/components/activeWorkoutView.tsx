import { useEffect, useMemo, useState } from "react";
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
  onDiscardWorkout: (sessionId: number) => Promise<void>;
  onLeaveWorkout: () => void;
}

export default function ActiveWorkoutView({
  session,
  isSubmitting,
  error,
  onSaveSet,
  onFinishWorkout,
  onDiscardWorkout,
  onLeaveWorkout,
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

  const timerStartFromClient =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem(`workout-session-client-start-${session.id}`)
      : null;

  const timerStartMs = timerStartFromClient
    ? Number(timerStartFromClient)
    : session.started_at
      ? new Date(session.started_at).getTime()
      : Date.now();

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    isFinished
      ? session.duration_seconds ?? 0
      : timerStartFromClient
        ? 0
        : Math.max(0, Math.floor((Date.now() - timerStartMs) / 1000))
  );

  useEffect(() => {
    if (isFinished) {
      setElapsedSeconds(session.duration_seconds ?? 0);
      return;
    }

    const tick = () => {
      const nowTs = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((nowTs - timerStartMs) / 1000)));
    };

    if (timerStartFromClient) {
      setElapsedSeconds(0);
    }

    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [
    isFinished,
    session.duration_seconds,
    timerStartFromClient,
    timerStartMs,
  ]);

  const formattedDuration = useMemo(() => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }, [elapsedSeconds]);

  const incompleteSets = useMemo(() => {
    return (session.exercises || []).reduce((count, exerciseItem) => {
      const pendingInExercise = (exerciseItem.sets || []).filter(
        (setItem) => !setItem.is_completed
      ).length;

      return count + pendingInExercise;
    }, 0);
  }, [session.exercises]);

  const finishConfirmationMessage =
    incompleteSets > 0
      ? `You still have ${incompleteSets} unfinished ${
          incompleteSets === 1 ? "set" : "sets"
        }. Finish anyway? Unchecked sets will not count toward your saved workout.`
      : "Finish this workout now? Duration will be saved.";

  return (
    <div className={styles.container}>
      <div className={styles.sessionHeader}>
        <div className={styles.sessionInfo}>
          <h1 className={styles.title}>{session.name}</h1>
          <p className={styles.timerText}>Timer: {formattedDuration}</p>
          <div className={styles.statPills}>
            <span className={styles.statPill}>Total reps: {session.total_reps}</span>
            <span className={styles.statPill}>Total volume: {Math.round(session.total_volume)}</span>
          </div>
        </div>

        <div className={styles.actionGroup}>
          <button
            className={styles.secondaryButton}
            onClick={onLeaveWorkout}
            type="button"
          >
            Leave Workout
          </button>

          {!isFinished && (
            <>
              <button
                className={styles.deleteButton}
                onClick={async () => {
                  const shouldDiscard = window.confirm(
                    "Discard this unfinished workout? This cannot be undone."
                  );

                  if (!shouldDiscard) return;
                  await onDiscardWorkout(session.id);
                }}
                disabled={isSubmitting}
                type="button"
              >
                Discard Workout
              </button>

              <button
                className={styles.successButton}
                onClick={async () => {
                  const shouldFinish = window.confirm(finishConfirmationMessage);

                  if (!shouldFinish) return;
                  await onFinishWorkout(session.id);
                }}
                disabled={isSubmitting}
                type="button"
              >
                Finish Workout
              </button>
            </>
          )}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.section}>
        <h2 className={styles.subtitle}>
          {isFinished ? "Workout Details" : "Exercises"}
        </h2>

        <div className={styles.grid}>
          {(session.exercises || []).map((exerciseItem) => (
            <div key={exerciseItem.id} className={styles.card}>
              <div className={styles.exerciseCardHeader}>
                <h3 className={styles.exerciseTitle}>{exerciseItem.exercise?.name || "Unknown exercise"}</h3>
                <div className={styles.exerciseBadges}>
                  <span className={styles.badgeMuted}>Order {exerciseItem.exercise_order}</span>
                  <span className={styles.badgeSuccess}>
                    {exerciseItem.exercise?.muscle_group || "-"}
                  </span>
                </div>
              </div>

              <div className={styles.section}>
                {isFinished ? (
                  <div className={styles.setsGrid}>
                    {(exerciseItem.sets || []).map((setItem) => (
                      <div key={setItem.id} className={styles.setCardFinished}>
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
                    ))}

                    {(exerciseItem.sets || []).length === 0 && (
                      <p className={styles.message}>No sets found.</p>
                    )}
                  </div>
                ) : (
                  <div className={styles.setsTable}>
                    <div className={styles.setsTableHeader}>
                      <span>Set</span>
                      <span>Actual Reps</span>
                      <span>Actual Weight (kg)</span>
                      <span>Done</span>
                    </div>

                    {(exerciseItem.sets || []).map((setItem) => (
                      <WorkoutSetRow
                        key={setItem.id}
                        sessionId={session.id}
                        setItem={setItem}
                        isSubmitting={isSubmitting}
                        onSave={onSaveSet}
                      />
                    ))}

                    {(exerciseItem.sets || []).length === 0 && (
                      <p className={styles.noSetsText}>No sets found.</p>
                    )}
                  </div>
                )}
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