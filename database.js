import fs from "fs";

export const getDB = () => {
  const filePath = "./db.json"; // db.json 파일 경로

  // db.json 파일 읽기
  if (!fs.existsSync(filePath)) {
    console.error("db.json 파일이 존재하지 않습니다.");
    return;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const db = JSON.parse(fileContent);
  return db;
};

export const updateStatus = (status) => {
  console.log(status);
  const filePath = "./db.json";

  // 기존 db.json 파일 읽기
  let db = {};
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    db = JSON.parse(fileContent);
  }

  // 새로운 상태 추가
  db = { ...db, ...status };

  // db.json에 저장
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf8");
};
