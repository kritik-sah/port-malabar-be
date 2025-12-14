import { keccak256, toBytes } from "viem";

export function hashSecret(words) {
  return keccak256(toBytes(words.join(" ").toLowerCase()));
}
