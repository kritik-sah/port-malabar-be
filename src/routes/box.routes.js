import { Router } from "express";
import { registerBox } from "../services/box.service";

export const boxRouter = Router();

boxRouter.post("/register", async (req, res) => {
  const { boxNo, version, imageUrl } = req.body;

  const { box, words } = await registerBox(boxNo, version, imageUrl);

  res.json({
    boxNo: box.boxNo,
    secretWords: words,
  });
});
