import { Box } from "../models/Box.js";
import { generateSecret } from "../utils/generateSecret.js";
import { hashSecret } from "../utils/hashSecret.js";

export async function registerBox(boxNo, version, imageUrl) {
  const words = generateSecret();
  const secretHash = hashSecret(words);

  const box = await Box.create({
    boxNo,
    version,
    imageUrl,
    secretHash,
  });

  return { box, words }; // words printed inside box
}
