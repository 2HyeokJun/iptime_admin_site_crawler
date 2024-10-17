import puppeteer from "puppeteer";

(async () => {
  // 브라우저 실행
  const browser = await puppeteer.launch({ headless: false }); // headless 모드를 끄려면 false로 설정
  const page = await browser.newPage();

  // Basic Auth 설정 (아이디:패스워드 형식으로 Authorization 헤더를 설정)
  const username = "leehyeokjun";
  const password = "sunnyh!1l";
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  await page.setExtraHTTPHeaders({
    Authorization: `Basic ${auth}`,
  });

  // 접속할 웹사이트 URL
  const url = "http://asymptote.iptime.org:2358/easymesh/";

  // 페이지 접속
  await page.goto(url, { waitUntil: "networkidle2" });

  // "전체 펼침" 버튼을 찾기 (이미지 버튼을 클릭)
  // src 속성이 "Off.svg"로 되어 있는 이미지를 찾고 클릭
  await page.evaluate(() => {
    const button = document.querySelector('input[src*="Off.svg"]');
    if (button) {
      console.log("button:", button);
      button.click(); // 클릭하여 "on" 상태로 전환
    }
  });

  await browser.close();
  // 페이지 내용을 가져와서 출력
  const pageContent = await page.content();
  console.log(pageContent);

  // 브라우저 종료
  await browser.close();
})();
