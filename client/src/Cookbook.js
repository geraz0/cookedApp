import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import RecipeCard from "./RecipeCard";

const Cookbook = ({ recipes, onBuildGroceryList }) => {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRecipeSelect = (recipeId) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(recipeId)
        ? prevSelected.filter((id) => id !== recipeId)
        : [...prevSelected, recipeId]
    );
  };

  // Filter recipes based on search query
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
    <div className="cookbook-section">
      <h2>Cookbook</h2>

      {/* Search Bar with Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            position: "absolute",
            left: "10px",
            color: "#333", // Dark gray, almost black
            fontSize: "16px",
            paddingBottom: "15px",
          }}
        />
        <input
          type="text"
          placeholder="Search by title, ingredient, or tag (e.g., #easy)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px 10px 10px 30px", // Add left padding for the icon space
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      <div className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => handleRecipeSelect(recipe.id)}
            isSelected={selectedRecipes.includes(recipe.id)}
          />
        ))}
      </div>

      <button
        onClick={() => onBuildGroceryList(selectedRecipes)}
        className="build-grocery-button"
      >
        Build Grocery List
      </button>
    </div>
  );
};

export default Cookbook;
