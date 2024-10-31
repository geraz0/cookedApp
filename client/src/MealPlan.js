import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import FullRecipe from "./FullRecipe";

const MealPlan = ({ uid, ingredients, setLatestMealPlan, setActiveTab }) => {
  const [mealPlan, setMealPlan] = useState(null);
  const [mealPlanRecipes, setMealPlanRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);




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

// Function to get recipes for a particular meal plan
const fetchRecipesForMealPlan = async (mealPlanId) => {
  try {
    // Fetch all recipe IDs associated with this meal plan
    const response = await fetch(`/api/mealplans/${mealPlanId}/recipes`);
    if (!response.ok) {
      throw new Error("Failed to load recipes for meal plan");
    }

    const recipeIds = await response.json(); // Returns array of recipe_id

    // Use Promise.all to fetch details for each recipe concurrently
    const mealPlanRecipes = await Promise.all(
      recipeIds.map(async (recipe) => {
        const recipeResponse = await fetch(`/api/recipes/${recipe.recipe_id}`);
        if (!recipeResponse.ok) {
          throw new Error(`Failed to load recipe with ID ${recipe.recipe_id}`);
        }
        return await recipeResponse.json();
      })
    );

    // Set all fetched recipes together in state
    setMealPlanRecipes(mealPlanRecipes);
  } catch (error) {
    console.error("Error loading recipes for meal plan:", error);
  }
};



const createMealPlan = async () => {
  try {
    const response = await fetch('/api/mealplans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: uid }),
    });

    if (response.ok) {
      const newMealPlan = await response.json();
      setMealPlan(newMealPlan); // Update local state
      setLatestMealPlan(newMealPlan);
      setActiveTab("cookbook"); // Redirect to Cookbook // Update App's state
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

    // Function to remove a recipe from the meal plan
    const handleRemoveRecipe = async (recipeId) => {
      if (!mealPlan) return;
  
      try {
        const response = await fetch(`/api/mealplans/${mealPlan.meal_plan_id}/recipes/${recipeId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // Remove the recipe from the mealPlanRecipes state
          setMealPlanRecipes((prevRecipes) =>
            prevRecipes.filter((recipe) => recipe.recipe_id !== recipeId)
          );
        } else {
          console.error("Failed to remove recipe from meal plan:", response.statusText);
        }
      } catch (error) {
        console.error("Error removing recipe from meal plan:", error);
      }
    };

  // Function to toggle recipe expansion for detailed view
  const toggleRecipeDetails = (recipe) => {
    setSelectedRecipe(selectedRecipe === recipe ? null : recipe);
  };

    // Fetch the latest open meal plan on component mount
    useEffect(() => {
      fetchLatestMealPlan();
    }, []);
  
    // Update recipes when meal plan changes
    useEffect(() => {
      if (mealPlan) {
        fetchRecipesForMealPlan(mealPlan.meal_plan_id); // Fetch recipes by meal plan ID
      }
    }, [mealPlan]);

  return (
    <div>
      <h2>Meal Plan</h2>
      {mealPlan ? (
        <button onClick={finishMealPlan}
         style={{
                  backgroundColor: "#FF595E",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
        >Clear Meal Plan</button>
      ) : (
        <button onClick={createMealPlan}
        style={{
                  backgroundColor: "#588157",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}>Start New Meal Plan
        
        </button>
      )}

      <div className="recipe-list">
        {mealPlanRecipes.map((recipe) => {
          const recipeIngredients = ingredients.find(
            (item) => item.recipe_id === recipe.recipe_id
          )?.ingredients || [];

          return (
            <div
              key={recipe.recipe_id}
              className="recipe-card"
              onClick={() => toggleRecipeDetails(recipe)}
               style={{
              background: "rgba(255, 240, 230, 0.65)",
              width: "100%",
              maxWidth: "150px",
              minHeight: "250px", // Ensures each card has the same minimum height
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)"
      }}
            >
              <h3>{recipe.recipe_name}</h3>
              <p>{recipe.description}</p>
              
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.recipe_name}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    marginBottom: "10px"
                  }}
                />
              )}

              {/* Remove from Meal Plan Button */}
              <button
                onClick={() => handleRemoveRecipe(recipe.recipe_id)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Remove from Meal Plan
              </button>

              {/* Show detailed view of ingredients and instructions when expanded */}
              {selectedRecipe === recipe && (
                <div style={{ marginTop: "10px" }}>
                  <p><strong>Ingredients:</strong></p>
                  <ul>
                    {recipeIngredients.map((ingredient, idx) => (
                      <li key={idx}>
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Instructions:</strong></p>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>
                    {recipe.instructions}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlan;
