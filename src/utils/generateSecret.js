import { loadWordlist } from "./loadWordlist.js";

export function generateSecret(words = 12) {
  const WORDLIST = loadWordlist();
  const selected = [];
  for (let i = 0; i < words; i++) {
    const idx = Math.floor(Math.random() * WORDLIST.length);
    selected.push(WORDLIST[idx]);
  }
  return selected;
}
