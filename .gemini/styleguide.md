# Company X JavaScript 스타일 가이드

# 소개
이 스타일 가이드는 Company X에서 개발되는 JavaScript 코드의 코딩 컨벤션을 설명합니다.
널리 알려진 커뮤니티 스타일 가이드(예: Airbnb, Google, StandardJS)를 기반으로 하지만, 우리 조직 내의 특정 요구 사항과 선호도를 반영하기 위해 일부 조정되었습니다.

# 핵심 원칙
*   **가독성:** 코드는 모든 팀 구성원이 이해하기 쉬워야 합니다.
*   **유지보수성:** 코드는 수정하고 확장하기 쉬워야 합니다.
*   **일관성:** 모든 프로젝트에서 일관된 스타일을 고수하면 협업을 개선하고 오류를 줄일 수 있습니다.
*   **성능:** 가독성이 가장 중요하지만, 코드는 효율적이어야 합니다.

# 주요 가이드라인 (일반적인 모범 사례 기반)

## 언어
*   **사용 언어:** 한국어 (모든 코드 리뷰는 한국어로 이루어집니다.).

## 줄 길이
*   **최대 줄 길이:** 100자 (일부 가이드는 80 또는 120자를 권장하기도 합니다).
    *   최신 화면은 더 넓은 줄을 허용하여 많은 경우 코드 가독성을 향상시킵니다.
    *   긴 문자열, URL 또는 복잡한 조건문은 이 기준을 초과할 수 있으나, 가독성을 해치지 않는 선에서 분리합니다.

## 들여쓰기
*   **들여쓰기 수준당 공백 4칸 사용.** (JavaScript 커뮤니티에서 널리 사용됨)

## 임포트 (ES 모듈)
*   **임포트 그룹화:**
    *   내장 모듈 (Node.js 환경의 경우, 예: `fs`, `path`)
    *   외부 라이브러리 (예: `react`, `lodash`)
    *   로컬 애플리케이션/라이브러리 특정 임포트 (상대 경로 사용)
*   **절대 경로 및 상대 경로:**
    *   프로젝트 내 다른 주요 모듈이나 최상위 디렉토리로부터의 임포트는 설정된 절대 경로 별칭 (예: `@/components/Button`)을 사용합니다.
    *   같은 모듈 내 또는 형제/자식 모듈은 상대 경로 (예: `./utils`, `../constants`)를 사용합니다.
*   **임포트 순서 innerhalb 그룹:** 알파벳 순으로 정렬합니다.
*   **명명된 임포트 사용:** 가능한 경우 `import * as Name` 보다는 명명된 임포트를 선호합니다.

## 이름 지정 규칙

*   **변수 및 함수:** `camelCase` 사용: `userName`, `totalCount`, `calculateTotal()`, `processData()`
*   **상수:** `UPPER_SNAKE_CASE` 사용: `MAX_VALUE`, `API_URL` (특히 `const`로 선언되고 재할당되지 않는 값)
*   **클래스 및 생성자 함수:** `PascalCase` (또는 `CapWords`) 사용: `UserManager`, `PaymentProcessor`
*   **파일 및 디렉토리:** `kebab-case` (예: `user-utils.js`, `payment-gateway`) 또는 `camelCase` (예: `userUtils.js`)를 일관되게 사용합니다. (팀/프로젝트별 결정)

## JSDoc 주석
*   **모든 공개 API(함수, 클래스, 주요 변수)에 `/** JSDoc 주석 내용 */` 형식의 JSDoc 주석 사용.**
*   **첫 줄:** 객체의 목적에 대한 간결한 요약. 마침표로 끝납니다.
*   **복잡한 함수/클래스의 경우:** `@param`, `@returns`, `@throws`, `@deprecated` 등의 태그를 사용하여 매개변수, 반환 값, 예외, 사용 중단 여부 등을 상세히 설명합니다.
*   **타입 명시:** JSDoc 태그 내에서 타입을 명시합니다. (TypeScript를 사용하지 않는 경우 특히 유용)
    ```javascript
    /**
     * 두 숫자를 더하는 함수입니다.
     *
     * @param {number} a - 첫 번째 숫자입니다.
     * @param {number} b - 두 번째 숫자입니다.
     * @returns {number} 두 숫자의 합입니다.
     * @throws {TypeError} 매개변수가 숫자가 아닐 경우 발생합니다.
     */
    function sum(a, b) {
      if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('Inputs must be numbers.');
      }
      return a + b;
    }
    ```

## 타입 힌트 (JSDoc 또는 TypeScript)
*   **타입 정보 사용 권장:** JSDoc을 통한 타입 명시 또는 TypeScript 사용을 권장합니다. 이는 코드 가독성을 높이고 오류를 조기에 발견하는 데 도움이 됩니다.
*   TypeScript를 사용하는 경우, 해당 프로젝트의 `tsconfig.json` 설정을 따릅니다.

## 일반 주석
*   **명확하고 간결한 주석 작성:** 코드의 "왜"를 설명하고, 복잡한 로직이나 중요한 결정 사항을 명시합니다.
*   **주석은 필요한 곳에만:** 잘 작성된 코드는 상당 부분 자체적으로 설명 가능해야 합니다.
*   **완전한 문장 사용 권장:** 주석은 대문자로 시작하고 적절한 구두점을 사용할 수 있습니다.

## 로깅
*   **`console` 객체 사용 또는 표준 로깅 라이브러리 사용:** (예: `pino`, `winston` - Node.js 환경)
    *   `console.log()`: 일반 정보 및 디버깅용
    *   `console.info()`: 정보성 메시지
    *   `console.warn()`: 경고
    *   `console.error()`: 오류
*   **컨텍스트 제공:** 로그 메시지에 디버깅에 도움이 되는 관련 정보를 포함합니다. (예: 변수 값, 함수명)
*   **프로덕션 환경에서는 `console.log` 최소화:** 성능 및 보안을 위해 프로덕션 빌드에서는 디버깅용 로그를 제거하거나 비활성화합니다.

## 오류 처리
*   **`Error` 객체 또는 그 하위 클래스 사용:** 일반 `string`이나 `object` 대신 `Error`, `TypeError`, `ReferenceError` 등 표준 에러 객체 또는 커스텀 에러 클래스를 사용합니다.
*   **`try...catch...finally` 블록 사용:** 예외 발생 가능성이 있는 코드를 적절히 감쌉니다.
*   **Promise 사용 시 `.catch()` 또는 `async/await`와 `try/catch`로 오류 처리:** 비동기 작업의 오류를 누락하지 않도록 합니다.
*   **사용자에게 친화적인 오류 메시지:** 애플리케이션 경계에서는 사용자에게 이해하기 쉬운 오류 메시지를 제공하거나, 오류를 적절히 처리하여 프로그램이 비정상 종료되지 않도록 합니다.

## 코드 스타일 및 규칙
*   **세미콜론(;) 사용:** 문장 끝에 세미콜론을 붙이는 것을 권장합니다. (ASI에 의존하지 않음)
*   **엄격 모드 (`'use strict';`) 사용:** 파일 또는 함수 스코프 상단에 선언하여 잠재적인 오류를 방지합니다. (ES 모듈은 기본적으로 엄격 모드)
*   **`let` 및 `const` 사용:** `var` 대신 블록 스코프 변수인 `let`과 상수인 `const`를 사용합니다.
*   **화살표 함수 활용:** 콜백이나 간단한 함수 표현 시 간결성을 위해 화살표 함수 사용을 고려합니다. (단, `this` 컨텍스트에 유의)

# 도구
*   **코드 포맷터:** Prettier - 일관된 코드 스타일을 자동으로 적용합니다.
*   **린터:** ESLint - 잠재적인 오류 및 스타일 위반을 식별합니다. (팀에서 합의된 규칙셋 사용, 예: `eslint-config-airbnb-base`, `eslint-config-standard`)

# 예시
```javascript
/**
 * @file User authentication utilities.
 */

import bcrypt from 'bcrypt'; // 외부 라이브러리
import { findUserByUsername } from '@/models/user-model'; // 애플리케이션 특정 임포트 (절대 경로 별칭)
import { logError, logInfo } from './logger'; // 로컬 임포트 (상대 경로)

const SALT_ROUNDS = 10;

/**
 * Hashes a password using bcrypt.
 *
 * @async
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 * @throws {Error} If hashing fails.
 */
async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new TypeError('Password must be a non-empty string.');
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    logError('Failed to hash password:', error);
    throw new Error('Password hashing failed.'); // 사용자에게 일반적인 오류 반환
  }
}

/**
 * Authenticates a user against the stored hash.
 *
 * @async
 * @param {string} username - The user's username.
 * @param {string} plainPassword - The user's plain text password.
 * @returns {Promise<boolean>} True if authenticated, false otherwise.
 */
async function authenticateUser(username, plainPassword) {
  if (!username || !plainPassword) {
    logWarn('Authentication attempt with missing username or password.');
    return false;
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      logInfo(`Authentication failed: User not found - ${username}`);
      return false;
    }

    const match = await bcrypt.compare(plainPassword, user.passwordHash);
    if (match) {
      logInfo(`User authenticated successfully - ${username}`);
      return true;
    } else {
      logInfo(`Authentication failed: Incorrect password - ${username}`);
      return false;
    }
  } catch (error) {
    logError(`An error occurred during authentication for ${username}:`, error);
    return false; // 혹은 에러를 다시 던져 상위에서 처리
  }
}

export { hashPassword, authenticateUser };
```

---

이 초안은 일반적인 JavaScript 관행을 반영하려고 노력했으며, 팀의 필요에 따라 세부 사항을 조정하고 특정 도구(예: 로깅 라이브러리, 특정 ESLint 규칙셋)를 명시할 수 있습니다.