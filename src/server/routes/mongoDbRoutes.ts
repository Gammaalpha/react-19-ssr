import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Record } from "../models/Record";
import { RecordModel } from "../models/Record";

const mongoDBRouter = Router();

// Get all records
mongoDBRouter.get(
  "/records",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const records = await RecordModel.find().sort({ createdAt: -1 });
      res.json(records);
    } catch (error) {
      console.error("Error fetching records: ", error);
      res.status(500).json({ error: "Failed to fetch records" });
    }
  }
);

// Get one record by id with limit 1
mongoDBRouter.get(
  "/record/:recordId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { recordId } = req.params;
      if (!ObjectId.isValid(recordId)) {
        res.status(400).json({ error: "Invalid record ID" });
        return;
      }

      const record = await RecordModel.findOne({ recordId })
        .sort({ createdAt: -1 })
        .limit(1);
      if (!record) {
        res.status(404).json({ error: "Record not found" });
        return;
      }
      res.json(record);
    } catch (error) {
      console.error("Error fetching record: ", error);
      res.status(500).json({ error: "Failed to fetch record" });
    }
  }
);

// Get all available record history by id
mongoDBRouter.get(
  "/record/:recordId/all",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { recordId } = req.params;
      if (!ObjectId.isValid(recordId)) {
        res.status(400).json({ error: "Invalid record ID" });
        return;
      }

      const records = await RecordModel.find({ recordId }).sort({
        createdAt: -1,
      });
      if (!records.length) {
        res.status(404).json({ error: "Records not found by id" });
        return;
      }
      res.json(records);
    } catch (error) {
      console.error("Error fetching record: ", error);
      res.status(500).json({ error: "Failed to fetch record" });
    }
  }
);

// Add a record
mongoDBRouter.post(
  "/records",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, description } = req.body;
      if (!type) {
        res.status(400).json({ error: "type is required" });
        return;
      }

      const record: Record = {
        type,
        description,
      };
      const newRecord = new RecordModel(record);
      const savedRecord = await newRecord.save();

      res.status(201).json({ _id: savedRecord._id, ...record });
    } catch (error) {
      console.error("Error creating record: ", error);
      res.status(500).json({ error: "Failed to create record" });
    }
  }
);

export { mongoDBRouter };
