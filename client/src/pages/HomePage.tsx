import { Link } from "react-router-dom";
import { useAuth } from "../features/auth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          marginBottom: "3rem",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          Welcome to Your App
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            marginBottom: "2rem",
            opacity: 0.9,
            lineHeight: "1.6",
          }}
        >
          Discover amazing features and connect with our community.
          Sign in to access your account or create a new one to get started.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {user ? (
          <Link
            to="/dashboard"
            style={{
              padding: "0.75rem 2rem",
              background: "white",
              color: "#667eea",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                padding: "0.75rem 2rem",
                background: "white",
                color: "#667eea",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              Sign In
            </Link>

            <Link
              to="/register"
              style={{
                padding: "0.75rem 2rem",
                background: "transparent",
                color: "white",
                textDecoration: "none",
                border: "2px solid white",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              Create Account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}