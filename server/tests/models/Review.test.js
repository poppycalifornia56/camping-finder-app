const mongoose = require("mongoose");
const Review = require("../../models/Review");
const User = require("../../models/User");
const Campsite = require("../../models/Campsite");

describe("Review Model", () => {
  let userId;
  let campsiteId;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/camping-finder-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a user and campsite to reference in reviews
    const userModel = new User();
    const user = await userModel.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    userId = user._id;

    const campsiteModel = new Campsite();
    const campsite = await campsiteModel.create({
      name: "Test Campground",
      description: "A beautiful test campground",
      address: "123 Test St, Test City, TS",
      facilities: ["Electric Hookups", "Water Hookups"],
      user: userId,
    });
    campsiteId = campsite._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await mongoose.connection.collection("reviews").deleteMany({});
  });

  const reviewModel = new Review();

  test("should create a new review", async () => {
    const reviewData = {
      title: "Great Place",
      text: "Had a wonderful time here!",
      rating: 5,
      campsite: campsiteId,
      user: userId,
    };

    const review = await reviewModel.create(reviewData);

    expect(review).toHaveProperty("_id");
    expect(review.title).toBe(reviewData.title);
    expect(review.rating).toBe(reviewData.rating);
    expect(review.campsite.toString()).toBe(campsiteId.toString());
    expect(review.user.toString()).toBe(userId.toString());
  });

  test("should get all reviews for a campsite", async () => {
    const reviews = [
      {
        title: "Great Place",
        text: "Had a wonderful time here!",
        rating: 5,
        campsite: campsiteId,
        user: userId,
      },
      {
        title: "Good Experience",
        text: "Enjoyed my stay.",
        rating: 4,
        campsite: campsiteId,
        user: userId,
      },
    ];

    await reviewModel.model.create(reviews);
    const foundReviews = await reviewModel.getAll(campsiteId);

    expect(foundReviews.length).toBe(2);
    expect(foundReviews[0].title).toBe(reviews[0].title);
    expect(foundReviews[1].title).toBe(reviews[1].title);
  });

  test("should calculate average rating for campsite", async () => {
    const reviews = [
      {
        title: "Great Place",
        text: "Had a wonderful time here!",
        rating: 5,
        campsite: campsiteId,
        user: userId,
      },
      {
        title: "Good Experience",
        text: "Enjoyed my stay.",
        rating: 4,
        campsite: campsiteId,
        user: userId,
      },
      {
        title: "Average",
        text: "It was okay.",
        rating: 3,
        campsite: campsiteId,
        user: userId,
      },
    ];

    await reviewModel.model.create(reviews);

    // Get the updated campsite to check if average rating was calculated
    const campsiteModel = new Campsite();
    const campsite = await campsiteModel.findById(campsiteId);

    // Average of 5 + 4 + 3 = 12 / 3 = 4
    expect(campsite.averageRating).toBe(4);
  });

  test("should prevent user from submitting duplicate reviews", async () => {
    const reviewData = {
      title: "Great Place",
      text: "Had a wonderful time here!",
      rating: 5,
      campsite: campsiteId,
      user: userId,
    };

    await reviewModel.create(reviewData);

    // Attempt to create a second review for the same user/campsite
    await expect(reviewModel.create(reviewData)).rejects.toThrow();
  });
});
