import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import RecipeForm from "./RecipeForm";
import Sidebar from "./Sidebar";
import Cookbook from "./Cookbook";
import GroceryList from "./GroceryList";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [uid, setUid] = useState(localStorage.getItem("uid") || null); // Initialize with localStorage
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [recipes, setRecipes] = useState([]);

  // Update login status based on uid presence in localStorage
  useEffect(() => {
    if (uid) {
      setIsLoggedIn(true);
      fetchRecipes(uid); // Fetch recipes on component mount or login
    }
  }, [uid]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowSidebar(false);
  };

  //handle login and set uid and username in localstorage
  const handleLoginSuccess = (userId, userName) => {
    setIsLoggedIn(true);
    setUid(userId);
    setUsername(userName);
    localStorage.setItem("username", userName)
    localStorage.setItem("uid", userId); 
    setIsRegisterView(false);
    setActiveTab("cookbook");
  };

  const handleRegisterSuccess = () => {
    setIsRegisterView(false);
  };

  //logout and clear uid and username from local storage
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUid(null);
    setUsername("");
    localStorage.removeItem("uid"); 
    localStorage.removeItem("username"); 
    setActiveTab("home");
  };

  //add new recipe to working recipes in the app
  const handleAddRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

   //get recipes for the logged-in user
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
          <img src="/Logo.png" alt="Cooked Logo" style={{ width: "120px", height: "auto" }} />
          {isLoggedIn && (
            <div>
              <span>Welcome, {username}!</span>
              <button onClick={handleLogout} style={{ marginLeft: "20px" }}>Logout</button>
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
          {!isLoggedIn && isRegisterView && (
            <Register setIsRegistered={handleRegisterSuccess} />
          )}

          {isLoggedIn && (
            <>
              {activeTab === "cookbook" && <Cookbook recipes={recipes}/>}
              {activeTab === "new recipe" && <RecipeForm onAddRecipe={handleAddRecipe} uid={uid}/>}
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
