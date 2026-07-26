import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    front: { type: String, required: true }, // term / question
    back: { type: String, required: true }, // definition / answer
  },
  { timestamps: true }
);

const Flashcard = mongoose.model("Flashcard", flashcardSchema);
export default Flashcard;
