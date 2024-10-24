import "./App.css";
import React from "react";
import RecipeForm from "./recipeForm"; // Import the RecipeForm component
import Footer from "./footer";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Cooked Platform</h1> 
      </header>
      <div className="app-content">
      <RecipeForm /> {/* Render the form component */}
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
