import { sendAlert } from "./alert.js";

export const analyzePresence = async (oldData, newData) => {
  const updatedData = JSON.parse(JSON.stringify(oldData));
  const analyzeList = Object.keys(newData);
  for (const list of analyzeList) {
    const beforePresence = oldData[list]?.presence;
    const afterPresence = newData[list]?.presence;
    if (isSamePresence(beforePresence, afterPresence)) {
      updatedData[list].time = newData[list].time;
    } else if (isComeToHome(beforePresence, afterPresence)) {
      updatedData[list].presence = afterPresence;
      updatedData[list].time = newData[list].time;
      await sendAlert(list, afterPresence);
    } else if (isLeftHome(beforePresence, afterPresence)) {
      const beforeTime = new Date(oldData[list].time);
      const afterTime = new Date(newData[list].time);
      const timeInterval = getTimeIntervalMinutes(beforeTime, afterTime);
      const MINIMUM_WAITING_MINUTES = 5;
      if (timeInterval > MINIMUM_WAITING_MINUTES) {
        updatedData[list].presence = afterPresence;
        updatedData[list].time = newData[list].time;
        await sendAlert(list, afterPresence);
      }
    }
  }
  return updatedData;
};

export const isSamePresence = (beforePresence, afterPresence) => {
  return beforePresence === afterPresence;
};

export const isComeToHome = (beforePresence, afterPresence) => {
  return !beforePresence && afterPresence;
};

export const isLeftHome = (beforePresence, afterPresence) => {
  return beforePresence && !afterPresence;
};

export const getTimeIntervalMinutes = (beforeTime, afterTime) => {
  return Math.floor((afterTime - beforeTime) / (1000 * 60));
};
