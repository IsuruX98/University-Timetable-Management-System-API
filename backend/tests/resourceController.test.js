const Resource = require("../models/resourceModel");
const resourceController = require("../controllers/resourceController");

jest.mock("../models/resourceModel");

describe("Resource Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for createResource function
  describe("createResource", () => {
    it("should create a new resource", async () => {
      const req = {
        body: {
          resourceName: "Resource 1",
          description: "Description of Resource 1",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedSavedResource = {
        _id: "someId",
        resourceName: "Resource 1",
        description: "Description of Resource 1",
      };
      Resource.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(expectedSavedResource),
      });

      await resourceController.createResource(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedSavedResource);
      expect(Resource).toHaveBeenCalledWith({
        resourceName: "Resource 1",
        description: "Description of Resource 1",
      });
    });

    it("should handle errors", async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Resource.mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error("Database error")),
      });

      await resourceController.createResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // Test for updateResource function
  describe("updateResource", () => {
    it("should update an existing resource", async () => {
      const req = {
        params: {
          id: "resourceId",
        },
        body: {
          resourceName: "Updated Resource",
          description: "Updated description",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const updatedResource = {
        _id: "resourceId",
        resourceName: "Updated Resource",
        description: "Updated description",
      };
      Resource.findByIdAndUpdate.mockResolvedValueOnce(updatedResource);

      await resourceController.updateResource(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedResource);
      expect(Resource.findByIdAndUpdate).toHaveBeenCalledWith(
        "resourceId",
        {
          resourceName: "Updated Resource",
          description: "Updated description",
        },
        { new: true }
      );
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "resourceId",
        },
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Resource.findByIdAndUpdate.mockRejectedValueOnce(
        new Error("Database error")
      );

      await resourceController.updateResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // Test for deleteResource function
  describe("deleteResource", () => {
    it("should delete an existing resource", async () => {
      const req = {
        params: {
          id: "resourceId",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const deletedResource = {
        _id: "resourceId",
        resourceName: "Deleted Resource",
        description: "Deleted description",
      };
      Resource.findByIdAndDelete.mockResolvedValueOnce(deletedResource);

      await resourceController.deleteResource(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Resource deleted" });
      expect(Resource.findByIdAndDelete).toHaveBeenCalledWith("resourceId");
    });

    it("should handle resource not found", async () => {
      const req = {
        params: {
          id: "nonexistentResourceId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Resource.findByIdAndDelete.mockResolvedValueOnce(null);

      await resourceController.deleteResource(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "resourceId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Resource.findByIdAndDelete.mockRejectedValueOnce(
        new Error("Database error")
      );

      await resourceController.deleteResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // Test for getAllResources function
  describe("getAllResources", () => {
    it("should get all resources", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };
      const resources = [
        {
          _id: "resource1",
          resourceName: "Resource 1",
          description: "Description of Resource 1",
        },
        {
          _id: "resource2",
          resourceName: "Resource 2",
          description: "Description of Resource 2",
        },
      ];
      Resource.find.mockResolvedValueOnce(resources);

      await resourceController.getAllResources(req, res);

      expect(res.json).toHaveBeenCalledWith(resources);
      expect(Resource.find).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Resource.find.mockRejectedValueOnce(new Error("Database error"));

      await resourceController.getAllResources(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // Test for getResourceById function
  describe("getResourceById", () => {
    it("should get a resource by ID", async () => {
      const req = {
        params: {
          id: "resourceId",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const resource = {
        _id: "resourceId",
        resourceName: "Test Resource",
        description: "Test description",
      };
      Resource.findById.mockResolvedValueOnce(resource);

      await resourceController.getResourceById(req, res);

      expect(res.json).toHaveBeenCalledWith(resource);
      expect(Resource.findById).toHaveBeenCalledWith("resourceId");
    });

    it("should handle resource not found", async () => {
      const req = {
        params: {
          id: "nonexistentResourceId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Resource.findById.mockResolvedValueOnce(null);

      await resourceController.getResourceById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "resourceId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Resource.findById.mockRejectedValueOnce(new Error("Database error"));

      await resourceController.getResourceById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
