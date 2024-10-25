import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";

const RecipeList = ({ fetchRecipes, showRecipeDetails }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      const response = await fetchRecipes();
      setRecipes(response);
    };

    fetchAllRecipes();
  }, [fetchRecipes]);

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onClick={showRecipeDetails} />
      ))}
    </div>
  );
};

export default RecipeList;
