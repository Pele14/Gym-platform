import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActiveWorkoutView, useWorkoutSession } from "../features/workout_session";
import styles from "../features/workout_session/workoutSessions.module.css";

export default function ActiveWorkoutPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const {
    activeSession,
    isLoading,
    isSubmitting,
    error,
    loadWorkoutSession,
    updateWorkoutSet,
    finishWorkout,
    discardWorkout,
  } = useWorkoutSession();

  useEffect(() => {
    if (!sessionId) return;
    void loadWorkoutSession(Number(sessionId));
  }, [sessionId, loadWorkoutSession]);

  if (isLoading) {
    return <p style={{ padding: "2rem" }}>Loading workout...</p>;
  }

  return (
    <div className={styles.pageLayout}>
      <aside className={styles.pageSidebar}>
        <div className={styles.brand}>FitTrack</div>
        <div className={styles.sidebarNav}>
          <button
            className={styles.navButton}
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`${styles.navButton} ${styles.navButtonActive}`}
            type="button"
          >
            Active Workout
          </button>
        </div>
        <p className={styles.sidebarHint}>Session remains active until you finish or discard.</p>
      </aside>

      <main className={styles.pageMain}>
        <div className={styles.pageTopbar}>
          <div className={styles.pageTopbarInner}>
            <h1 className={styles.pageTitle}>Workout Log</h1>
          </div>
        </div>

        <div className={styles.pageContent}>
          <div className={styles.pageContentInner}>
          <ActiveWorkoutView
            session={activeSession}
            isSubmitting={isSubmitting}
            error={error}
            onSaveSet={async (sessionId, setId, payload) => {
              await updateWorkoutSet(sessionId, setId, payload);
            }}
            onFinishWorkout={async (id) => {
              await finishWorkout(id);
            }}
            onDiscardWorkout={async (id) => {
              await discardWorkout(id);
              navigate("/dashboard");
            }}
            onLeaveWorkout={() => navigate("/dashboard")}
          />
          </div>
        </div>
      </main>
    </div>
  );
}