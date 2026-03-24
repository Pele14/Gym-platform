import { useState } from "react";
import { useDailyNutritionLog } from "../hooks/useDailyNutritionLog";
import { foodService } from "../../food";
import type { Food } from "../../food";
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
      setSelectedFood(null);
      setEntryGrams("");
      setShowEntryForm(null);
      setSearchQuery("");
      setFoods([]);
    } catch (err) {
      console.error(err);
    }
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
          <div className={styles.summary}>
            <div className={styles.macroItem}>
              <span className={styles.macroLabel}>Calories</span>
              <strong>{Math.round(dailyLog.total_calories)}</strong>
              {remaining && (
                <span className={styles.remaining}>
                  / {Math.round(goal?.target_calories || 0)} (
                  {Math.round(remaining.calories)} left)
                </span>
              )}
            </div>
            <div className={styles.macroItem}>
              <span className={styles.macroLabel}>Protein</span>
              <strong>{Math.round(dailyLog.total_protein)}g</strong>
              {remaining && (
                <span className={styles.remaining}>
                  / {Math.round(goal?.target_protein || 0)}g (
                  {Math.round(remaining.protein)}g left)
                </span>
              )}
            </div>
            <div className={styles.macroItem}>
              <span className={styles.macroLabel}>Carbs</span>
              <strong>{Math.round(dailyLog.total_carbs)}g</strong>
              {remaining && (
                <span className={styles.remaining}>
                  / {Math.round(goal?.target_carbs || 0)}g (
                  {Math.round(remaining.carbs)}g left)
                </span>
              )}
            </div>
            <div className={styles.macroItem}>
              <span className={styles.macroLabel}>Fat</span>
              <strong>{Math.round(dailyLog.total_fat)}g</strong>
              {remaining && (
                <span className={styles.remaining}>
                  / {Math.round(goal?.target_fat || 0)}g (
                  {Math.round(remaining.fat)}g left)
                </span>
              )}
            </div>
          </div>

          <div className={styles.mealSection}>
            {!showMealForm ? (
              <button
                className={styles.button}
                onClick={() => setShowMealForm(true)}
                disabled={isSubmitting}
              >
                + Add Meal
              </button>
            ) : (
              <div className={styles.form}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Meal name (e.g., Breakfast)"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  className={styles.button}
                  onClick={handleCreateMeal}
                  disabled={isSubmitting || !mealName.trim()}
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={() => {
                    setShowMealForm(false);
                    setMealName("");
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

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

                      {showEntryForm === meal.id ? (
                        <div className={styles.entryForm}>
                          {!selectedFood ? (
                            <>
                              <input
                                className={styles.input}
                                type="text"
                                placeholder="Search food..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                              <button
                                className={styles.button}
                                onClick={handleLoadFoods}
                                disabled={isSubmitting}
                              >
                                Search
                              </button>
                              {foods.length > 0 && (
                                <div className={styles.foodList}>
                                  {foods.map((food) => (
                                    <div
                                      key={food.id}
                                      className={styles.foodOption}
                                      onClick={() => setSelectedFood(food)}
                                    >
                                      <span>{food.name}</span>
                                      {food.brand && (
                                        <span className={styles.foodBrand}>
                                          {food.brand}
                                        </span>
                                      )}
                                      <span className={styles.foodMacros}>
                                        {Math.round(food.calories_per_100g)} cal/100g
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <button
                                className={styles.secondaryButton}
                                onClick={() => {
                                  setShowEntryForm(null);
                                  setSearchQuery("");
                                  setFoods([]);
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <p className={styles.selectedFood}>
                                Selected: {selectedFood.name}
                              </p>
                              <input
                                className={styles.input}
                                type="number"
                                step="0.1"
                                placeholder="Grams"
                                value={entryGrams}
                                onChange={(e) => setEntryGrams(e.target.value)}
                                disabled={isSubmitting}
                              />
                              <button
                                className={styles.button}
                                onClick={() => handleCreateEntry(meal.id)}
                                disabled={
                                  isSubmitting ||
                                  !entryGrams ||
                                  Number(entryGrams) <= 0
                                }
                              >
                                {isSubmitting ? "Adding..." : "Add Food"}
                              </button>
                              <button
                                className={styles.secondaryButton}
                                onClick={() => {
                                  setSelectedFood(null);
                                  setEntryGrams("");
                                }}
                                disabled={isSubmitting}
                              >
                                Back
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <button
                          className={styles.button}
                          onClick={() => setShowEntryForm(meal.id)}
                          disabled={isSubmitting}
                        >
                          + Add Food
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
