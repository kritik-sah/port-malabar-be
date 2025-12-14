import { Router } from "express";
import { claimBox } from "../services/claim.service.js";
import { claimLimiter } from "../utils/rateLimiter.js";

export const claimRouter = Router();

claimRouter.post("/claim", claimLimiter, async (req, res) => {
  const { boxNo, words, userAddress } = req.body;

  try {
    const result = await claimBox(boxNo, words, userAddress);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
