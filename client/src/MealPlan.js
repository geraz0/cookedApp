import React, { useState, useEffect } from "react";

const MealPlan = ({ uid }) => {
  const [mealPlan, setMealPlan] = useState(null);

  // Fetch the latest open meal plan on component mount
  useEffect(() => {
    fetchLatestMealPlan();
  }, []);

  // Function to fetch the latest open meal plan
  const fetchLatestMealPlan = async () => {
    try {
      const response = await fetch(`/api/users/${uid}/mealplans/open`);
      if (response.ok) {
        const data = await response.json();
        setMealPlan(data);
      } else if (response.status === 404) {
        setMealPlan(null); // No open meal plan found
      } else {
        console.error("Failed to fetch the latest meal plan:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching the latest meal plan:", error);
    }
  };

  // Function to create a new meal plan
  const createMealPlan = async () => {
    try {
      const response = await fetch('/api/mealplans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: uid }),
      });

      if (response.ok) {
        const newMealPlan = await response.json();
        setMealPlan(newMealPlan); // Update the state immediately to reflect the new plan
      } else {
        console.error("Failed to create meal plan:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating meal plan:", error);
    }
  };

  // Function to finish the current meal plan
  const finishMealPlan = async () => {
    if (!mealPlan) return;

    try {
      const response = await fetch(`/api/mealplans/${mealPlan.meal_plan_id}/close`, {
        method: 'PUT',
      });

      if (response.ok) {
        setMealPlan(null); // Reset meal plan in state
      } else {
        console.error("Failed to finish meal plan:", response.statusText);
      }
    } catch (error) {
      console.error("Error finishing meal plan:", error);
    }
  };

  return (
    <div>
      {mealPlan ? (
        <button onClick={finishMealPlan}>Finish Meal Plan</button>
      ) : (
        <button onClick={createMealPlan}>Start New Meal Plan</button>
      )}
    </div>
  );
};

export default MealPlan;
