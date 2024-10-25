import "./App.css";
import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import RecipeForm from "./recipeForm";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import RecipeList from "./RecipeList";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]); // State to hold fetched recipes

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecipes();
    }
  }, [isLoggedIn]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch("https://your-lambda-function-url/recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data); // Set fetched recipes
      } else {
        console.error("Failed to fetch recipes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
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
          style={{ width: "120px", height: "auto" }}
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
          <Sidebar
            onTabClick={handleTabClick}
            recipes={recipes}
            searchQuery={searchQuery}
          />
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
                <RecipeList recipes={recipes} searchQuery={searchQuery} />
              </div>
            )}
            {activeTab === "instructions" && (
              <div>
                <h2>Grocery List</h2>
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
