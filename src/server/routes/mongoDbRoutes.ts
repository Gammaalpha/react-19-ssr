import { Router, Request, Response } from "express";
import { Record } from "../models/Record";
import { RecordModel } from "../models/Record";
import crypto from "crypto";

const mongoDBRouter = Router();

// Get all records
mongoDBRouter.get(
  "/records",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const records = await RecordModel.aggregate([
        {
          $sort: { createdAt: -1 }, // 1 for ascending, -1 for descending
        },
        {
          $group: {
            _id: "$recordId",
            createdAt: { $first: "$createdAt" },
            description: { $first: "$description" },
          },
        },
        {
          $project: {
            recordId: "$_id",
            description: 1,
            createdAt: 1,
            _id: 0,
          },
        },
        {
          $sort: { createdAt: 1 }, // 1 for ascending, -1 for descending
        },
      ]);
      res.json(records);
    } catch (error) {
      console.error("Error fetching records: ", error);
      res.status(500).json({ error: "Failed to fetch records" });
    }
  }
);

// Get one record by id with limit 1
mongoDBRouter.get(
  "/records/:recordId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { recordId } = req.params;

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
  "/records/:recordId/all",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { recordId } = req.params;

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

// Add a record to the records collection
mongoDBRouter.post(
  "/records",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, description, recordId } = req.body;
      if (!type) {
        res.status(400).json({ error: "type is required" });
        return;
      }

      const record: Record = {
        type,
        description,
        recordId: recordId || crypto.randomUUID(),
      };
      const newRecord = new RecordModel(record);
      const savedRecord = await newRecord.save();

      res
        .status(201)
        .json({
          _id: savedRecord._id,
          createdAt: savedRecord.createdAt,
          ...record,
        });
    } catch (error) {
      console.error("Error creating record: ", error);
      res.status(500).json({ error: "Failed to create record" });
    }
  }
);

export { mongoDBRouter };
