import { useState } from "react";
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

export default function FoodForm({
  isAdmin,
  isSubmitting,
  onSubmit,
  editingFood = null,
  onUpdate,
  onCancelEdit,
}: FoodFormProps) {
  const [formData, setFormData] = useState<CreateFoodPayload>({
    name: editingFood?.name || "",
    brand: editingFood?.brand || "",
    calories: editingFood?.calories_per_100g || 0,
    protein: editingFood?.protein_per_100g || 0,
    carbs: editingFood?.carbs_per_100g || 0,
    fat: editingFood?.fat_per_100g || 0,
  });

  const [isSystem, setIsSystem] = useState<boolean>(
    editingFood ? editingFood.is_system : false
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "name" || name === "brand"
          ? value
          : value === ""
            ? 0
            : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateFoodPayload = {
      name: formData.name.trim(),
      brand: formData.brand?.trim() || undefined,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fat: Number(formData.fat),
    };

    if (editingFood && onUpdate) {
      await onUpdate(editingFood.id, payload, editingFood.is_system);
    } else {
      await onSubmit(payload, isAdmin ? isSystem : false);
    }

    if (!editingFood) {
      setFormData({
        name: "",
        brand: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
      setIsSystem(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        name="name"
        placeholder="Food name"
        value={formData.name}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />

      <input
        className={styles.input}
        name="brand"
        placeholder="Brand"
        value={formData.brand || ""}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <input
        className={styles.input}
        name="calories"
        type="number"
        step="0.1"
        placeholder="Calories per 100g"
        value={formData.calories}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />

      <input
        className={styles.input}
        name="protein"
        type="number"
        step="0.1"
        placeholder="Protein per 100g"
        value={formData.protein}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />

      <input
        className={styles.input}
        name="carbs"
        type="number"
        step="0.1"
        placeholder="Carbs per 100g"
        value={formData.carbs}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />

      <input
        className={styles.input}
        name="fat"
        type="number"
        step="0.1"
        placeholder="Fat per 100g"
        value={formData.fat}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />

      {!editingFood && isAdmin && (
        <select
          className={styles.select}
          value={isSystem ? "system" : "custom"}
          onChange={(e) => setIsSystem(e.target.value === "system")}
          disabled={isSubmitting}
        >
          <option value="custom">Custom food</option>
          <option value="system">System food</option>
        </select>
      )}

      <div className={styles.actions}>
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
            className={styles.deleteButton}
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