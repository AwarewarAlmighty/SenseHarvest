import mongoose from "mongoose";

const employeeSchema = mongoose.Schema(
  {
    cardId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['employee', 'admin'],
      default: 'employee',
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
