import React from "react";

const FullRecipe = ({ recipe, ingredients, onDelete, onBack, currentMealPlanId }) => {
  
  const handleAddToMealPlan = async () => {
    if (!currentMealPlanId) {
      console.error("No current meal plan found.");
      return;
    }

    console.log("currentMealPlanId:", currentMealPlanId);
    console.log("recipe.recipe_id:", recipe.recipe_id);

    try {
      const response = await fetch(`/api/mealplans/${currentMealPlanId}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipe_id: recipe.recipe_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to add recipe to meal plan");
      }

      alert("Recipe added to meal plan successfully!");
    } catch (error) {
      console.error("Error adding recipe to meal plan:", error);
      alert("There was an error adding this recipe to the meal plan.");
    }
};


  return (
    <div className="full-recipe" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* Button Container */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            backgroundColor: "#333",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Back
        </button>

        {/* Add to Meal Plan Button */}
        <button
          onClick={handleAddToMealPlan}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Add to Current Meal Plan
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Delete
        </button>
      </div>

      {/* Display Recipe Content */}
      <h2>{recipe.recipe_name}</h2>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.recipe_name}
          style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
        />
      )}
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {ingredients.map((ingredient, idx) => (
          <li key={idx}>
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <pre style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>
        {recipe.instructions}
      </pre>
    </div>
  );
};

export default FullRecipe;
