import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import RecipeForm from "./RecipeForm";
import Sidebar from "./Sidebar";
import Cookbook from "./Cookbook";
import GroceryList from "./GroceryList";
import MealPlan from "./MealPlan";

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("uid") ? "cookbook" : "home";
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("uid"));
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [uid, setUid] = useState(localStorage.getItem("uid") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [latestMealPlan, setLatestMealPlan] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);

  useEffect(() => {
    if (uid) {
      fetchRecipes(uid);
      fetchIngredients(uid);
      fetchAllRecipes();
      fetchLatestMealPlan(uid);
    }
  }, [uid]);

  useEffect(() => {
    if (uid) {
      fetchIngredients(uid); // Refresh ingredients when recipes change
    }
  }, [recipes]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowSidebar(false);
  };

  const handleLoginSuccess = (userId, userName) => {
    setIsLoggedIn(true);
    setUid(userId);
    setUsername(userName);
    localStorage.setItem("username", userName);
    localStorage.setItem("uid", userId);
    setIsRegisterView(false);
    setActiveTab("mealplan");
  };

  const handleRegisterSuccess = () => {
    setIsRegisterView(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUid(null);
    setUsername("");
    localStorage.removeItem("uid");
    localStorage.removeItem("username");
    setActiveTab("home");
  };

  const handleAddRecipe = async (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const fetchRecipes = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/recipes`);
      if (response.ok) {
        const userRecipes = await response.json();
        setRecipes(userRecipes);
      } else {
        console.error("Failed to load recipes:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  };

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch(`/api/recipes`);
      if (response.ok) {
        const allTheRecipes = await response.json();
        setAllRecipes(allTheRecipes);
      } else {
        console.error("Failed to load recipes:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  };

  const fetchIngredients = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/ingredients`);
      if (response.ok) {
        const userIngredients = await response.json();

        const groupedIngredients = userIngredients.reduce((acc, ingredient) => {
          const { recipe_id, name, unit, quantity } = ingredient;
          if (!acc[recipe_id]) {
            acc[recipe_id] = [];
          }
          acc[recipe_id].push({ name, unit, quantity });
          return acc;
        }, {});

        const ingredientsByRecipe = Object.keys(groupedIngredients).map((recipeId) => ({
          recipe_id: parseInt(recipeId, 10),
          ingredients: groupedIngredients[recipeId],
        }));

        setIngredients(ingredientsByRecipe);
      } else {
        console.error("Failed to load ingredients:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading ingredients:", error);
    }
  };

  const fetchLatestMealPlan = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/mealplans/open`);
      if (response.ok) {
        const data = await response.json();
        setLatestMealPlan(data);
      } else if (response.status === 404) {
        setLatestMealPlan(null); // No open meal plan found
      } else {
        console.error("Failed to fetch latest meal plan:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching latest meal plan:", error);
    }
  };
  

  

  useEffect(() => {
    const userId = localStorage.getItem("uid"); // Assuming the user ID is stored in local storage
    if (userId) {
      fetchLatestMealPlan(userId);
    }
  }, []);

  const toggleSidebar = () => {
    setShowSidebar((prevShowSidebar) => !prevShowSidebar);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/cottage.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "120vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="app-container">
        <header className="app-header">
          <img
            src="/Logo.png"
            alt="Cooked Logo"
            className="header-logo"
            style={{ width: "120px", height: "auto" }}
          />
          {isLoggedIn && (
            <div className="welcome-container">
              <span className="welcome-text">Welcome, {username}!</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </header>

        {isLoggedIn && (
          <Sidebar onTabClick={handleTabClick} showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        )}

        <div className="app-content">
          {!isLoggedIn && !isRegisterView && (
            <Login setIsLoggedIn={handleLoginSuccess} setIsRegisterView={setIsRegisterView} />
          )}
          {!isLoggedIn && isRegisterView && <Register setIsRegistered={handleRegisterSuccess} />}

          {isLoggedIn && (
            <>
              {activeTab === "cookbook" && (
                <Cookbook recipes={recipes} ingredients={ingredients} setRecipes={setRecipes} currentMealPlanId={latestMealPlan?.meal_plan_id} allRecipes={allRecipes}/>
              )}
              {activeTab === "new recipe" && <RecipeForm onAddRecipe={handleAddRecipe} uid={uid} />}
              {activeTab === "mealplan" && <MealPlan latestMealPlan={latestMealPlan} uid={uid} onUpdateMealPlans={fetchLatestMealPlan} setLatestMealPlan={setLatestMealPlan} ingredients={ingredients}/>}
              {activeTab === "grocery list" && <GroceryList />}
            </>
          )}
        </div>

        <footer style={{ textAlign: "center" }}>
          <p>© 2024 Cooked. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
