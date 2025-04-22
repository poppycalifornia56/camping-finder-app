const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class User {
  constructor(data) {
    this.schema = new mongoose.Schema({
      name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
        maxlength: [50, "Name cannot be more than 50 characters"],
      },
      email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
      password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false,
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    // Hash password before saving
    this.schema.pre("save", async function (next) {
      if (!this.isModified("password")) {
        next();
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    });

    // Sign JWT and return
    this.schema.methods.getSignedJwtToken = function () {
      return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "secretKey", {
        expiresIn: "30d",
      });
    };

    // Match user entered password to hashed password in database
    this.schema.methods.matchPassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };

    this.model = mongoose.model("User", this.schema);
  }

  async create(userData) {
    return await this.model.create(userData);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }

  async updateUser(id, userData) {
    return await this.model.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    });
  }
}

module.exports = User;
