import React, { useState } from "react";

const RecipeForm = () => {
  // State for the form inputs
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "Select unit" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(""); // For success/error messages

  const lambdaUrl = "https://your-lambda-function-url"; 

  // Handle the title input change
  const handleTitleChange = (e) => setTitle(e.target.value);

  // Handle adding a new ingredient
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", quantity: "", unit: "Select unit" },
    ]);
  };

  // Handle ingredient input changes
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Handle image upload
  const handleImageUpload = (e) => setImage(e.target.files[0]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form data preparation for POST
    const formData = new FormData();
    formData.append("title", title);
    formData.append("instructions", instructions);
    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][name]`, ingredient.name);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
      formData.append(`ingredients[${index}][unit]`, ingredient.unit);
    });
    if (image) formData.append("image", image);

    try {
      const response = await fetch(lambdaUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Recipe created successfully!");
        setTitle("");
        setIngredients([{ name: "", quantity: "", unit: "Select unit" }]);
        setInstructions("");
        setImage(null);
      } else {
        setMessage(`Failed to create recipe: ${response.statusText}`);
      }
    } catch (error) {
      setMessage(`Error submitting the form: ${error.message}`);
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
          onChange={handleTitleChange}
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
        <button
          type="button"
          onClick={handleAddIngredient}
          style={{ marginTop: "10px", padding: "5px 15px" }}
        >
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
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          type="submit"
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Add Recipe
        </button>
      </div>

      {/* Message Display */}
      {message && <p style={{ marginTop: "20px", color: "green" }}>{message}</p>}
    </form>
  );
};

export default RecipeForm;
