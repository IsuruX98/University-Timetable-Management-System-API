const mongoose = require("mongoose");

const resourceSchema = mongoose.Schema({
  resourceName: {
    type: String,
    required: true,
  },
  description: String,
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
