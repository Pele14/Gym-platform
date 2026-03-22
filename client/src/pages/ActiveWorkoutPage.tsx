import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActiveWorkoutView, useWorkoutSession } from "../features/workout_session";

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
  } = useWorkoutSession();

  useEffect(() => {
    if (!sessionId) return;
    void loadWorkoutSession(Number(sessionId));
  }, [sessionId, loadWorkoutSession]);

  if (isLoading) {
    return <p style={{ padding: "2rem" }}>Loading workout...</p>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto 1rem auto" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "0.75rem 1rem",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>

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
      />
    </div>
  );
}