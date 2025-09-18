import mongoose from "mongoose";
const BookInfoSchema = mongoose.Schema({
  name: {
    type: String,
    required:true,
    unique:true,
  },
  pages: {
    type: Number,
    required: true,
  },

  stories:{
    type:[String],
    required:true,
  }
});
const Book=mongoose.model("Book",BookInfoSchema);
export default Book;