const express = require("express");
const router = express.Router();
const { getProviderById,createProvider,updateProvider } = require("../controllers/providerController");

// GET api/provider/:providerId
// Get provider details by provider ID
router.get("/:providerId", getProviderById);

// POST api/provider
// Create a new provider
router.post("/", createProvider);

// PUT api/provider/:providerId
// Update provider details
router.put("/:providerId", updateProvider);
