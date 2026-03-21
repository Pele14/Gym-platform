import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth";
import { UsersTable } from "../features/user";
import { ExerciseList } from "../features/exercises";
import { RoutineList } from "../features/routines";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                color: "#111827",
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                margin: "0.5rem 0 0 0",
                color: "#4b5563",
              }}
            >
              Welcome, {user?.first_name} {user?.last_name}
            </p>

            <p
              style={{
                margin: "0.25rem 0 0 0",
                color: "#6b7280",
              }}
            >
              Role: {user?.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "0.75rem 1rem",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>

        {user?.role === "admin" ? (
          <>
            <UsersTable />
            <ExerciseList />
          </>
        ) : (
          <RoutineList />
        )}
      </div>
    </div>
  );
}