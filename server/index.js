require('dotenv').config();
console.log(process.env.DATABASE_URL); // Verify if DATABASE_URL is being read correctly

const express = require('express');
const { sequelize, Users, Recipes, Ingredients, RecipeIngredients, MealPlans, MealPlanRecipes } = require('./models');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors'); 
const { Op } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

// Test root route
app.get('/', (req, res) => {
  res.send('Welcome to the Recipe and Meal Plan API!');
});

// Register user
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await Users.findOne({ where: { username } });
    const existingEmail = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    if (existingEmail) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await Users.create({ username, email, password: hashedPassword });
    res.status(201).json(newUser);

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }


    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});



// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get a specific user by ID
app.get('/api/users/:id', async (req, res) => {
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

// Get a specific user by email
app.get('/api/users/email/:email', async (req, res) => {
    try {
      const user = await Users.findOne({ where: { email: req.params.email } });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  });


  // Get a specific user by username
app.get('/api/users/username/:username', async (req, res) => {
    try {
      const user = await Users.findOne({ where: { username: req.params.username } });
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
app.put('/api/users/:id', async (req, res) => {
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
          where: { username, user_id: { [Op.ne]: userId } } // Exclude current user
        });

        if (existingUser) {
          return res.status(400).json({ error: 'Username is already taken by another user' });
        }
      }

      // Check if the new email is already registered to another user
      if (email) {
        const existingEmail = await Users.findOne({
          where: { email, user_id: { [Op.ne]: userId } } // Exclude current user
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
app.delete('/api/users/:id', async (req, res) => {
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

// Create new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const { user_id, recipe_name, description, instructions, image } = req.body;

    const newRecipe = await Recipes.create({
      user_id,
      recipe_name,
      description,
      instructions,
      image, 
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Error creating recipe' });
  }
});

// Get all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipes.findAll();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipes' });
  }
});

// Get recipes by user ID
app.get('/api/users/:userId/recipes', async (req, res) => {
  try {
    const recipes = await Recipes.findAll({ where: { user_id: req.params.userId } });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipes' });
  }
});


// Get a specific recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
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
app.put('/api/recipes/:id', async (req, res) => {
  try {
    const { recipe_name, description, instructions, image } = req.body;
    const recipe = await Recipes.findByPk(req.params.id);

    if (recipe) {
      recipe.recipe_name = recipe_name || recipe.recipe_name;
      recipe.description = description || recipe.description;
      recipe.instructions = instructions || recipe.instructions;
      recipe.image = image || recipe.image; 
      await recipe.save();

      res.status(200).json(recipe);
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Error updating recipe' });
  }
});

// Delete a recipe and its associated ingredients
app.delete('/api/recipes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // First, delete associated ingredients from RecipeIngredients
    await RecipeIngredients.destroy({
      where: { recipe_id: id },
    });

    // Then delete the recipe
    const deletedRecipe = await Recipes.destroy({
      where: { recipe_id: id },
    });

    if (deletedRecipe) {
      res.status(204).json({ message: 'Recipe and associated ingredients deleted successfully' });
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'An error occurred while deleting the recipe' });
  }
});


// ------ INGREDIENTS ROUTES ------ //

// Create new ingredient or return existing one if already in db
app.post('/api/ingredients', async (req, res) => {
  try {
    const { ingredient_name, unit } = req.body;

    // check if ingredient already exists with same name and unit and if so just return that
    const existingIngredient = await Ingredients.findOne({
      where: { ingredient_name, unit }
    });

    if (existingIngredient) {
      return res.status(200).json(existingIngredient);
    }

    // if not already in db then create it
    const newIngredient = await Ingredients.create({ ingredient_name, unit });
    res.status(201).json(newIngredient);

  } catch (error) {
    console.error('Error creating ingredient:', error);
    res.status(500).json({ error: 'Error creating ingredient' });
  }
});


// Get all ingredients
app.get('/api/ingredients', async (req, res) => {
  try {
    const ingredients = await Ingredients.findAll();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ingredients' });
  }
});

// Get a specific ingredient by ID
app.get('/api/ingredients/:id', async (req, res) => {
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
// Add ingredients to RecipeIngredients table linked by recipe_id
app.post('/api/recipeingredients', async (req, res) => {
  const { recipe_id, ingredients } = req.body;

  if (!recipe_id || !ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Missing or invalid recipe_id or ingredients data" });
  }

  try {
    // Process each ingredient to ensure it has the correct properties
    const ingredientPromises = ingredients.map(async (ingredient, index) => {
      // Validate that each ingredient has the necessary fields
      if (!ingredient.ingredient_id || !ingredient.quantity) {
        console.error(`Ingredient at index ${index} is missing required properties:`, ingredient);
        throw new Error("Ingredient data is incomplete");
      }

      // Add entry to RecipeIngredients table with recipe_id, ingredient_id, and quantity
      return RecipeIngredients.create({
        recipe_id,
        ingredient_id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
      });
    });

    // Wait for all ingredient processing promises to complete
    await Promise.all(ingredientPromises);

    res.status(201).json({ message: 'Ingredients successfully added to the recipe' });
  } catch (error) {
    console.error('Error adding ingredients to recipe:', error);
    res.status(500).json({ error: 'Error adding ingredients to recipe' });
  }
});



// Get all ingredients for a specific recipe by recipeId
app.get('/api/recipes/:recipeId/ingredients', async (req, res) => {
  const { recipeId } = req.params;

  try {
    // Find all ingredients for the given recipeId
    const recipeIngredients = await RecipeIngredients.findAll({
      where: { recipe_id: recipeId },
      include: [
        {
          model: Ingredients,
          attributes: ['ingredient_name', 'unit'], // Select ingredient details to return
        },
      ],
      attributes: ['quantity'], // Select only the quantity from RecipeIngredients
    });

    if (!recipeIngredients.length) {
      return res.status(404).json({ error: 'No ingredients found for this recipe' });
    }

    // Format the response to include both ingredient details and quantity
    const ingredients = recipeIngredients.map((item) => ({
      name: item.Ingredients.ingredient_name,
      unit: item.Ingredients.unit,
      quantity: item.quantity,
    }));

    res.status(200).json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients for recipe:', error);
    res.status(500).json({ error: 'Error fetching ingredients for recipe' });
  }
});


// Get all ingredients for all recipes by user ID
app.get('/api/users/:userId/ingredients', async (req, res) => {
  const { userId } = req.params;

  try {
    const userRecipes = await Recipes.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Ingredients,
          through: { attributes: ['quantity'] }, // Include quantity from RecipeIngredients
          attributes: ['ingredient_name', 'unit'],
        },
      ],
    });

    if (!userRecipes.length) {
      return res.status(404).json({ error: 'No ingredients found for this user\'s recipes' });
    }

    const ingredients = userRecipes.flatMap((recipe) => {
      return recipe.Ingredients.map((ingredient) => ({
        recipe_id: recipe.recipe_id,
        name: ingredient.ingredient_name,
        unit: ingredient.unit,
        quantity: ingredient.RecipeIngredients.quantity, // Quantity from RecipeIngredients
      }));
    });

    res.status(200).json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients for all recipes by user:', error);
    res.status(500).json({ error: 'Error fetching ingredients for all recipes by user' });
  }
});




// Edit ingredients for a specific recipe by recipeId
app.put('/api/recipes/:recipeId/ingredients', async (req, res) => {
  const { recipeId } = req.params;
  const { ingredients } = req.body; // Expecting an array of ingredients with { name, unit, quantity }

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Invalid ingredients data" });
  }

  try {
    const ingredientPromises = ingredients.map(async (ingredient) => {
      // Check if the ingredient exists in the Ingredients table
      let existingIngredient = await Ingredients.findOne({
        where: { ingredient_name: ingredient.name, unit: ingredient.unit },
      });

      // If the ingredient doesn’t exist, create it in the Ingredients table
      if (!existingIngredient) {
        existingIngredient = await Ingredients.create({
          ingredient_name: ingredient.name,
          unit: ingredient.unit,
        });
      }

      // Check if this ingredient is already linked to the recipe in RecipeIngredients
      const recipeIngredient = await RecipeIngredients.findOne({
        where: { recipe_id: recipeId, ingredient_id: existingIngredient.ingredient_id },
      });

      if (recipeIngredient) {
        // If it exists, update the quantity
        await recipeIngredient.update({ quantity: ingredient.quantity });
      } else {
        // If it doesn’t exist, create a new entry in RecipeIngredients
        await RecipeIngredients.create({
          recipe_id: recipeId,
          ingredient_id: existingIngredient.ingredient_id,
          quantity: ingredient.quantity,
        });
      }
    });

    // Wait for all updates to complete
    await Promise.all(ingredientPromises);

    res.status(200).json({ message: 'Ingredients updated successfully' });
  } catch (error) {
    console.error('Error updating ingredients for recipe:', error);
    res.status(500).json({ error: 'Error updating ingredients for recipe' });
  }
});



// ------ MEAL PLANS ROUTES ------ //

// Create a meal plan with the current date as start_date and no end_date initially
app.post('/api/mealplans', async (req, res) => {
  try {
    const { user_id } = req.body;
    const start_date = new Date(); // Set start_date to the current date

    const newMealPlan = await MealPlans.create({ user_id, start_date });
    res.status(201).json(newMealPlan);
  } catch (error) {
    console.error("Error creating meal plan:", error);
    res.status(500).json({ error: 'Error creating meal plan' });
  }
});

// Get the open meal plan for a specific user (where end_date is null)
app.get('/api/users/:userId/mealplans/open', async (req, res) => {
  try {
    const openMealPlan = await MealPlans.findOne({
      where: {
        user_id: req.params.userId,
        end_date: null, // Find meal plan without an end_date
      },
    });

    if (openMealPlan) {
      res.status(200).json(openMealPlan);
    } else {
      res.status(404).json({ error: 'No open meal plan found for this user' });
    }
  } catch (error) {
    console.error("Error fetching open meal plan:", error);
    res.status(500).json({ error: 'Error fetching open meal plan' });
  }
});

// Update a meal plan to set the current date as the end_date
app.put('/api/mealplans/:id/close', async (req, res) => {
  try {
    // Find the meal plan by ID
    const mealPlan = await MealPlans.findByPk(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    // Update the end_date to the current date
    mealPlan.end_date = new Date(); // Set to current date
    await mealPlan.save();

    res.status(200).json({ message: 'Meal plan closed successfully', mealPlan });
  } catch (error) {
    console.error('Error closing meal plan:', error);
    res.status(500).json({ error: 'Error closing meal plan' });
  }
});



// Get all meal plans for a user
app.get('/api/users/:userId/mealplans', async (req, res) => {
  try {
    const mealPlans = await MealPlans.findAll({ where: { user_id: req.params.userId } });
    res.status(200).json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meal plans' });
  }
});

// Get a specific meal plan by ID
app.get('/api/mealplans/:id', async (req, res) => {
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
app.delete('/api/mealplans/:id', async (req, res) => {
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
app.post('/api/mealplans/:mealPlanId/recipes', async (req, res) => {
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
app.get('/api/mealplans/:mealPlanId/recipes', async (req, res) => {
  try {
    const recipes = await MealPlanRecipes.findAll({ where: { meal_plan_id: req.params.mealPlanId } });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipes for meal plan' });
  }
});

// Remove a recipe from a meal plan
app.delete('/api/mealplans/:mealPlanId/recipes/:recipeId', async (req, res) => {
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

// Test the database connection first
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');

    // Sync models after successful connection
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database & tables synced successfully');
    
    // Start the server after syncing
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });

