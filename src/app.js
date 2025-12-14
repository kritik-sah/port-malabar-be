import express from "express";
import { boxRouter } from "./routes/box.routes";
import { claimRouter } from "./routes/claim.routes";

export const app = express();
app.use(express.json());

app.use("/api/box", boxRouter);
app.use("/api", claimRouter);
