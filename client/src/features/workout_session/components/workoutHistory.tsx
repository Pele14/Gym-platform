import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import styles from "../workoutSessions.module.css";

export default function WorkoutHistory() {
  const navigate = useNavigate();
  const { history, isLoading, error, loadWorkoutHistory } = useWorkoutSession();

  useEffect(() => {
    void loadWorkoutHistory();
  }, [loadWorkoutHistory]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Workout History</h2>

      {error && <p className={styles.error}>{error}</p>}

      {isLoading && <p className={styles.message}>Loading history...</p>}

      <div className={styles.grid}>
        {history.map((session) => (
          <div key={session.id} className={styles.card}>
            <div className={styles.row}>
              <div>
                <h3>{session.name}</h3>
                <p className={styles.smallText}>
                  Date: {session.started_at?.slice(0, 10) || "-"}
                </p>
                <p className={styles.smallText}>
                  Duration: {session.duration_seconds ?? 0}s
                </p>
                <p className={styles.smallText}>Reps: {session.total_reps}</p>
                <p className={styles.smallText}>Volume: {session.total_volume}</p>
              </div>

              <button
                className={styles.secondaryButton}
                onClick={() => navigate(`/workout-session/${session.id}`)}
                type="button"
              >
                View details
              </button>
            </div>
          </div>
        ))}

        {history.length === 0 && !isLoading && (
          <p className={styles.message}>No workouts yet.</p>
        )}
      </div>
    </div>
  );
}