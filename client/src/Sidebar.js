import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faUtensils, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ onTabClick }) => {
  return (
    <div className="sidebar">
      <div className="tab" onClick={() => onTabClick('home')}>
        <FontAwesomeIcon icon={faHome} size="2x" />
      </div>
      <div className="tab" onClick={() => onTabClick('ingredients')}>
        <FontAwesomeIcon icon={faList} size="2x" />
      </div>
      <div className="tab" onClick={() => onTabClick('recipes')}>
        <FontAwesomeIcon icon={faUtensils} size="2x" />
      </div>
      <div className="tab" onClick={() => onTabClick('instructions')}>
        <FontAwesomeIcon icon={faFileAlt} size="2x" />
      </div>
    </div>
  );
};

export default Sidebar;
