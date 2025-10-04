import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: 
  { 
    type: String, 
    required: true 
  },
  email: 
  { 
    type: String,
    required: true,
    unique: true 
  },
  mobile: 
  { 
    type: String,
    required: true 
  },
  gender: 
  { 
    type: String, 
    enum: ["Male", "Female", "Other"] 
  },
  dob: 
  { 
    type: Date 
  },
  qualification: 
  { 
    type: String ,
    required: true 
  }
  ,
  experience: 
  { 
    type: String ,
    required: true 

  },
  skills: 
  { 
    type: [String], 
    default: [] ,
    required: true 
  },
  portfolio:
  { 
    type: String 
  },
  resume: 
  {
    data: Buffer,
    contentType: String,
    fileName: String,
    size: Number
  },
  about: 
  { 
    type: String 
  },
  newPassword: 
  { 
    type: String, 
  },
  confirmPassword: 
  { 
    type: String, 
  },
  createdAt: 
  { 
    type: Date, 
    default: Date.now 
  },
});

const User = mongoose.model("User", userSchema);

export default User;
