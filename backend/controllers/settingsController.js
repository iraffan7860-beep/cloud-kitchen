import Settings from "../models/Settings.js";

// Get public settings
export const getPublicSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch settings."
    });
  }
};

// Get admin settings
export const getAdminSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch settings."
    });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const allowedFields = [
      "brandName",
      "tagline",
      "phone",
      "email",
      "instagramUrl",
      "address",
      "mapsUrl",
      "deliveryRadiusKm",
      "deliveryCharge",
      "openingTime",
      "closingTime",
      "isAvailable",
      "availabilityMessage"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Validate availability
    if (
      updates.isAvailable !== undefined &&
      typeof updates.isAvailable !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability status."
      });
    }

    // Validate availability message
    if (updates.availabilityMessage !== undefined) {
      if (typeof updates.availabilityMessage !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid availability message."
        });
      }

      updates.availabilityMessage = updates.availabilityMessage.trim();
    }

    // Validate delivery radius
    if (
      updates.deliveryRadiusKm !== undefined &&
      (!Number.isFinite(Number(updates.deliveryRadiusKm)) ||
        Number(updates.deliveryRadiusKm) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery radius."
      });
    }

    // Validate delivery charge
    if (
      updates.deliveryCharge !== undefined &&
      (!Number.isFinite(Number(updates.deliveryCharge)) ||
        Number(updates.deliveryCharge) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery charge."
      });
    }

    if (updates.deliveryRadiusKm !== undefined) {
      updates.deliveryRadiusKm = Number(updates.deliveryRadiusKm);
    }

    if (updates.deliveryCharge !== undefined) {
      updates.deliveryCharge = Number(updates.deliveryCharge);
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: updates },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      success: true,
      message: "Settings updated successfully.",
      settings
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update settings."
    });
  }
};