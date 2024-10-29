import React, { useState } from 'react';

const RecipeCard = ({ recipe, ingredients, onClick, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    onClick(); // Handle recipe selection when card is clicked
  };

  return (
    <div
      className={`recipe-card ${isSelected ? "selected" : ""}`}
      onClick={toggleExpanded}
      style={{
        border: isSelected ? "2px solid #007bff" : "1px solid #ccc",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
      }}
    >
      <h3>{recipe.recipe_name}</h3>
      <p>{recipe.description}</p>
      
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            maxWidth: "300px", // Set a max width for the image
            maxHeight: "200px", // Set a max height to maintain aspect ratio
            borderRadius: "8px",
            objectFit: "cover", // Crop if needed to fit dimensions
            marginBottom: "10px"
          }}
        />
      )}

      {/* Conditionally render ingredients and instructions */}
      {isExpanded && (
        <>
          <p><strong>Ingredients:</strong></p>
          <ul>
            {ingredients.map((ingredient, idx) => (
              <li key={idx}>
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>
          <p><strong>Instructions:</strong></p>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>
            {recipe.instructions}
          </pre>
        </>
      )}
    </div>
  );
};

export default RecipeCard;
