import styles from "../../../pages/pages.module.css";
import type { CalendarDayCell } from "../types/profile_types";

type WorkoutCalendarCardProps = {
  calendarMonthLabel: string;
  calendarDays: CalendarDayCell[];
  isHistoryLoading: boolean;
  historyError: string | null;
  isCurrentCalendarMonth: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

export default function WorkoutCalendarCard({
  calendarMonthLabel,
  calendarDays,
  isHistoryLoading,
  historyError,
  isCurrentCalendarMonth,
  onPreviousMonth,
  onNextMonth,
}: WorkoutCalendarCardProps) {
  return (
    <article className={styles.workoutCalendarCard}>
      <div className={styles.calendarHeader}>
        <h3 className={styles.calendarTitle}>Workout Calendar</h3>
        <div className={styles.calendarNav}>
          <button
            className={styles.calendarNavButton}
            type="button"
            onClick={onPreviousMonth}
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className={styles.calendarMonthLabel}>{calendarMonthLabel}</span>
          <button
            className={styles.calendarNavButton}
            type="button"
            disabled={isCurrentCalendarMonth}
            onClick={onNextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.calendarGrid}>
        {isHistoryLoading ? (
          <p className={styles.cardMeta}>Loading workout calendar...</p>
        ) : historyError ? (
          <p className={styles.cardMeta}>{historyError}</p>
        ) : (
          <>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day) => (
                <div key={day} className={styles.calendarDayHeader}>
                  {day}
                </div>
              )
            )}
            {calendarDays.map((cell, index) =>
              cell === null ? (
                <div
                  key={`empty-${index}`}
                  className={styles.calendarCellEmpty}
                />
              ) : (
                <div
                  key={cell.dateKey}
                  className={[
                    styles.calendarCell,
                    cell.hasWorkout ? styles.calendarCellDone : "",
                    cell.isToday ? styles.calendarCellToday : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className={styles.calendarDayNumber}>{cell.day}</span>
                </div>
              )
            )}
          </>
        )}
      </div>
    </article>
  );
}
