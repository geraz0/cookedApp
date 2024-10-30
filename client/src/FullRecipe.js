import React from "react";

const FullRecipe = ({ recipe, onDelete }) => {
  // Function to handle recipe deletion
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipe.recipe_id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete recipe: ${response.statusText}`);
      }
  
      onDelete(); // Navigate back to the cookbook
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert(`There was an error deleting the recipe: ${error.message}`);
    }
  };
  

  return (
    <div className="full-recipe" style={{ position: "relative" }}>
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>

      {/* Display Recipe Title */}
      <h2>{recipe.recipe_name}</h2>

      {/* Display Recipe Image */}
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.recipe_name}
          style={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}
        />
      )}
      
      {/* Display Recipe Description */}
      <p>{recipe.description}</p>

      {/* Display Ingredients List */}
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients ? (
          recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
            </li>
          ))
        ) : (
          <li>No ingredients listed.</li>
        )}
      </ul>

      {/* Display Instructions */}
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default FullRecipe;
