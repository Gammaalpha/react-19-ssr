import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export type RecordType = "NEW" | "UPDATED";

export interface Record {
  _id?: ObjectId;
  recordId?: string;
  type: RecordType;
  description?: string;
  createdAt?: string;
}

const recordSchema = new mongoose.Schema({
  recordId: {
    type: String,
    required: [true, "Record ID is required"],
  },
  type: { type: String, required: [true, "Type is required"] },
  description: { type: String },
  createdAt: { type: String, default: new Date().toISOString() },
});

export const RecordModel = mongoose.model("Record", recordSchema);
