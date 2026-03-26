import { useState } from "react";
import { useDailyNutritionLog } from "../hooks/useDailyNutritionLog";
import { foodService } from "../../food";
import type { Food } from "../../food";
import AddMealCard from "./AddMealCard";
import styles from "../nutrition_log.module.css";

type DailyLogViewProps = {
  date: string;
};

export default function DailyLogView({ date }: DailyLogViewProps) {
  const {
    dailyLog,
    goal,
    remaining,
    isLoading,
    isSubmitting,
    error,
    createMeal,
    deleteMeal,
    createEntry,
    deleteEntry,
  } = useDailyNutritionLog(date);

  const [showMealForm, setShowMealForm] = useState(false);
  const [mealName, setMealName] = useState("");
  const [expandedMealId, setExpandedMealId] = useState<number | null>(null);
  const [showEntryForm, setShowEntryForm] = useState<number | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [entryGrams, setEntryGrams] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const resetEntryFlow = () => {
    setSelectedFood(null);
    setEntryGrams("");
    setShowEntryForm(null);
    setSearchQuery("");
    setFoods([]);
  };

  const openEntryModal = (mealId: number) => {
    setSelectedFood(null);
    setEntryGrams("");
    setSearchQuery("");
    setFoods([]);
    setShowEntryForm(mealId);
  };

  const handleCreateMeal = async () => {
    if (!mealName.trim()) return;
    try {
      await createMeal(mealName.trim());
      setMealName("");
      setShowMealForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadFoods = async () => {
    try {
      const data = await foodService.getFoods();
      const filtered = data.foods.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFoods(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEntry = async (mealId: number) => {
    if (!selectedFood || !entryGrams || Number(entryGrams) <= 0) return;
    try {
      await createEntry(mealId, selectedFood.id, Number(entryGrams));
      resetEntryFlow();
    } catch (err) {
      console.error(err);
    }
  };

  const activeMeal = dailyLog?.meals.find((meal) => meal.id === showEntryForm) ?? null;

  const getProgressWidth = (current: number, target?: number) => {
    if (!target || target <= 0) return 0;
    return Math.max(0, Math.min(100, (current / target) * 100));
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.message}>Loading daily log...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Daily Nutrition Log</h2>
        <p className={styles.date}>{date}</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {dailyLog && (
        <>
          {(() => {
            const macroStats = [
              {
                label: "Calories",
                value: Math.round(dailyLog.total_calories),
                unit: "kcal",
                target: Math.round(goal?.target_calories || 0),
                remainingValue: Math.round(remaining?.calories || 0),
              },
              {
                label: "Protein",
                value: Math.round(dailyLog.total_protein),
                unit: "g",
                target: Math.round(goal?.target_protein || 0),
                remainingValue: Math.round(remaining?.protein || 0),
              },
              {
                label: "Carbs",
                value: Math.round(dailyLog.total_carbs),
                unit: "g",
                target: Math.round(goal?.target_carbs || 0),
                remainingValue: Math.round(remaining?.carbs || 0),
              },
              {
                label: "Fat",
                value: Math.round(dailyLog.total_fat),
                unit: "g",
                target: Math.round(goal?.target_fat || 0),
                remainingValue: Math.round(remaining?.fat || 0),
              },
            ];

            return (
              <>
          {/* SECTION 1: Macro Summary */}
          <div className={styles.summarySection}>
            <h3 className={styles.sectionTitle}>Today's Overview</h3>
            <div className={styles.summary}>
              {macroStats.map((macro) => (
                <div key={macro.label} className={styles.macroItem}>
                  <div className={styles.macroHeaderRow}>
                    <span className={styles.macroLabel}>{macro.label}</span>
                    <span className={styles.macroTarget}>
                      Goal {macro.target}
                      {macro.unit}
                    </span>
                  </div>

                  <div className={styles.macroValueRow}>
                    <strong className={styles.macroValue}>
                      {macro.value}
                      <span className={styles.macroUnit}>{macro.unit}</span>
                    </strong>
                  </div>

                  <div className={styles.progressTrack} aria-hidden="true">
                    <span
                      className={styles.progressFill}
                      style={{ width: `${getProgressWidth(macro.value, macro.target)}%` }}
                    />
                  </div>

                  {remaining && (
                    <span className={styles.remaining}>
                      {macro.remainingValue >= 0
                        ? `${macro.remainingValue}${macro.unit} left`
                        : `${Math.abs(macro.remainingValue)}${macro.unit} over`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

              </>
            );
          })()}

          {/* SECTION 2: Add Meal Action */}
          <div className={styles.addMealSection}>
            <h3 className={styles.sectionTitle}>Add Meal</h3>
            <div className={styles.sectionContent}>
              <AddMealCard
                showForm={showMealForm}
                mealName={mealName}
                isSubmitting={isSubmitting}
                onOpen={() => setShowMealForm(true)}
                onChangeName={setMealName}
                onSubmit={handleCreateMeal}
                onCancel={() => {
                  setShowMealForm(false);
                  setMealName("");
                }}
              />
            </div>
          </div>

          {/* SECTION 3: Meal List */}
          <div className={styles.mealsListSection}>
            <h3 className={styles.sectionTitle}>Your Meals</h3>
            <div className={styles.mealsList}>
              {dailyLog.meals.length === 0 ? (
                <p className={styles.message}>No meals logged yet.</p>
              ) : (
                dailyLog.meals.map((meal) => (
                  <div key={meal.id} className={styles.mealCard}>
                    <div className={styles.mealHeader}>
                      <div
                        className={styles.mealTitle}
                        onClick={() =>
                          setExpandedMealId(
                            expandedMealId === meal.id ? null : meal.id
                          )
                        }
                      >
                        <h4>{meal.name}</h4>
                        <span className={styles.mealMacros}>
                          {Math.round(meal.total_calories)} kcal | {Math.round(meal.total_protein)}g protein
                        </span>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteMeal(meal.id)}
                        disabled={isSubmitting}
                      >
                        Delete
                      </button>
                    </div>

                    {expandedMealId === meal.id && (
                      <div className={styles.mealDetail}>
                        <div className={styles.entriesList}>
                          {meal.entries.length === 0 ? (
                            <p className={styles.message}>No foods added yet.</p>
                          ) : (
                            meal.entries.map((entry) => (
                              <div key={entry.id} className={styles.entryItem}>
                                <div className={styles.entryInfo}>
                                  <span className={styles.foodName}>
                                    {entry.food_name}
                                    {entry.food_brand && ` (${entry.food_brand})`}
                                  </span>
                                  <span className={styles.entryGrams}>
                                    {Math.round(entry.grams * 10) / 10}g
                                  </span>
                                  <span className={styles.entryMacros}>
                                    {Math.round(entry.consumed_calories)} kcal |
                                    {Math.round(entry.consumed_protein)}p |
                                    {Math.round(entry.consumed_carbs)}c |
                                    {Math.round(entry.consumed_fat)}f
                                  </span>
                                </div>
                                <button
                                  className={styles.deleteButton}
                                  onClick={() => deleteEntry(meal.id, entry.id)}
                                  disabled={isSubmitting}
                                >
                                  Remove
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        <button
                          className={styles.button}
                          type="button"
                          onClick={() => openEntryModal(meal.id)}
                          disabled={isSubmitting}
                        >
                          + Add Food
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {activeMeal && (
            <div className={styles.modalOverlay} onClick={resetEntryFlow}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <div>
                    <h3 className={styles.modalTitle}>Add Food</h3>
                    <p className={styles.modalSubtitle}>{activeMeal.name}</p>
                  </div>
                  <button
                    className={styles.modalClose}
                    type="button"
                    onClick={resetEntryFlow}
                  >
                    ✕
                  </button>
                </div>

                {!selectedFood ? (
                  <>
                    <label className={styles.modalLabel}>Search food</label>
                    <div className={styles.modalSearchRow}>
                      <input
                        className={styles.input}
                        type="text"
                        placeholder="Search food..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        className={styles.button}
                        type="button"
                        onClick={handleLoadFoods}
                        disabled={isSubmitting}
                      >
                        Search
                      </button>
                    </div>

                    <div className={styles.foodSearchSection}>
                      {foods.length > 0 ? (
                        <div className={styles.foodList}>
                          {foods.map((food) => (
                            <div
                              key={food.id}
                              className={styles.foodOption}
                              onClick={() => setSelectedFood(food)}
                            >
                              <div className={styles.foodOptionInfo}>
                                <span className={styles.foodOptionName}>{food.name}</span>
                                {food.brand && (
                                  <span className={styles.foodBrand}>{food.brand}</span>
                                )}
                              </div>
                              <span className={styles.foodMacros}>
                                {Math.round(food.calories_per_100g)} cal/100g
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.message}>
                          {searchQuery.trim()
                            ? "No matching foods yet. Try another search."
                            : "Search to pick a food for this meal."}
                        </p>
                      )}
                    </div>

                    <div className={styles.modalActions}>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={resetEntryFlow}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <label className={styles.modalLabel}>Selected food</label>
                    <div className={styles.selectedFoodCard}>
                      <div className={styles.foodOptionInfo}>
                        <span className={styles.selectedBadge}>Selected</span>
                        <span className={styles.foodOptionName}>{selectedFood.name}</span>
                        {selectedFood.brand && (
                          <span className={styles.foodBrand}>{selectedFood.brand}</span>
                        )}
                      </div>
                      <span className={styles.foodMacros}>
                        {Math.round(selectedFood.calories_per_100g)} cal/100g
                      </span>
                    </div>

                    <label className={styles.modalLabel}>Amount in grams</label>
                    <input
                      className={styles.input}
                      type="number"
                      step="0.1"
                      placeholder="Grams"
                      value={entryGrams}
                      onChange={(e) => setEntryGrams(e.target.value)}
                      disabled={isSubmitting}
                    />

                    <div className={styles.modalActions}>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => {
                          setSelectedFood(null);
                          setEntryGrams("");
                        }}
                        disabled={isSubmitting}
                      >
                        Back
                      </button>
                      <button
                        className={styles.button}
                        type="button"
                        onClick={() => handleCreateEntry(activeMeal.id)}
                        disabled={
                          isSubmitting || !entryGrams || Number(entryGrams) <= 0
                        }
                      >
                        {isSubmitting ? "Adding..." : "Add Food"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
