import { useEffect, useState } from "react";
import styles from "../foods.module.css";
import type { CreateFoodPayload, Food } from "../types/food_types";

interface FoodFormProps {
  isAdmin: boolean;
  isSubmitting: boolean;
  onSubmit: (payload: CreateFoodPayload, isSystem: boolean) => Promise<void>;
  editingFood?: Food | null;
  onUpdate?: (
    foodId: number,
    payload: Partial<CreateFoodPayload>,
    isSystem: boolean
  ) => Promise<void>;
  onCancelEdit?: () => void;
}

interface FoodFormState {
  name: string;
  brand: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export default function FoodForm({
  isAdmin,
  isSubmitting,
  onSubmit,
  editingFood = null,
  onUpdate,
  onCancelEdit,
}: FoodFormProps) {
  const [formData, setFormData] = useState<FoodFormState>({
    name: "",
    brand: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  useEffect(() => {
    if (!editingFood) {
      setFormData({
        name: "",
        brand: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
      return;
    }

    setFormData({
      name: editingFood.name,
      brand: editingFood.brand || "",
      calories: String(editingFood.calories_per_100g),
      protein: String(editingFood.protein_per_100g),
      carbs: String(editingFood.carbs_per_100g),
      fat: String(editingFood.fat_per_100g),
    });
  }, [editingFood]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateFoodPayload = {
      name: formData.name.trim(),
      brand: formData.brand?.trim() || undefined,
      calories: Number(formData.calories || 0),
      protein: Number(formData.protein || 0),
      carbs: Number(formData.carbs || 0),
      fat: Number(formData.fat || 0),
    };

    if (editingFood && onUpdate) {
      await onUpdate(editingFood.id, payload, editingFood.is_system);
    } else {
      await onSubmit(payload, isAdmin);
    }

    if (!editingFood) {
      setFormData({
        name: "",
        brand: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="food-name">Food name</label>
          <input
            id="food-name"
            className={styles.input}
            name="name"
            placeholder="e.g. Greek Yogurt"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="food-brand">Brand (optional)</label>
          <input
            id="food-brand"
            className={styles.input}
            name="brand"
            placeholder="e.g. Fage"
            value={formData.brand || ""}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="food-calories">Calories (per 100g)</label>
          <input
            id="food-calories"
            className={styles.input}
            name="calories"
            type="number"
            step="0.1"
            min="0"
            value={formData.calories}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="food-protein">Protein (g per 100g)</label>
          <input
            id="food-protein"
            className={styles.input}
            name="protein"
            type="number"
            step="0.1"
            min="0"
            value={formData.protein}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="food-carbs">Carbs (g per 100g)</label>
          <input
            id="food-carbs"
            className={styles.input}
            name="carbs"
            type="number"
            step="0.1"
            min="0"
            value={formData.carbs}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="food-fat">Fat (g per 100g)</label>
          <input
            id="food-fat"
            className={styles.input}
            name="fat"
            type="number"
            step="0.1"
            min="0"
            value={formData.fat}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? editingFood
              ? "Saving..."
              : "Adding..."
            : editingFood
              ? "Save food"
              : "Add food"}
        </button>

        {editingFood && onCancelEdit && (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}