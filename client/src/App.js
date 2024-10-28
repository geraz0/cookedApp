import React, { useState } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import RecipeForm from "./recipeForm";
import Sidebar from "./Sidebar";
import Cookbook from "./Cookbook";
import GroceryList from "./GroceryList";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowSidebar(false);
  };

  // Handle login success by setting the main tabs view
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsRegisterView(false); // Ensure view resets to login if user logs out
  };

  // Handle registration success by returning to the login screen
  const handleRegisterSuccess = () => {
    setIsRegisterView(false); // Switch back to login after registering
  };

  return (
    <div className="app-container" style={appStyle}>
      <header className="app-header">
        <img src="/Logo.png" alt="Cooked Logo" style={logoStyle} />
      </header>

      {isLoggedIn && (
        <Sidebar
          onTabClick={handleTabClick}
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
        />
      )}

      <div className={`app-content ${showSidebar ? "content-shift" : ""}`}>
        {!isLoggedIn && !isRegisterView && (
          <Login setIsLoggedIn={handleLoginSuccess} setIsRegisterView={setIsRegisterView} />
        )}
        {!isLoggedIn && isRegisterView && (
          <Register setIsRegistered={handleRegisterSuccess} />
        )}

        {isLoggedIn && (
          <>
            {activeTab === "cookbook" && <Cookbook />}
            {activeTab === "new recipe" && <RecipeForm />}
            {activeTab === "grocery list" && <GroceryList />}
          </>
        )}
      </div>

      <footer style={{ textAlign: "center" }}>
        <p>© 2024 Cooked. All rights reserved.</p>
      </footer>
    </div>
  );
}

const appStyle = {
  backgroundImage: "url('/cottage.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

const logoStyle = {
  width: "100px",
  height: "auto",
};

export default App;
