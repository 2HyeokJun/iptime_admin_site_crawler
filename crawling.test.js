import { analyzePresence } from "./analyze";

describe("analyze 테스트", () => {
  let oldData;
  beforeEach(() => {
    oldData = {
      father: {
        presence: true,
        time: "2024-11-19T10:11:06.229Z",
      },
    };
  });
  test("재실 상태가 이전과 똑같을때 시간만 업데이트되는지 확인", async () => {
    const newData = {
      father: {
        presence: true,
        time: "2024-11-19T10:28:06.229Z",
      },
    };
    const analyzedData = await analyzePresence(oldData, newData);
    const { presence, time } = analyzedData.father;
    expect(presence).toBe(true);
    expect(
      new Date(time).getTime() - new Date(oldData.father.time).getTime() > 0
    ).toBe(true);
  });
  test("집에 들어왔을때 presence가 변경되는지 확인", async () => {
    oldData.father.presence = false;
    const newData = {
      father: {
        presence: true,
        time: "2024-11-19T10:28:06.229Z",
        alert: true,
      },
    };
    const analyzedData = await analyzePresence(oldData, newData);
    const { presence, time } = analyzedData.father;
    expect(presence).toBe(true);
    expect(
      new Date(time).getTime() - new Date(oldData.father.time).getTime() > 0
    ).toBe(true);
  });
  test("집에 없은지 5분 미만이면 시간이 변경되지 않는지 확인", async () => {
    const newData = {
      father: {
        presence: false,
        time: "2024-11-19T10:12:06.229Z",
        alert: true,
      },
    };
    const analyzedData = await analyzePresence(oldData, newData);
    const { presence, time } = analyzedData.father;
    expect(presence).toBe(true);
    expect(
      new Date(time).getTime() - new Date(oldData.father.time).getTime() === 0
    ).toBe(true);
  });
  test("집에 없은지 5분 이상이면 알람이 가는지 확인", async () => {
    const newData = {
      father: {
        presence: false,
        time: "2024-11-19T11:00:06.229Z",
        alert: true,
      },
    };
    const analyzedData = await analyzePresence(oldData, newData);
    const { presence, time } = analyzedData.father;
    expect(presence).toBe(false);
    expect(
      new Date(time).getTime() - new Date(oldData.father.time).getTime() > 0
    ).toBe(true);
  });
});
