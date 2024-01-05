import puppeteer from 'puppeteer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'redaxios';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' }); // headless: false는 브라우저가 GUI 모드로 실행됨을 의미합니다.
  const page = await browser.newPage();

  // 로그인 페이지로 이동
  await page.goto('http://asymptote.iptime.org:2358');
  await page.waitForNavigation({waitUntil: 'networkidle0'});
  page.on('console', message => console.log(message.text()));

  // 사용자 이름과 비밀번호 입력
  await page.type('input[name=username]', 'leehyeokjun');
  await page.type('input[name=passwd]', '2hayang!');

  // 로그인 버튼 클릭
  await page.click('#submit_bt'); // 로그인 버튼의 선택자에 맞게 조정해야 합니다.

  // 페이지 네비게이션이 완료될 때까지 기다림
  await page.waitForNavigation();
  // eash mesh 페이지로 이동
  const cookies = await page.cookies();
  await page.setCookie(...cookies);
  await page.goto('http://asymptote.iptime.org:2358/easymesh/?ver=14.25.4', {waitUntil: 'networkidle0'});

  let onButton = 'input[type="image"][src="/images/Off.svg?3b1aa7d109af8d51ce5c489c64872b28"]'
  await page.click(onButton);
  await page.waitForSelector('.station-item');
  const items = await page.$$eval('.station-item', elements => elements.map(el => el.textContent));
  await browser.close();

  // 브라우저 닫기

  // DB 연결
  // const __filename = fileURLToPath(import.meta.url);
  //   const __dirname = dirname(__filename);
  //   const dbPath = resolve(__dirname, 'house.db');
  //   // 데이터베이스 연결 및 초기화
  //   async function initializeDatabase() {
  //       const db = await open({
  //       filename: dbPath,
  //       driver: sqlite3.Database
  //       });

  //       await db.exec(`
  //       CREATE TABLE IF NOT EXISTS devices (
  //           mac_address TEXT PRIMARY KEY,
  //           device_name TEXT NOT NULL, 
  //           status INTEGER NOT NULL,
  //           updated_at TEXT NOT NULL
  //       )
  //       `);

  //       return db;
  //   }

  //   async function upsertData(db, key, status, updated_at) {
  //       await db.run(`
  //       INSERT INTO devices (mac_address, device_name, status, updated_at) VALUES(?, ?, ?, ?)
  //       ON CONFLICT(mac_address) DO UPDATE SET device_name = excluded.device_name, status = excluded.status, updated_at = excluded.updated_at`,
  //       key, status, updated_at
  //       );
  //   }

  //   async function getAllData(db) { 
  //     try {
  //       const rows = await db.all('SELECT key, CASE status WHEN 1 THEN "있음" ELSE "없음" END AS status, updated_at FROM devices');
  //       return rows;
  //     } catch (error) {
  //       console.error('Error fetching data from database:', error);
  //       throw error;
  //     }
  //   }





  //   const db = await initializeDatabase();

  //   let data = await getAllData(db)
  //   console.log(typeof data[0])
  //   const alertURL = 'https://ntfy.sh/house';

  //   await axios.post(alertURL, data[0]);

  //   await db.close();




//   console.log(cleanedItems);

  // 예: 페이지의 특정 요소를 크롤링하거나 스크린샷을 찍는 등의 작업

  
  
})();
