// App.js
import "./App.css";
import React, { useState } from "react";
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
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar((prevShowSidebar) => !prevShowSidebar);
  };

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
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div className="app-container">
        <header className="app-header">
          <img src="/Logo.png" alt="Cooked Logo" style={{ width: "120px", height: "auto" }} />
        </header>

        {/* Render Sidebar only when logged in */}
        {isLoggedIn && (
          <Sidebar onTabClick={handleTabClick} />
        )}

        {/* Render Login or Register views when not logged in */}
        {!isLoggedIn && !isRegisterView && (
          <Login setIsLoggedIn={setIsLoggedIn} setIsRegisterView={setIsRegisterView} />
        )}
        {!isLoggedIn && isRegisterView && <Register setIsRegistered={setIsLoggedIn} />}

        {/* Render main content when logged in */}
        {isLoggedIn && (
          <div className={`app-content ${showSidebar ? "content-shift" : ""}`}>
            {activeTab === "cookbook" && <Cookbook />}
            {activeTab === "new recipe" && <RecipeForm />}
            {activeTab === "grocery list" && <GroceryList />}
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

export default App;
