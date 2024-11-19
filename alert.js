export const sendAlert = async (person, presence) => {
  const presenceMessage = presence ? "Home" : "Out";
  try {
    const fetchResult = await fetch(process.env.ALERT_URL, {
      method: "PUT", // POST works too
      body: `${person} ${presenceMessage}`,
      headers: getHeaderByStatus(person, presence),
    });
    if (!fetchResult.ok) {
      throw new Error(error);
    }
  } catch (error) {
    console.error("fetch error:", error);
  }
};

export const getHeaderByStatus = (person, presence) => {
  let tag = "";
  if (person === "father" && presence) {
    tag = "skull_and_crossbones";
  } else if (person === "father" && !presence) {
    tag = "wave";
  } else {
    tag = "heavy_check_mark";
  }

  return { Tags: tag };
};
