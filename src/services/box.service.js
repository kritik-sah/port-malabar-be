import { Box } from "../models/Box";
import { generateSecret } from "../utils/generateSecret";
import { hashSecret } from "../utils/hashSecret";

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
