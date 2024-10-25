import React from "react";

const RecipeCard = ({ recipe, onClick }) => {
  const handleClick = () => {
    onClick(recipe); // Trigger the detail view for the clicked recipe
  };

  return (
    <div className="recipe-card" onClick={handleClick}>
      <img src={recipe.image} alt={recipe.title} style={{ width: "100%" }} />
      <h3>{recipe.title}</h3>
    </div>
  );
};

export default RecipeCard;
