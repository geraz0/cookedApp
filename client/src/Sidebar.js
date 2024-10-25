import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUtensils,
  faBook,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import RecipeList from "./RecipeList";
import FullRecipe from "./FullRecipe";

const Sidebar = ({ onTabClick, recipes, searchQuery }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState("home"); // Track active tab

  const handleShowRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabClick(tab);
    setSelectedRecipe(null); // Reset selected recipe when switching tabs
  };

  return (
    <div className="sidebar">
      <div
        className={`tab ${activeTab === "home" ? "active" : ""}`}
        onClick={() => handleTabClick("home")}
      >
        <FontAwesomeIcon icon={faHome} size="2x" />
      </div>
      <div
        className={`tab ${activeTab === "ingredients" ? "active" : ""}`}
        onClick={() => handleTabClick("ingredients")}
      >
        <FontAwesomeIcon icon={faUtensils} size="2x" />
      </div>
      <div
        className={`tab ${activeTab === "recipes" ? "active" : ""}`}
        onClick={() => handleTabClick("recipes")}
      >
        <FontAwesomeIcon icon={faBook} size="2x" />
      </div>
      <div
        className={`tab ${activeTab === "instructions" ? "active" : ""}`}
        onClick={() => handleTabClick("instructions")}
      >
        <FontAwesomeIcon icon={faList} size="2x" />
      </div>

      {selectedRecipe ? (
        <FullRecipe recipe={selectedRecipe} />
      ) : (
        <RecipeList
          recipes={recipes}
          searchQuery={searchQuery}
          showRecipeDetails={handleShowRecipeDetails}
        />
      )}
    </div>
  );
};

export default Sidebar;
