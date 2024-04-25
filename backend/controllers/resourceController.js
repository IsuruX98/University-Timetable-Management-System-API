const Resource = require("../models/resourceModel");

// Controller for creating a resource
async function createResource(req, res) {
  try {
    const { resourceName, description } = req.body;
    const newResource = new Resource({
      resourceName,
      description,
    });
    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for updating a resource
async function updateResource(req, res) {
  try {
    const { id } = req.params;
    const { resourceName, description } = req.body;
    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      {
        resourceName,
        description,
      },
      { new: true }
    );
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for deleting a resource
async function deleteResource(req, res) {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting all resources
async function getAllResources(req, res) {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting a resource by ID
async function getResourceById(req, res) {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createResource,
  updateResource,
  deleteResource,
  getAllResources,
  getResourceById,
};
