import puppeteer from 'puppeteer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'redaxios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);


(async () => {
  const browser = await puppeteer.launch({ headless: 'new' }); // headless: false는 브라우저가 GUI 모드로 실행됨을 의미합니다.
  const page = await browser.newPage();

  // 로그인 페이지로 이동
  await page.goto(process.env.ADMIN_SITE);
  await page.waitForNavigation({waitUntil: 'networkidle0'});
  page.on('console', message => console.log(message.text()));

  // 사용자 이름과 비밀번호 입력
  await page.type('input[name=username]', process.env.ADMIN_ID);
  await page.type('input[name=passwd]', process.env.ADMIN_PASSWORD);

  // 로그인 버튼 클릭
  await page.click('#submit_bt'); // 로그인 버튼의 선택자에 맞게 조정해야 합니다.

  // 페이지 네비게이션이 완료될 때까지 기다림
  await page.waitForNavigation();
  // easy mesh 페이지로 이동
  const cookies = await page.cookies();
  await page.setCookie(...cookies);
  await page.goto(`${process.env.ADMIN_SITE}/easymesh/?ver=14.25.4`, {waitUntil: 'networkidle0'});

  let onButton = `input[type="image"][src="${process.env.OFF_IMAGE_SOURCE}"]`
  await page.click(onButton);
  await page.waitForSelector('.station-item');
  const items = await page.$$eval('.station-item', elements => elements.map(el => el.textContent));
  const connectedDevices = items.map(element => element.replaceAll('\n', '').replaceAll('\t', ''));
  console.log('connectedDevices:', connectedDevices)
  await browser.close();
  

  // 브라우저 닫기

  // DB 연결
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const dbPath = resolve(__dirname, 'house.db');
  // 데이터베이스 연결 및 초기화
  async function initializeDatabase() {
      const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
      });

      await db.exec(`
      CREATE TABLE IF NOT EXISTS devices (
          device_name TEXT PRIMARY KEY NOT NULL, 
          status INTEGER NOT NULL,
          alert INTEGER NOT NULL DEFAULT 0,
          updated_at TEXT NOT NULL
      )
      `);

      return db;
  }

  async function createData(db, device_name, status, updated_at) {
      await db.run(`INSERT INTO devices (device_name, status, updated_at) VALUES(?, ?, ?)`, device_name, status, updated_at);
  }

  async function updateDeviceStatus(db, device_name, status, updated_at) {
    try {
      const rows = await db.run(`UPDATE devices SET status = ?, alert = ?, updated_at = ? WHERE device_name = ?`, status, updated_at, device_name);
      return rows;
    } catch (error) {
      console.error('Error fetching data from database:', error);
      throw error;
    }
  }

  async function getAllData(db) { 
    try {
      const rows = await db.all(`SELECT device_name, status, updated_at FROM devices`);
      return rows;
    } catch (error) {
      console.error('Error fetching data from database:', error);
      throw error;
    }
  }

  async function updateAlert(db, device_name, alert) {
    try {
      const rows = await db.run(`UPDATE devices SET alert = ? WHERE device_name = ?`, alert, device_name);
      return rows;
    } catch (error) {
      console.error('Error fetching data from database:', error);
      throw error;
    }
  }




  const db = await initializeDatabase();
  let db_data = await getAllData(db);

  for (const element of connectedDevices) {
    
  }
  



  const alertURL = 'https://ntfy.sh/house';

  // await axios.post(alertURL, data[0]);

  await db.close();
})();
