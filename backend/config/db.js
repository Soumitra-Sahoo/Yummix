import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://soumitrasahoo030_db_user:RaDPEYI9u3MREgAI@cluster0.ecw0j7f.mongodb.net/food-del"
    );
    console.log("DB Connected!");
  } catch (error) {
    console.error("DB Connection Failed:", error);
  }
};
