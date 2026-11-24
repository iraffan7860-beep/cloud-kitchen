import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    review: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;