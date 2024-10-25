import "./App.css";
import React, { useState } from "react";
import Login from './Login';
import Register from './Register'; // Import the Register component
import RecipeForm from "./recipeForm"; // Import the RecipeForm component
import Footer from "./footer";
import Sidebar from "./Sidebar"; // Import the Sidebar component

function App() {
  const [activeTab, setActiveTab] = useState('home'); // State to track active tab
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
  const [isRegisterView, setIsRegisterView] = useState(false); // Track if register view is active

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Step: Add fetchRecipes function to fetch recipes from the backend
  const fetchRecipes = async () => {
    try {
      const response = await fetch("https://your-lambda-function-url/recipes"); // Replace with actual Lambda URL
      if (response.ok) {
        const recipes = await response.json();
        return recipes;  // Return the list of recipes
      } else {
        console.error("Failed to fetch recipes:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  };

  return (
    <div className="app-container">
      {/* Header should always be visible, with conditional styling */}
      <header 
        className="app-header"
        style={{ 
          textAlign: isLoggedIn ? 'left' : 'center', // Center the text when not logged in
          paddingLeft: isLoggedIn ? '80px' : '0px' // Space for sidebar when logged in
        }}
      >
        {/* Replace the text with an image */}
        <img 
          src="/Logo.png"  // Updated path to the image
          alt="Cooked Logo"
          style={{ width: '140px', height: 'auto' }}  // Adjust the size as needed
        />
      </header>

      {/* Conditionally render Login, Register, or main content */}
      {!isLoggedIn && !isRegisterView && <Login setIsLoggedIn={setIsLoggedIn} setIsRegisterView={setIsRegisterView} />} {/* Show Login if not logged in */}
      {!isLoggedIn && isRegisterView && <Register setIsRegistered={setIsLoggedIn} />} {/* Show Register if Register view is active */}

      {isLoggedIn && (
        <>
          <Sidebar onTabClick={handleTabClick} fetchRecipes={fetchRecipes} /> {/* Pass fetchRecipes to Sidebar */}
          <div className="app-content">
            {/* Conditionally render content based on the active tab */}
            {activeTab === 'home' && (
              <div>
                <h2>Welcome to Cooked Platform</h2>
                <p>Select a tab to get started!</p>
              </div>
            )}
            {activeTab === 'ingredients' && <RecipeForm />} {/* Show RecipeForm for ingredients */}
            {activeTab === 'recipes' && (
              <div>
                <h2>Recipes</h2>
                <p>Here you can manage your recipes.</p>
              </div>
            )}
            {activeTab === 'instructions' && (
              <div>
                <h2>Instructions</h2>
                <p>Upload or edit instructions for your recipes.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
