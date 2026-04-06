import { useEffect, useMemo, useState } from "react";

import { useWorkoutSession, type WorkoutSession } from "../../workout_session";
import type {
  CalendarDayCell,
  CalendarMonth,
  MetricSummary,
  WeeklyWorkoutPoint,
  WorkoutBarChartPoint,
  WorkoutMetric,
} from "../types/profile_types";

const STATS_WEEKS = 8;
const BAR_CHART_HEIGHT = 92;
const MIN_BAR_HEIGHT = 8;

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekStart(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  const day = normalized.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  normalized.setDate(normalized.getDate() + diff);
  return normalized;
}

function getShortWeekLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getMetricValue(point: WeeklyWorkoutPoint, metric: WorkoutMetric): number {
  switch (metric) {
    case "reps":
      return point.reps;
    case "duration":
      return point.duration;
    case "volume":
      return point.volume;
    default:
      return 0;
  }
}

function buildWeeklyWorkoutStats(
  sessions: WorkoutSession[],
  weeks: number
): WeeklyWorkoutPoint[] {
  const currentWeekStart = getWeekStart(new Date());
  const weekBuckets = new Map<string, WeeklyWorkoutPoint>();

  for (let index = weeks - 1; index >= 0; index -= 1) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - index * 7);

    weekBuckets.set(toDateKey(weekStart), {
      weekStart,
      weekLabel: getShortWeekLabel(weekStart),
      reps: 0,
      duration: 0,
      volume: 0,
    });
  }

  sessions.forEach((session) => {
    if (!session.finished_at) {
      return;
    }

    const weekStart = getWeekStart(new Date(session.finished_at));
    const bucket = weekBuckets.get(toDateKey(weekStart));

    if (!bucket) {
      return;
    }

    bucket.reps += session.total_reps ?? 0;
    bucket.duration += Math.round((session.duration_seconds ?? 0) / 60);
    bucket.volume += session.total_volume ?? 0;
  });

  return Array.from(weekBuckets.values()).sort(
    (left, right) => left.weekStart.getTime() - right.weekStart.getTime()
  );
}

function formatMetricValue(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function useProfileOverview() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedWorkoutMetric, setSelectedWorkoutMetric] =
    useState<WorkoutMetric>("reps");
  const [calendarMonth, setCalendarMonth] = useState<CalendarMonth>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const {
    history,
    isLoading: isHistoryLoading,
    error: historyError,
    loadWorkoutHistory,
  } = useWorkoutSession();

  useEffect(() => {
    void loadWorkoutHistory().catch(() => {
      // Error is already stored in hook state and rendered by consumers.
    });
  }, [loadWorkoutHistory]);

  const weeklyWorkoutStats = useMemo(
    () => buildWeeklyWorkoutStats(history, STATS_WEEKS),
    [history]
  );

  const workoutBarChartData = useMemo<WorkoutBarChartPoint[]>(() => {
    const maxValue = Math.max(
      ...weeklyWorkoutStats.map((point) =>
        getMetricValue(point, selectedWorkoutMetric)
      ),
      1
    );

    return weeklyWorkoutStats.map((point, index) => {
      const value = getMetricValue(point, selectedWorkoutMetric);
      const scaledHeight = Math.round((value / maxValue) * BAR_CHART_HEIGHT);

      return {
        ...point,
        value,
        isLatest: index === weeklyWorkoutStats.length - 1,
        barHeight:
          value === 0
            ? MIN_BAR_HEIGHT
            : Math.max(MIN_BAR_HEIGHT, scaledHeight),
      };
    });
  }, [selectedWorkoutMetric, weeklyWorkoutStats]);

  const selectedMetricSummary = useMemo<MetricSummary>(() => {
    const total = weeklyWorkoutStats.reduce(
      (sum, point) => sum + getMetricValue(point, selectedWorkoutMetric),
      0
    );
    const thisWeek = weeklyWorkoutStats.at(-1);
    const average =
      weeklyWorkoutStats.length > 0 ? total / weeklyWorkoutStats.length : 0;
    const unit =
      selectedWorkoutMetric === "reps"
        ? "reps"
        : selectedWorkoutMetric === "duration"
          ? "min"
          : "kg";

    return {
      unit,
      thisWeek: thisWeek ? getMetricValue(thisWeek, selectedWorkoutMetric) : 0,
      total,
      average,
    };
  }, [selectedWorkoutMetric, weeklyWorkoutStats]);

  const metricSubtitle =
    selectedWorkoutMetric === "reps"
      ? "Weekly reps completed"
      : selectedWorkoutMetric === "duration"
        ? "Weekly training duration"
        : "Weekly lifted volume";

  const workoutDates = useMemo(() => {
    const set = new Set<string>();
    history.forEach((session) => {
      if (session.finished_at) {
        set.add(toDateKey(new Date(session.finished_at)));
      }
    });
    return set;
  }, [history]);

  const calendarDays = useMemo<CalendarDayCell[]>(() => {
    const { year, month } = calendarMonth;
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayKey = toDateKey(new Date());
    const rawDow = firstOfMonth.getDay();
    const offset = rawDow === 0 ? 6 : rawDow - 1;

    const cells: CalendarDayCell[] = Array.from({ length: offset }, () => null);

    for (let d = 1; d <= daysInMonth; d += 1) {
      const dateKey = toDateKey(new Date(year, month, d));
      cells.push({
        dateKey,
        day: d,
        isToday: dateKey === todayKey,
        hasWorkout: workoutDates.has(dateKey),
      });
    }

    return cells;
  }, [calendarMonth, workoutDates]);

  const calendarMonthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(calendarMonth.year, calendarMonth.month, 1));

  const isCurrentCalendarMonth =
    calendarMonth.year === new Date().getFullYear() &&
    calendarMonth.month === new Date().getMonth();

  const showPreviousCalendarMonth = () => {
    setCalendarMonth(({ year, month }) => {
      const date = new Date(year, month - 1, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  const showNextCalendarMonth = () => {
    setCalendarMonth(({ year, month }) => {
      const date = new Date(year, month + 1, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  return {
    isSettingsOpen,
    toggleSettings: () => setIsSettingsOpen((prev) => !prev),
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
  };
}
