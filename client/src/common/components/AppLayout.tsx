import { type ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth";
import styles from "./AppLayout.module.css";

export type AppSection = "dashboard" | "workouts" | "nutrition" | "profile";

type AppLayoutProps = {
  children: ReactNode;
  pageTitle: string;
  activeSection?: AppSection;
  onSectionChange?: (section: AppSection) => void;
};

export default function AppLayout({
  children,
  pageTitle,
  activeSection,
  onSectionChange,
}: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isOnDashboard = location.pathname === "/dashboard";
  const isOnGyms = location.pathname === "/gyms";

  const profileInitials =
    `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSectionClick = (section: AppSection) => {
    setIsSidebarOpen(false);
    if (!isOnDashboard) {
      navigate(`/dashboard?section=${section}`);
      return;
    }
    onSectionChange?.(section);
  };

  const handleProfileClick = () => {
    if (!isOnDashboard) {
      navigate("/dashboard?section=profile");
      return;
    }
    onSectionChange?.("profile");
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
            className={`${styles.navButton} ${isOnDashboard && activeSection === "dashboard" ? styles.navButtonActive : ""}`}
            onClick={() => handleSectionClick("dashboard")}
            type="button"
          >
            Dashboard
          </button>
          <button
            className={`${styles.navButton} ${isOnDashboard && activeSection === "workouts" ? styles.navButtonActive : ""}`}
            onClick={() => handleSectionClick("workouts")}
            type="button"
          >
            Workouts
          </button>
          <button
            className={`${styles.navButton} ${isOnDashboard && activeSection === "nutrition" ? styles.navButtonActive : ""}`}
            onClick={() => handleSectionClick("nutrition")}
            type="button"
          >
            Nutrition
          </button>
          <button
            className={`${styles.navButton} ${isOnDashboard && activeSection === "profile" ? styles.navButtonActive : ""}`}
            onClick={() => handleSectionClick("profile")}
            type="button"
          >
            Profile
          </button>
          {user?.role !== "admin" && (
            <button
              className={`${styles.navButton} ${isOnGyms ? styles.navButtonActive : ""}`}
              onClick={() => {
                setIsSidebarOpen(false);
                navigate("/gyms");
              }}
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
                  onClick={handleProfileClick}
                >
                  <span className={styles.profileAvatar}>{profileInitials}</span>
                  <span className={styles.profileLabel}>Profile</span>
                </button>
              )}
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
