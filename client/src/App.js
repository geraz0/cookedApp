import React, { useState } from "react";
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowSidebar(false); // Hide sidebar after selecting a tab
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsRegisterView(false);
    setActiveTab("cookbook"); // Navigate to Cookbook after successful login
  };

  const handleRegisterSuccess = () => {
    setIsRegisterView(false);
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
          <img
            src="/Logo.png"
            alt="Cooked Logo"
            style={{ width: "120px", height: "auto" }}
          />
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
    </div>
  );
}

export default App;
