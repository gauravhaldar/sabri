import mongoose from "mongoose";

const sequenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Sequence =
  mongoose.models.Sequence || mongoose.model("Sequence", sequenceSchema);

export default Sequence;
