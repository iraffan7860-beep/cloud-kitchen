import Testimonial from "../models/Testimonial.js";

// Get approved reviews for customers
export const getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      isApproved: true
    }).sort({ sortOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch reviews."
    });
  }
};

// Get all reviews for admin
export const getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch reviews."
    });
  }
};

// Add a customer review
export const addTestimonial = async (req, res) => {
  try {
    const { customerName, review, rating } = req.body;

    if (
      !customerName?.trim() ||
      !review?.trim() ||
      rating === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, review and rating are required."
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5."
      });
    }

    const testimonial = await Testimonial.create({
      customerName: customerName.trim(),
      review: review.trim(),
      rating: numericRating,
      isApproved: false
    });

    res.status(201).json({
      success: true,
      message: "Review submitted for approval.",
      testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to submit review."
    });
  }
};

// Update or approve a review
export const updateTestimonial = async (req, res) => {
  try {
    const updates = { ...req.body };

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.rating !== undefined) {
      const rating = Number(updates.rating);

      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5."
        });
      }

      updates.rating = rating;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Review not found."
      });
    }

    res.json({
      success: true,
      message: "Review updated successfully.",
      testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update review."
    });
  }
};

// Delete a review
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Review not found."
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete review."
    });
  }
};