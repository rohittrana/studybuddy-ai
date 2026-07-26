import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    text: { type: String, required: true },
    chunkIndex: { type: Number, required: true },
    embedding: { type: [Number], required: true }, // vector array
  },
  { timestamps: true }
);

chunkSchema.index({ document: 1 });

const Chunk = mongoose.model("Chunk", chunkSchema);
export default Chunk;
