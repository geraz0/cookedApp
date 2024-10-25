require('dotenv').config();
const express = require('express');
const { Users, Recipes, Ingredients, RecipeIngredients, MealPlans, MealPlanRecipes } = require('./models');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// Test the root route
app.get('/', (req, res) => {
  res.send('Welcome to the Recipe and Meal Plan API!');
});

// ------ USERS ROUTES ------ //

// Create a new user
app.post('/users', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if the username or email already exists
      const existingUser = await Users.findOne({ where: { username } });
      const existingEmail = await Users.findOne({ where: { email } });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
  
      if (existingEmail) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
  
      // If both are unique, create a new user
      const newUser = await Users.create({ username, email, password });
      res.status(201).json(newUser);
  
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  });

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get a specific user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const userId = req.params.id;
  
      // Find the user by ID
      const user = await Users.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the new username is already taken by another user
      if (username) {
        const existingUser = await Users.findOne({
          where: { username, user_id: { [Sequelize.Op.ne]: userId } } // Exclude current user
        });
  
        if (existingUser) {
          return res.status(400).json({ error: 'Username is already taken by another user' });
        }
      }
  
      // Check if the new email is already registered to another user
      if (email) {
        const existingEmail = await Users.findOne({
          where: { email, user_id: { [Sequelize.Op.ne]: userId } } // Exclude current user
        });
  
        if (existingEmail) {
          return res.status(400).json({ error: 'Email is already registered by another user' });
        }
      }
  
      // Update the user with the new values, if they are provided
      user.username = username || user.username;
      user.email = email || user.email;
      user.password = password || user.password; // Add logic for hashing passwords later
  
      await user.save();
  
      res.status(200).json(user);
  
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'An error occurred while updating the user' });
    }
  });
  

// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// ------ RECIPES ROUTES ------ //

// Create a new recipe
app.post('/recipes', async (req, res) => {
  try {
    const { user_id, recipe_name, description, instructions, servings } = req.body;
    const newRecipe = await Recipes.create({ user_id, recipe_name, description, instructions, servings });
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Error creating recipe' });
  }
});

// Get all recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipes.findAll();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipes' });
  }
});

// Get recipes by user ID
app.get('/users/:userId/recipes', async (req, res) => {
  try {
    const recipes = await Recipes.findAll({ where: { user_id: req.params.userId } });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipes' });
  }
});


// Get a specific recipe by ID
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipes.findByPk(req.params.id);
    if (recipe) {
      res.status(200).json(recipe);
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipe' });
  }
});

// Update a recipe
app.put('/recipes/:id', async (req, res) => {
  try {
    const { recipe_name, description, instructions, servings } = req.body;
    const recipe = await Recipes.findByPk(req.params.id);
    if (recipe) {
      recipe.recipe_name = recipe_name || recipe.recipe_name;
      recipe.description = description || recipe.description;
      recipe.instructions = instructions || recipe.instructions;
      recipe.servings = servings || recipe.servings;
      await recipe.save();
      res.status(200).json(recipe);
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating recipe' });
  }
});

// Delete a recipe
app.delete('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipes.findByPk(req.params.id);
    if (recipe) {
      await recipe.destroy();
      res.status(204).json({ message: 'Recipe deleted' });
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting recipe' });
  }
});

// ------ INGREDIENTS ROUTES ------ //

// Create a new ingredient
app.post('/ingredients', async (req, res) => {
  try {
    const { ingredient_name, unit } = req.body;
    const newIngredient = await Ingredients.create({ ingredient_name, unit });
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(500).json({ error: 'Error creating ingredient' });
  }
});

// Get all ingredients
app.get('/ingredients', async (req, res) => {
  try {
    const ingredients = await Ingredients.findAll();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ingredients' });
  }
});

// Get a specific ingredient by ID
app.get('/ingredients/:id', async (req, res) => {
  try {
    const ingredient = await Ingredients.findByPk(req.params.id);
    if (ingredient) {
      res.status(200).json(ingredient);
    } else {
      res.status(404).json({ error: 'Ingredient not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ingredient' });
  }
});

// ------ RECIPE INGREDIENTS ROUTES ------ //

// Add ingredients to a recipe
app.post('/recipes/:recipeId/ingredients', async (req, res) => {
  try {
    const { ingredients } = req.body; // Array of { ingredient_id, quantity }
    const recipeId = req.params.recipeId;

    for (let ingredient of ingredients) {
      await RecipeIngredients.create({
        recipe_id: recipeId,
        ingredient_id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
      });
    }

    res.status(201).json({ message: 'Ingredients added to recipe' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding ingredients to recipe' });
  }
});

// Get all ingredients for a recipe
app.get('/recipes/:recipeId/ingredients', async (req, res) => {
  try {
    const ingredients = await RecipeIngredients.findAll({ where: { recipe_id: req.params.recipeId } });
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ingredients for recipe' });
  }
});

// ------ MEAL PLANS ROUTES ------ //

// Create a meal plan
app.post('/mealplans', async (req, res) => {
  try {
    const { user_id, start_date, end_date } = req.body;
    const newMealPlan = await MealPlans.create({ user_id, start_date, end_date });
    res.status(201).json(newMealPlan);
  } catch (error) {
    res.status(500).json({ error: 'Error creating meal plan' });
  }
});

// Get all meal plans for a user
app.get('/users/:userId/mealplans', async (req, res) => {
  try {
    const mealPlans = await MealPlans.findAll({ where: { user_id: req.params.userId } });
    res.status(200).json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meal plans' });
  }
});

// Get a specific meal plan by ID
app.get('/mealplans/:id', async (req, res) => {
  try {
    const mealPlan = await MealPlans.findByPk(req.params.id);
    if (mealPlan) {
      res.status(200).json(mealPlan);
    } else {
      res.status(404).json({ error: 'Meal plan not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meal plan' });
  }
});

// Delete a meal plan
app.delete('/mealplans/:id', async (req, res) => {
  try {
    const mealPlan = await MealPlans.findByPk(req.params.id);
    if (mealPlan) {
      await mealPlan.destroy();
      res.status(204).json({ message: 'Meal plan deleted' });
    } else {
      res.status(404).json({ error: 'Meal plan not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting meal plan' });
  }
});

// ------ MEAL PLAN RECIPES ROUTES ------ //

// Add a recipe to a meal plan
app.post('/mealplans/:mealPlanId/recipes', async (req, res) => {
  try {
    const { recipe_id } = req.body;
    const mealPlanId = req.params.mealPlanId;
    await MealPlanRecipes.create({ meal_plan_id: mealPlanId, recipe_id });
    res.status(201).json({ message: 'Recipe added to meal plan' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding recipe to meal plan' });
  }
});

// Get all recipes for a meal plan
app.get('/mealplans/:mealPlanId/recipes', async (req, res) => {
  try {
    const recipes = await MealPlanRecipes.findAll({ where: { meal_plan_id: req.params.mealPlanId } });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipes for meal plan' });
  }
});

// Remove a recipe from a meal plan
app.delete('/mealplans/:mealPlanId/recipes/:recipeId', async (req, res) => {
  try {
    const mealPlanId = req.params.mealPlanId;
    const recipeId = req.params.recipeId;
    const entry = await MealPlanRecipes.findOne({ where: { meal_plan_id: mealPlanId, recipe_id: recipeId } });
    if (entry) {
      await entry.destroy();
      res.status(204).json({ message: 'Recipe removed from meal plan' });
    } else {
      res.status(404).json({ error: 'Recipe not found in meal plan' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error removing recipe from meal plan' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
