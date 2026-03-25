import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth";
import { useDailyNutritionLog } from "../features/nutrition_log";
import { UsersTable, SettingsForm} from "../features/user";
import { ExerciseList } from "../features/exercises";
import { RoutineList } from "../features/routines";
import { useWorkoutSession } from "../features/workout_session";
import { FoodList } from "../features/food";
import { DailyLogView, DateNavigator } from "../features/nutrition_log";
import styles from "./DashboardPage.module.css";

type DashboardSection = "dashboard" | "workouts" | "nutrition" | "profile";

type SectionWrapperProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

function SectionWrapper({ title, subtitle, children }: SectionWrapperProps) {
  return (
    <section className={styles.sectionWrapper}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<DashboardSection>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  });
  const {
    dailyLog,
    goal,
    remaining,
    isLoading: isNutritionLoading,
  } = useDailyNutritionLog(selectedDate);
  const {
    history,
    isLoading: isHistoryLoading,
    loadWorkoutHistory,
  } = useWorkoutSession();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSelectSection = (section: DashboardSection) => {
    setSelectedSection(section);
    setIsSidebarOpen(false);
  };

  const profileInitials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`
    .toUpperCase() || "U";

  useEffect(() => {
    void loadWorkoutHistory();
  }, [loadWorkoutHistory]);

  const nutritionStats = useMemo(() => {
    const caloriesCurrent = dailyLog?.total_calories ?? 0;
    const caloriesGoal = goal?.target_calories ?? 0;
    const proteinCurrent = dailyLog?.total_protein ?? 0;
    const proteinGoal = goal?.target_protein ?? 0;

    const toPercent = (current: number, target: number) => {
      if (!target || target <= 0) return 0;
      return Math.min(100, Math.max(0, (current / target) * 100));
    };

    return {
      caloriesCurrent,
      caloriesGoal,
      caloriesRemaining: remaining?.calories ?? Math.max(0, caloriesGoal - caloriesCurrent),
      caloriesProgress: toPercent(caloriesCurrent, caloriesGoal),
      proteinCurrent,
      proteinGoal,
      proteinRemaining: remaining?.protein ?? Math.max(0, proteinGoal - proteinCurrent),
      proteinProgress: toPercent(proteinCurrent, proteinGoal),
    };
  }, [dailyLog, goal, remaining]);

  const activeWorkout = history.find((session) => !session.finished_at) ?? null;
  const lastWorkout = history.find((session) => !!session.finished_at) ?? null;

  const renderAdminSection = () => {
    switch (selectedSection) {
      case "dashboard":
        return (
          <SectionWrapper
            title="Users"
            subtitle="Manage platform users and roles"
          >
            <UsersTable />
          </SectionWrapper>
        );
      case "workouts":
        return (
          <SectionWrapper
            title="Exercises"
            subtitle="Maintain the global exercise library"
          >
            <ExerciseList />
          </SectionWrapper>
        );
      case "nutrition":
        return (
          <SectionWrapper
            title="Foods"
            subtitle="Manage the shared nutrition database"
          >
            <FoodList />
          </SectionWrapper>
        );
      case "profile":
      default:
        return (
          <SectionWrapper title="Profile">
            <div className={styles.panelMessage}>
              Profile section is not available for admin.
            </div>
          </SectionWrapper>
        );
    }
  };

  const renderUserSection = () => {
    switch (selectedSection) {
      case "workouts":
        return (
          <SectionWrapper
            title="Routines"
            subtitle="Build and organize your training plans"
          >
            <RoutineList />
          </SectionWrapper>
        );
      case "nutrition":
        return (
          <SectionWrapper
            title="Daily Nutrition"
            subtitle="Log meals and track progress against your goals"
          >
            <DateNavigator date={selectedDate} onDateChange={setSelectedDate} />
            <DailyLogView date={selectedDate} />
          </SectionWrapper>
        );
      case "profile":
        return (
          <SectionWrapper
            title="Profile Settings"
            subtitle="Update your account and personal fitness details"
          >
            <SettingsForm />
          </SectionWrapper>
        );
      case "dashboard":
      default:
        return (
          <SectionWrapper
            title="Dashboard Overview"
            subtitle="Quick status and actions for today"
          >
            <div className={styles.dashboardGrid}>
              <div className={styles.statCard}>
                <p className={styles.cardLabel}>Calories</p>
                <p className={styles.cardValue}>
                  {Math.round(nutritionStats.caloriesCurrent)} / {Math.round(nutritionStats.caloriesGoal)}
                </p>
                <p className={styles.cardMeta}>
                  {Math.round(nutritionStats.caloriesRemaining)} remaining
                </p>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${nutritionStats.caloriesProgress}%` }}
                  />
                </div>
              </div>

              <div className={styles.statCard}>
                <p className={styles.cardLabel}>Protein</p>
                <p className={styles.cardValue}>
                  {Math.round(nutritionStats.proteinCurrent)}g / {Math.round(nutritionStats.proteinGoal)}g
                </p>
                <p className={styles.cardMeta}>
                  {Math.round(nutritionStats.proteinRemaining)}g remaining
                </p>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${nutritionStats.proteinProgress}%` }}
                  />
                </div>
              </div>

              <div className={styles.quickCard}>
                <p className={styles.cardLabel}>Quick Start</p>
                <div className={styles.quickActions}>
                  {activeWorkout && (
                    <button
                      className={styles.primaryAction}
                      type="button"
                      onClick={() => navigate(`/workout-session/${activeWorkout.id}`)}
                    >
                      Resume Workout
                    </button>
                  )}
                  <button
                    className={styles.primaryAction}
                    type="button"
                    onClick={() => handleSelectSection("workouts")}
                  >
                    Start Workout
                  </button>
                  <button
                    className={styles.secondaryAction}
                    type="button"
                    onClick={() => handleSelectSection("nutrition")}
                  >
                    Add Meal
                  </button>
                </div>
              </div>

              <div className={styles.lastWorkoutCard}>
                <div>
                  <p className={styles.cardLabel}>
                    {activeWorkout ? "Active Workout" : "Last Workout"}
                  </p>
                  {isHistoryLoading ? (
                    <p className={styles.cardMeta}>Loading...</p>
                  ) : activeWorkout ? (
                    <>
                      <p className={styles.cardValue}>{activeWorkout.name}</p>
                      <p className={styles.cardMeta}>
                        Started: {activeWorkout.started_at?.slice(0, 10) || "-"} • In progress
                      </p>
                    </>
                  ) : lastWorkout ? (
                    <>
                      <p className={styles.cardValue}>{lastWorkout.name}</p>
                      <p className={styles.cardMeta}>
                        {lastWorkout.started_at?.slice(0, 10) || "-"} • Reps: {lastWorkout.total_reps} • Volume: {Math.round(lastWorkout.total_volume)}
                      </p>
                    </>
                  ) : (
                    <p className={styles.cardMeta}>No workouts yet.</p>
                  )}
                </div>

                <button
                  className={styles.secondaryAction}
                  type="button"
                  disabled={!activeWorkout && !lastWorkout}
                  onClick={() => {
                    const targetSession = activeWorkout ?? lastWorkout;
                    if (!targetSession) return;
                    navigate(`/workout-session/${targetSession.id}`);
                  }}
                >
                  {activeWorkout ? "Resume" : "View details"}
                </button>
              </div>
            </div>

            {isNutritionLoading ? (
              <p className={styles.cardMeta}>Updating nutrition status...</p>
            ) : (
              <DateNavigator date={selectedDate} onDateChange={setSelectedDate} />
            )}
          </SectionWrapper>
        );
    }
  };

  return (
    <div className={styles.layout}>
      {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>Fitness OS</div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${selectedSection === "dashboard" ? styles.navButtonActive : ""}`}
            onClick={() => handleSelectSection("dashboard")}
            type="button"
          >
            Dashboard
          </button>
          <button
            className={`${styles.navButton} ${selectedSection === "workouts" ? styles.navButtonActive : ""}`}
            onClick={() => handleSelectSection("workouts")}
            type="button"
          >
            Workouts
          </button>
          <button
            className={`${styles.navButton} ${selectedSection === "nutrition" ? styles.navButtonActive : ""}`}
            onClick={() => handleSelectSection("nutrition")}
            type="button"
          >
            Nutrition
          </button>
          <button
            className={`${styles.navButton} ${selectedSection === "profile" ? styles.navButtonActive : ""}`}
            onClick={() => handleSelectSection("profile")}
            type="button"
          >
            Profile
          </button>
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
                <h1 className={styles.pageTitle}>Dashboard</h1>
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
                  onClick={() => handleSelectSection("profile")}
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
          <div className={styles.contentInner}>
            {user?.role === "admin" ? renderAdminSection() : renderUserSection()}
          </div>
        </main>
      </div>
    </div>
  );
}