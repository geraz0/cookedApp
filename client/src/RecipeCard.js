import React from 'react';

const RecipeCard = ({ recipe, ingredients, onClick }) => {
  return (
    <div
      className="recipe-card"
      onClick={() => onClick(recipe, ingredients)}
      style={{
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
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        transition: "border 0.3s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.border = "2px solid #007bff"}
      onMouseLeave={(e) => e.currentTarget.style.border = "1px solid #ccc"}
    >
      <h3 style={{ margin: "0 0 10px 0" }}>{recipe.recipe_name}</h3>
      <p style={{ flex: "1", overflow: "hidden", textOverflow: "ellipsis" }}>{recipe.description}</p>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            maxHeight: "150px",
            borderRadius: "8px",
            objectFit: "cover",
            marginTop: "10px"
          }}
        />
      )}
    </div>
  );
};

export default RecipeCard;
