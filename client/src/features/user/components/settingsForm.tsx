import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { NutritionGoalCard } from "../../nutrition";
import styles from "../userSettings.module.css";
import type {
  UpdateCurrentUserPayload,
} from "../types/currentUser";

export default function SettingsForm() {
  const { currentUser, isLoading, isSubmitting, error, updateCurrentUser } =
    useCurrentUser();

  const [formData, setFormData] = useState<UpdateCurrentUserPayload>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: null,
    profile_image_url: null,
    height_cm: null,
    weight_kg: null,
    sex: null,
    activity_level: null,
    goal_type: null,
  });

  useEffect(() => {
    if (!currentUser) return;

    setFormData({
      username: currentUser.username,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      email: currentUser.email,
      date_of_birth: currentUser.profile?.date_of_birth ?? null,
      profile_image_url: currentUser.profile?.profile_image_url ?? null,
      height_cm: currentUser.profile?.height_cm ?? null,
      weight_kg: currentUser.profile?.weight_kg ?? null,
      sex: currentUser.profile?.sex ?? null,
      activity_level: currentUser.profile?.activity_level ?? null,
      goal_type: currentUser.profile?.goal_type ?? null,
    });
  }, [currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "height_cm" || name === "weight_kg"
          ? value === ""
            ? null
            : Number(value)
          : value === ""
            ? null
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCurrentUser(formData);
  };

  const hasRequiredNutritionFields =
    !!formData.date_of_birth &&
    formData.height_cm !== null &&
    (formData.height_cm ?? 0) > 0 &&
    formData.weight_kg !== null &&
    (formData.weight_kg ?? 0) > 0 &&
    !!formData.sex &&
    !!formData.activity_level &&
    !!formData.goal_type;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Settings</h2>
        <p className={styles.message}>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Settings</h2>

      {error && <p className={styles.error}>{error}</p>}

      <NutritionGoalCard
        canCalculate={hasRequiredNutritionFields}
        isDisabled={isSubmitting}
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.formSectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.subtitle}>Account</h3>
            <p className={styles.sectionHint}>Identity and login details for your account.</p>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-username">Username</label>
              <input
                id="settings-username"
                className={styles.input}
                name="username"
                value={formData.username ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-email">Email</label>
              <input
                id="settings-email"
                className={styles.input}
                name="email"
                type="email"
                value={formData.email ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-first-name">First name</label>
              <input
                id="settings-first-name"
                className={styles.input}
                name="first_name"
                value={formData.first_name ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-last-name">Last name</label>
              <input
                id="settings-last-name"
                className={styles.input}
                name="last_name"
                value={formData.last_name ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </section>

        <section className={styles.formSectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.subtitle}>Profile Details</h3>
            <p className={styles.sectionHint}>Body metrics and activity profile used across workouts and nutrition.</p>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-height">Height (cm)</label>
              <input
                id="settings-height"
                className={styles.input}
                name="height_cm"
                type="number"
                step="0.1"
                value={formData.height_cm ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-weight">Weight (kg)</label>
              <input
                id="settings-weight"
                className={styles.input}
                name="weight_kg"
                type="number"
                step="0.1"
                value={formData.weight_kg ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-sex">Sex</label>
              <select
                id="settings-sex"
                className={styles.select}
                name="sex"
                value={formData.sex ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-activity">Activity level</label>
              <select
                id="settings-activity"
                className={styles.select}
                name="activity_level"
                value={formData.activity_level ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very active</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-goal">Goal type</label>
              <select
                id="settings-goal"
                className={styles.select}
                name="goal_type"
                value={formData.goal_type ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Select goal</option>
                <option value="lose">Lose</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Gain</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-dob">Date of birth</label>
              <input
                id="settings-dob"
                className={styles.input}
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </section>

        <div className={styles.actionRow}>
          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}