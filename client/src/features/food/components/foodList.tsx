import { useState } from "react";
import { useAuth } from "../../auth";
import { useFoods } from "../hooks/useFoods";
import FoodForm from "./foodForm";
import styles from "../foods.module.css";
import type { CreateFoodPayload, Food } from "../types/food_types";

export default function FoodList() {
  const { user } = useAuth();
  const { foods, isLoading, isSubmitting, error, createFood, updateFood, deleteFood } =
    useFoods();

  const [editingFood, setEditingFood] = useState<Food | null>(null);

  const isAdmin = user?.role === "admin";

  const handleCreate = async (payload: CreateFoodPayload, isSystem: boolean) => {
    await createFood(payload, isSystem);
  };

  const handleUpdate = async (
    foodId: number,
    payload: Partial<CreateFoodPayload>,
    isSystem: boolean
  ) => {
    await updateFood(foodId, payload, isSystem);
    setEditingFood(null);
  };

  const handleDelete = async (foodId: number, isSystem: boolean) => {
    await deleteFood(foodId, isSystem);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.message}>Loading foods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Foods</h2>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <FoodForm
        isAdmin={isAdmin}
        isSubmitting={isSubmitting}
        onSubmit={handleCreate}
      />

      {foods.length === 0 ? (
        <p className={styles.empty}>No foods found.</p>
      ) : (
        <div className={styles.grid}>
          {foods.map((food) => {
            const canEdit =
              (food.is_system && isAdmin) ||
              (!food.is_system && food.created_by_user_id === user?.id);

            const canDelete =
              (food.is_system && isAdmin) ||
              (!food.is_system && food.created_by_user_id === user?.id);

            return (
              <div key={food.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.cardTitle}>{food.name}</h3>
                    <p className={styles.meta}>{food.brand || "No brand"}</p>
                  </div>

                  <div className={styles.actions}>
                    {canEdit && (
                      <button
                        className={styles.editButton}
                        onClick={() => setEditingFood(food)}
                        type="button"
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(food.id, food.is_system)}
                        type="button"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.badges}>
                  <span
                    className={`${styles.badge} ${
                      food.is_system ? styles.system : styles.custom
                    }`}
                  >
                    {food.is_system ? "System" : "Custom"}
                  </span>
                </div>

                <div className={styles.macroRow}>
                  <span>Calories: {food.calories_per_100g}</span>
                  <span>Protein: {food.protein_per_100g}</span>
                  <span>Carbs: {food.carbs_per_100g}</span>
                  <span>Fat: {food.fat_per_100g}</span>
                </div>

                {editingFood?.id === food.id && (
                  <div style={{ marginTop: "1rem" }}>
                    <FoodForm
                      isAdmin={isAdmin}
                      isSubmitting={isSubmitting}
                      onSubmit={handleCreate}
                      editingFood={editingFood}
                      onUpdate={handleUpdate}
                      onCancelEdit={() => setEditingFood(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}