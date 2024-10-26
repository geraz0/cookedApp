// RecipeCard.js
import React from "react";

const RecipeCard = ({ recipe, onClick, isSelected, onSelect }) => {
  return (
    <div
      className={`recipe-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="recipe-select-checkbox"
      />
      <img src={recipe.image} alt={recipe.title} style={{ width: "100%" }} />
      <h3>{recipe.title}</h3>
    </div>
  );
};

export default RecipeCard;
