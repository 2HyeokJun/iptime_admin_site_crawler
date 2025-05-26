import { sendAlert } from "./alert.js";

const MINIMUM_WAITING_MINUTES = 5;

export const analyzePresence = async (oldData, newData) => {
  const updatedData = JSON.parse(JSON.stringify(oldData));
  const entityIdsToAnalyze = Object.keys(newData);

  for (const entityId of entityIdsToAnalyze) {
    const oldEntityState = oldData[entityId];
    const newEntityState = newData[entityId]; // entityIdsToAnalyze는 newData의 키이므로 항상 존재

    // updatedData에 해당 entityId가 없을 경우 (즉, newData에 새로 추가된 경우) 초기화
    // 이렇게 하지 않으면 아래 updatedData[entityId].property 접근 시 오류 발생 가능
    if (!updatedData[entityId] && newEntityState) {
      updatedData[entityId] = {}; // 혹은 newEntityState의 구조에 맞게 초기화
    }
    
    // 업데이트 대상 객체에 대한 참조 (새로운 엔티티의 경우 위에서 생성됨)
    const targetEntityForUpdate = updatedData[entityId];

    // newEntityState가 존재하고, targetEntityForUpdate가 객체인지 확인 (방어적 코딩)
    if (!newEntityState || typeof targetEntityForUpdate !== 'object' || targetEntityForUpdate === null) {
        console.warn(`Skipping entity ${entityId}: Invalid new state or target for update.`);
        continue;
    }

    const beforePresence = oldEntityState?.presence; // oldData에는 없을 수 있으므로 Optional Chaining
    const afterPresence = newEntityState.presence;   // newData의 값은 존재한다고 가정
    const newTime = newEntityState.time;             // newData의 값은 존재한다고 가정

    if (isSamePresence(beforePresence, afterPresence)) {
      // 상태는 같지만, 시간 정보는 최신으로 업데이트
      targetEntityForUpdate.time = newTime;
    } else if (isComeToHome(beforePresence, afterPresence)) {
      // 집에 돌아온 경우
      targetEntityForUpdate.presence = afterPresence;
      targetEntityForUpdate.time = newTime;
      await sendAlert(entityId, afterPresence);
    } else if (isLeftHome(beforePresence, afterPresence)) {
      // 집을 떠난 경우
      // 떠나기 전 시간과 현재 시간 간의 간격 계산
      // oldEntityState?.time을 사용하는 것이 더 정확할 수 있음 (updatedData는 루프 내 다른 로직으로 변경되었을 수 있으나, 이 경우엔 없음)
      const previousTimeValue = oldEntityState?.time || targetEntityForUpdate.time; // 이전 시간 값 가져오기

      if (!previousTimeValue) {
        // 이전 시간 정보가 없는 경우 (예: 새로 나타난 후 바로 사라짐)
        // 이 경우, 바로 업데이트할지 또는 다른 처리를 할지 결정 필요
        console.warn(`Entity ${entityId} left home, but no previous time found. Updating directly.`);
        targetEntityForUpdate.presence = afterPresence;
        targetEntityForUpdate.time = newTime;
        await sendAlert(entityId, afterPresence);
        continue; // 다음 엔티티로 넘어감
      }
      
      const beforeTime = new Date(previousTimeValue);
      const afterTime = new Date(newTime);
      const timeInterval = getTimeIntervalMinutes(beforeTime, afterTime);

      if (timeInterval > MINIMUM_WAITING_MINUTES) {
        console.log(entityId, "isTimeIntervalOver (left home)");
        targetEntityForUpdate.presence = afterPresence;
        targetEntityForUpdate.time = newTime;
        await sendAlert(entityId, afterPresence);
      }
      // 시간 간격이 MINIMUM_WAITING_MINUTES 이하이면 아무 작업도 하지 않음 (잠깐 자리를 비운 것으로 간주)
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
