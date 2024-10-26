import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUtensils,
  faBook,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import "./App.css";

const Sidebar = ({ onTabClick }) => {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabClick(tab);
  };

  return (
    <div className="sidebar">
      <div
        className={`tab ${activeTab === "home" ? "active" : ""}`}
        onClick={() => handleTabClick("home")}
      >
        <FontAwesomeIcon icon={faHome} size="2x" />
      </div>
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
  );
};

export default Sidebar;
