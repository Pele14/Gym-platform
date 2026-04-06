import { SettingsForm } from "../../user";
import styles from "../../../pages/pages.module.css";

type ProfileSettingsPanelProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function ProfileSettingsPanel({
  isOpen,
  onToggle,
}: ProfileSettingsPanelProps) {
  return (
    <>
      <div className={styles.profileControlsRow}>
        <button
          className={`${styles.settingsToggleButton} ${
            isOpen ? styles.settingsToggleButtonActive : ""
          }`}
          type="button"
          onClick={onToggle}
        >
          {isOpen ? "Hide Settings" : "Settings"}
        </button>
      </div>

      {isOpen && (
        <article className={styles.profileFormContainer}>
          <SettingsForm />
        </article>
      )}
    </>
  );
}
