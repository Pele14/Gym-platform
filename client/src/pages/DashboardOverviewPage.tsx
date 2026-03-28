import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDailyNutritionLog, DateNavigator } from "../features/nutrition_log";
import { useWorkoutSession } from "../features/workout_session";
import AppLayout from "../common/components/AppLayout";
import styles from "./pages.module.css";

const ACTIVE_WORKOUTS_CAP = 2;
const PAST_WORKOUTS_CAP = 4;

export default function DashboardOverviewPage() {
  const navigate = useNavigate();
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

  const [expandedPastId, setExpandedPastId] = useState<number | null>(null);

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

  const hasNutritionGoal = !!goal;

  return (
    <AppLayout pageTitle="Dashboard">
      <div className={styles.dateNavigatorWrapper}>
          <DateNavigator date={selectedDate} onDateChange={setSelectedDate} />
        </div>

        <div className={styles.dashboardGrid}>
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
                onClick={() => navigate("/workouts")}
              >
                Start Workout
              </button>
              <button
                className={styles.secondaryAction}
                type="button"
                disabled={!hasNutritionGoal}
                onClick={() => navigate("/nutrition")}
              >
                Add Meal
              </button>
              <button
                className={styles.secondaryAction}
                type="button"
                onClick={() => navigate("/gyms")}
              >
                Find Gyms
              </button>
              {!hasNutritionGoal && (
                <p className={styles.cardMeta}>Calculate nutrition goal first.</p>
              )}
            </div>
          </div>

          {hasNutritionGoal ? (
            <>
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
            </>
          ) : (
            <div className={styles.nutritionLockedCard}>
              <p className={styles.cardLabel}>Nutrition</p>
              <p className={styles.cardMeta}>
                Calculate your nutrition goal to unlock meal logging and macro tracking.
              </p>
            </div>
          )}

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
                            className={`${styles.secondaryAction} ${styles.detailsToggleButton}`}
                            type="button"
                            onClick={() => setExpandedPastId(isOpen ? null : session.id)}
                            aria-expanded={isOpen}
                          >
                            {isOpen ? "Hide" : "Details"}
                          </button>
                        </div>

                        <div
                          className={`${styles.workoutDropdown} ${isOpen ? styles.workoutDropdownOpen : styles.workoutDropdownClosed}`}
                          aria-hidden={!isOpen}
                        >
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
    </AppLayout>
  );
}
