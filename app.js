import { analyzePresence } from "./analyze.js";
import { getCurrentPresenceByCrawling } from "./crawling.js";
import { getDB, updateStatus } from "./database.js";

export const startApp = async () => {
  console.log("==============================================================");
  const currentPresence = await getCurrentPresenceByCrawling();
  const oldData = getDB();
  const updatedData = await analyzePresence(oldData, currentPresence);
  updateStatus(updatedData);
  console.log("==============================================================");
};

await startApp();
