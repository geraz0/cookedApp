import React from 'react';

const RecipeCard = ({ recipe, ingredients, onClick }) => {
  return (
    <div
      className="recipe-card"
      onClick={() => onClick(recipe, ingredients)}
      style={{
        background: "rgba(255, 240, 230, 0.65)",
        width: "100%",
        maxWidth: "200px",
        minHeight: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        backgroundColor: "#fff",
        textAlign: "center"
      }}
      onMouseEnter={(e) => e.currentTarget.style.border = "3px solid #FB8B24"}
      onMouseLeave={(e) => e.currentTarget.style.border = "1px solid #ccc"}
    >
      <h3 style={{ 
        margin: "0 0 10px 0",
        width: "100%",
        textAlign: "center"
      }}>{recipe.recipe_name}</h3>
      
      <p style={{ 
        textAlign: "center",
        width: "100%"
      }}>{recipe.description}</p>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            maxWidth: "250px",
            maxHeight: "200px",
            borderRadius: "8px",
            objectFit: "cover",
            marginBottom: "10px"
          }}
        />
      )}
    </div>
  );
};

export default RecipeCard;
