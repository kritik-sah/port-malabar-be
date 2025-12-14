import { Box } from "../models/Box";
import { hashSecret } from "../utils/hashSecret";
import { signMint } from "./signer.service";

export async function claimBox(boxNo, words, user) {
  const box = await Box.findOne({ boxNo });
  if (!box) throw new Error("Box not found");
  if (box.claimed) throw new Error("Already claimed");

  const providedHash = hashSecret(words);

  if (providedHash !== box.secretHash) {
    box.failedAttempts += 1;
    await box.save();
    throw new Error("Invalid secret");
  }

  const signature = await signMint(user, box.boxNo, box.version, box.imageUrl);

  return {
    boxNo: box.boxNo,
    version: box.version,
    imageUrl: box.imageUrl,
    signature,
  };
}
