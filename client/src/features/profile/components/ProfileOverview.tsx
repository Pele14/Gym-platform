import styles from "../../../pages/pages.module.css";
import { useProfileOverview } from "../hooks/useProfileOverview";
import ProfileSettingsPanel from "./ProfileSettingsPanel";
import WorkoutCalendarCard from "./WorkoutCalendarCard";
import WorkoutStatsCard from "./WorkoutStatsCard";

export default function ProfileOverview() {
  const {
    isSettingsOpen,
    toggleSettings,
    selectedWorkoutMetric,
    setSelectedWorkoutMetric,
    workoutBarChartData,
    selectedMetricSummary,
    metricSubtitle,
    isHistoryLoading,
    historyError,
    formatMetricValue,
    calendarMonthLabel,
    calendarDays,
    isCurrentCalendarMonth,
    showPreviousCalendarMonth,
    showNextCalendarMonth,
  } = useProfileOverview();

  return (
    <div className={styles.profileSectionStack}>
      <ProfileSettingsPanel isOpen={isSettingsOpen} onToggle={toggleSettings} />

      <div className={styles.statsRow}>
        <WorkoutStatsCard
          selectedWorkoutMetric={selectedWorkoutMetric}
          onSelectMetric={setSelectedWorkoutMetric}
          metricSubtitle={metricSubtitle}
          selectedMetricSummary={selectedMetricSummary}
          workoutBarChartData={workoutBarChartData}
          isHistoryLoading={isHistoryLoading}
          historyError={historyError}
          formatMetricValue={formatMetricValue}
        />

        <WorkoutCalendarCard
          calendarMonthLabel={calendarMonthLabel}
          calendarDays={calendarDays}
          isHistoryLoading={isHistoryLoading}
          historyError={historyError}
          isCurrentCalendarMonth={isCurrentCalendarMonth}
          onPreviousMonth={showPreviousCalendarMonth}
          onNextMonth={showNextCalendarMonth}
        />
      </div>
    </div>
  );
}
