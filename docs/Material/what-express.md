Express는 **Node.js 위에서 웹 서버와 API를 더 쉽게 만들게 해주는 백엔드 웹 프레임워크**야.

Node.js만으로도 서버를 만들 수 있지만, Express를 쓰면 라우팅, 요청/응답 처리, 미들웨어 같은 걸 훨씬 간단하게 작성할 수 있어.

예를 들어 Node.js 기본 `http` 모듈만 쓰면 요청 경로를 직접 나눠야 해.

```js
import http from "node:http";

const server = http.createServer((req, res) => {
  if (req.url === "/api/events" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify([]));
  }
});

server.listen(3000);
```

Express를 쓰면 같은 의미를 훨씬 간단하게 적을 수 있어.

```js
import express from "express";

const app = express();

app.get("/api/events", (req, res) => {
  res.json([]);
});

app.listen(3000);
```

핵심은 이거야.

```text
Node.js
= 서버를 실행할 수 있는 런타임

Express
= 그 Node.js 서버를 편하게 만드는 도구
```

## Express에서 가장 먼저 배우는 개념

첫 번째는 **라우팅**이야.

```js
app.get("/api/events", (req, res) => {
  res.json([]);
});
```

이 코드는:

```text
GET /api/events
```

요청이 들어오면 이 함수를 실행하라는 뜻이야.

POST도 가능해.

```js
app.post("/api/events", (req, res) => {
  res.json({
    message: "created",
  });
});
```

REST API에서 자주 보는:

```text
GET
POST
PUT
PATCH
DELETE
```

같은 HTTP method를 거의 그대로 표현한다.

예를 들면:

```js
app.get("/events", ...)
app.post("/events", ...)
app.patch("/events/:id", ...)
app.delete("/events/:id", ...)
```

처럼 쓴다.

---

두 번째는 `req`와 `res`야.

```js
app.get("/api/events", (req, res) => {
  res.json({
    message: "hello",
  });
});
```

여기서:

```text
req
= request
= 클라이언트가 보낸 요청

res
= response
= 서버가 클라이언트에게 보낼 응답
```

이야.

예를 들어 사용자가:

```text
/api/events?category=game
```

라고 요청하면:

```js
app.get("/api/events", (req, res) => {
  console.log(req.query.category);
});
```

에서:

```text
game
```

을 얻을 수 있어.

---

URL parameter도 자주 사용해.

```js
app.get("/api/events/:id", (req, res) => {
  console.log(req.params.id);
});
```

사용자가:

```text
GET /api/events/123
```

으로 요청하면:

```js
req.params.id
```

는:

```text
123
```

이 된다.

그래서 특정 행사 하나를 조회할 때 이런 구조를 많이 사용해.

```text
GET /api/events/123
```

---

POST 요청에서는 body도 중요해.

클라이언트가:

```json
{
  "title": "GIST AI Seminar",
  "date": "2026-09-20"
}
```

를 보냈다고 하자.

Express에서는 먼저:

```js
app.use(express.json());
```

을 추가한 뒤:

```js
app.post("/api/events", (req, res) => {
  console.log(req.body);
});
```

라고 하면 JSON 데이터를 받을 수 있어.

즉:

```text
req.params
→ URL 경로 값

req.query
→ ? 뒤의 query string

req.body
→ 요청 본문
```

이 세 가지는 Express를 배우면 아주 자주 보게 된다.

---

## 미들웨어

Express에서 정말 중요한 개념이 **middleware**야.

예를 들어:

```js
app.use(express.json());
```

도 미들웨어다.

요청이 들어오면:

```text
Request
   ↓
Middleware
   ↓
Middleware
   ↓
Route handler
   ↓
Response
```

순서로 처리할 수 있어.

예를 들어 로그를 남기는 미들웨어를 직접 만들 수도 있다.

```js
app.use((req, res, next) => {
  console.log(req.method, req.url);

  next();
});
```

여기서:

```js
next();
```

는:

> 다음 처리 단계로 넘어가라.

라는 뜻이야.

그래서 인증도 미들웨어로 만들 수 있어.

```js
function auth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}
```

그리고:

```js
app.get("/api/profile", auth, (req, res) => {
  res.json({
    name: "Pinata",
  });
});
```

처럼 붙인다.

---

## Express + PostgreSQL

네 프로젝트에서는 이게 가장 중요할 거야.

예를 들어:

```js
app.get("/api/events", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM events"
  );

  res.json(result.rows);
});
```

구조는:

```text
React
  ↓
GET /api/events
  ↓
Express route
  ↓
PostgreSQL query
  ↓
result
  ↓
JSON response
  ↓
React
```

이다.

그래서 Express는 백엔드에서 **HTTP와 DB 사이를 연결하는 중심 역할**을 하게 된다.

---

## 프로젝트가 커지면 파일도 나눈다

처음에는:

```text
server.js
```

하나에 전부 작성해도 된다.

하지만 프로젝트가 커지면:

```text
src/
├── server.js
├── routes/
│   └── events.js
├── controllers/
│   └── eventController.js
├── services/
│   └── eventService.js
└── db/
    └── postgres.js
```

처럼 나눈다.

역할은 대략:

```text
routes
→ 어떤 URL을 받을지

controllers
→ 요청/응답 처리

services
→ 실제 비즈니스 로직

db
→ PostgreSQL 연결
```

이렇게 나눌 수 있어.

예를 들어:

```js
router.get("/events", getEvents);
```

라우터가 요청을 받고,

```js
export async function getEvents(req, res) {
  const events = await eventService.findAll();

  res.json(events);
}
```

controller가 요청/응답을 관리하고,

```js
export async function findAll() {
  const result = await pool.query(
    "SELECT * FROM events"
  );

  return result.rows;
}
```

service가 DB 관련 로직을 처리하는 식이야.

---

## Express를 배우려면 JavaScript에서 무엇을 알아야 하나

최소한 이 정도는 필요해.

```text
함수
객체
배열
destructuring
import / export
Promise
async / await
try / catch
```

특히:

```js
async (req, res) => {
}
```

같은 코드를 거의 계속 보게 되니까 `async/await`은 중요해.

---

## Express에서 자주 쓰는 형태

이 정도는 눈에 익혀두면 좋아.

```js
app.use(...)
```

미들웨어 등록.

```js
app.get(...)
```

GET API.

```js
app.post(...)
```

POST API.

```js
req.params
```

URL parameter.

```js
req.query
```

query string.

```js
req.body
```

body.

```js
res.json(...)
```

JSON 응답.

```js
res.status(404).json(...)
```

HTTP 상태 코드 설정.

---

## 네가 지금까지 본 기술과 연결하면

```text
JavaScript
    │
    ▼
Node.js
    │
    ▼
Express
    │
    ├── HTTP API
    ├── routing
    ├── middleware
    └── request / response
    │
    ▼
PostgreSQL
```

프론트까지 포함하면:

```text
React
   │
   │ fetch()
   ▼
Express
   │
   │ SQL
   ▼
PostgreSQL
```

그리고 개발 도구는 옆에서:

```text
Vite
→ React 개발/빌드

ESLint
→ 코드 검사
```

를 해준다.

따라서 지금 배우는 기술 중에서 **Express는 Vite보다 훨씬 배워야 할 내용이 많아.** Vite는 설정을 찾아 쓰는 도구에 가까운 반면, Express의 `routing`, HTTP request/response, middleware, error handling은 실제 백엔드 프로그래밍의 핵심 개념이기 때문이야.

네 행사 추천 서비스 기준으로는 다음 순서로 Express를 익히는 게 좋다:

```text
1. app.get()으로 GET API 하나 만들기
2. params / query 이해
3. POST + req.body
4. HTTP status code
5. Router로 파일 분리
6. async/await + error handling
7. PostgreSQL 연결
8. middleware
```

여기까지 배우면 MVP 백엔드를 만드는 데 필요한 Express 기초는 거의 갖춘 셈이야.