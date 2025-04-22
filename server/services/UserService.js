class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async register(userData) {
    return await this.userModel.create(userData);
  }

  async login(email, password) {
    const user = await this.userModel.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  async getUserProfile(userId) {
    return await this.userModel.findById(userId);
  }

  async updateUserProfile(userId, userData) {
    // Don't allow role to be updated
    if (userData.role) {
      delete userData.role;
    }

    return await this.userModel.updateUser(userId, userData);
  }
}

module.exports = UserService;
