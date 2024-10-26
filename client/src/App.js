// App.js
import "./App.css";
import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import RecipeForm from "./RecipeForm";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import Cookbook from "./Cookbook";
import GroceryList from "./GroceryList";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [groceryItems, setGroceryItems] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecipes();
    }
  }, [isLoggedIn]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("https://your-lambda-function-url/recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        console.error("Failed to fetch recipes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const buildGroceryList = async (selectedRecipeIds) => {
    const ingredientMap = {};

    for (const recipeId of selectedRecipeIds) {
      try {
        const response = await fetch(`https://your-lambda-function-url/ingredients?recipeId=${recipeId}`);
        if (response.ok) {
          const ingredients = await response.json();
          ingredients.forEach(({ name, quantity, unit }) => {
            if (ingredientMap[name]) {
              ingredientMap[name].quantity += quantity;
            } else {
              ingredientMap[name] = { quantity, unit };
            }
          });
        } else {
          console.error("Failed to fetch ingredients for recipe:", recipeId);
        }
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    }

    setGroceryItems(
      Object.entries(ingredientMap).map(([name, { quantity, unit }]) => ({
        name,
        quantity,
        unit,
      }))
    );
    setActiveTab("grocery list");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/Logo.png" alt="Cooked Logo" style={{ width: "120px", height: "auto" }} />
      </header>
      {!isLoggedIn && !isRegisterView && (
        <Login setIsLoggedIn={setIsLoggedIn} setIsRegisterView={setIsRegisterView} />
      )}
      {!isLoggedIn && isRegisterView && <Register setIsRegistered={setIsLoggedIn} />}
      {isLoggedIn && (
        <>
          <Sidebar onTabClick={handleTabClick} recipes={recipes} />
          <div className="app-content">
            {activeTab === "cookbook" && (
              <Cookbook
                recipes={recipes}
                searchQuery={searchQuery}
                onBuildGroceryList={buildGroceryList}
              />
            )}
            {activeTab === "new recipe" && <RecipeForm />}
            {activeTab === "grocery list" && <GroceryList groceryItems={groceryItems} />}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;
