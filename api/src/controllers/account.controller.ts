import { Request, Response } from "express";
import { getHoldings } from "../services/investmentService";

export const getAllHoldings = async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const offset = req.query.offset ? Number(req.query.offset) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  try {
    const { results, count } = await getHoldings(accountId, offset, limit);

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No holdings found", results: [], count: 0 });
    }

    return res.status(200).json({ results, count });
  } catch (error) {
    console.error("Error fetching holdings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
