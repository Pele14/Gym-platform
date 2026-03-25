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

const ACTIVE_WORKOUTS_CAP = 2;
const PAST_WORKOUTS_CAP = 4;

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
    error: historyError,
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

  const activeWorkoutsPreview = useMemo(
    () => history.filter((session) => !session.finished_at).slice(0, ACTIVE_WORKOUTS_CAP),
    [history]
  );

  const pastWorkoutsPreview = useMemo(
    () => history.filter((session) => !!session.finished_at).slice(0, PAST_WORKOUTS_CAP),
    [history]
  );

  const [expandedPastId, setExpandedPastId] = useState<number | null>(null);

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
            <div className={styles.dateNavigatorWrapper}>
              <DateNavigator date={selectedDate} onDateChange={setSelectedDate} />
            </div>

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

              <div className={styles.workoutsPreviewCard}>
                <div className={styles.workoutSection}>
                  <p className={styles.cardLabel}>Active Workouts</p>

                  {isHistoryLoading ? (
                    <p className={styles.cardMeta}>Loading workouts...</p>
                  ) : historyError ? (
                    <p className={styles.cardMeta}>{historyError}</p>
                  ) : activeWorkoutsPreview.length === 0 ? (
                    <p className={styles.cardMeta}>No active workouts.</p>
                  ) : (
                    <div className={styles.workoutList}>
                      {activeWorkoutsPreview.map((session) => (
                        <div key={session.id} className={styles.workoutItem}>
                          <div className={styles.workoutItemRow}>
                            <div className={styles.workoutItemInfo}>
                              <p className={styles.workoutItemName}>{session.name}</p>
                              <p className={styles.workoutItemMeta}>
                                Started: {session.started_at?.slice(0, 10) || "-"} • In progress
                              </p>
                            </div>

                            <button
                              className={styles.secondaryAction}
                              type="button"
                              onClick={() => navigate(`/workout-session/${session.id}`)}
                            >
                              Resume
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.workoutSection}>
                  <p className={styles.cardLabel}>Past Workouts</p>

                  {isHistoryLoading ? (
                    <p className={styles.cardMeta}>Loading workouts...</p>
                  ) : historyError ? (
                    <p className={styles.cardMeta}>{historyError}</p>
                  ) : pastWorkoutsPreview.length === 0 ? (
                    <p className={styles.cardMeta}>No past workouts yet.</p>
                  ) : (
                    <div className={styles.workoutList}>
                      {pastWorkoutsPreview.map((session) => {
                        const isOpen = expandedPastId === session.id;
                        return (
                          <div key={session.id} className={styles.workoutItem}>
                            <div className={styles.workoutItemRow}>
                              <div className={styles.workoutItemInfo}>
                                <p className={styles.workoutItemName}>{session.name}</p>
                                <p className={styles.workoutItemMeta}>
                                  {session.started_at?.slice(0, 10) || "-"} • Reps: {session.total_reps} • Volume: {Math.round(session.total_volume)}
                                </p>
                              </div>

                              <button
                                className={styles.secondaryAction}
                                type="button"
                                onClick={() => setExpandedPastId(isOpen ? null : session.id)}
                              >
                                {isOpen ? "Hide" : "Details"}
                              </button>
                            </div>

                            {isOpen && (
                              <div className={styles.workoutDropdown}>
                                {(session.exercises ?? []).length === 0 ? (
                                  <p className={styles.workoutDropdownEmpty}>No exercise breakdown available.</p>
                                ) : (
                                  <div className={styles.workoutExerciseList}>
                                    {(session.exercises ?? []).map((exerciseItem) => (
                                      <div key={exerciseItem.id} className={styles.workoutExerciseCard}>
                                        <div className={styles.workoutExerciseHeader}>
                                          <p className={styles.workoutExerciseName}>
                                            {exerciseItem.exercise?.name || "Exercise"}
                                          </p>
                                          <span className={styles.workoutExerciseBadge}>
                                            {(exerciseItem.sets ?? []).length} sets
                                          </span>
                                        </div>

                                        {(exerciseItem.sets ?? []).length === 0 ? (
                                          <p className={styles.workoutDropdownEmpty}>No sets logged.</p>
                                        ) : (
                                          <div className={styles.workoutSetsTable}>
                                            <div className={styles.workoutSetsHead}>
                                              <span>Set</span>
                                              <span>Planned</span>
                                              <span>Actual</span>
                                              <span>Status</span>
                                            </div>

                                            {(exerciseItem.sets ?? []).map((setItem) => (
                                              <div key={setItem.id} className={styles.workoutSetsRow}>
                                                <span>#{setItem.set_order}</span>
                                                <span>{setItem.planned_reps} × {setItem.planned_weight_kg}kg</span>
                                                <span>{setItem.actual_reps ?? "-"} × {setItem.actual_weight_kg ?? "-"}kg</span>
                                                <span className={setItem.is_completed ? styles.workoutSetDone : styles.workoutSetMissed}>
                                                  {setItem.is_completed ? "Done" : "Skipped"}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isNutritionLoading && (
              <p className={styles.cardMeta}>Updating nutrition status...</p>
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