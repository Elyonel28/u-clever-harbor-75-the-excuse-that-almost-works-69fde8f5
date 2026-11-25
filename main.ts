// The Excuse That Almost Works
// make.fun bounty: u-clever-harbor-75-the-excuse-that-almost-works-69fde8f5
//
// The program writes ONE line of plain text to output/entry.txt:
// the single text a gamer sends their boss to skip work during
// GTA 6 launch week. Gate: UTF-8, 1-140 chars, at most 20 words,
// one line, no setup, no explanation, no signature.
//
// Why this excuse: a tired manager has heard every wild story
// twice. What almost gets believed is the opposite -- a real,
// specific, boring chore that someone else scheduled and that
// forces you to be home. A landlord's annual gas safety check
// is exactly that: yearly, not your choice of timing, and
// "someone has to be in" leaves the manager no workaround to
// offer. The laugh is in the mundanity itself.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const EXCUSE =
  "Sorry, landlord's doing the annual gas safety check this morning and someone has to be in";

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validate(text) {
  const chars = [...text].length;
  if (text.length === 0 || text.trim().length === 0) {
    throw new Error("excuse is empty");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("excuse must be a single line");
  }
  if (chars > 140) {
    throw new Error(`excuse is ${chars} characters, over the 140 limit`);
  }
  const words = wordCount(text);
  if (words > 20) {
    throw new Error(`excuse is ${words} words, over the 20-word limit`);
  }
  return { chars, words };
}

function main() {
  const { chars, words } = validate(EXCUSE);

  // The sandbox collects /output/entry.txt; also write a copy next
  // to the working directory so a local run can be inspected.
  // At least one of the two writes must succeed.
  const here = dirname(fileURLToPath(import.meta.url));
  const targets = ["/output/entry.txt", join(here, "output", "entry.txt")];
  let written = 0;
  for (const target of targets) {
    try {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, EXCUSE, "utf8");
      written += 1;
    } catch {
      // /output may not exist outside the sandbox; the local copy
      // is the fallback, so a failure here is not fatal on its own.
    }
  }
  if (written === 0) {
    throw new Error("could not write entry.txt to any target");
  }

  console.log(`excuse (${words} words, ${chars} chars): ${EXCUSE}`);
}

main();
