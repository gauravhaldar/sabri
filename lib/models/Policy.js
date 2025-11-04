import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

const Policy = mongoose.models.Policy || mongoose.model("Policy", policySchema);

export default Policy;


