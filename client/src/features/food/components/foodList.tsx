import { useState } from "react";
import { useAuth } from "../../auth";
import { useFoods } from "../hooks/useFoods";
import FoodForm from "./foodForm";
import styles from "../foods.module.css";
import type { CreateFoodPayload, Food } from "../types/food_types";

type FoodAdminView = "add" | "list";

export default function FoodList() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<FoodAdminView>("add");
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredFoods = foods.filter((food) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [
      food.name,
      food.brand ?? "",
      food.is_system ? "system" : "custom",
      String(food.calories_per_100g),
      String(food.protein_per_100g),
      String(food.carbs_per_100g),
      String(food.fat_per_100g),
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.message}>Loading food...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Food Library</h2>
          <p className={styles.subtitle}>
            Manage nutrition entries and quickly edit system or custom food.
          </p>
        </div>

        <div className={styles.viewToggle} role="tablist" aria-label="Food management views">
          <button
            className={`${styles.viewToggleButton} ${
              activeView === "add" ? styles.viewToggleButtonActive : ""
            }`}
            type="button"
            onClick={() => setActiveView("add")}
            role="tab"
            aria-selected={activeView === "add"}
          >
            Add Food
          </button>
          <button
            className={`${styles.viewToggleButton} ${
              activeView === "list" ? styles.viewToggleButtonActive : ""
            }`}
            type="button"
            onClick={() => setActiveView("list")}
            role="tab"
            aria-selected={activeView === "list"}
          >
            Food
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {activeView === "add" ? (
        <section className={styles.formSectionCard}>
          <header className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Create Food</h3>
          </header>

          <FoodForm
            isAdmin={isAdmin}
            isSubmitting={isSubmitting}
            onSubmit={handleCreate}
          />
        </section>
      ) : (
        <section className={styles.listSection}>
          <header className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Existing Food</h3>
              <p className={styles.sectionSubtitle}>{foods.length} total</p>
            </div>

            <div className={styles.searchGroup}>
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search food"
              />
            </div>
          </header>

          {foods.length === 0 ? (
            <p className={styles.empty}>No food found.</p>
          ) : filteredFoods.length === 0 ? (
            <p className={styles.empty}>No food match your search.</p>
          ) : (
            <div className={styles.grid}>
              {filteredFoods.map((food) => {
                const canEdit =
                  (food.is_system && isAdmin) ||
                  (!food.is_system && food.created_by_user_id === user?.id);

                const canDelete =
                  (food.is_system && isAdmin) ||
                  (!food.is_system && food.created_by_user_id === user?.id);

                return (
                  <div
                    key={food.id}
                    className={`${styles.card} ${canEdit ? styles.cardClickable : ""}`}
                    onClick={() => {
                      if (canEdit) {
                        setEditingFood(food);
                      }
                    }}
                    role={canEdit ? "button" : undefined}
                    tabIndex={canEdit ? 0 : -1}
                    onKeyDown={(event) => {
                      if (!canEdit) {
                        return;
                      }

                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setEditingFood(food);
                      }
                    }}
                    aria-label={canEdit ? `Edit ${food.name}` : undefined}
                  >
                    <div className={styles.cardTop}>
                      <div>
                        <h3 className={styles.cardTitle}>{food.name}</h3>
                        <p className={styles.meta}>{food.brand || "No brand"}</p>
                      </div>

                      <div className={styles.actions}>
                        {canDelete && (
                          <button
                            className={styles.deleteButton}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleDelete(food.id, food.is_system);
                            }}
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
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {editingFood && (
        <div
          className={styles.editOverlay}
          onClick={() => setEditingFood(null)}
          role="presentation"
        >
          <section
            className={styles.editModal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${editingFood.name}`}
          >
            <header className={styles.editModalHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Edit Food</h3>
                <p className={styles.sectionSubtitle}>{editingFood.name}</p>
              </div>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setEditingFood(null)}
              >
                Close
              </button>
            </header>

            <FoodForm
              isAdmin={isAdmin}
              isSubmitting={isSubmitting}
              onSubmit={handleCreate}
              editingFood={editingFood}
              onUpdate={handleUpdate}
              onCancelEdit={() => setEditingFood(null)}
            />
          </section>
        </div>
      )}
    </div>
  );
}