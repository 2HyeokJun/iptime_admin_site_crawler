import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function initDB() {
  const db = await open({
    filename: './house.db',
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS device_histories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_name TEXT NOT NULL UNIQUE,
      is_home INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

// 1. 전달받은 deviceNames에 대해 모두 is_home = 1, updated_at = now로 upsert
export async function upsertHomeDevices(deviceNames) {
  if (!deviceNames.length) return;
  const db = await initDB();
  const now = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  const placeholders = deviceNames.map(() => '(?, 1, ?)').join(',');
  const params = deviceNames.flatMap(name => [name, now]);
  await db.run(
    `INSERT INTO device_histories (device_name, is_home, updated_at)
     VALUES ${placeholders}
     ON CONFLICT(device_name) DO UPDATE
       SET is_home = 1,
           updated_at = excluded.updated_at;`,
    params
  );
  await db.close();
}

// 2. deviceNames에는 없는데 is_home = 1이고 updated_at이 5분 이상 지난 device_name을 리턴
export async function getLeavingDevices(deviceNames) {
  const db = await initDB();
  const threshold = dayjs().tz('Asia/Seoul').subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss');
  let rows;
  if (deviceNames.length) {
    const placeholders = deviceNames.map(() => '?').join(',');
    rows = await db.all(
      `SELECT device_name FROM device_histories
       WHERE is_home = 1
         AND device_name NOT IN (${placeholders})
         AND updated_at <= ?;`,
      [...deviceNames, threshold]
    );
  } else {
    rows = await db.all(
      `SELECT device_name FROM device_histories
       WHERE is_home = 1
         AND updated_at <= ?;`,
      [threshold]
    );
  }
  await db.close();
  return rows.map(r => r.device_name);
}

// 3. 전달받은 deviceNames에 대해 모두 is_home = 0, updated_at = now로 update
export async function markDevicesAway(deviceNames) {
  if (!deviceNames.length) return;
  const db = await initDB();
  const now = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  const placeholders = deviceNames.map(() => '?').join(',');
  await db.run(
    `UPDATE device_histories
     SET is_home = 0,
         updated_at = ?
     WHERE device_name IN (${placeholders});`,
    [now, ...deviceNames]
  );
  await db.close();
}

// 4. is_home = 0인데 deviceNames에 있는 장비들을 조회
export async function getArrivingDevices(deviceNames) {
  if (!deviceNames.length) return [];
  const db = await initDB();
  const placeholders = deviceNames.map(() => '?').join(',');
  const rows = await db.all(
    `SELECT device_name FROM device_histories
     WHERE is_home = 0
       AND device_name IN (${placeholders});`,
    deviceNames
  );
  await db.close();
  return rows.map(r => r.device_name);
}

export async function selectAllDevices() {
  const db = await initDB()
  const rows = await db.all(
    `SELECT device_name, is_home, updated_at FROM device_histories`
  )
  await db.close();
  return rows
}
