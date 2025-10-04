const userSchema = new mongoose.Schema({
  // ... existing fields
  resume: {
    data: Buffer,
    contentType: String,
    fileName: String,
    size: Number,
  },
  resumeText: {
    type: String, // store all extracted text
    default: "",
  },
});
