import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import RecipeCard from "./RecipeCard";
import FullRecipe from "./FullRecipe";

const Cookbook = ({ recipes, ingredients }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const filteredRecipes = recipes
    ? recipes.filter((recipe) => {
        const query = searchQuery.toLowerCase();
        return (
          recipe.title?.toLowerCase().includes(query) ||
          recipe.ingredients?.some((ingredient) =>
            `${ingredient.name} ${ingredient.quantity} ${ingredient.unit}`
              .toLowerCase()
              .includes(query)
          ) ||
          recipe.instructions?.toLowerCase().includes(query) ||
          recipe.tags?.some((tag) => tag.toLowerCase() === query)
        );
      })
    : [];

  return (
    <div className="cookbook-section">
      <h2>Cookbook</h2>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", position: "relative" }}>
        <FontAwesomeIcon
          icon={faSearch}
          style={{ position: "absolute", left: "10px", color: "#333", fontSize: "16px"}}
        />
        <input
          type="text"
          placeholder="Search by title, ingredient, or tag (e.g., #easy)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "10px 10px 10px 30px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
        />
      </div>

      {selectedRecipe ? (
        <FullRecipe recipe={selectedRecipe} />
      ) : (
        <div className="recipe-list" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "20px",
          alignItems: "start", // Ensures cards align at the top of each row
        }}>
          {filteredRecipes.map((recipe) => {
            const recipeIngredients = ingredients.find((item) => item.recipe_id === recipe.recipe_id);
            return (
              <RecipeCard
                key={recipe.recipe_id}
                recipe={recipe}
                ingredients={recipeIngredients?.ingredients || []}
                onClick={handleRecipeSelect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cookbook;
