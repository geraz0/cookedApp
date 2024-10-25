import React from "react";

const FullRecipe = ({ recipe }) => {
  return (
    <div className="full-recipe">
      <img src={recipe.image} alt={recipe.title} style={{ width: "100%" }} />
      <h2>{recipe.title}</h2>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{`${ingredient.quantity} ${ingredient.unit} of ${ingredient.name}`}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default FullRecipe;
