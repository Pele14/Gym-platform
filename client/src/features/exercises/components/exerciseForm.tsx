import { useEffect, useState } from "react";
import styles from "../exercises.module.css";
import type { CreateExercisePayload, Exercise } from "../types/exercise_types";

interface ExerciseFormProps {
  isAdmin: boolean;
  isSubmitting: boolean;
  onSubmit: (payload: CreateExercisePayload, isSystem: boolean) => Promise<void>;
  initialData?: Exercise | null;
  mode?: "create" | "edit";
  onCancel?: () => void;
}

export default function ExerciseForm({
  isAdmin,
  isSubmitting,
  onSubmit,
  initialData = null,
  mode = "create",
  onCancel,
}: ExerciseFormProps) {
  const [formData, setFormData] = useState<CreateExercisePayload>({
    name: "",
    muscle_group: "",
    description: "",
    equipment: "",
    difficulty: "",
  });

  useEffect(() => {
    if (!initialData) {
      setFormData({
        name: "",
        muscle_group: "",
        description: "",
        equipment: "",
        difficulty: "",
      });
      return;
    }

    setFormData({
      name: initialData.name ?? "",
      muscle_group: initialData.muscle_group ?? "",
      description: initialData.description ?? "",
      equipment: initialData.equipment ?? "",
      difficulty: initialData.difficulty ?? "",
    });
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitAsSystem = mode === "edit" ? (initialData?.is_system ?? false) : isAdmin;

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
      submitAsSystem
    );

    if (mode === "create") {
      setFormData({
        name: "",
        muscle_group: "",
        description: "",
        equipment: "",
        difficulty: "",
      });
    }
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

      <select
        className={styles.select}
        name="muscle_group"
        value={formData.muscle_group}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      >
        <option value="" disabled>
          Select muscle group
        </option>
        <option value="Chest">Chest</option>
        <option value="Back">Back</option>
        <option value="Legs">Legs</option>
        <option value="Shoulders">Shoulders</option>
        <option value="Biceps">Biceps</option>
        <option value="Triceps">Triceps</option>
        <option value="Core">Core</option>
        <option value="Glutes">Glutes</option>
        <option value="Full Body">Full Body</option>
        <option value="Cardio">Cardio</option>
      </select>

      <select
        className={styles.select}
        name="equipment"
        value={formData.equipment}
        onChange={handleChange}
        disabled={isSubmitting}
      >
        <option value="">Select equipment (optional)</option>
        <option value="Bodyweight">Bodyweight</option>
        <option value="Dumbbells">Dumbbells</option>
        <option value="Barbell">Barbell</option>
        <option value="Kettlebell">Kettlebell</option>
        <option value="Machine">Machine</option>
        <option value="Resistance Band">Resistance Band</option>
        <option value="Cable">Cable</option>
        <option value="Medicine Ball">Medicine Ball</option>
        <option value="Pull-up Bar">Pull-up Bar</option>
        <option value="Bench">Bench</option>
      </select>

      <select
        className={styles.select}
        name="difficulty"
        value={formData.difficulty}
        onChange={handleChange}
        disabled={isSubmitting}
      >
        <option value="">Select difficulty (optional)</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <textarea
        className={styles.textarea}
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <div className={styles.formActions}>
        {mode === "edit" && onCancel && (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "edit"
              ? "Save changes"
              : "Add exercise"}
        </button>
      </div>
    </form>
  );
}