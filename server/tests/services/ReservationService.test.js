const ReservationService = require("../../services/ReservationService");

// Mock the Reservation and Campsite models
const mockReservationModel = {
  create: jest.fn(),
  findById: jest.fn(),
  getUserReservations: jest.fn(),
  updateStatus: jest.fn(),
  checkAvailability: jest.fn(),
};

const mockCampsiteModel = {
  findById: jest.fn(),
};

describe("ReservationService", () => {
  const reservationService = new ReservationService(
    mockReservationModel,
    mockCampsiteModel
  );

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("should create a reservation when campsite is available", async () => {
    const mockUserId = "123";
    const mockCampsiteId = "456";
    const mockReservationData = {
      startDate: "2025-05-01",
      endDate: "2025-05-05",
      numberOfPeople: 2,
    };

    // Mock campsite exists
    mockCampsiteModel.findById.mockResolvedValue({
      id: mockCampsiteId,
      name: "Test Campsite",
      averageCost: 40,
    });

    // Mock campsite is available
    mockReservationModel.checkAvailability.mockResolvedValue(true);

    // Mock successful reservation creation
    const mockCreatedReservation = {
      ...mockReservationData,
      id: "789",
      user: mockUserId,
      campsite: mockCampsiteId,
      totalPrice: 160, // 4 days * $40
    };
    mockReservationModel.create.mockResolvedValue(mockCreatedReservation);

    const result = await reservationService.createReservation(
      mockUserId,
      mockCampsiteId,
      mockReservationData
    );

    expect(mockCampsiteModel.findById).toHaveBeenCalledWith(mockCampsiteId);
    expect(mockReservationModel.checkAvailability).toHaveBeenCalledWith(
      mockCampsiteId,
      expect.any(Date),
      expect.any(Date)
    );
    expect(mockReservationModel.create).toHaveBeenCalledWith({
      ...mockReservationData,
      user: mockUserId,
      campsite: mockCampsiteId,
      totalPrice: 160,
    });
    expect(result).toEqual(mockCreatedReservation);
  });

  test("should throw error when campsite is not available", async () => {
    const mockUserId = "123";
    const mockCampsiteId = "456";
    const mockReservationData = {
      startDate: "2025-05-01",
      endDate: "2025-05-05",
      numberOfPeople: 2,
    };

    // Mock campsite exists
    mockCampsiteModel.findById.mockResolvedValue({
      id: mockCampsiteId,
      name: "Test Campsite",
      averageCost: 40,
    });

    // Mock campsite is NOT available
    mockReservationModel.checkAvailability.mockResolvedValue(false);

    await expect(
      reservationService.createReservation(
        mockUserId,
        mockCampsiteId,
        mockReservationData
      )
    ).rejects.toThrow("Campsite is not available for the selected dates");

    expect(mockCampsiteModel.findById).toHaveBeenCalledWith(mockCampsiteId);
    expect(mockReservationModel.checkAvailability).toHaveBeenCalledWith(
      mockCampsiteId,
      expect.any(Date),
      expect.any(Date)
    );
    expect(mockReservationModel.create).not.toHaveBeenCalled();
  });

  test("should get user reservations", async () => {
    const mockUserId = "123";
    const mockReservations = [
      { id: "1", campsite: { name: "Campsite 1" } },
      { id: "2", campsite: { name: "Campsite 2" } },
    ];

    mockReservationModel.getUserReservations.mockResolvedValue(
      mockReservations
    );

    const result = await reservationService.getUserReservations(mockUserId);

    expect(mockReservationModel.getUserReservations).toHaveBeenCalledWith(
      mockUserId
    );
    expect(result).toEqual(mockReservations);
  });

  test("should cancel reservation", async () => {
    const mockUserId = "123";
    const mockReservationId = "456";
    const mockReservation = {
      id: mockReservationId,
      user: {
        _id: {
          toString: () => mockUserId,
        },
      },
      status: "confirmed",
    };

    mockReservationModel.findById.mockResolvedValue(mockReservation);
    mockReservationModel.updateStatus.mockResolvedValue({
      ...mockReservation,
      status: "cancelled",
    });

    const result = await reservationService.cancelReservation(
      mockReservationId,
      mockUserId
    );

    expect(mockReservationModel.findById).toHaveBeenCalledWith(
      mockReservationId
    );
    expect(mockReservationModel.updateStatus).toHaveBeenCalledWith(
      mockReservationId,
      "cancelled"
    );
    expect(result.status).toBe("cancelled");
  });

  test("should throw error when cancelling if user is not owner", async () => {
    const mockUserId = "123";
    const mockOtherUserId = "789";
    const mockReservationId = "456";
    const mockReservation = {
      id: mockReservationId,
      user: {
        _id: {
          toString: () => mockOtherUserId,
        },
      },
      status: "confirmed",
    };

    mockReservationModel.findById.mockResolvedValue(mockReservation);

    await expect(
      reservationService.cancelReservation(mockReservationId, mockUserId)
    ).rejects.toThrow("Not authorized to cancel this reservation");

    expect(mockReservationModel.findById).toHaveBeenCalledWith(
      mockReservationId
    );
    expect(mockReservationModel.updateStatus).not.toHaveBeenCalled();
  });
});
