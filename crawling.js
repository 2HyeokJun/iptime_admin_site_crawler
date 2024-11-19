import puppeteer from "puppeteer";
import fs from "fs";
import { getDB, updateStatus } from "./database.js";

export const getCurrentPresenceByCrawling = async () => {
  // 브라우저 실행
  const browser = await puppeteer.launch({ headless: true }); // headless 모드를 끄려면 false로 설정
  const page = await browser.newPage();

  // Basic Auth 설정 (아이디:패스워드 형식으로 Authorization 헤더를 설정)
  const username = process.env.ADMIN_ID;
  const password = process.env.ADMIN_PW;
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  await page.setExtraHTTPHeaders({
    Authorization: `Basic ${auth}`,
  });

  // 접속할 웹사이트 URL
  const url = process.env.IPTIME_URL;

  // 페이지 접속
  await page.goto(url, { waitUntil: "networkidle2" });
  await clickOnButton(page);
  await clickOnButton(page);
  const pageContent = await page.content();
  const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
  const presenceDTO = {
    father: {
      presence:
        isFatherHome(pageContent) ||
        (isTVPowerOn(pageContent) && !isSisterHome(pageContent)),
      time: now,
    },
    sister: {
      presence: isSisterHome(pageContent),
      time: now,
    },
  };
  return presenceDTO;
};

export const clickOnButton = async (page) => {
  const selector = '.on-off-button input[type="image"]'; // on-off-button 내부의 버튼 선택

  try {
    // 선택자 대기
    await page.waitForSelector(selector, { visible: true });

    // 버튼 클릭
    await page.click(selector);
  } catch (error) {
    console.error("Failed to click the button:", error);
  }
};

export const isFatherHome = (text) => {
  return text.includes("[아빠]");
};

export const isTVPowerOn = (text) => {
  return text.includes("LGwebOSTV");
};

export const isSisterHome = (text) => {
  return text.includes("[누나]");
};
