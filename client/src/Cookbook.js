import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import RecipeCard from "./RecipeCard";

const Cookbook = ({ recipes, ingredients }) => {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle creating the grocery list
  const onBuildGroceryList = () => {
    console.log("Building grocery list with selected recipes:", selectedRecipes);
    // Additional functionality for creating a grocery list goes here
  };

  const handleRecipeSelect = (recipeId) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(recipeId)
        ? prevSelected.filter((id) => id !== recipeId)
        : [...prevSelected, recipeId]
    );
  };

  // Filter recipes based on search query
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
            color: "#333",
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
            padding: "10px 10px 10px 30px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>


      <div className="recipe-list">
  {filteredRecipes.map((recipe) => {
    const recipeIngredients = ingredients.find(
      (item) => item.recipe_id === recipe.recipe_id
    );

    return (
      <RecipeCard
        key={recipe.recipe_id}
        recipe={recipe}
        ingredients={recipeIngredients?.ingredients || []}  
        onClick={() => handleRecipeSelect(recipe.recipe_id)}
        isSelected={selectedRecipes.includes(recipe.recipe_id)}
      />
    );
  })}
</div>



      <button onClick={onBuildGroceryList} className="build-grocery-button">
        Build Grocery List
      </button>
    </div>
  );
};

export default Cookbook;
