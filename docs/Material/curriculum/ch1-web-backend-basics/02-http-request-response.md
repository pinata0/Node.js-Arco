# HTTP Request / Response

## 1. 학습 목표

이 문서에서는 Client와 Server가 실제로 어떤 형식으로 데이터를 주고받는지 학습한다.

Project Arco를 기준으로 다음 흐름을 이해하는 것이 목표다.

```text
Frontend
   ↓
HTTP Request
   ↓
Express Backend
   ↓
HTTP Response
   ↓
Frontend
```

학습 후 다음 질문에 답할 수 있어야 한다.

- HTTP는 무엇인가?
- HTTP Request는 무엇으로 구성되는가?
- HTTP Response는 무엇으로 구성되는가?
- Method, URL, Header, Body는 각각 무엇인가?
- Status Code는 어떤 역할을 하는가?
- JSON은 HTTP에서 어떤 방식으로 전달되는가?
- Express에서는 Request와 Response를 어떻게 다루는가?

---

# 2. HTTP란?

HTTP는

```text
HyperText Transfer Protocol
```

의 약자다.

웹에서 Client와 Server가 데이터를 주고받을 때 사용하는 통신 규칙이다.

쉽게 말하면 다음과 같다.

> Client와 Server가 서로 어떤 형식으로 요청하고 응답할지 정해 놓은 약속

Project Arco에서는 Frontend와 Backend가 주로 HTTP를 이용해 통신한다.

```text
Frontend
   │
   │ HTTP
   ▼
Express Backend
```

예를 들어 Frontend가 행사 목록을 요청한다.

```http
GET /events
```

Backend는 요청을 처리한 뒤 결과를 반환한다.

```json
[
  {
    "id": 1,
    "title": "GIST AI Seminar"
  }
]
```

이 전체 과정이 HTTP 통신이다.

---

# 3. HTTP의 기본 구조

HTTP 통신은 크게 두 단계로 이루어진다.

```text
Request
   ↓
Server
   ↓
Response
```

Client가 먼저 Request를 보낸다.

Server는 요청을 처리하고 Response를 반환한다.

Project Arco에서는 다음과 같이 볼 수 있다.

```text
Frontend
   │
   │ Request
   ▼
Backend
   │
   │ Response
   ▼
Frontend
```

예:

```text
Frontend:
"9월 12일 행사 보여줘"

        ↓

Backend:
"여기 행사 5개 있어"

        ↓

Frontend:
행사 목록 표시
```

---

# 4. HTTP Request란?

HTTP Request는 Client가 Server에게 보내는 요청이다.

예를 들어 다음 요청이 있다고 하자.

```http
GET /events
```

이 요청은

> 행사 목록을 조회하고 싶다.

라는 의미로 사용할 수 있다.

HTTP Request는 일반적으로 다음 요소들로 구성된다.

```text
Request
├── Method
├── URL
├── Header
└── Body
```

모든 Request가 항상 Body를 가지는 것은 아니다.

예를 들어 단순 조회 요청인 `GET`은 일반적으로 Body 없이 사용한다.

---

# 5. Request Method

Method는

> Server에게 어떤 종류의 작업을 원하는지

나타낸다.

대표적인 HTTP Method는 다음과 같다.

| Method | 일반적인 의미 |
|---|---|
| GET | 데이터 조회 |
| POST | 새로운 데이터 생성 |
| PUT | 데이터 전체 수정 |
| PATCH | 데이터 일부 수정 |
| DELETE | 데이터 삭제 |

Project Arco에서는 다음과 같이 사용할 수 있다.

```http
GET /events
```

행사 목록 조회

```http
GET /events/123
```

123번 행사 조회

```http
POST /events
```

새로운 행사 생성

```http
PATCH /events/123
```

123번 행사 일부 수정

```http
DELETE /events/123
```

123번 행사 삭제

Method에 대해서는 다음 문서에서 더 자세히 학습한다.

---

# 6. Request URL

URL은 요청을 보낼 대상과 Resource를 나타낸다.

예:

```text
https://api.arco.example.com/events
```

구조를 단순화하면 다음과 같다.

```text
https://api.arco.example.com/events
│       │                    │
scheme  host                 path
```

조금 더 복잡한 URL은 다음과 같다.

```text
https://api.arco.example.com/events/123?category=ai
```

여기에는 다음 정보가 포함된다.

```text
https
= 통신 방식

api.arco.example.com
= Server 주소

/events/123
= Path

category=ai
= Query Parameter
```

Project Arco에서는 개발 중 다음과 같은 주소를 사용할 수도 있다.

```text
http://localhost:3000/events
```

여기서

```text
localhost
```

는 현재 컴퓨터를 의미한다.

그리고

```text
3000
```

은 Port 번호다.

---

# 7. Request Header

Header는 Request에 대한 추가 정보를 담는다.

Request 자체의 주요 내용이라기보다는

> 이 요청을 어떻게 해석해야 하는가?

에 관한 Metadata라고 볼 수 있다.

예를 들어 다음 Header가 있다.

```http
Content-Type: application/json
```

이것은

> Request Body가 JSON 형식이다.

라는 뜻이다.

다른 예:

```http
Authorization: Bearer ...
```

인증 정보를 전달할 때 사용할 수 있다.

또는

```http
Accept: application/json
```

Client가

> JSON 형태의 응답을 원한다.

는 뜻으로 사용할 수 있다.

---

# 8. Content-Type

특히 자주 보게 될 Header가 `Content-Type`이다.

예:

```http
Content-Type: application/json
```

의미는 다음과 같다.

```text
이 HTTP Message의 Body는 JSON 형식이다.
```

예를 들어 새로운 행사를 등록한다고 하자.

```http
POST /events
Content-Type: application/json
```

Body:

```json
{
  "title": "AI Conference",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

Server는 `Content-Type`을 보고 Body가 JSON이라는 것을 알 수 있다.

---

# 9. Request Body

Body는 Server에 전달할 실제 데이터를 담는 영역이다.

예를 들어 행사 생성 API가 있다고 하자.

```http
POST /events
```

Client가 다음 데이터를 전달한다.

```json
{
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00",
  "category": "AI"
}
```

이 JSON이 Request Body다.

전체를 개념적으로 표현하면 다음과 같다.

```text
POST /events

Header:
Content-Type: application/json

Body:
{
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

---

# 10. GET 요청에는 Body가 필요한가?

일반적인 REST API에서는 GET 요청에 Body를 사용하지 않는다.

조회 조건은 주로 URL에 넣는다.

예:

```http
GET /events?category=ai
```

또는

```http
GET /events?date=2026-09-12
```

반면 새로운 데이터를 만드는 경우에는 Body를 사용한다.

```http
POST /events
```

```json
{
  "title": "AI Conference"
}
```

정리하면 다음처럼 기억하면 된다.

```text
조회 조건
→ URL / Query Parameter

생성하거나 수정할 데이터
→ Request Body
```

항상 절대적인 규칙은 아니지만 일반적인 REST API 설계에서는 이렇게 사용하는 것이 좋다.

---

# 11. HTTP Response란?

HTTP Response는 Server가 Client에게 보내는 응답이다.

Response는 일반적으로 다음 구조를 가진다.

```text
Response
├── Status Code
├── Header
└── Body
```

예를 들어 Client가 다음 요청을 한다.

```http
GET /events/123
```

행사가 존재한다면 Backend가 다음과 같은 Response를 반환할 수 있다.

```text
Status Code:
200 OK
```

```http
Content-Type: application/json
```

```json
{
  "id": 123,
  "title": "GIST AI Seminar"
}
```

---

# 12. Response Status Code

Status Code는 Server가 Request를 어떻게 처리했는지 알려준다.

예:

```text
200 OK
```

의미:

> 요청이 정상적으로 처리되었다.

또 다른 예:

```text
404 Not Found
```

의미:

> 요청한 Resource를 찾을 수 없다.

예를 들어

```http
GET /events/999999
```

를 요청했는데 해당 행사가 없다면 다음처럼 응답할 수 있다.

```text
404 Not Found
```

```json
{
  "message": "Event not found"
}
```

---

# 13. 자주 사용하는 Status Code

Project Arco에서 우선 알아둘 Status Code는 다음 정도다.

| Status | 이름 | 의미 |
|---|---|---|
| 200 | OK | 요청 성공 |
| 201 | Created | 새로운 데이터 생성 성공 |
| 204 | No Content | 성공했지만 Body 없음 |
| 400 | Bad Request | 잘못된 요청 |
| 404 | Not Found | Resource를 찾을 수 없음 |
| 409 | Conflict | 데이터 충돌 |
| 500 | Internal Server Error | Server 내부 오류 |

예를 들어 행사 등록 성공:

```text
POST /events
→ 201 Created
```

존재하지 않는 행사 조회:

```text
GET /events/123456
→ 404 Not Found
```

잘못된 날짜 입력:

```text
GET /events?date=hello
→ 400 Bad Request
```

Status Code 자체는 다음 학습노트에서 더 자세히 다룬다.

---

# 14. Response Header

Response에도 Header가 있다.

예:

```http
Content-Type: application/json
```

이것은 Client에게

> Response Body가 JSON 형식이다.

라고 알려준다.

다른 Header에는 다음과 같은 것들이 있을 수 있다.

```text
Content-Length
Cache-Control
Set-Cookie
Location
```

현재 Project Arco 단계에서는 모든 Header를 외울 필요는 없다.

우선 다음 하나를 확실히 이해하면 된다.

```http
Content-Type: application/json
```

---

# 15. Response Body

Response Body에는 Server가 Client에게 전달하려는 데이터가 들어간다.

예:

```http
GET /events/123
```

응답:

```json
{
  "id": 123,
  "title": "AI Conference",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

이 JSON 객체가 Response Body다.

행사 여러 개를 반환한다면 배열을 사용할 수도 있다.

```json
[
  {
    "id": 1,
    "title": "AI Conference"
  },
  {
    "id": 2,
    "title": "Game Meetup"
  }
]
```

---

# 16. Request와 Response 비교

둘을 비교하면 다음과 같다.

| 구분 | Request | Response |
|---|---|---|
| 보내는 쪽 | Client | Server |
| 받는 쪽 | Server | Client |
| Method | 있음 | 없음 |
| URL | 있음 | 없음 |
| Status Code | 없음 | 있음 |
| Header | 있음 | 있음 |
| Body | 있을 수도 있음 | 있을 수도 있음 |

핵심 구조는 다음과 같다.

```text
HTTP Request

Method
URL
Header
Body

       ↓

Server

       ↓

HTTP Response

Status Code
Header
Body
```

---

# 17. Project Arco 예제 1: 행사 목록 조회

Client가 다음 Request를 보낸다.

```http
GET /events
```

개념적으로 Request는 다음과 같다.

```text
Method:
GET

URL:
/events

Body:
없음
```

Backend는 PostgreSQL에서 행사 목록을 조회한다.

```sql
SELECT *
FROM events;
```

그리고 Response를 반환한다.

```text
Status:
200 OK
```

Body:

```json
[
  {
    "id": 1,
    "title": "GIST AI Seminar"
  },
  {
    "id": 2,
    "title": "Game Conference"
  }
]
```

전체 흐름:

```text
Frontend

GET /events
   ↓

Express

SELECT * FROM events;
   ↓

PostgreSQL

행사 데이터
   ↓

Express

200 OK
[
  ...
]
   ↓

Frontend
```

---

# 18. Project Arco 예제 2: 특정 행사 조회

Request:

```http
GET /events/123
```

Backend는 `123`이라는 행사 ID를 이용해 조회한다.

SQL 예:

```sql
SELECT *
FROM events
WHERE id = 123;
```

행사가 존재한다면:

```text
200 OK
```

```json
{
  "id": 123,
  "title": "AI Conference"
}
```

행사가 존재하지 않는다면:

```text
404 Not Found
```

```json
{
  "message": "Event not found"
}
```

같은 Request라도 Server의 처리 결과에 따라 Response가 달라질 수 있다.

---

# 19. Project Arco 예제 3: 행사 생성

Request:

```http
POST /events
Content-Type: application/json
```

Body:

```json
{
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

Backend는 데이터를 검증한다.

```text
title이 존재하는가?
startAt이 올바른 날짜인가?
필수 값이 빠지지 않았는가?
```

문제가 없다면 PostgreSQL에 저장한다.

예:

```sql
INSERT INTO events (
  title,
  start_at
)
VALUES (
  'GIST AI Seminar',
  '2026-09-12T10:00:00+09:00'
);
```

생성이 성공했다면:

```text
201 Created
```

Response Body:

```json
{
  "id": 123,
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

---

# 20. 잘못된 Request 예제

Client가 다음 데이터를 보냈다고 하자.

```http
POST /events
Content-Type: application/json
```

```json
{
  "title": "",
  "startAt": "banana"
}
```

문제가 있다.

```text
title
→ 빈 문자열

startAt
→ 날짜가 아님
```

Backend는 DB에 저장하기 전에 검증할 수 있다.

그리고 다음과 같이 응답할 수 있다.

```text
400 Bad Request
```

```json
{
  "message": "Invalid event data"
}
```

즉 Request를 받았다고 해서 Server가 반드시 요청을 수행하는 것은 아니다.

```text
Request
   ↓
Validation
   ↓
정상?
 ┌─┴─┐
Yes No
 │   │
처리 400
```

---

# 21. Express에서 Request 받기

Express에서는 HTTP Request가 `req` 객체로 전달된다.

예:

```ts
app.get("/events", (req, res) => {
  res.json([]);
});
```

여기서

```ts
req
```

는 Request 정보를 담고 있다.

```ts
res
```

는 Response를 만드는 데 사용한다.

구조를 연결하면 다음과 같다.

```text
HTTP Request
    ↓
req
Express Handler
res
    ↓
HTTP Response
```

---

# 22. Express의 req

Express의 `req`에는 Request에 관한 다양한 정보가 들어 있다.

이번 프로젝트에서 특히 많이 사용할 것은 다음 세 가지다.

```ts
req.params
req.query
req.body
```

예를 들어:

```http
GET /events/123
```

여기서 `123`을 읽을 때:

```ts
req.params
```

를 사용한다.

---

다음 Request:

```http
GET /events?category=ai
```

`category=ai`를 읽을 때:

```ts
req.query
```

를 사용한다.

---

다음 Request:

```http
POST /events
```

Body:

```json
{
  "title": "AI Conference"
}
```

이 데이터를 읽을 때:

```ts
req.body
```

를 사용한다.

이를 정리하면 다음과 같다.

```text
/events/123
        ↓
req.params

/events?category=ai
        ↓
req.query

JSON Body
        ↓
req.body
```

---

# 23. Express의 res

`res`는 Client에 Response를 보낼 때 사용한다.

예:

```ts
res.json([]);
```

JSON Response를 보낸다.

다음처럼 Status Code를 지정할 수도 있다.

```ts
res.status(201).json({
  id: 123,
  title: "AI Conference",
});
```

의미:

```text
Status Code
201

Body
{
  ...
}
```

404 예:

```ts
res.status(404).json({
  message: "Event not found",
});
```

---

# 24. Express에서 JSON Body 읽기

Express가 JSON Request Body를 읽으려면 JSON parsing Middleware를 사용한다.

일반적으로 다음 코드를 작성한다.

```ts
app.use(express.json());
```

예를 들어 Client가 다음 Request를 보낸다.

```http
POST /events
Content-Type: application/json
```

```json
{
  "title": "AI Conference"
}
```

Express는 이를 parsing해서 다음처럼 사용할 수 있게 한다.

```ts
req.body.title
```

흐름:

```text
JSON Request Body
       ↓
express.json()
       ↓
JavaScript Object
       ↓
req.body
```

Middleware는 이후 별도 학습노트에서 자세히 다룬다.

---

# 25. HTTP는 상태를 기억하는가?

HTTP는 기본적으로 Stateless한 프로토콜이다.

즉 각 Request는 기본적으로 독립적이다.

예를 들어 다음 요청이 있다고 하자.

```text
Request 1
GET /events

Request 2
GET /events/123
```

HTTP 자체는

> Request 2가 Request 1 다음에 왔다.

는 사용자 상태를 자동으로 기억하지 않는다.

필요하다면 별도의 기술을 이용한다.

예:

```text
Cookie
Session
Token
Database
```

현재 Project Arco MVP에서는 이 개념을 깊게 공부할 필요는 없지만,

> HTTP Request는 기본적으로 서로 독립적이다.

정도는 기억해두면 좋다.

---

# 26. HTTP와 TCP의 관계

HTTP는 데이터를 어떤 의미와 구조로 주고받을지 정의한다.

실제 네트워크에서 HTTP 데이터를 전달하기 위해서는 아래 계층의 네트워크 기술이 사용된다.

아주 단순화하면 다음처럼 생각할 수 있다.

```text
HTTP
 ↓
TCP
 ↓
IP
 ↓
Network
```

HTTPS에서는 TLS도 사용된다.

```text
HTTP
 ↓
TLS
 ↓
TCP
 ↓
IP
```

Project Arco를 구현하는 현재 단계에서는 TCP 패킷 구조까지 공부할 필요는 없다.

우선 다음만 기억하면 충분하다.

> HTTP는 Client와 Server가 어떤 형식과 의미로 메시지를 주고받을지 정의하는 Application Layer Protocol이다.

---

# 27. HTTP와 HTTPS

웹 주소를 보면 두 가지를 자주 볼 수 있다.

```text
http://
https://
```

HTTP:

```text
통신 내용 자체를 암호화하지 않음
```

HTTPS:

```text
HTTP 통신을 TLS를 이용해 암호화
```

실제 서비스에서는 일반적으로 HTTPS를 사용한다.

개발 환경에서는 다음처럼 HTTP를 사용할 수 있다.

```text
http://localhost:3000
```

운영 환경에서는 보통 다음과 같이 HTTPS를 사용한다.

```text
https://arco.example.com
```

---

# 28. Request와 Response는 문자열인가?

네트워크 수준에서는 HTTP Message가 정해진 형식으로 전송된다.

예를 들어 HTTP/1.1 요청은 개념적으로 다음과 비슷하게 생겼다.

```http
GET /events HTTP/1.1
Host: localhost:3000
Accept: application/json
```

POST 요청:

```http
POST /events HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "title": "AI Conference"
}
```

Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "title": "AI Conference"
}
```

하지만 Express를 사용할 때는 이런 문자열을 직접 parsing할 필요가 없다.

Express가 이를 처리해서 개발자가 사용하기 쉬운 객체로 제공한다.

```text
Raw HTTP Message
       ↓
Node.js / Express
       ↓
req / res
```

---

# 29. API 개발자가 실제로 보는 관점

실제 Project Arco 개발에서는 HTTP 전체 형식을 직접 작성하는 경우보다 다음처럼 생각하는 경우가 많다.

```text
Method
+
Path
+
Input
+
Output
+
Status Code
```

예를 들어 행사 상세 조회 API:

```text
Method
GET

Path
/events/:id

Input
id

Success
200

Output
Event JSON

Failure
404
```

이것을 하나의 API 계약으로 볼 수 있다.

---

# 30. Project Arco API를 HTTP 관점에서 표현하기

예를 들어 다음 API가 있다고 하자.

```http
GET /events?date=2026-09-12&category=ai
```

이를 분석하면:

```text
Method
GET

Path
/events

Query Parameter
date=2026-09-12
category=ai

Request Body
없음
```

성공 Response:

```text
Status
200 OK

Content-Type
application/json
```

Body:

```json
[
  {
    "id": 1,
    "title": "AI Conference"
  }
]
```

이처럼 API 하나를

```text
Request
+
Response
```

두 부분으로 나눠 생각하면 이해하기 쉽다.

---

# 31. Request 처리 전체 흐름

Project Arco에서 HTTP Request가 들어왔을 때의 흐름을 자세히 보면 다음과 같다.

```text
Frontend
   ↓
HTTP Request
   ↓
Node.js
   ↓
Express
   ↓
Middleware
   ↓
Router
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

그 결과는 반대 방향으로 돌아온다.

```text
PostgreSQL
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
Express
   ↓
HTTP Response
   ↓
Frontend
```

현재는 이 모든 계층을 이해할 필요는 없다.

지금 단계에서는 다음만 확실히 기억하면 된다.

```text
Request
   ↓
Backend 처리
   ↓
Response
```

---

# 32. 자주 혼동하는 개념

## Request와 API

Request는 실제로 Client가 보내는 하나의 메시지다.

```http
GET /events
```

API는 Server가 제공하기로 약속한 인터페이스다.

```text
GET /events
→ 행사 목록을 반환한다.
```

즉:

```text
API
= 약속

Request
= 그 약속에 따라 실제로 보내는 요청
```

---

## JSON과 HTTP

JSON과 HTTP는 같은 것이 아니다.

HTTP:

```text
통신 규칙
```

JSON:

```text
데이터 표현 형식
```

HTTP Body 안에 JSON을 넣어 전달할 수 있다.

```text
HTTP
└── Body
    └── JSON
```

---

## URL과 Body

조회 조건은 URL에 들어갈 수 있다.

```http
GET /events?category=ai
```

생성할 데이터는 보통 Body에 들어간다.

```http
POST /events
```

```json
{
  "title": "AI Conference"
}
```

---

## Status Code와 Error Message

Status Code:

```text
404
```

는 프로그램이 이해하기 좋은 표준적인 결과 표현이다.

Body:

```json
{
  "message": "Event not found"
}
```

는 개발자나 사용자가 이해하기 쉬운 추가 정보다.

둘은 함께 사용할 수 있다.

---

# 33. 핵심 구조 암기

HTTP Request:

```text
Method
URL
Header
Body
```

HTTP Response:

```text
Status Code
Header
Body
```

Project Arco에 연결하면:

```text
GET
/events?date=2026-09-12
        ↓
Request

Express Backend

        ↓

200 OK
application/json
[ ... ]
        ↓
Response
```

---

# 34. 확인 문제

## 문제 1

다음 중 HTTP Request에 포함되는 것은?

```text
A. Method
B. URL
C. Header
D. 모두 포함될 수 있다.
```

정답:

```text
D
```

---

## 문제 2

다음 중 HTTP Response에 존재하는 것은?

```text
A. Status Code
B. Response Header
C. Response Body
D. 모두 가능
```

정답:

```text
D
```

---

## 문제 3

다음 Request에서 Method는 무엇인가?

```http
GET /events/123
```

정답:

```text
GET
```

---

## 문제 4

다음 Request에서 Body는 일반적으로 필요한가?

```http
GET /events?category=ai
```

정답:

```text
일반적으로 필요하지 않는다.
```

조회 조건은 Query Parameter로 전달하고 있다.

---

## 문제 5

다음 Response의 의미는?

```text
404 Not Found
```

정답:

```text
요청한 Resource를 찾지 못했다.
```

---

## 문제 6

다음 Header의 의미는?

```http
Content-Type: application/json
```

정답:

```text
HTTP Message Body가 JSON 형식이라는 의미다.
```

---

# 35. 실습 1: Request 분석

다음 HTTP Request를 분석해보자.

```http
GET /events?date=2026-09-12&category=game
```

다음 항목을 찾아본다.

```text
Method:
Path:
Query Parameter:
Body:
```

정답:

```text
Method:
GET

Path:
/events

Query Parameter:
date=2026-09-12
category=game

Body:
없음
```

---

# 36. 실습 2: 행사 생성 Request 설계

다음 행사를 등록한다고 하자.

```text
제목:
GIST AI Seminar

시작 시간:
2026-09-12 10:00

분야:
AI
```

HTTP Request를 설계하면 다음과 같이 작성할 수 있다.

```http
POST /events
Content-Type: application/json
```

```json
{
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00",
  "category": "AI"
}
```

---

# 37. 실습 3: Response 설계

새로운 행사가 성공적으로 생성되었을 때 어떤 Response를 반환할지 생각해보자.

예:

```text
Status:
201 Created
```

Body:

```json
{
  "id": 123,
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

---

# 38. Project Arco에서 반드시 이해할 예제

다음 요청을 완전히 설명할 수 있어야 한다.

```http
GET /events?date=2026-09-12&category=ai
```

설명:

```text
GET
→ 데이터를 조회하려는 요청

/events
→ 행사 Resource

date=2026-09-12
→ 날짜 검색 조건

category=ai
→ 관심 분야 검색 조건

Body
→ 없음
```

Backend 처리:

```text
Request
   ↓
Query Parameter 읽기
   ↓
입력 검증
   ↓
PostgreSQL 조회
   ↓
결과 생성
```

Response:

```text
200 OK
```

```json
[
  {
    "id": 1,
    "title": "AI Conference"
  }
]
```

이 흐름이 이후 REST API, Express, SQL 학습의 기반이 된다.

---

# 39. 체크리스트

학습 후 다음 항목을 확인한다.

- [ ] HTTP가 무엇인지 설명할 수 있다.
- [ ] Request와 Response의 차이를 설명할 수 있다.
- [ ] HTTP Method의 역할을 설명할 수 있다.
- [ ] Request URL이 무엇인지 설명할 수 있다.
- [ ] Header의 역할을 설명할 수 있다.
- [ ] `Content-Type: application/json`의 의미를 안다.
- [ ] Request Body가 무엇인지 설명할 수 있다.
- [ ] Response Status Code의 역할을 설명할 수 있다.
- [ ] Response Body가 무엇인지 설명할 수 있다.
- [ ] JSON과 HTTP의 차이를 설명할 수 있다.
- [ ] Express에서 `req`와 `res`가 무엇인지 설명할 수 있다.
- [ ] `req.params`, `req.query`, `req.body`가 각각 어디에서 오는지 대략 설명할 수 있다.
- [ ] `GET /events`의 Request와 Response 흐름을 설명할 수 있다.
- [ ] `POST /events`에서 JSON Body가 어떻게 전달되는지 설명할 수 있다.

---

# 40. 핵심 요약

HTTP는 Client와 Server가 통신하기 위한 규칙이다.

기본 흐름은 다음과 같다.

```text
Client
  ↓
HTTP Request
  ↓
Server
  ↓
HTTP Response
  ↓
Client
```

Request의 핵심 구성:

```text
Method
URL
Header
Body
```

Response의 핵심 구성:

```text
Status Code
Header
Body
```

Project Arco에서는 이를 다음과 같이 사용한다.

```text
Frontend
   ↓
GET /events
   ↓
Express Backend
   ↓
PostgreSQL
   ↓
200 OK
JSON
   ↓
Frontend
```

가장 중요한 한 문장은 다음과 같다.

> HTTP Request는 Client가 Server에 원하는 작업과 필요한 데이터를 전달하는 메시지이고, HTTP Response는 Server가 그 처리 결과와 데이터를 Client에게 반환하는 메시지다.

---

# 41. 다음 학습

다음 문서에서는 HTTP Request를 구성하는 URL과 Method를 더 자세히 학습한다.

```text
현재
02-http-request-response.md

        ↓

다음
03-url-http-method.md
```

다음 핵심 질문은 다음과 같다.

> `/events/123`과 `/events?category=ai`는 어떻게 다르며, GET·POST·PUT·PATCH·DELETE는 각각 언제 사용해야 하는가?