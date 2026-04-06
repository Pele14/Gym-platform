export type WorkoutMetric = "reps" | "duration" | "volume";

export type WeeklyWorkoutPoint = {
  weekStart: Date;
  weekLabel: string;
  reps: number;
  duration: number;
  volume: number;
};

export type WorkoutBarChartPoint = WeeklyWorkoutPoint & {
  value: number;
  isLatest: boolean;
  barHeight: number;
};

export type MetricSummary = {
  unit: string;
  thisWeek: number;
  total: number;
  average: number;
};

export type CalendarMonth = {
  year: number;
  month: number;
};

export type CalendarDayCell =
  | null
  | {
      dateKey: string;
      day: number;
      isToday: boolean;
      hasWorkout: boolean;
    };
