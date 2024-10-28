import React from 'react';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
      <p><strong>Ingredients:</strong></p>
      <ul>
        {recipe.ingredients.map((ingredient, idx) => (
          <li key={idx}>
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      <p><strong>Instructions:</strong> {recipe.instructions}</p>
      {recipe.image && <img src={URL.createObjectURL(recipe.image)} alt={recipe.title} />}
    </div>
  );
};

export default RecipeCard;
