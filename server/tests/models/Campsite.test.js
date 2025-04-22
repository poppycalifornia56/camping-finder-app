const mongoose = require("mongoose");
const Campsite = require("../../models/Campsite");
const User = require("../../models/User");

describe("Campsite Model", () => {
  let userId;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/camping-finder-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a user to reference in campsites
    const userModel = new User();
    const user = await userModel.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    userId = user._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  const campsiteModel = new Campsite();

  test("should create a new campsite", async () => {
    const campsiteData = {
      name: "Test Campground",
      description: "A beautiful test campground",
      address: "123 Test St, Test City, TS",
      facilities: ["Electric Hookups", "Water Hookups", "WiFi"],
      user: userId,
    };

    const campsite = await campsiteModel.create(campsiteData);

    expect(campsite).toHaveProperty("_id");
    expect(campsite.name).toBe(campsiteData.name);
    expect(campsite.facilities).toEqual(
      expect.arrayContaining(campsiteData.facilities)
    );
    expect(campsite.user.toString()).toBe(userId.toString());
  });

  test("should get all campsites", async () => {
    const campsites = [
      {
        name: "Test Campground 1",
        description: "A beautiful test campground",
        address: "123 Test St, Test City, TS",
        facilities: ["Electric Hookups", "Water Hookups"],
        user: userId,
      },
      {
        name: "Test Campground 2",
        description: "Another beautiful test campground",
        address: "456 Test Ave, Test Town, TS",
        facilities: ["WiFi", "Showers", "Pool"],
        user: userId,
      },
    ];

    await campsiteModel.model.create(campsites);
    const foundCampsites = await campsiteModel.getAll();

    expect(foundCampsites.length).toBe(2);
    expect(foundCampsites[0].name).toBe(campsites[0].name);
    expect(foundCampsites[1].name).toBe(campsites[1].name);
  });

  test("should find campsite by ID", async () => {
    const campsiteData = {
      name: "Test Campground",
      description: "A beautiful test campground",
      address: "123 Test St, Test City, TS",
      facilities: ["Electric Hookups", "Water Hookups"],
      user: userId,
    };

    const createdCampsite = await campsiteModel.create(campsiteData);
    const foundCampsite = await campsiteModel.findById(createdCampsite._id);

    expect(foundCampsite._id).toEqual(createdCampsite._id);
    expect(foundCampsite.name).toBe(campsiteData.name);
  });

  test("should update campsite", async () => {
    const campsiteData = {
      name: "Test Campground",
      description: "A beautiful test campground",
      address: "123 Test St, Test City, TS",
      facilities: ["Electric Hookups", "Water Hookups"],
      user: userId,
    };

    const createdCampsite = await campsiteModel.create(campsiteData);

    const updatedData = {
      name: "Updated Campground",
      description: "Updated description",
    };

    const updatedCampsite = await campsiteModel.update(
      createdCampsite._id,
      updatedData
    );

    expect(updatedCampsite.name).toBe(updatedData.name);
    expect(updatedCampsite.description).toBe(updatedData.description);
    expect(updatedCampsite.facilities).toEqual(campsiteData.facilities); // Facilities should remain unchanged
  });

  test("should delete campsite", async () => {
    const campsiteData = {
      name: "Test Campground",
      description: "A beautiful test campground",
      address: "123 Test St, Test City, TS",
      facilities: ["Electric Hookups", "Water Hookups"],
      user: userId,
    };

    const createdCampsite = await campsiteModel.create(campsiteData);
    await campsiteModel.delete(createdCampsite._id);

    const foundCampsite = await campsiteModel.findById(createdCampsite._id);
    expect(foundCampsite).toBeNull();
  });

  test("should find campsites within radius", async () => {
    const campsites = [
      {
        name: "Near Campground",
        description: "A campground near the search point",
        address: "Near Address",
        location: {
          type: "Point",
          coordinates: [-118.2437, 34.0522], // Los Angeles
        },
        facilities: ["Electric Hookups"],
        user: userId,
      },
      {
        name: "Far Campground",
        description: "A campground far from the search point",
        address: "Far Address",
        location: {
          type: "Point",
          coordinates: [-74.006, 40.7128], // New York
        },
        facilities: ["WiFi"],
        user: userId,
      },
    ];

    await campsiteModel.model.create(campsites);

    // Search near Los Angeles with small radius
    const nearbyCampsites = await campsiteModel.getWithinRadius(
      -118.2437,
      34.0522,
      10
    );

    expect(nearbyCampsites.length).toBe(1);
    expect(nearbyCampsites[0].name).toBe("Near Campground");
  });
});
