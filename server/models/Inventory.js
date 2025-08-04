// It's using ES Module
import mongoose from "mongoose";

const inventorySchema = mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
