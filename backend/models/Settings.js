import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: "FC Kitchen"
    },
    tagline: {
      type: String,
      default: "A Taste Like Home in Every Bite."
    },
    phone: {
      type: String,
      default: "6300612693"
    },
    email: {
      type: String,
      default: "iraffan7860@gmail.com"
    },
    instagramUrl: {
      type: String,
      default: "https://www.instagram.com/castle_cafe_.8811/"
    },
    address: {
      type: String,
      default: ""
    },
    mapsUrl: {
      type: String,
      default: ""
    },
    deliveryRadiusKm: {
      type: Number,
      default: 5
    },
    deliveryCharge: {
      type: Number,
      default: 0
    },
    openingTime: {
      type: String,
      default: "07:00"
    },
    closingTime: {
      type: String,
      default: "00:00"
    }
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;