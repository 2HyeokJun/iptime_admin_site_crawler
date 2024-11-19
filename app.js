import { analyzePresence } from "./analyze.js";
import { getCurrentPresenceByCrawling } from "./crawling.js";
import { getDB, updateStatus } from "./database.js";

export const startApp = async () => {
  const currentPresence = await getCurrentPresenceByCrawling();
  const oldData = getDB();
  await analyzePresence(oldData, currentPresence);
  updateStatus(currentPresence);
  process.exit(1);
};

await startApp();
