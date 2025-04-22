const mongoose = require("mongoose");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

describe("User Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/camping-finder-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  test("should create a new user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "user",
    };

    const user = await User.create(userData);

    expect(user).toHaveProperty("_id");
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    // Password should be hashed
    expect(user.password).not.toBe(userData.password);
    // Optional: Check that it's hashed
    expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
  });

  test("should find user by ID", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const createdUser = await User.create(userData);
    const foundUser = await User.findById(createdUser._id);

    expect(foundUser._id.toString()).toEqual(createdUser._id.toString());
    expect(foundUser.name).toBe(userData.name);
  });

  test("should find user by email", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    await User.create(userData);
    const foundUser = await User.findOne({ email: userData.email });

    expect(foundUser).not.toBeNull();
    expect(foundUser.email).toBe(userData.email);
  });
});
