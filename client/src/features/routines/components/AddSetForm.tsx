import { useState } from "react";
import styles from "../routines.module.css";

interface AddSetFormProps {
  isSubmitting: boolean;
  onSubmit: (payload: {
    set_order: number;
    target_reps: number;
    target_weight_kg: number;
  }) => Promise<void>;
}

export default function AddSetForm({ isSubmitting, onSubmit }: AddSetFormProps) {
  const [setOrder, setSetOrder] = useState("");
  const [targetReps, setTargetReps] = useState("");
  const [targetWeightKg, setTargetWeightKg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      set_order: Number(setOrder),
      target_reps: Number(targetReps),
      target_weight_kg: Number(targetWeightKg),
    });

    setSetOrder("");
    setTargetReps("");
    setTargetWeightKg("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="number"
        placeholder="Set order"
        value={setOrder}
        onChange={(e) => setSetOrder(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <input
        className={styles.input}
        type="number"
        placeholder="Target reps"
        value={targetReps}
        onChange={(e) => setTargetReps(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <input
        className={styles.input}
        type="number"
        step="0.5"
        placeholder="Target weight (kg)"
        value={targetWeightKg}
        onChange={(e) => setTargetWeightKg(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <button className={styles.secondaryButton} type="submit" disabled={isSubmitting}>
        Add set
      </button>
    </form>
  );
}