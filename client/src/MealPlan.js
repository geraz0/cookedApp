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

    // Add confirmation popup
    const confirmClear = window.confirm("Are you sure you want to clear all recipes from your meal plan?");
    
    if (!confirmClear) return;

    try {
      // First, remove all recipes from the meal plan
      const recipePromises = mealPlanRecipes.map(recipe => 
        fetch(`/api/mealplans/${mealPlan.meal_plan_id}/recipes/${recipe.recipe_id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(recipePromises);

      // Then close the meal plan
      const response = await fetch(`/api/mealplans/${mealPlan.meal_plan_id}/close`, {
        method: 'PUT',
      });

      if (response.ok) {
        setMealPlan(null); // Reset meal plan in state
        setMealPlanRecipes([]); // Clear all recipes at once
        setActiveTab("cookbook"); // Switch to cookbook tab
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
      <h2 style={{
        fontSize: "2.5em",
        color: "#2F4858",
        textAlign: "center",
        marginBottom: "30px",
        fontWeight: "bold",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)"
      }}>Meal Plan</h2>
      
      {mealPlan ? (
        <div style={{ textAlign: "center" }}>
          <button 
            onClick={finishMealPlan}
            style={{
              backgroundColor: "#FF595E",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "40px",
              fontSize: "1.1em",
              fontWeight: "500",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#ff4146";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#FF595E";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            Clear Meal Plan
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <button 
            onClick={createMealPlan}
            style={{
              backgroundColor: "#588157",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "40px",
              fontSize: "1.1em",
              fontWeight: "500",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#4d7049";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#588157";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            Start New Meal Plan
          </button>
        </div>
      )}

      <div className="recipe-list" style={{ 
        marginTop: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "25px",
        padding: "20px"
      }}>
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
          maxWidth: "200px",
          minHeight: "250px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          backgroundColor: "#fff",
          textAlign: "center"
        }}
        onMouseEnter={(e) => e.currentTarget.style.border = "3px solid #FB8B24"}
        onMouseLeave={(e) => e.currentTarget.style.border = "1px solid #ccc"}
      >
        <h3 style={{ 
          margin: "0 0 10px 0",
          width: "100%",
          textAlign: "center"
        }}>{recipe.recipe_name}</h3>
        
        <p style={{ 
          textAlign: "center",
          width: "100%"
        }}>{recipe.description}</p>
        
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveRecipe(recipe.recipe_id);
          }}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
            width: "100%"
          }}
        >
          Remove from Meal Plan
        </button>

        {selectedRecipe === recipe && (
          <div style={{ 
            marginTop: "10px",
            width: "100%",
            textAlign: "center"
          }}>
            <p><strong>Ingredients:</strong></p>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0
            }}>
              {recipeIngredients.map((ingredient, idx) => (
                <li key={idx} style={{ margin: "5px 0" }}>
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
            <p><strong>Instructions:</strong></p>
            <pre style={{ 
              whiteSpace: "pre-wrap", 
              fontSize: "16px",
              textAlign: "center",
              fontFamily: "inherit"
            }}>
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
