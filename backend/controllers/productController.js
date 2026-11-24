import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch products."
    });
  }
};

// Get available products for customers
export const getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isAvailable: true
    })
      .populate("category", "name")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch menu."
    });
  }
};

// Add product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      isAvailable,
      isFeatured
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required."
      });
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid price."
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category."
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      image,
      category,
      isAvailable,
      isFeatured
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add product."
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.price !== undefined) {
      if (
        !Number.isFinite(Number(updates.price)) ||
        Number(updates.price) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid price."
        });
      }

      updates.price = Number(updates.price);
    }

    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category."
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully.",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update product."
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete product."
    });
  }
};