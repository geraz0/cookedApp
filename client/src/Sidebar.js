import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faPenToSquare,
  faBook,
  faUtensils,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ onTabClick, showSidebar, toggleSidebar }) => {
  const [activeTab, setActiveTab] = useState("");

  const handleMenuClick = () => {
    toggleSidebar();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabClick(tab);
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

      {/* Other Tabs, with transition based on showSidebar */}
      <div className={`tabs-container ${showSidebar ? "open" : "closed"}`}>
        <div
          className={`tab ${activeTab === "new recipe" ? "active" : ""}`}
          onClick={() => handleTabClick("new recipe")}
        >
          <FontAwesomeIcon icon={faPenToSquare} size="2x" />
        </div>
        <div
          className={`tab ${activeTab === "cookbook" ? "active" : ""}`}
          onClick={() => handleTabClick("cookbook")}
        >
          <FontAwesomeIcon icon={faUtensils} size="2x" />
        </div>
        <div
          className={`tab ${activeTab === "mealplan" ? "active" : ""}`}
          onClick={() => handleTabClick("mealplan")}
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
