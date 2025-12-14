import express from "express";
import { boxRouter } from "./routes/box.routes.js";
import { claimRouter } from "./routes/claim.routes.js";

export const app = express();
app.use(express.json());

app.use("/api/box", boxRouter);
app.use("/api", claimRouter);
