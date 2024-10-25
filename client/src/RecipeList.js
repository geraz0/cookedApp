import React from "react";
import RecipeCard from "./RecipeCard";

const RecipeList = ({ recipes, searchQuery, showRecipeDetails }) => {
  const filteredRecipes = recipes.filter((recipe) => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(query) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(query)
      ) ||
      recipe.instructions.toLowerCase().includes(query) ||
      recipe.tags?.some((tag) => tag.toLowerCase() === query)
    );
  });

  return (
    <div className="recipe-list">
      {filteredRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onClick={() => showRecipeDetails(recipe)} />
      ))}
    </div>
  );
};

export default RecipeList;
