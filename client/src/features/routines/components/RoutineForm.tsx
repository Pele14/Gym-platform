import { useState } from "react";
import styles from "../routines.module.css";

interface RoutineFormProps {
  isSubmitting: boolean;
  onSubmit: (payload: { name: string; description?: string }) => Promise<void>;
}

export default function RoutineForm({
  isSubmitting,
  onSubmit,
}: RoutineFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });

    setName("");
    setDescription("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Routine name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <textarea
        className={styles.textarea}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSubmitting}
      />

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create routine"}
      </button>
    </form>
  );
}