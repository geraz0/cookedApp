const { Sequelize, DataTypes } = require('sequelize');

//ssl false for testing
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: false
  },
  logging: false,
});

//ssl false for testing
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     logging: false,
//   });

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
  servings: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
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
  timestamps: false,
});

// Export all models
module.exports = {
  Users,
  Recipes,
  Ingredients,
  RecipeIngredients,
  MealPlans,
  MealPlanRecipes,
};
