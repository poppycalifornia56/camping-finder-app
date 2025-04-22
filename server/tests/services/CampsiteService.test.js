const CampsiteService = require("../../services/CampsiteService");

// Mock the Campsite model
const mockCampsiteModel = {
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getWithinRadius: jest.fn(),
};

describe("CampsiteService", () => {
  const campsiteService = new CampsiteService(mockCampsiteModel);

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("should get all campsites with filters", async () => {
    const mockCampsites = [
      { id: "1", name: "Campsite 1", facilities: ["WiFi", "Showers"] },
      { id: "2", name: "Campsite 2", facilities: ["Electric Hookups"] },
    ];

    mockCampsiteModel.getAll.mockResolvedValue(mockCampsites);

    const filters = {
      facilities: "WiFi,Showers",
      minRating: "4",
      maxCost: "50",
    };

    const result = await campsiteService.getAllCampsites(filters);

    expect(mockCampsiteModel.getAll).toHaveBeenCalledWith({
      facilities: { $all: ["WiFi", "Showers"] },
      averageRating: { $gte: 4 },
      averageCost: { $lte: 50 },
    });

    expect(result).toEqual(mockCampsites);
  });

  test("should get campsite by ID", async () => {
    const mockCampsite = { id: "1", name: "Campsite 1" };
    mockCampsiteModel.findById.mockResolvedValue(mockCampsite);

    const result = await campsiteService.getCampsiteById("1");

    expect(mockCampsiteModel.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockCampsite);
  });

  test("should create a new campsite", async () => {
    const mockCampsiteData = {
      name: "New Campsite",
      description: "Test description",
    };
    const mockUserId = "123";
    const mockCreatedCampsite = {
      ...mockCampsiteData,
      user: mockUserId,
      id: "1",
    };

    mockCampsiteModel.create.mockResolvedValue(mockCreatedCampsite);

    const result = await campsiteService.createCampsite(
      mockCampsiteData,
      mockUserId
    );

    expect(mockCampsiteModel.create).toHaveBeenCalledWith({
      ...mockCampsiteData,
      user: mockUserId,
    });
    expect(result).toEqual(mockCreatedCampsite);
  });

  test("should update campsite if user is owner", async () => {
    const mockCampsiteId = "1";
    const mockUserId = "123";
    const mockUpdateData = { name: "Updated Name" };

    mockCampsiteModel.findById.mockResolvedValue({
      id: mockCampsiteId,
      user: mockUserId,
    });
    mockCampsiteModel.update.mockResolvedValue({
      id: mockCampsiteId,
      ...mockUpdateData,
      user: mockUserId,
    });

    const result = await campsiteService.updateCampsite(
      mockCampsiteId,
      mockUpdateData,
      mockUserId
    );

    expect(mockCampsiteModel.findById).toHaveBeenCalledWith(mockCampsiteId);
    expect(mockCampsiteModel.update).toHaveBeenCalledWith(
      mockCampsiteId,
      mockUpdateData
    );
    expect(result).toEqual({
      id: mockCampsiteId,
      ...mockUpdateData,
      user: mockUserId,
    });
  });

  test("should throw error when updating if user is not owner", async () => {
    const mockCampsiteId = "1";
    const mockUserId = "123";
    const mockOtherUserId = "456";
    const mockUpdateData = { name: "Updated Name" };

    mockCampsiteModel.findById.mockResolvedValue({
      id: mockCampsiteId,
      user: mockOtherUserId,
      toString: () => mockOtherUserId,
    });

    await expect(
      campsiteService.updateCampsite(mockCampsiteId, mockUpdateData, mockUserId)
    ).rejects.toThrow("Not authorized to update this campsite");
  });

  test("should find campsites nearby", async () => {
    const mockLongitude = -118.2437;
    const mockLatitude = 34.0522;
    const mockRadius = 20;
    const mockNearbyCampsites = [
      { id: "1", name: "Nearby Campsite 1" },
      { id: "2", name: "Nearby Campsite 2" },
    ];

    mockCampsiteModel.getWithinRadius.mockResolvedValue(mockNearbyCampsites);

    const result = await campsiteService.findCampsitesNearby(
      mockLongitude,
      mockLatitude,
      mockRadius
    );

    expect(mockCampsiteModel.getWithinRadius).toHaveBeenCalledWith(
      mockLongitude,
      mockLatitude,
      mockRadius
    );
    expect(result).toEqual(mockNearbyCampsites);
  });
});
