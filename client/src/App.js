import "./App.css";
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import RecipeForm from "./recipeForm";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import RecipeList from "./RecipeList"; // Import RecipeList component

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch("https://your-lambda-function-url/recipes");
      if (response.ok) {
        const recipes = await response.json();
        return recipes;
      } else {
        console.error("Failed to fetch recipes:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  };

  const showRecipeDetails = (recipe) => {
    // Logic to show full recipe details, e.g., setting a modal or redirecting
    console.log("Selected recipe details:", recipe);
  };

  return (
    <div className="app-container">
      <header
        className="app-header"
        style={{
          textAlign: isLoggedIn ? "left" : "center",
          paddingLeft: isLoggedIn ? "80px" : "0px",
        }}
      >
        <img
          src="/Logo.png"
          alt="Cooked Logo"
          style={{ width: "140px", height: "auto" }}
        />
      </header>
      {!isLoggedIn && !isRegisterView && (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          setIsRegisterView={setIsRegisterView}
        />
      )}
      {!isLoggedIn && isRegisterView && (
        <Register setIsRegistered={setIsLoggedIn} />
      )}
      {isLoggedIn && (
        <>
          <Sidebar onTabClick={handleTabClick} fetchRecipes={fetchRecipes} />
          <div className="app-content">
            {activeTab === "home" && (
              <div>
                <h2>Welcome to Cooked Platform</h2>
                <p>Select a tab to get started!</p>
              </div>
            )}
            {activeTab === "ingredients" && <RecipeForm />}
            {activeTab === "recipes" && (
              <div>
                <h2>Recipes</h2>
                <input
                  type="text"
                  placeholder="Search by title, ingredient, or tag (e.g., #easy)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    marginBottom: "20px",
                    width: "100%",
                    padding: "10px",
                  }}
                />
                <RecipeList
                  fetchRecipes={fetchRecipes}
                  searchQuery={searchQuery}
                  showRecipeDetails={showRecipeDetails}
                />
              </div>
            )}
            {activeTab === "instructions" && (
              <div>
                <h2>Instructions</h2>
                <p>Upload or edit instructions for your recipes.</p>
              </div>
            )}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;
