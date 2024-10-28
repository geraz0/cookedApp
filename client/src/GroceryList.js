import React, { useState } from "react";

const GroceryList = ({ groceryItems = [] }) => {
  // Ensure groceryItems is always treated as an array
  const [groceryList, setGroceryList] = useState(
    groceryItems.map((item) => ({ ...item, checked: false }))
  );

  const toggleCheckOff = (itemName) => {
    setGroceryList((prevList) =>
      prevList.map((item) =>
        item.name === itemName ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="grocery-list">
      <h2>Grocery List</h2>
      <ul>
        {groceryList.map((item, index) => (
          <li
            key={index}
            onClick={() => toggleCheckOff(item.name)}
            style={{
              textDecoration: item.checked ? "line-through" : "none",
              cursor: "pointer",
            }}
          >
            {`${item.quantity} ${item.unit} of ${item.name}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList;
