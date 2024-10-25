import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUtensils,
  faBook,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import RecipeList from "./RecipeList";  // Import the RecipeList component
import FullRecipe from "./FullRecipe";  // Import FullRecipe component for showing recipe details

const Sidebar = ({ onTabClick, fetchRecipes }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);  // State to track the selected recipe
  const [showRecipes, setShowRecipes] = useState(false);  // State to control when to show recipe cards

  // Function to handle showing recipe details
  const handleShowRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);  // Set the selected recipe to display full details
  };

  // Function to handle the "recipes" tab click
  const handleRecipesClick = () => {
    onTabClick("recipes");
    setShowRecipes(true);  // Show the recipe list
    setSelectedRecipe(null);  // Reset selected recipe when clicking the tab
  };

  return (
    <div className="sidebar">
      <div className="tab" onClick={() => onTabClick("home")}>
        <FontAwesomeIcon icon={faHome} size="2x" />
      </div>
      <div className="tab" onClick={() => onTabClick("ingredients")}>
        <FontAwesomeIcon icon={faUtensils} size="2x" />
      </div>
      <div className="tab" onClick={handleRecipesClick}>
        <FontAwesomeIcon icon={faBook} size="2x" />
      </div>
      <div className="tab" onClick={() => onTabClick("instructions")}>
        <FontAwesomeIcon icon={faFileAlt} size="2x" />
      </div>

      {/* Render recipe list if "recipes" tab is clicked and no specific recipe is selected */}
      {showRecipes && !selectedRecipe && (
        <RecipeList fetchRecipes={fetchRecipes} showRecipeDetails={handleShowRecipeDetails} />
      )}

      {/* Render full recipe details if a recipe is selected */}
      {selectedRecipe && <FullRecipe recipe={selectedRecipe} />}
    </div>
  );
};

export default Sidebar;
