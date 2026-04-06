import styles from "../../../pages/pages.module.css";
import type {
  MetricSummary,
  WorkoutBarChartPoint,
  WorkoutMetric,
} from "../types/profile_types";

type WorkoutStatsCardProps = {
  selectedWorkoutMetric: WorkoutMetric;
  onSelectMetric: (metric: WorkoutMetric) => void;
  metricSubtitle: string;
  selectedMetricSummary: MetricSummary;
  workoutBarChartData: WorkoutBarChartPoint[];
  isHistoryLoading: boolean;
  historyError: string | null;
  formatMetricValue: (value: number) => string;
};

export default function WorkoutStatsCard({
  selectedWorkoutMetric,
  onSelectMetric,
  metricSubtitle,
  selectedMetricSummary,
  workoutBarChartData,
  isHistoryLoading,
  historyError,
  formatMetricValue,
}: WorkoutStatsCardProps) {
  return (
    <article className={styles.profileStatsCard}>
      <div className={styles.statsCardHeader}>
        <div className={styles.statsCardTitleSection}>
          <h3 className={styles.statsCardTitle}>Workout Statistics</h3>
          <p className={styles.statsCardSubtitle}>{metricSubtitle}</p>
        </div>

        <div className={styles.metricToggleGroup}>
          <button
            className={`${styles.metricToggleButton} ${
              selectedWorkoutMetric === "reps"
                ? styles.metricToggleButtonActive
                : ""
            }`}
            type="button"
            onClick={() => onSelectMetric("reps")}
          >
            Reps
          </button>
          <button
            className={`${styles.metricToggleButton} ${
              selectedWorkoutMetric === "duration"
                ? styles.metricToggleButtonActive
                : ""
            }`}
            type="button"
            onClick={() => onSelectMetric("duration")}
          >
            Duration
          </button>
          <button
            className={`${styles.metricToggleButton} ${
              selectedWorkoutMetric === "volume"
                ? styles.metricToggleButtonActive
                : ""
            }`}
            type="button"
            onClick={() => onSelectMetric("volume")}
          >
            Volume
          </button>
        </div>
      </div>

      <div className={styles.statsMainHighlight}>
        <span className={styles.highlightLabel}>This week</span>
        <div className={styles.highlightValueRow}>
          <strong className={styles.highlightNumber}>
            {formatMetricValue(selectedMetricSummary.thisWeek)}
          </strong>
          <span className={styles.highlightUnit}>
            {selectedMetricSummary.unit}
          </span>
        </div>
      </div>

      <div className={styles.barChartShell}>
        {isHistoryLoading ? (
          <p className={styles.cardMeta}>Loading workout statistics...</p>
        ) : historyError ? (
          <p className={styles.cardMeta}>{historyError}</p>
        ) : (
          <div className={styles.barChartPlot}>
            {workoutBarChartData.map((point) => (
              <div key={point.weekLabel} className={styles.barChartColumn}>
                <span className={styles.barChartValue}>
                  {formatMetricValue(point.value)}
                </span>
                <div className={styles.barChartTrack}>
                  <div
                    className={`${styles.barChartBar} ${
                      point.isLatest ? styles.barChartBarLatest : ""
                    }`}
                    style={{ height: `${point.barHeight}px` }}
                    aria-label={`${point.weekLabel}: ${formatMetricValue(
                      point.value
                    )} ${selectedMetricSummary.unit}`}
                    role="img"
                  />
                </div>
                <span className={styles.barChartLabel}>{point.weekLabel}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.statsSummaryGrid}>
        <div className={styles.statsSummaryItem}>
          <span className={styles.summaryItemLabel}>This week</span>
          <span className={styles.summaryItemValue}>
            {formatMetricValue(selectedMetricSummary.thisWeek)}
            <span className={styles.summaryItemUnit}>
              {selectedMetricSummary.unit}
            </span>
          </span>
        </div>
        <div className={styles.statsSummaryItem}>
          <span className={styles.summaryItemLabel}>8-week total</span>
          <span className={styles.summaryItemValue}>
            {formatMetricValue(selectedMetricSummary.total)}
            <span className={styles.summaryItemUnit}>
              {selectedMetricSummary.unit}
            </span>
          </span>
        </div>
        <div className={styles.statsSummaryItem}>
          <span className={styles.summaryItemLabel}>Weekly avg</span>
          <span className={styles.summaryItemValue}>
            {formatMetricValue(selectedMetricSummary.average)}
            <span className={styles.summaryItemUnit}>
              {selectedMetricSummary.unit}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
