import "./App.css";
import React, { useState } from "react";
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
    setShowSidebar(false); // Close sidebar after selecting a tab
  };

  return (
    <div
      style={{
        backgroundImage: "url('/cottage.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex", // Ensure content fills the entire area
        flexDirection: "column",
      }}
    >
      <div>
        <div className="app-container">
          <header className="app-header">
            <img
              src="/Logo.png"
              alt="Cooked Logo"
              style={{ width: "100px", height: "auto" }}
            />
          </header>

          {/* Render Sidebar only when logged in */}
          {isLoggedIn && (
            <Sidebar
              onTabClick={handleTabClick}
              setShowSidebar={setShowSidebar}
              showSidebar={showSidebar}
            />
          )}

          {/* Main content container that shifts based on sidebar visibility */}
          <div className={`app-content ${showSidebar ? "content-shift" : ""}`}>
            {/* Render Login or Register views when not logged in */}
            {!isLoggedIn && !isRegisterView && (
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setIsRegisterView={setIsRegisterView}
              />
            )}
            {!isLoggedIn && isRegisterView && (
              <Register setIsRegistered={setIsLoggedIn} />
            )}

            {/* Render main content when logged in */}
            {isLoggedIn && (
              <>
                {activeTab === "cookbook" && <Cookbook />}
                {activeTab === "new recipe" && <RecipeForm />}
                {activeTab === "grocery list" && <GroceryList />}
              </>
            )}
          </div>

          {/* Footer content moved here */}
          <footer style={{ textAlign: "center" }}>
            <p>© 2024 Cooked. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
