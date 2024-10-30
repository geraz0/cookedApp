import React from "react";

const FullRecipe = ({ recipe, ingredients, onDelete, onBack }) => {
  return (
    <div className="full-recipe" style={{ position: "relative" }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "#333",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Back
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>

      {/* Display Recipe Title */}
      <h2>{recipe.recipe_name}</h2>

      {/* Display Recipe Image */}
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.recipe_name}
          style={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}
        />
      )}
      
      {/* Display Recipe Description */}
      <p>{recipe.description}</p>

      {/* Display Ingredients List */}
      <h3>Ingredients</h3>
        <ul>
            {ingredients.map((ingredient, idx) => (
              <li key={idx}>
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>

      {/* Display Instructions */}
      <h3>Instructions</h3>
      <pre style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>
            {recipe.instructions}
          </pre>
    </div>
  );
};

export default FullRecipe;
