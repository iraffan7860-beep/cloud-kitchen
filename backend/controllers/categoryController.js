import Category from "../models/Category.js";
import Product from "../models/Product.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch categories."
    });
  }
};

// Get public categories
export const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true
    }).sort({ sortOrder: 1 });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch categories."
    });
  }
};

// Add category
export const addCategory = async (req, res) => {
  try {
    const { name, description, image, sortOrder } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required."
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim()
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists."
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      image,
      sortOrder
    });

    res.status(201).json({
      success: true,
      message: "Category added successfully.",
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add category."
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const updates = { ...req.body };

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();

      if (!updates.name) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty."
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found."
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully.",
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update category."
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const productExists = await Product.exists({
      category: req.params.id
    });

    if (productExists) {
      return res.status(400).json({
        success: false,
        message: "Move or delete its products before deleting this category."
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found."
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete category."
    });
  }
};