import { useState } from "react";
import styles from "../exercises.module.css";
import type { CreateExercisePayload } from "../types/exercise_types";

interface ExerciseFormProps {
  isAdmin: boolean;
  isSubmitting: boolean;
  onSubmit: (payload: CreateExercisePayload, isSystem: boolean) => Promise<void>;
}

export default function ExerciseForm({
  isAdmin,
  isSubmitting,
  onSubmit,
}: ExerciseFormProps) {
  const [formData, setFormData] = useState<CreateExercisePayload>({
    name: "",
    muscle_group: "",
    description: "",
    equipment: "",
    difficulty: "",
  });

  const [isSystem, setIsSystem] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit(
      {
        name: formData.name.trim(),
        muscle_group: formData.muscle_group.trim(),
        description: formData.description?.trim() || undefined,
        equipment: formData.equipment?.trim() || undefined,
        difficulty: formData.difficulty?.trim() || undefined,
      },
      isAdmin ? isSystem : false
    );

    setFormData({
      name: "",
      muscle_group: "",
      description: "",
      equipment: "",
      difficulty: "",
    });
    setIsSystem(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        name="name"
        placeholder="Exercise name"
        value={formData.name}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />

      <input
        className={styles.input}
        name="muscle_group"
        placeholder="Muscle group"
        value={formData.muscle_group}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />

      <input
        className={styles.input}
        name="equipment"
        placeholder="Equipment"
        value={formData.equipment}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <input
        className={styles.input}
        name="difficulty"
        placeholder="Difficulty"
        value={formData.difficulty}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <textarea
        className={styles.textarea}
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      {isAdmin && (
        <select
          className={styles.select}
          value={isSystem ? "system" : "custom"}
          onChange={(e) => setIsSystem(e.target.value === "system")}
          disabled={isSubmitting}
        >
          <option value="custom">Custom exercise</option>
          <option value="system">System exercise</option>
        </select>
      )}

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add exercise"}
      </button>
    </form>
  );
}