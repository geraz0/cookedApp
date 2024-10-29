const { Sequelize, DataTypes } = require('sequelize');

//ssl false for testing
//ssl true for deployment

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // tells Sequelize and Node.js not to verify the SSL certificate’s authority
    },
  },
  logging: false,
});

// Define the Users model
const Users = sequelize.define('Users', {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, 
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, 
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

// Define the Recipes model
const Recipes = sequelize.define('Recipes', {
  recipe_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'user_id',
    },
  },
  recipe_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
    tableName:"recipes",
  timestamps: false,
});

// Define the Ingredients model
const Ingredients = sequelize.define('Ingredients', {
  ingredient_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ingredient_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
    tableName: 'ingredients',
  timestamps: false,
});

// Define the RecipeIngredients model (many-to-many relationship)
const RecipeIngredients = sequelize.define('RecipeIngredients', {
  recipe_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Recipes,
      key: 'recipe_id',
    },
    primaryKey: true,
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Ingredients,
      key: 'ingredient_id',
    },
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
    tableName: 'recipeingredients',
  timestamps: false,
});

// Define the MealPlans model
const MealPlans = sequelize.define('MealPlans', {
  meal_plan_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'user_id',
    },
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
    tableName: 'mealplans',
  timestamps: false,
});

// Define the MealPlanRecipes model (many-to-many relationship)
const MealPlanRecipes = sequelize.define('MealPlanRecipes', {
  meal_plan_id: {
    type: DataTypes.INTEGER,
    references: {
      model: MealPlans,
      key: 'meal_plan_id',
    },
    primaryKey: true,
  },
  recipe_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Recipes,
      key: 'recipe_id',
    },
    primaryKey: true,
  },
}, {
    tableName: 'mealplanrecipes',
  timestamps: false,
});

// Export all models
// Export all models and the sequelize instance
module.exports = {
  sequelize, // instance of Sequelize, helpful for syncing and configuration
  Users,
  Recipes,
  Ingredients,
  RecipeIngredients,
  MealPlans,
  MealPlanRecipes,
};

