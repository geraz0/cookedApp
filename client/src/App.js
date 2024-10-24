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

  return (
    <div className="app-container">
      {/* Header should always be visible, with conditional styling */}
      <header 
        className="app-header"
        style={{ 
          textAlign: isLoggedIn ? 'left' : 'center', // Center the text when not logged in
          paddingLeft: isLoggedIn ? '240px' : '0px' // Space for sidebar when logged in
        }}
      >
        <h1>Cooked</h1>
      </header>

      {/* Conditionally render Login, Register, or main content */}
      {!isLoggedIn && !isRegisterView && <Login setIsLoggedIn={setIsLoggedIn} setIsRegisterView={setIsRegisterView} />} {/* Show Login if not logged in */}
      {!isLoggedIn && isRegisterView && <Register setIsRegistered={setIsLoggedIn} />} {/* Show Register if Register view is active */}

      {isLoggedIn && (
        <>
          <Sidebar onTabClick={handleTabClick} /> {/* Sidebar component */}
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
