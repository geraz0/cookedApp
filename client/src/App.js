import "./App.css";
import React, { useState } from "react";
import RecipeForm from "./recipeForm"; // Import the RecipeForm component
import Footer from "./footer";
import Sidebar from "./Sidebar"; // Import the Sidebar component

function App() {
  const [activeTab, setActiveTab] = useState('home'); // State to track active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app-container">
      <Sidebar onTabClick={handleTabClick} /> {/* Sidebar component */}
      <header className="app-header">
          <h1>Cooked</h1>
        </header>

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

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
