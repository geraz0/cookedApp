import React, { useState } from "react";
import imageCompression from "browser-image-compression";

const RecipeForm = ({ onAddRecipe, uid }) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "Select unit" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");

  // Handle ingredient input changes
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Handle adding a new ingredient
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", quantity: "", unit: "Select unit" },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Handle image upload and compression
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          setImage(reader.result); // Set Base64 image for submission
          setImagePreview(reader.result);
        };
      } catch (error) {
        console.error("Error compressing the image", error);
      }
    }
  };

  //submit to reicipes, ingredients, and recipeingredients dbs
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      recipe_name: title,
      instructions,
      description,
      image,
      user_id: uid,
    };

    try {
      // Step 1: Create the recipe and get recipe_id
      const recipeResponse = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!recipeResponse.ok) {
        throw new Error(
          `Failed to create recipe: ${recipeResponse.statusText}`
        );
      }

      const createdRecipe = await recipeResponse.json();
      const recipeId = createdRecipe.recipe_id;

      // Step 2: Process each ingredient to ensure it has ingredient_id and quantity
      const ingredientIds = await Promise.all(
        ingredients.map(async (ingredient) => {
          // Log the initial ingredient data
          console.log("Processing ingredient:", ingredient);

          if (!ingredient.ingredient_id) {
            // Check if ingredient exists in the database or create it
            const ingredientResponse = await fetch("/api/ingredients", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ingredient_name: ingredient.name,
                unit: ingredient.unit,
              }),
            });

            if (!ingredientResponse.ok) {
              throw new Error(
                `Failed to create or retrieve ingredient: ${ingredientResponse.statusText}`
              );
            }

            const ingredientData = await ingredientResponse.json();
            return {
              ingredient_id: ingredientData.ingredient_id,
              quantity: ingredient.quantity,
            };
          } else {
            // If ingredient_id already exists
            return {
              ingredient_id: ingredient.ingredient_id,
              quantity: ingredient.quantity,
            };
          }
        })
      );

      // Step 3: Verify ingredient data
      ingredientIds.forEach((ing, index) => {
        if (!ing.ingredient_id || !ing.quantity) {
          console.error(
            `Ingredient at index ${index} is missing required properties`,
            ing
          );
          throw new Error("Ingredient data is incomplete");
        }
      });

      // Step 4: Link ingredients to the recipe in RecipeIngredients
      const linkResponse = await fetch("/api/recipeingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipe_id: recipeId,
          ingredients: ingredientIds,
        }),
      });

      if (!linkResponse.ok) {
        throw new Error(
          `Failed to link ingredients to recipe: ${linkResponse.statusText}`
        );
      }

      // Success message and reset form fields
      setMessage("Recipe created successfully!");
      onAddRecipe(createdRecipe);
      setTitle("");
      setDescription("");
      setIngredients([{ name: "", quantity: "", unit: "Select unit" }]);
      setInstructions("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      setMessage(`Error submitting the form: ${error.message}`);
      console.error("Form submission error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ textAlign: "center", marginTop: "20px" }}
    >
      <h2>Add a New Recipe</h2>

      {/* Recipe Title Input */}
      <div>
        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "60%",
            margin: "20px",
            padding: "10px",
            fontSize: "16px",
          }}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "60%", padding: "10px", fontSize: "16px" }}
          required
        />
      </div>

      {/* Ingredients Section */}
      <div>
        <h3>Ingredients</h3>
        {ingredients.map((ingredient, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Ingredient Name"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, "name", e.target.value)
              }
              style={{ marginRight: "10px", padding: "5px", width: "40%" }}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(index, "quantity", e.target.value)
              }
              style={{ marginRight: "10px", padding: "5px", width: "20%" }}
              required
            />
            <select
              value={ingredient.unit}
              onChange={(e) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
              style={{ padding: "5px", width: "25%" }}
              required
            >
              <option value="Select unit" disabled>
                Select unit
              </option>
              <option value="unit">unit</option>
              <option value="g">grams</option>
              <option value="ml">milliliters</option>
              <option value="tbsp">tablespoons</option>
              <option value="tsp">teaspoons</option>
              <option value="cup">cups</option>
            </select>
            <button
              type="button"
              onClick={() => handleRemoveIngredient(index)}
              style={{ marginLeft: "5px" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          style={{ marginTop: "10px", padding: "5px 15px" }}
        >
          Add Another Ingredient
        </button>
      </div>

      {/* Instructions Input */}
      <div style={{ marginTop: "20px" }}>
        <h3>Instructions</h3>
        <textarea
          placeholder="Enter instructions here..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          style={{
            width: "60%",
            padding: "10px",
            height: "100px",
            fontSize: "16px",
          }}
          required
        />
      </div>

      {/* Image Upload */}
<div style={{ 
  margin: "40px auto", 
  padding: "20px",
  width: "60%",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
}}>
  <h3 style={{ marginBottom: "15px" }}>Recipe Image</h3>
  <div style={{ 
    display: "flex", 
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px"
  }}>
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleImageUpload}
      style={{
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "white"
      }}
    />
    {imagePreview && (
      <button
        type="button"
        onClick={() => {
          const fileInput = document.querySelector('input[type="file"]');
          fileInput.value = '';
          setImage(null);
          setImagePreview(null);
        }}
        style={{
          padding: "8px 15px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "500"
        }}
      >
        Clear
      </button>
    )}
  </div>
  {imagePreview && (
    <div style={{
      width: "200px",
      height: "200px",
      margin: "0 auto",
      border: "1px solid #ddd",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "white"
    }}>
      <img
        src={imagePreview}
        alt="Preview"
        style={{ 
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
    </div>
  )}
</div>

      {/* Submit Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          Add Recipe
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <p style={{ marginTop: "20px", color: "green" }}>{message}</p>
      )}
    </form>
  );
};

export default RecipeForm;
