import React from "react";

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <img src={recipe.image} alt={recipe.title} style={{ width: "100%" }} />
      <h3>{recipe.title}</h3>
    </div>
  );
};

export default RecipeCard;
