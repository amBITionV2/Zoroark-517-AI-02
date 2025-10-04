import User from "../modules/usermodule.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      gender,
      dob,
      qualification,
      experience,
      skills,
      portfolio,
      about,
      newPassword,
      confirmPassword,
      resume
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if passwords match
    if (newPassword === confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Create new user
    const user = new User({
      fullName,
      email,
      mobile,
      gender,
      dob,
      qualification,
      experience,
      skills,
      portfolio,
      about,
      newPassword: hashedPassword,
      confirmPassword: hashedPassword, // optional, stored hashed
      resume
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.newPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};