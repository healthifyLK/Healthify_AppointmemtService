const {
  getProviderByIdService,
  createProviderService,
  updateProviderService,
} = require("../services/providerService");

// GET api/provider/:providerId
// Get provider details by provider ID
const getProviderById = async (req, res) => {
  const providerId = req.params.providerId;
  try {
    const provider = await getProviderByIdService(providerId);
    res.status(200).json(provider);
  } catch (error) {
    console.error("Error fetching provider details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST api/provider
// Create a new provider
const createProvider = async (req, res) => {
  const providerData = req.body;
  try {
    const newProvider = await createProviderService(providerData);
    res.status(201).json(newProvider);
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT api/provider/:providerId
// Update provider details
const updateProvider = async (req, res) => {
  const providerId = req.params.providerId;
  const updateData = req.body;
  try {
    const updatedProvider = await updateProviderService(providerId, updateData);
    res.status(200).json(updatedProvider);
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getProviderById,
  createProvider,
  updateProvider,
};
