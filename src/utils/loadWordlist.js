import fs from "fs";
import path from "path";

let WORDLIST = [];

export function loadWordlist() {
  if (WORDLIST.length) return WORDLIST;

  const filePath = path.join(__dirname, "wordlist.txt");
  const data = fs.readFileSync(filePath, "utf-8");

  WORDLIST = data
    .split("\n")
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);

  if (WORDLIST.length < 512) {
    throw new Error("Wordlist too small (security risk)");
  }

  console.log(`🔐 Wordlist loaded (${WORDLIST.length} words)`);
  return WORDLIST;
}
