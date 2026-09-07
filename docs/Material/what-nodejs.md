## Node.js가 뭐냐

Node.js는 한 문장으로 말하면:

> **JavaScript를 웹 브라우저 밖에서도 실행할 수 있게 해주는 JavaScript 런타임 환경**

이야.

원래 JavaScript는 주로 브라우저에서 실행되는 언어였다.

```text
Chrome
 └─ JavaScript

Firefox
 └─ JavaScript
```

예를 들어 이런 코드:

```js
console.log("Hello");
```

를 웹 페이지 안에서 실행했다.

그런데 Node.js가 등장하면서:

```text
Windows
macOS
Linux
   ↓
Node.js
   ↓
JavaScript 실행
```

이 가능해졌다.

그래서 JavaScript로 **백엔드 서버, CLI 프로그램, 빌드 도구, 자동화 스크립트**까지 만들 수 있게 됐다.

---

# Node.js는 프로그래밍 언어가 아니다

이 부분이 굉장히 중요해.

```text
JavaScript = 언어
Node.js = JavaScript를 실행하는 환경
```

즉:

```js
const message = "hello";
console.log(message);
```

이 코드는 **JavaScript 코드**다.

Node.js는 이 코드를 실행하는 프로그램이다.

예를 들어:

```bash
node app.js
```

라고 실행한다.

구조는:

```text
app.js
   ↓
Node.js
   ↓
JavaScript 실행
```

이다.

따라서

> "Node.js 언어를 배운다"

보다는

> "JavaScript를 배우고 Node.js 환경에서 백엔드를 개발한다"

라고 말하는 게 정확하다.

---

# 브라우저 JavaScript와 Node.js JavaScript의 차이

같은 JavaScript 언어를 사용하지만 실행 환경이 다르다.

브라우저에서는:

```js
document.querySelector("#button");
```

같은 코드를 사용할 수 있다.

왜냐하면 브라우저가:

```text
document
window
localStorage
```

같은 API를 제공하기 때문이다.

하지만 Node.js에서는 기본적으로:

```js
document
```

가 없다.

대신 Node.js는 서버 프로그램에 필요한 API를 제공한다.

예를 들어:

```js
import fs from "node:fs";

const text = fs.readFileSync("test.txt", "utf8");

console.log(text);
```

처럼 파일을 직접 읽을 수 있다.

또:

```js
import http from "node:http";
```

를 사용해서 HTTP 서버도 만들 수 있다.

따라서:

| Browser | Node.js |
|---|---|
| DOM | 파일 시스템 |
| `window` | `process` |
| `document` | `fs` |
| 화면/UI | 서버 |
| 브라우저 API | OS/서버 API |

라고 볼 수 있다.

---

# Node.js가 백엔드에서 사용되는 이유

예를 들어 네 행사 추천 서비스에서 사용자가:

```text
9월 12일
개발
광주
```

를 검색한다고 하자.

프론트엔드에서는:

```js
fetch("/api/events");
```

를 요청한다.

Node.js 백엔드는 요청을 받아:

```text
Browser
   ↓
GET /api/events
   ↓
Node.js
   ↓
PostgreSQL
   ↓
행사 데이터
   ↓
JSON response
```

를 처리할 수 있다.

Node.js만으로도 HTTP 서버를 만들 수 있다.

예:

```js
import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain",
  });

  res.end("Hello");
});

server.listen(3000);
```

실행:

```bash
node server.js
```

그러면:

```text
localhost:3000
```

에서 서버가 실행된다.

---

# 그런데 왜 Express를 같이 쓰는가

Node.js 기본 API만으로도 서버를 만들 수 있지만 불편하다.

예를 들어 URL에 따라 처리를 나누려면 직접 구현해야 한다.

그래서 Express 같은 프레임워크를 사용한다.

```js
import express from "express";

const app = express();

app.get("/api/events", (req, res) => {
  res.json([
    {
      name: "Developer Conference",
    },
  ]);
});

app.listen(3000);
```

훨씬 간결하다.

관계를 정확히 보면:

```text
JavaScript
    ↓
Node.js
    ↓
Express
    ↓
내 Backend Application
```

이다.

Express가 Node.js를 대체하는 게 아니다.

**Express가 Node.js 위에서 돌아간다.**

---

# Node.js와 npm은 다른 것이다

이것도 처음엔 상당히 헷갈린다.

Node.js를 설치하면 일반적으로:

```text
node
npm
```

을 함께 사용하게 된다.

### Node.js

JavaScript 실행:

```bash
node app.js
```

### npm

패키지 관리:

```bash
npm install express
```

그러면 Express를 다운로드해준다.

그래서:

```text
Node.js
→ JavaScript runtime

npm
→ package manager
```

이다.

---

# package.json은 뭐냐

Node.js 프로젝트를 하다 보면 반드시 만나게 된다.

```json
{
  "name": "event-recommendation-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "node src/server.js"
  },
  "dependencies": {
    "express": "^5.0.0"
  }
}
```

이 파일에는 프로젝트에 대한 정보가 저장된다.

대표적으로:

```text
프로젝트 이름
패키지 목록
스크립트
버전
Node 설정
```

등이 들어간다.

그래서:

```bash
npm install
```

하면 `package.json`을 보고 필요한 라이브러리를 설치한다.

---

# node_modules는 뭐냐

```bash
npm install express
```

를 실행하면 보통:

```text
node_modules/
```

가 생긴다.

그 안에:

```text
Express
Express가 사용하는 패키지
그 패키지가 사용하는 패키지
...
```

가 저장된다.

그래서 상당히 커질 수 있다.

보통 Git에는 올리지 않는다.

`.gitignore`:

```gitignore
node_modules/
```

를 추가한다.

---

# package-lock.json은?

npm으로 설치하면:

```text
package.json
package-lock.json
```

두 파일을 보게 된다.

간단하게 보면:

```text
package.json
→ "어떤 패키지가 필요한가"

package-lock.json
→ "실제로 정확히 어떤 버전을 설치했는가"
```

이다.

예를 들어:

```json
"express": "^5.1.0"
```

처럼 어느 정도 버전 범위를 허용할 수 있는데,

`package-lock.json`은 실제 설치 결과를 기록해서 팀원 간 환경을 최대한 동일하게 유지한다.

따라서 **package-lock.json은 Git에 커밋하는 것이 일반적**이다.

---

# Node.js의 중요한 특징: Event Loop

Node.js를 조금 더 제대로 이해하려면 이 개념을 알아야 한다.

Node.js는 많은 I/O 작업을 효율적으로 처리하는 데 강점이 있다.

예를 들어 서버에서:

```text
사용자 A → DB 요청
사용자 B → 파일 요청
사용자 C → API 요청
```

이 동시에 들어온다고 하자.

Node.js는 하나의 요청이 끝날 때까지 무작정 기다리는 방식이 아니라 **비동기 I/O와 Event Loop**를 적극 활용한다.

예:

```js
const result = await database.query("SELECT ...");
```

DB가 처리하는 동안 Node.js가 다른 요청을 처리할 수 있다.

개념적으로:

```text
요청 A
   ↓
DB 작업 시작
   ↓
기다리는 동안

요청 B 처리
요청 C 처리

   ↓

DB A 완료
   ↓
요청 A 계속 처리
```

같은 방식이다.

그래서 웹 API 같은 I/O 중심 서버에 잘 맞는다.

---

# 그러면 Node.js는 싱글 스레드인가?

자주 나오는 표현인데 조금 주의해야 한다.

보통:

> Node.js는 single-threaded event loop를 사용한다.

라고 설명한다.

JavaScript 코드를 실행하는 주요 Event Loop는 기본적으로 한 스레드에서 동작한다.

하지만 Node.js 전체가 문자 그대로 스레드 하나만 사용하는 것은 아니다.

내부에서는:

```text
OS
libuv
thread pool
worker threads
```

등을 활용할 수 있다.

따라서 처음에는:

> **Node.js는 JavaScript 이벤트 루프를 중심으로 비동기 작업을 처리한다.**

정도로 이해하는 게 정확하다.

---

# 비동기 코드 때문에 Promise를 많이 보게 된다

Node.js 백엔드를 하면:

```js
async function getEvents() {
  const result = await db.query(
    "SELECT * FROM events"
  );

  return result.rows;
}
```

같은 코드를 계속 만나게 될 거다.

여기서:

```text
async
await
Promise
```

가 중요한 이유가 바로 Node.js에서 DB, 파일, 네트워크 같은 **비동기 I/O를 많이 처리하기 때문**이다.

따라서 Node.js를 공부하기 전에 JavaScript에서:

```text
Promise
async / await
try / catch
```

를 이해해두면 좋다.

---

# CommonJS와 ES Modules

Node.js를 공부하면서 또 하나 헷갈리는 부분이다.

예전 Node.js 코드에서는:

```js
const express = require("express");
```

를 많이 사용했다.

이걸 **CommonJS**라고 한다.

반면 현대 JavaScript에서는:

```js
import express from "express";
```

를 많이 사용한다.

이건 **ES Modules(ESM)** 방식이다.

두 가지를 비교하면:

```text
CommonJS

const express = require("express");

module.exports = something;
```

vs

```text
ES Modules

import express from "express";

export default something;
```

이다.

새 프로젝트에서 특별한 이유가 없다면 ESM을 배우는 게 자연스럽다.

`package.json`에서:

```json
{
  "type": "module"
}
```

을 지정하는 Node.js 프로젝트도 흔하다.

---

# Node.js와 TypeScript 관계

Node.js는 본질적으로 JavaScript 런타임이다.

하지만 TypeScript로 백엔드를 작성하는 것도 매우 흔하다.

```ts
interface Event {
  id: number;
  title: string;
}

function getEvent(): Event {
  return {
    id: 1,
    title: "GIST Seminar",
  };
}
```

개념적으로는:

```text
TypeScript
   ↓
JavaScript
   ↓
Node.js
```

이다.

다만 최신 Node.js는 일부 TypeScript 구문을 직접 처리하는 기능도 발전하고 있지만, **TypeScript 타입 시스템 자체를 Node.js가 제공하는 것은 아니다.**

따라서 개념적으로는 여전히:

```text
TypeScript = 언어/타입 시스템
Node.js = runtime
```

으로 구별하는 게 좋다.

---

# Vite와 Node.js 관계

앞에서 본 Vite와 연결해보자.

Vite는 Node.js 위에서 실행된다.

```text
Node.js
   ↓
Vite
   ↓
React frontend 개발
```

즉:

```bash
npm run dev
```

로 Vite를 실행할 때도 실제로는 Node.js 환경이 필요하다.

하지만 중요한 차이가 있다.

### Vite

```text
Frontend 개발용
```

### Node.js + Express

```text
Backend 서버
```

예를 들어 네 프로젝트는:

```text
Node.js
│
├─ Vite
│    └─ React frontend 개발
│
└─ Express
     └─ Backend API 서버
```

처럼 이해할 수도 있다.

---

# ESLint도 Node.js 위에서 돌아간다

마찬가지로:

```bash
npx eslint .
```

할 때 ESLint 자체도 Node.js 프로그램이다.

따라서 지금까지 조사한 것들을 연결하면:

```text
                JavaScript / TypeScript
                         │
                 ┌───────┴───────┐
                 │               │
              Browser          Node.js
                 │               │
               React      ┌──────┼──────┐
                          │      │      │
                       Express  Vite  ESLint
```

정도로 볼 수 있다.

이 관계를 이해하면 기술 스택 이름들이 갑자기 훨씬 명확해진다.

---

# Node.js와 PostgreSQL

네 프로젝트에서는 이 연결이 특히 중요하다.

Node.js에서 PostgreSQL에 접근하는 라이브러리를 사용해서:

```js
const result = await pool.query(
  "SELECT * FROM events"
);
```

처럼 DB 데이터를 조회할 수 있다.

전체 구조는:

```text
React
   ↓ HTTP
Express
   ↓
Node.js
   ↓ SQL
PostgreSQL
```

이다.

좀 더 정확히 말하면 Express도 Node.js 안에서 실행되므로:

```text
Browser
  │
  ▼
React + Vite
  │
  │ HTTP
  ▼
Node.js
  └─ Express
       │
       │ SQL
       ▼
   PostgreSQL
```

이다.

---

# Node.js가 잘 맞는 분야

대표적으로:

- REST API 서버
- 웹 백엔드
- 실시간 채팅
- WebSocket 서버
- CLI 프로그램
- 개발 도구
- 자동화 스크립트
- 서버리스 함수

등에서 많이 사용된다.

특히 프론트엔드도 JavaScript/TypeScript로 개발한다면:

```text
Frontend → TypeScript
Backend  → TypeScript
```

로 한 언어 생태계를 공유할 수 있다는 장점이 크다.

---

# Node.js의 약점도 있다

Node.js가 모든 작업에 최적인 건 아니다.

예를 들어 단순한 JavaScript 코드로:

```text
매우 무거운 수치 계산
대규모 영상 인코딩
CPU 집약적인 시뮬레이션
```

을 Event Loop에서 오래 수행하면 다른 요청 처리가 막힐 수 있다.

예를 들어:

```js
while (true) {
  // 엄청 무거운 계산
}
```

같은 코드는 Event Loop를 막아버린다.

그래서 CPU-intensive 작업은:

```text
Worker Threads
별도 서비스
별도 프로세스
Python/C++/Rust 서비스
```

등으로 분리하기도 한다.

반면 웹 백엔드에서 흔한:

```text
DB 요청
HTTP 요청
파일 I/O
```

같은 작업에는 Node.js가 잘 맞는다.

---

# Node.js / NodeJS 차이를 다시 정리하면

검색할 때는 둘 다 나온다.

예:

```text
Node.js backend
NodeJS backend
nodejs tutorial
```

전부 대부분 같은 기술을 말한다.

다만 공식적인 글을 쓸 때는:

```text
Node.js
```

를 사용하자.

예를 들어 README에서는:

```markdown
## Backend

- Node.js
- Express
- PostgreSQL
```

가 적절하다.

아래처럼:

```markdown
- NodeJS
```

라고 써도 의미는 통하지만 공식 표기는 아니다.

---

## 지금까지 조사한 기술들을 한 번에 정리하면

| 기술 | 정체 |
|---|---|
| JavaScript | 프로그래밍 언어 |
| TypeScript | JavaScript + 타입 시스템 |
| Node.js | JavaScript Runtime |
| npm | Package Manager |
| Express | Node.js Backend Framework |
| React | Frontend UI Library |
| Vite | Frontend Dev Server / Build Tool |
| ESLint | Linter |
| PostgreSQL | Relational DBMS |

네 프로젝트 기준으로 보면:

```text
Frontend
├─ JavaScript / TypeScript
├─ React
├─ Vite
└─ ESLint

Backend
├─ JavaScript / TypeScript
├─ Node.js
├─ Express
└─ ESLint

Database
└─ PostgreSQL
```

이 된다.

그래서 네 레포지토리 이름이 `Node.js-Arco` 같은 형태라면 **Node.js는 프로젝트의 백엔드 실행 환경**, Express가 실제 웹 API 프레임워크라고 이해하면 가장 정확하다.