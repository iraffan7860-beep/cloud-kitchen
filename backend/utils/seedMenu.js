import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const categoriesData = [
  {
    name: "Desserts",
    description: "Sweet treats",
    sortOrder: 1
  },
  {
    name: "Fries",
    description: "Fresh and crispy fries",
    sortOrder: 2
  },
  {
    name: "Momos",
    description: "Delicious momos",
    sortOrder: 3
  },
  {
    name: "Chicken Specials",
    description: "Chicken favourites",
    sortOrder: 4
  }
];

const productsData = [
  { name: "Chocolate Bun", price: 40, category: "Desserts" },
  { name: "Choco Lava", price: 40, category: "Desserts" },

  { name: "Peri Peri French Fries", price: 40, category: "Fries" },
  { name: "Normal French Fries", price: 40, category: "Fries" },

  { name: "Chicken Momos (5 pieces)", price: 40, category: "Momos" },
  { name: "Veg Momos (6 pieces)", price: 40, category: "Momos" },

  { name: "Chicken Nuggets (3 pieces)", price: 30, category: "Chicken Specials" },
  {
    name: "Chicken Combo (2 Nuggets + 2 Chicken Balls + Fries)",
    price: 55,
    category: "Chicken Specials"
  }
];

const seedMenu = async () => {
  try {
    await connectDB();

    const categoryMap = {};

    // Create or find categories
    for (const item of categoriesData) {
      const category = await Category.findOneAndUpdate(
        { name: item.name },
        { $set: item },
        { new: true, upsert: true, runValidators: true }
      );

      categoryMap[item.name] = category._id;
    }

    // Create or update products
    for (const item of productsData) {
      await Product.findOneAndUpdate(
        { name: item.name },
        {
          $set: {
            name: item.name,
            price: item.price,
            category: categoryMap[item.category],
            isAvailable: true,
            isFeatured: false
          },
          $setOnInsert: {
            description: "",
            image: ""
          }
        },
        { new: true, upsert: true, runValidators: true }
      );
    }

    console.log("FC Kitchen categories created successfully!");
    console.log("All 8 FC Kitchen products added successfully!");
  } catch (error) {
    console.error("Menu setup failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedMenu();