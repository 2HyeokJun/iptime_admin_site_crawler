import puppeteer from 'puppeteer';
import * as db from './db.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { alert } from './alert.js'

dayjs.extend(utc);
dayjs.extend(timezone);

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page    = await browser.newPage();

  await page.authenticate({
    username: process.env.ADMIN_ID,
    password: process.env.ADMIN_PASSWORD,
  });

  await page.goto(process.env.ADMIN_SITE, { waitUntil: 'networkidle2' });

  const offButton = await page.$('div.on-off-button input[src*="Off.svg"]');
  if (offButton) {
    await offButton.click();
    await page.waitForFunction(
      () => document.querySelector('div.on-off-button input').src.includes('On.svg'),
      { timeout: 5000 }
    ).catch(() => {});
  }

  const productNames = await page.$$eval(
    'li.station-item p.clickable',
    els => els.map(el => el.textContent.trim())
  );

  await browser.close();
  const arrivedDevices = await db.getArrivingDevices(productNames)
  for (const device of arrivedDevices) {
    const isSisterHome = device.includes("누나")
    const isFatherHome = device.includes("아빠")
    if (isSisterHome) {
      await alert("arrived", "누나")
    }
    if (isFatherHome) {
      await alert("arrived", "아빠")
    }
  }
  
  await db.upsertHomeDevices(productNames);
  const leavingDevices = await db.getLeavingDevices(productNames)
  for (const device of leavingDevices) {
      const isSisterHome = device.includes("누나")
      const isFatherHome = device.includes("아빠")
      if (isSisterHome) {
        await alert("arrived", "누나")
      }
      if (isFatherHome) {
        await alert("arrived", "아빠")
      }
  }
  await db.markDevicesAway(leavingDevices)

  const now = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  console.log("크롤링 완료:", now)
})();
