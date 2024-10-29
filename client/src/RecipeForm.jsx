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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      recipe_name: title,
      instructions,
      ingredients,
      description,
      image,
      user_id: uid,
    };

    try {
      const response = await fetch('/api/recipes', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        onAddRecipe(result);

        setMessage("Recipe created successfully!");
        setTitle("");
        setDescription("");
        setIngredients([{ name: "", quantity: "", unit: "Select unit" }]);
        setInstructions("");
        setImage(null);
        setImagePreview(null);
      } else {
        setMessage(`Failed to create recipe: ${response.statusText}`);
      }
    } catch (error) {
      setMessage(`Error submitting the form: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Add a New Recipe</h2>

      {/* Recipe Title Input */}
      <div>
        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "60%", padding: "10px", fontSize: "16px" }}
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
              <option value="g">grams</option>
              <option value="ml">milliliters</option>
              <option value="tbsp">tablespoons</option>
              <option value="tsp">teaspoons</option>
              <option value="cup">cups</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient} style={{ marginTop: "10px", padding: "5px 15px" }}>
          Add Ingredient
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
      <div style={{ margin: "20px", marginRight: "40px" }}>
        <h3>Recipe Image</h3>
        <input type="file" accept="public/*" onChange={handleImageUpload} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />}
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "20px" }}>
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px", marginBottom: "20px" }}>
          Add Recipe
        </button>
      </div>

      {/* Message Display */}
      {message && <p style={{ marginTop: "20px", color: "green" }}>{message}</p>}
    </form>
  );
};

export default RecipeForm;
