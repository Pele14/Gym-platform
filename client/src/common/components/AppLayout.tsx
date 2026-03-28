import { type ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { useTheme } from "../../hooks/useTheme";
import styles from "./AppLayout.module.css";

export type AppSection = "dashboard" | "workouts" | "nutrition" | "profile";

type AppLayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

export default function AppLayout({
  children,
  pageTitle,
}: AppLayoutProps) {
  const { user, logout } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const profileInitials =
    `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (path: string) => {
    setIsSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className={styles.layout}>
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>Fitness OS</div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${location.pathname === "/dashboard" ? styles.navButtonActive : ""}`}
            onClick={() => handleNavClick("/dashboard")}
            type="button"
          >
            Dashboard
          </button>
          <button
            className={`${styles.navButton} ${location.pathname === "/workouts" ? styles.navButtonActive : ""}`}
            onClick={() => handleNavClick("/workouts")}
            type="button"
          >
            Workouts
          </button>
          <button
            className={`${styles.navButton} ${location.pathname === "/nutrition" ? styles.navButtonActive : ""}`}
            onClick={() => handleNavClick("/nutrition")}
            type="button"
          >
            Nutrition
          </button>
          <button
            className={`${styles.navButton} ${location.pathname === "/profile" ? styles.navButtonActive : ""}`}
            onClick={() => handleNavClick("/profile")}
            type="button"
          >
            Profile
          </button>
          {user?.role !== "admin" && (
            <button
              className={`${styles.navButton} ${location.pathname === "/gyms" ? styles.navButtonActive : ""}`}
              onClick={() => handleNavClick("/gyms")}
              type="button"
            >
              Gyms
            </button>
          )}
        </nav>
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.topbarInner}>
            <div className={styles.topbarLeft}>
              <button
                className={styles.mobileMenuButton}
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                type="button"
              >
                Menu
              </button>
              <div className={styles.titleGroup}>
                <h1 className={styles.pageTitle}>{pageTitle}</h1>
                <p className={styles.welcome}>
                  Welcome, {user?.first_name} {user?.last_name}
                </p>
              </div>
            </div>

            <div className={styles.topbarRight}>
              {user?.role === "admin" ? (
                <span className={styles.rolePill}>Role: {user?.role}</span>
              ) : (
                <button
                  className={styles.profileButton}
                  type="button"
                  onClick={() => handleNavClick("/profile")}
                >
                  <span className={styles.profileAvatar}>{profileInitials}</span>
                  <span className={styles.profileLabel}>Profile</span>
                </button>
              )}
              <button
                className={styles.themeToggleButton}
                onClick={toggleTheme}
                type="button"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <button className={styles.logoutButton} onClick={handleLogout} type="button">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <div className={styles.contentInner}>{children}</div>
        </main>
      </div>
    </div>
  );
}
