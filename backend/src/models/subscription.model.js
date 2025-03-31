import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  priceId: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "cancelled", "pending"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
