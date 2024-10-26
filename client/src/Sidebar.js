import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUtensils,
  faBook,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ onTabClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("menu");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabClick(tab);
    setIsMenuOpen(false); // Close menu after selecting a tab
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="sidebar">
      {/* Menu Tab */}
      <div
        className={`tab ${activeTab === "menu" ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </div>

      {/* Other Tabs, only visible when isMenuOpen is true */}
      <div className={`tabs-container ${isMenuOpen ? "open" : ""}`}>
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
