import styles from "../nutrition_log.module.css";

type DateNavigatorProps = {
  date: string;
  onDateChange: (date: string) => void;
};

export default function DateNavigator({ date, onDateChange }: DateNavigatorProps) {
  const handlePrevDay = () => {
    const current = new Date(date);
    current.setDate(current.getDate() - 1);
    onDateChange(current.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const current = new Date(date);
    current.setDate(current.getDate() + 1);
    onDateChange(current.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    onDateChange(today);
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onDateChange(e.target.value);
    }
  };

  return (
    <div className={styles.dateNavigator}>
      <button className={styles.dateNavButton} onClick={handlePrevDay}>
        ← Previous
      </button>

      <div className={styles.dateInputWrapper}>
        <input
          className={styles.dateInput}
          type="date"
          value={date}
          onChange={handleDateInput}
        />
      </div>

      <button className={styles.dateNavButton} onClick={handleNextDay}>
        Next →
      </button>

      <button className={styles.dateNavTodayButton} onClick={handleToday}>
        Today
      </button>
    </div>
  );
}
