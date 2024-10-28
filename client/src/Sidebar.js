import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUtensils,
  faBook,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ onTabClick, setShowSidebar, showSidebar }) => {
  const [activeTab, setActiveTab] = useState("");

  const handleMenuClick = () => {
    setShowSidebar(!showSidebar); // Toggle sidebar visibility
    setActiveTab((prevTab) => (prevTab === "menu" ? "" : "menu")); // Toggle menu tab active state
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabClick(tab);
    setShowSidebar(false); // Close menu after selecting a tab
  };

  return (
    <div className="sidebar">
      {/* Menu Tab */}
      <div
        className={`tab ${activeTab === "menu" ? "active" : ""}`}
        onClick={handleMenuClick}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </div>

      {/* Other Tabs, only visible when isMenuOpen is true */}
      <div className={`tabs-container ${showSidebar ? "open" : "closed"}`}>
        <div
          className={`tab ${activeTab === "new recipe" ? "active" : ""}`}
          onClick={() => handleTabClick("new recipe")}
        >
          <FontAwesomeIcon icon={faUtensils} size="2x" />
        </div>
        <div
          className={`tab ${activeTab === "cookbook" ? "active" : ""}`}
          onClick={() => handleTabClick("cookbook")}
        >
          <FontAwesomeIcon icon={faBook} size="2x" />
        </div>
        <div
          className={`tab ${activeTab === "grocery list" ? "active" : ""}`}
          onClick={() => handleTabClick("grocery list")}
        >
          <FontAwesomeIcon icon={faList} size="2x" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
