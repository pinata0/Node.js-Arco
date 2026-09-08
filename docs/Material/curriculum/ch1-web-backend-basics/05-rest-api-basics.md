# REST API Basics

## 1. 학습 목표

이 문서에서는 지금까지 학습한 HTTP 개념을 이용해 REST API를 어떻게 설계하는지 학습한다.

Project Arco를 기준으로 다음과 같은 API를 직접 이해하고 설계할 수 있는 것이 목표다.

```http
GET /events
GET /events/123
GET /events?date=2026-09-12
GET /events?category=ai
POST /events
PATCH /events/123
DELETE /events/123
```

학습 후 다음 질문에 답할 수 있어야 한다.

- API란 무엇인가?
- REST란 무엇인가?
- REST API에서 Resource란 무엇인가?
- Endpoint란 무엇인가?
- URL과 HTTP Method를 어떻게 조합하는가?
- Path Parameter와 Query Parameter는 언제 사용하는가?
- Request Body는 언제 사용하는가?
- Status Code는 API 설계에서 어떤 역할을 하는가?
- Project Arco의 행사 검색 API를 직접 설계할 수 있는가?

---

# 2. API란?

API는

```text
Application Programming Interface
```

의 약자다.

프로그램이 다른 프로그램의 기능을 사용할 수 있도록 제공되는 인터페이스다.

예를 들어 Project Arco Frontend가 행사 데이터를 필요로 한다고 하자.

Frontend가 PostgreSQL에 직접 SQL을 보내는 대신 Backend API를 호출한다.

```text
Frontend
   ↓
API Request
   ↓
Backend
   ↓
PostgreSQL
```

예:

```http
GET /events
```

Backend는 행사 목록을 반환한다.

```json
[
  {
    "id": 1,
    "title": "GIST AI Seminar"
  }
]
```

즉 API는 Frontend와 Backend 사이의 약속이라고 볼 수 있다.

---

# 3. API는 왜 필요한가?

Frontend가 Backend 내부 코드를 직접 실행하는 구조라면 두 시스템이 강하게 결합된다.

하지만 API를 사용하면 Frontend는 Backend 내부 구현을 몰라도 된다.

Frontend가 알아야 하는 것은 다음 정도다.

```text
어떤 URL로 요청할 것인가?
어떤 Method를 사용할 것인가?
어떤 데이터를 전달할 것인가?
어떤 Response가 돌아오는가?
```

예를 들어 다음 API가 있다고 하자.

```http
GET /events/123
```

Frontend는

> 123번 행사 데이터를 받고 싶다.

는 것만 알면 된다.

Backend 내부에서는 실제로 다음과 같은 작업이 일어날 수 있다.

```text
Express Router
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
   ↓
JOIN
   ↓
JSON 변환
```

Frontend는 이 내부 구현을 알 필요가 없다.

---

# 4. API는 계약이다

Frontend와 Backend가 다음과 같이 약속했다고 하자.

```text
GET /events/:id

성공
→ 200 OK

실패
→ 404 Not Found
```

Response 형식:

```json
{
  "id": 123,
  "title": "AI Conference"
}
```

이것이 API 계약이다.

Frontend는 이 계약을 믿고 개발한다.

Backend도 이 계약에 맞게 구현한다.

```text
Frontend
   ↕
API Contract
   ↕
Backend
```

따라서 API 설계가 변경되면 Frontend 코드에도 영향을 줄 수 있다.

---

# 5. REST란?

REST는

```text
Representational State Transfer
```

의 약자다.

웹 API를 설계하는 하나의 Architecture Style이다.

REST에는 여러 원칙이 있지만 처음부터 모든 이론을 깊게 공부할 필요는 없다.

Project Arco에서는 우선 다음 핵심 아이디어를 이해하면 된다.

```text
Resource를 URL로 표현한다.

작업은 HTTP Method로 표현한다.

HTTP의 기본 의미를 최대한 그대로 활용한다.
```

예:

```http
GET /events
```

여기서:

```text
/events
→ Resource

GET
→ 조회
```

---

# 6. REST API란?

REST 원칙을 활용해 HTTP 기반으로 설계한 API를 일반적으로 REST API 또는 RESTful API라고 부른다.

예:

```http
GET /events
POST /events
GET /events/123
PATCH /events/123
DELETE /events/123
```

각 요청은 같은 Event Resource를 대상으로 하지만 HTTP Method에 따라 역할이 달라진다.

```text
GET
→ 조회

POST
→ 생성

PATCH
→ 수정

DELETE
→ 삭제
```

---

# 7. Resource 중심으로 생각하기

REST API에서는 기능보다 Resource를 먼저 생각하는 것이 중요하다.

Project Arco에는 다음과 같은 Resource가 있을 수 있다.

```text
Event
Tag
Category
Location
Organizer
```

이를 URL에서는 보통 복수 명사 형태로 표현한다.

```text
/events
/tags
/categories
/locations
/organizers
```

즉 다음처럼 생각한다.

```text
"행사를 조회하는 기능"
```

보다 먼저:

```text
"Event라는 Resource가 있다."
```

를 생각한다.

그리고 HTTP Method로 작업을 표현한다.

---

# 8. Resource와 행동을 분리한다

다음처럼 API를 설계할 수도 있다.

```text
/getEvents
/createEvent
/updateEvent
/deleteEvent
```

하지만 REST 스타일에서는 일반적으로 다음과 같이 설계한다.

```http
GET /events
POST /events
PATCH /events/123
DELETE /events/123
```

왜냐하면:

```text
/events
→ 무엇을 대상으로 하는가?

GET / POST / PATCH / DELETE
→ 무엇을 할 것인가?
```

가 명확히 분리되기 때문이다.

---

# 9. Endpoint란?

Endpoint는 Client가 실제로 요청할 수 있는 API의 특정 접점을 의미한다.

예:

```http
GET /events
```

하나의 Endpoint라고 볼 수 있다.

다음도 별개의 Endpoint다.

```http
GET /events/:id
```

그리고:

```http
POST /events
```

도 다른 Endpoint다.

같은 `/events` Path라도 Method가 다르면 서로 다른 기능이다.

따라서 API Endpoint는 보통 다음 두 요소를 함께 본다.

```text
HTTP Method
+
Path
```

예:

```text
GET /events

POST /events
```

---

# 10. Collection Resource

여러 Event의 집합은 Collection으로 표현할 수 있다.

```text
/events
```

예:

```http
GET /events
```

의미:

> Event Collection을 조회한다.

Response:

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

# 11. Single Resource

특정 Event 하나는 ID를 이용해 표현할 수 있다.

```text
/events/123
```

예:

```http
GET /events/123
```

의미:

> ID가 123인 Event를 조회한다.

Response:

```json
{
  "id": 123,
  "title": "GIST AI Seminar"
}
```

---

# 12. Collection과 Single Resource 비교

```text
/events
→ Event Collection

/events/123
→ 하나의 Event
```

이를 HTTP Method와 결합하면:

```http
GET /events
```

> 행사 목록 조회

```http
GET /events/123
```

> 특정 행사 조회

```http
POST /events
```

> 새 행사 생성

```http
PATCH /events/123
```

> 특정 행사 수정

---

# 13. REST API와 CRUD

CRUD는 데이터의 기본적인 네 가지 작업이다.

```text
Create
Read
Update
Delete
```

HTTP Method와 연결하면 다음과 같다.

| CRUD | HTTP Method | Project Arco 예 |
|---|---|---|
| Create | POST | 행사 생성 |
| Read | GET | 행사 조회 |
| Update | PUT / PATCH | 행사 수정 |
| Delete | DELETE | 행사 삭제 |

---

# 14. Event Resource CRUD

Project Arco의 Event Resource를 기준으로 API를 만든다면 다음과 같다.

## Create

```http
POST /events
```

새로운 Event 생성

---

## Read Collection

```http
GET /events
```

행사 목록 조회

---

## Read Single Resource

```http
GET /events/123
```

123번 행사 조회

---

## Update

```http
PATCH /events/123
```

123번 행사 수정

---

## Delete

```http
DELETE /events/123
```

123번 행사 삭제

---

# 15. Path Parameter

특정 Resource 하나를 식별할 때 Path Parameter를 사용한다.

Express Route:

```ts
app.get("/events/:id", (req, res) => {
  // ...
});
```

실제 Request:

```http
GET /events/123
```

여기서:

```text
123
```

은 Event ID다.

Express에서는:

```ts
req.params.id
```

로 접근할 수 있다.

---

# 16. Path Parameter를 사용하는 기준

다음 질문을 해보면 된다.

> 어떤 Resource 하나를 식별하기 위한 값인가?

그렇다면 Path Parameter가 자연스럽다.

예:

```http
GET /events/123
```

```text
123
→ Event 식별
```

또 다른 예:

```http
GET /locations/5
```

```text
5
→ Location 식별
```

---

# 17. Query Parameter

Collection에서 특정 조건에 맞는 Resource를 검색하거나 필터링할 때 Query Parameter를 사용한다.

예:

```http
GET /events?category=ai
```

또는:

```http
GET /events?date=2026-09-12
```

여러 조건을 함께 사용할 수도 있다.

```http
GET /events?date=2026-09-12&category=ai
```

---

# 18. Query Parameter를 사용하는 기준

다음 질문을 해본다.

> Resource를 식별하는 값인가?

아니고,

> 목록을 검색하거나 필터링하기 위한 조건인가?

라면 Query Parameter를 고려한다.

예:

```text
date
category
region
format
registrationStatus
sort
page
limit
```

---

# 19. Path Parameter와 Query Parameter 다시 비교

```text
Path Parameter
→ 어떤 Resource인가?

Query Parameter
→ 어떤 조건을 만족해야 하는가?
```

예:

```http
GET /events/123
```

```text
123번 Event
```

반면:

```http
GET /events?category=ai
```

```text
AI 조건을 만족하는 Event들
```

---

# 20. Request Body

새로운 Resource를 만들거나 기존 Resource를 수정할 때 전달하는 데이터는 일반적으로 Request Body에 넣는다.

예:

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

즉:

```text
URL
→ 어떤 Resource인가?

Method
→ 어떤 작업인가?

Body
→ 실제 전달할 데이터는 무엇인가?
```

---

# 21. 입력 데이터 위치 선택 기준

REST API를 설계할 때 입력 값이 어디에 들어가야 하는지 헷갈릴 수 있다.

다음 기준을 사용할 수 있다.

```text
특정 Resource 식별
→ Path Parameter

검색 / 필터 / 정렬
→ Query Parameter

생성 / 수정할 데이터
→ Request Body
```

예:

```http
PATCH /events/123
Content-Type: application/json
```

```json
{
  "title": "Updated AI Seminar"
}
```

분석:

```text
123
→ Path Parameter
→ 수정할 Event 식별

title
→ Request Body
→ 수정할 데이터
```

---

# 22. 행사 목록 API

Project Arco의 가장 기본적인 API는 다음이다.

```http
GET /events
```

의미:

> 행사 목록을 조회한다.

성공:

```text
200 OK
```

Response:

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

# 23. 특정 행사 조회 API

```http
GET /events/123
```

성공:

```text
200 OK
```

```json
{
  "id": 123,
  "title": "GIST AI Seminar"
}
```

Event가 없다면:

```text
404 Not Found
```

```json
{
  "message": "Event not found"
}
```

---

# 24. 행사 생성 API

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

성공:

```text
201 Created
```

```json
{
  "id": 123,
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

Validation 실패:

```text
400 Bad Request
```

---

# 25. 행사 수정 API

행사의 일부만 수정한다고 하자.

```http
PATCH /events/123
Content-Type: application/json
```

Body:

```json
{
  "title": "Updated GIST AI Seminar"
}
```

성공:

```text
200 OK
```

Resource가 없다면:

```text
404 Not Found
```

입력 값이 잘못되었다면:

```text
400 Bad Request
```

---

# 26. 행사 삭제 API

```http
DELETE /events/123
```

삭제 성공:

```text
204 No Content
```

Resource가 없다면:

```text
404 Not Found
```

---

# 27. 검색도 `/events`를 사용한다

행사 검색 기능이 있다고 해서 다음처럼 별도 Resource를 만들 필요는 없다.

```text
/searchEvents
/findEvents
/getEventsByDate
```

Event Collection에 Query Parameter를 추가할 수 있다.

예:

```http
GET /events?date=2026-09-12
```

또는:

```http
GET /events?category=ai
```

복합 검색:

```http
GET /events?date=2026-09-12&category=ai&region=seoul
```

---

# 28. Project Arco 검색 API

Project Arco의 핵심 기능은 여러 조건을 조합한 행사 검색이다.

예를 들어 사용자가 다음 조건을 입력한다고 하자.

```text
날짜
2026-09-12

지역
서울

관심 분야
AI

참여 방식
offline
```

API는 다음처럼 설계할 수 있다.

```http
GET /events?date=2026-09-12&region=seoul&category=ai&format=offline
```

---

# 29. 검색 API 내부 흐름

Frontend:

```http
GET /events?date=2026-09-12&category=ai
```

Express:

```ts
req.query.date
req.query.category
```

그 다음 Backend는 Query Parameter를 SQL 조건으로 변환한다.

```text
date
        ↓
start_at 조건

category
        ↓
category JOIN / WHERE 조건
```

전체 흐름:

```text
HTTP Query Parameter
        ↓
Express
        ↓
Validation
        ↓
Service
        ↓
SQL Query
        ↓
PostgreSQL
```

---

# 30. URL과 DB Schema는 같지 않아도 된다

Project Arco의 DB는 다음처럼 구성될 수 있다.

```text
events
tags
event_tags
categories
event_categories
locations
```

하지만 API는 단순하게 유지할 수 있다.

```http
GET /events?tag=ai
```

Backend 내부에서는:

```sql
SELECT ...
FROM events
JOIN event_tags
  ON ...
JOIN tags
  ON ...
WHERE tags.name = ...;
```

같은 SQL을 실행할 수 있다.

즉:

> API URL은 DB Table 구조를 그대로 노출할 필요가 없다.

---

# 31. API는 Backend 내부 구조도 숨긴다

Backend 내부 구조가 다음과 같다고 하자.

```text
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

Frontend는 이것을 몰라도 된다.

Frontend가 보는 것은 단지:

```http
GET /events
```

뿐이다.

즉 API는 내부 구현 세부사항을 숨기는 역할도 한다.

---

# 32. REST API의 Stateless

REST에서 중요한 특성 중 하나는 Stateless다.

각 Request는 기본적으로 독립적으로 처리된다.

예를 들어:

```http
GET /events
```

다음에:

```http
GET /events/123
```

을 보냈다고 해서 Server가 HTTP 자체를 통해 이전 요청을 자동으로 기억하는 것은 아니다.

필요한 정보가 있다면 각 Request에서 전달하거나 별도의 인증 상태 관리 기술을 사용한다.

예:

```text
Cookie
Session
Token
```

Project Arco MVP에서는 인증 기능이 없을 수 있으므로 지금은 개념만 이해하면 된다.

---

# 33. REST API에서 HTTP 의미를 활용한다

REST 스타일 API에서는 HTTP가 이미 가지고 있는 의미를 최대한 활용한다.

예:

```text
GET
→ 조회

POST
→ 생성

PATCH
→ 일부 수정

DELETE
→ 삭제
```

Status Code도 활용한다.

```text
200
→ 성공

201
→ 생성 성공

400
→ 잘못된 입력

404
→ Resource 없음

500
→ Server Error
```

따라서 Response Body에 모든 의미를 새로 정의할 필요가 줄어든다.

---

# 34. 좋지 않은 API 예시

다음 API를 보자.

```http
POST /doSomething
```

Body:

```json
{
  "action": "getEvent",
  "id": 123
}
```

이 API는 어떤 Resource를 대상으로 하는지 URL만 보고 알기 어렵다.

또 GET이 아닌 POST를 사용해 조회를 하고 있다.

REST 스타일에서는 다음이 더 자연스럽다.

```http
GET /events/123
```

---

# 35. 또 다른 좋지 않은 예

```http
GET /deleteEvent?id=123
```

GET은 조회용 Method인데 Resource를 삭제하고 있다.

더 자연스러운 API:

```http
DELETE /events/123
```

의미가 훨씬 명확하다.

---

# 36. 지나치게 많은 Endpoint 만들지 않기

다음과 같이 기능마다 Endpoint를 하나씩 만들 수 있다.

```text
/getEvents
/getEventsByDate
/getEventsByCategory
/getEventsByRegion
/getEventsByDateAndCategory
/getEventsByDateAndRegion
```

검색 조건이 늘어날수록 Endpoint 수가 폭발한다.

대신 하나의 Collection Endpoint를 사용한다.

```http
GET /events
```

그리고 Query Parameter를 조합한다.

```http
GET /events?date=2026-09-12
```

```http
GET /events?category=ai
```

```http
GET /events?date=2026-09-12&category=ai
```

이 방식이 훨씬 확장하기 쉽다.

---

# 37. Optional Query Parameter

검색 조건은 선택적일 수 있다.

예를 들어:

```http
GET /events
```

모든 행사

```http
GET /events?date=2026-09-12
```

날짜 조건 추가

```http
GET /events?date=2026-09-12&region=seoul
```

지역 조건 추가

즉 Backend에서는 Query Parameter가 존재하는 경우에만 조건을 추가할 수 있다.

개념적으로:

```text
date 있음?
→ 날짜 조건 추가

category 있음?
→ 카테고리 조건 추가

region 있음?
→ 지역 조건 추가
```

---

# 38. 복수 조건 검색

사용자가 AI 또는 Game 분야를 선택했다고 하자.

다양한 API 표현 방법이 존재한다.

예:

```http
GET /events?category=ai&category=game
```

또는:

```http
GET /events?categories=ai,game
```

어떤 방식을 사용할지는 API 설계 결정이다.

가장 중요한 것은 다음이다.

> 프로젝트 전체에서 한 가지 규칙을 일관되게 사용한다.

Project Arco에서는 실제 API Schema 설계 단계에서 결정하면 된다.

---

# 39. 정렬

Query Parameter는 검색뿐 아니라 정렬에도 사용할 수 있다.

예:

```http
GET /events?sort=startAt
```

또는:

```http
GET /events?sort=startAt&order=asc
```

의미:

```text
startAt 기준
오름차순 정렬
```

---

# 40. Pagination

행사가 많아지면 한 번에 모든 Event를 반환하지 않을 수 있다.

예:

```http
GET /events?page=1&limit=20
```

의미:

```text
page
→ 페이지 번호

limit
→ 한 페이지 데이터 개수
```

Pagination은 MVP 이후 별도로 더 자세히 학습한다.

---

# 41. Nested Resource

Resource 간 관계를 URL에 표현할 수도 있다.

예:

```http
GET /events/123/tags
```

의미:

> 123번 Event의 Tag 목록을 조회한다.

또는:

```http
GET /organizers/5/events
```

의미:

> Organizer 5가 주최한 Event 목록을 조회한다.

하지만 모든 DB 관계를 Nested URL로 표현할 필요는 없다.

API를 지나치게 깊게 만들면 오히려 복잡해질 수 있다.

---

# 42. Project Arco에서는 단순한 API부터 시작한다

MVP에서는 우선 핵심 Event API를 중심으로 만드는 것이 좋다.

```text
GET    /events
GET    /events/:id
POST   /events
PATCH  /events/:id
DELETE /events/:id
```

검색은:

```text
GET /events?...
```

로 처리한다.

Tag, Category, Location을 별도 API로 노출할지는 실제 Frontend 요구사항을 보고 결정한다.

---

# 43. Response 구조도 API 계약이다

다음 API가 있다고 하자.

```http
GET /events/123
```

Response를 다음처럼 정했다고 하자.

```json
{
  "id": 123,
  "title": "AI Conference",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

Frontend는 이 구조를 기대한다.

따라서 Backend가 갑자기:

```json
{
  "event_id": 123,
  "event_name": "AI Conference"
}
```

처럼 바꾸면 Frontend가 깨질 수 있다.

즉 API Contract에는 URL뿐만 아니라 Response Schema도 포함된다.

---

# 44. Request Schema도 API 계약이다

행사 생성 API:

```http
POST /events
```

다음 Body를 받기로 했다고 하자.

```json
{
  "title": "AI Conference",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

그러면 Backend는 어떤 필드가 들어올 수 있는지 정의해야 한다.

예:

```text
title
→ required

startAt
→ required

endAt
→ optional
```

이러한 규칙도 API 계약의 일부다.

---

# 45. Validation과 REST API

Client가 다음 데이터를 보냈다고 하자.

```json
{
  "title": "",
  "startAt": "banana"
}
```

Backend는 이를 그대로 DB에 넣으면 안 된다.

```text
Request
   ↓
Validation
   ↓
정상 데이터?
```

잘못되었다면:

```text
400 Bad Request
```

를 반환한다.

따라서 API는 단순한 데이터 전달 통로가 아니라 입력 데이터의 경계 역할도 한다.

---

# 46. REST API와 Database

API와 Database를 연결하면 다음 흐름이 된다.

```text
HTTP Request
   ↓
REST API
   ↓
Backend Logic
   ↓
SQL
   ↓
PostgreSQL
   ↓
Result
   ↓
JSON Response
```

Project Arco에서:

```http
GET /events?category=ai
```

라는 요청이 들어오면 Backend는 내부적으로 SQL을 실행한다.

예:

```sql
SELECT DISTINCT e.*
FROM events AS e
JOIN event_categories AS ec
  ON ec.event_id = e.id
JOIN categories AS c
  ON c.id = ec.category_id
WHERE c.name = 'AI';
```

Frontend는 이 SQL을 알 필요가 없다.

---

# 47. SQL Injection 방지와 API

Request에 포함된 값은 사용자가 조작할 수 있다.

예:

```http
GET /events?category=ai
```

여기서 `category`는 사용자 입력이다.

이 값을 SQL 문자열에 직접 이어붙이는 것은 위험하다.

나쁜 예:

```ts
const sql = `
  SELECT *
  FROM events
  WHERE category = '${category}'
`;
```

나중에 Database 연결 단계에서는 Parameterized Query를 사용한다.

```sql
SELECT *
FROM events
WHERE category = $1;
```

REST API는 사용자 입력이 Server로 들어오는 경계이므로 Validation과 보안이 중요하다.

---

# 48. API Versioning

서비스가 발전하면 API 형태가 바뀔 수 있다.

이를 관리하기 위해 다음처럼 Version을 URL에 넣는 경우도 있다.

```text
/api/v1/events
```

나중에 새로운 API가 필요하다면:

```text
/api/v2/events
```

같은 방식도 가능하다.

하지만 Project Arco MVP에서는 처음부터 Versioning을 복잡하게 도입할 필요는 없다.

현재 단계에서는 개념만 알아두면 된다.

---

# 49. `/api` Prefix

Backend Endpoint 앞에 `/api`를 붙이는 프로젝트도 많다.

예:

```text
/api/events
/api/events/123
```

그러면 Frontend Route와 Backend API Route를 구분하기 쉬워질 수 있다.

예:

```text
/events
→ Frontend 페이지

/api/events
→ Backend API
```

Project Arco에서도 필요하다면 다음 형식을 사용할 수 있다.

```http
GET /api/events
```

다만 중요한 것은 `/events`와 `/api/events` 중 어떤 것이 절대적으로 맞는지가 아니라 프로젝트 내에서 일관된 규칙을 쓰는 것이다.

---

# 50. RESTful이라는 표현

REST 원칙을 비교적 잘 따르는 API를 흔히 RESTful API라고 한다.

예를 들어 다음 API는 REST 스타일에 가깝다.

```http
GET /events
POST /events
GET /events/123
PATCH /events/123
DELETE /events/123
```

반면:

```text
/getAllEvents
/createNewEvent
/changeEventName
/removeEvent
```

처럼 기능 이름을 URL에 직접 나열하는 형태는 REST 스타일에서 멀어진다.

하지만 REST는 법칙이 아니라 Architecture Style이다.

현실의 API는 요구사항에 따라 일부 원칙에서 벗어날 수도 있다.

초기에는 완벽하게 RESTful한 API를 만드는 것보다

> 이해하기 쉽고 일관된 API를 만드는 것

이 더 중요하다.

---

# 51. REST는 CRUD와 완전히 같은가?

아니다.

REST와 CRUD는 서로 다른 개념이다.

CRUD:

```text
Create
Read
Update
Delete
```

데이터에 수행하는 기본 작업이다.

REST:

```text
웹 시스템을 Resource 중심으로 설계하는 Architecture Style
```

REST API에서 CRUD를 HTTP Method와 연결해 사용하는 경우가 많기 때문에 비슷하게 보이는 것이다.

```text
CRUD
      ↓
HTTP Method
      ↓
REST API
```

하지만 둘은 같은 개념은 아니다.

---

# 52. REST와 HTTP도 같은 개념이 아니다

HTTP는 Protocol이다.

```text
HTTP
→ Client와 Server가 통신하는 규칙
```

REST는 Architecture Style이다.

```text
REST
→ Resource 중심으로 시스템을 설계하는 방식
```

REST API는 주로 HTTP를 이용한다.

관계를 표현하면:

```text
HTTP
→ 통신 수단

REST
→ API 설계 방식
```

---

# 53. Project Arco 기본 Event API

현재 단계에서 Project Arco의 Event API를 다음처럼 생각할 수 있다.

```text
GET /events
```

행사 목록 조회 및 검색

```text
GET /events/:id
```

행사 상세 조회

```text
POST /events
```

새 행사 생성

```text
PATCH /events/:id
```

행사 수정

```text
DELETE /events/:id
```

행사 삭제

---

# 54. Project Arco 검색 Parameter 후보

Project Arco의 서비스 목표를 고려하면 `/events`에서 다음 Query Parameter들이 필요할 가능성이 있다.

```text
date
startDate
endDate
category
tag
region
format
registrationStatus
sort
page
limit
```

예:

```http
GET /events?date=2026-09-12
```

```http
GET /events?category=ai
```

```http
GET /events?region=seoul
```

```http
GET /events?format=offline
```

복합 검색:

```http
GET /events?date=2026-09-12&category=ai&region=seoul&format=offline
```

실제 Parameter 이름과 형식은 API 설계 단계에서 별도로 확정하면 된다.

---

# 55. 날짜 검색에서 생각해야 할 점

사용자가 다음 요청을 한다.

```http
GET /events?date=2026-09-12
```

Backend에서는 이를 다음 범위로 해석할 수 있다.

```text
2026-09-12 00:00:00
이상

2026-09-13 00:00:00
미만
```

SQL 개념:

```sql
WHERE start_at >= $1
  AND start_at < $2
```

즉 REST API의 Query Parameter 하나가 실제로는 여러 SQL 조건으로 변환될 수 있다.

---

# 56. 관심 분야 검색에서 생각해야 할 점

Request:

```http
GET /events?category=ai
```

DB 구조가 N:M이라면 Backend 내부에서는 JOIN이 필요할 수 있다.

```text
events
   ↓
event_categories
   ↓
categories
```

Frontend는 이를 몰라도 된다.

API는 단순히:

```http
GET /events?category=ai
```

만 제공한다.

---

# 57. 태그 검색

Tag 역시 N:M 관계로 설계했다면:

```text
events
   ↕
event_tags
   ↕
tags
```

API는 다음처럼 단순하게 만들 수 있다.

```http
GET /events?tag=machine-learning
```

Backend 내부에서 JOIN을 수행한다.

즉 REST API는 복잡한 DB 구조를 단순한 외부 인터페이스로 감싸준다.

---

# 58. 지역 검색

사용자가 서울 행사를 찾는다고 하자.

```http
GET /events?region=seoul
```

DB에서는 Location Table과 JOIN해야 할 수도 있다.

```text
events
   ↓
location_id
   ↓
locations
```

하지만 API 사용자는 DB 구조를 알 필요가 없다.

---

# 59. 복합 검색

다음 조건을 검색한다고 하자.

```text
2026-09-12
서울
AI 또는 Game
Offline
```

Request 예:

```http
GET /events?date=2026-09-12&region=seoul&categories=ai,game&format=offline
```

Backend:

```text
Query Parameter Parsing
        ↓
Validation
        ↓
SQL 조건 생성
        ↓
JOIN
        ↓
WHERE
        ↓
ORDER BY
        ↓
Result
```

이것이 Project Arco의 핵심 Backend 기능 중 하나가 된다.

---

# 60. API 설계 순서

새로운 기능의 API를 만들 때 다음 순서로 생각하면 좋다.

```text
1. Resource가 무엇인가?
2. Collection인가 Single Resource인가?
3. 어떤 작업을 하는가?
4. 어떤 HTTP Method가 적절한가?
5. Resource 식별 값이 필요한가?
6. 검색 조건이 있는가?
7. Body가 필요한가?
8. 성공 Status Code는 무엇인가?
9. 실패 Status Code는 무엇인가?
10. Response JSON은 어떤 구조인가?
```

---

# 61. 예제: 행사 상세 조회 API 설계

기능:

```text
특정 행사 상세 조회
```

## 1. Resource

```text
Event
```

## 2. Single Resource

```text
/events/:id
```

## 3. 작업

조회

## 4. Method

```text
GET
```

최종:

```http
GET /events/:id
```

성공:

```text
200 OK
```

실패:

```text
404 Not Found
```

---

# 62. 예제: 행사 생성 API 설계

기능:

```text
새로운 행사 등록
```

Resource:

```text
Event Collection
```

Method:

```text
POST
```

Endpoint:

```http
POST /events
```

Body:

```json
{
  "title": "AI Conference",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

성공:

```text
201 Created
```

Validation Error:

```text
400 Bad Request
```

중복:

```text
409 Conflict
```

---

# 63. 예제: 날짜 기반 행사 검색

기능:

```text
특정 날짜에 열리는 행사 조회
```

Resource:

```text
Event Collection
```

작업:

```text
Read
```

Method:

```text
GET
```

검색 조건:

```text
date
```

최종:

```http
GET /events?date=2026-09-12
```

검색 결과가 없으면:

```text
200 OK
```

```json
[]
```

---

# 64. 예제: 날짜 + 분야 복합 검색

기능:

```text
2026년 9월 12일 AI 행사 조회
```

Endpoint:

```http
GET /events?date=2026-09-12&category=ai
```

분석:

```text
GET
→ 조회

/events
→ Event Collection

date
→ 날짜 필터

category
→ 분야 필터
```

---

# 65. Express Route로 연결

Event 목록:

```ts
app.get("/events", (req, res) => {
  const date = req.query.date;
  const category = req.query.category;

  res.json([]);
});
```

특정 Event:

```ts
app.get("/events/:id", (req, res) => {
  const id = req.params.id;

  res.json({
    id,
  });
});
```

행사 생성:

```ts
app.post("/events", (req, res) => {
  const event = req.body;

  res.status(201).json(event);
});
```

---

# 66. Router를 사용하면

Project Arco가 커지면 Express Router를 사용할 수 있다.

예:

```ts
router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", createEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);
```

그리고:

```ts
app.use("/events", router);
```

라고 연결할 수 있다.

그 결과 실제 API는:

```text
GET    /events
GET    /events/:id
POST   /events
PATCH  /events/:id
DELETE /events/:id
```

가 된다.

Router는 이후 Express 챕터에서 자세히 학습한다.

---

# 67. API 문서화

API를 만들면 다른 개발자가 사용할 수 있도록 문서화하는 것이 좋다.

예:

```text
GET /events/:id

Description
특정 Event 조회

Path Parameter
id: Event ID

Success
200 OK

Failure
404 Not Found
```

Response:

```json
{
  "id": 123,
  "title": "AI Conference"
}
```

이런 문서가 있으면 Frontend와 Backend 개발을 분리하기 쉬워진다.

---

# 68. API 설계 예시 표

Project Arco 초기 API를 정리하면 다음과 같다.

| Method | Path | 목적 |
|---|---|---|
| GET | `/events` | 행사 목록 및 검색 |
| GET | `/events/:id` | 행사 상세 조회 |
| POST | `/events` | 행사 생성 |
| PATCH | `/events/:id` | 행사 일부 수정 |
| DELETE | `/events/:id` | 행사 삭제 |

검색 조건은:

```text
GET /events?...
```

형태로 추가한다.

---

# 69. Status Code까지 포함한 API 계약

| API | 성공 | 주요 실패 |
|---|---|---|
| `GET /events` | 200 | 400, 500 |
| `GET /events/:id` | 200 | 400, 404, 500 |
| `POST /events` | 201 | 400, 409, 500 |
| `PATCH /events/:id` | 200 | 400, 404, 409, 500 |
| `DELETE /events/:id` | 204 | 404, 500 |

이 정도만 정해도 Backend API의 기본 뼈대가 만들어진다.

---

# 70. 좋은 REST API의 특징

초기에는 다음 정도를 기준으로 삼으면 된다.

## Resource 중심

```text
/events
```

처럼 명사를 사용한다.

## HTTP Method 의미 활용

```text
GET
POST
PATCH
DELETE
```

를 목적에 맞게 사용한다.

## URL 일관성

```text
/events
/events/:id
```

같은 패턴을 유지한다.

## 적절한 Status Code

```text
200
201
204
400
404
409
500
```

를 상황에 맞게 사용한다.

## Response 구조 일관성

동일한 종류의 데이터는 비슷한 JSON 형태를 유지한다.

---

# 71. 좋지 않은 REST API 설계 예

다음 API를 살펴보자.

```text
GET /getEvents

GET /getEventById?id=123

POST /createNewEvent

POST /updateEvent

GET /deleteEvent?id=123
```

문제:

```text
URL에 동작이 들어감

HTTP Method 의미를 제대로 활용하지 않음

Resource 구조가 일관되지 않음

삭제에 GET 사용
```

REST 스타일로 바꾸면:

```text
GET    /events
GET    /events/123
POST   /events
PATCH  /events/123
DELETE /events/123
```

---

# 72. REST API 설계가 중요한 이유

API 설계가 일관적이면 개발자는 Endpoint 이름을 거의 예측할 수 있다.

예를 들어:

```text
Event 목록?
→ GET /events

특정 Event?
→ GET /events/:id

새 Event?
→ POST /events
```

반대로 규칙이 없다면 매번 API 문서를 확인해야 한다.

좋은 API는:

```text
예측 가능하고
일관되고
이해하기 쉽다.
```

---

# 73. 확인 문제

## 문제 1

REST API에서 URL은 주로 무엇을 표현하는가?

정답:

```text
Resource
```

---

## 문제 2

Resource에 어떤 작업을 할지는 주로 무엇으로 표현하는가?

정답:

```text
HTTP Method
```

---

## 문제 3

다음 중 더 REST 스타일에 가까운 API는?

```text
A. GET /getEvents
B. GET /events
```

정답:

```text
B. GET /events
```

---

## 문제 4

123번 Event를 조회하려면?

정답:

```http
GET /events/123
```

---

## 문제 5

새 Event를 만들려면?

정답:

```http
POST /events
```

---

## 문제 6

123번 Event의 일부를 수정하려면?

정답:

```http
PATCH /events/123
```

---

## 문제 7

AI 행사를 검색하려면?

정답 예:

```http
GET /events?category=ai
```

---

# 74. 확인 문제: 입력 위치

다음 값은 어디에 넣는 것이 자연스러운가?

## Event ID

```text
Path Parameter
```

예:

```http
GET /events/123
```

---

## 검색 날짜

```text
Query Parameter
```

예:

```http
GET /events?date=2026-09-12
```

---

## 새 Event 제목

```text
Request Body
```

예:

```json
{
  "title": "AI Conference"
}
```

---

# 75. 실습 1: API 설계

다음 기능의 REST API를 설계한다.

## 전체 행사 조회

```http
GET /events
```

## 특정 행사 조회

```http
GET /events/:id
```

## 행사 추가

```http
POST /events
```

## 행사 제목 수정

```http
PATCH /events/:id
```

## 행사 삭제

```http
DELETE /events/:id
```

---

# 76. 실습 2: 검색 API 설계

다음 조건으로 검색한다.

```text
날짜:
2026-09-12

분야:
Game

지역:
Busan
```

예:

```http
GET /events?date=2026-09-12&category=game&region=busan
```

---

# 77. 실습 3: API 계약 작성

다음 API의 계약을 직접 작성해본다.

```http
GET /events/:id
```

예:

```text
Method
GET

Path
/events/:id

Path Parameter
id

Success Status
200

Not Found
404
```

Success Response:

```json
{
  "id": 123,
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

---

# 78. 실습 4: 잘못된 API 고치기

다음 API를 REST 스타일로 수정한다.

```http
GET /getEvent?id=123
```

수정:

```http
GET /events/123
```

---

다음 API:

```http
GET /deleteEvent?id=123
```

수정:

```http
DELETE /events/123
```

---

다음 API:

```http
POST /searchEvents
```

검색 조건:

```json
{
  "category": "ai"
}
```

간단한 검색이라면 다음처럼 표현할 수 있다.

```http
GET /events?category=ai
```

---

# 79. Project Arco 실전 문제

다음 사용자 요구를 API로 표현한다.

> 2026년 9월 12일에 서울에서 열리는 AI 또는 Game 분야의 오프라인 행사를 찾는다.

예:

```http
GET /events?date=2026-09-12&region=seoul&categories=ai,game&format=offline
```

이 Request를 분석하면:

```text
Method
GET

Resource
Event Collection

date
2026-09-12

region
seoul

categories
ai, game

format
offline
```

Backend에서는 이 조건들을 SQL Query로 변환한다.

---

# 80. Project Arco에서 API가 담당하는 경계

전체 시스템에서 REST API가 위치하는 곳은 다음과 같다.

```text
사용자
   ↓
Frontend
   ↓

-------------------------
REST API
-------------------------

   ↓
Express Backend
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

Frontend는 API 위쪽의 세계다.

Database는 API 아래쪽에 숨겨져 있다.

API는 두 영역을 연결한다.

---

# 81. 전체 흐름

사용자 검색:

```text
2026-09-12
AI
서울
```

Frontend:

```http
GET /events?date=2026-09-12&category=ai&region=seoul
```

Backend:

```text
req.query 읽기
   ↓
Validation
   ↓
SQL Query 작성
   ↓
PostgreSQL 조회
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

Frontend:

```text
JSON Parsing
   ↓
행사 목록 렌더링
```

이 흐름이 Project Arco의 핵심이다.

---

# 82. 핵심 요약

REST API에서는 Resource 중심으로 URL을 설계한다.

```text
/events
/tags
/locations
```

작업은 HTTP Method로 표현한다.

```text
GET
POST
PATCH
DELETE
```

따라서:

```http
GET /events
```

는 행사 목록 조회,

```http
POST /events
```

는 행사 생성,

```http
GET /events/123
```

은 특정 행사 조회,

```http
PATCH /events/123
```

은 특정 행사 수정,

```http
DELETE /events/123
```

은 특정 행사 삭제를 의미한다.

입력 값의 위치는 다음 기준으로 구분한다.

```text
특정 Resource 식별
→ Path Parameter

검색 / 필터 / 정렬
→ Query Parameter

생성 / 수정 데이터
→ Request Body
```

Response에는 적절한 HTTP Status Code를 사용한다.

```text
200
→ 조회 성공

201
→ 생성 성공

204
→ Body 없는 성공

400
→ 잘못된 입력

404
→ Resource 없음

409
→ 데이터 충돌

500
→ Server Error
```

가장 중요한 한 문장은 다음과 같다.

> REST API는 Resource를 URL로 표현하고, 그 Resource에 수행할 작업을 HTTP Method로 표현하며, Request와 Response의 형식을 일관된 계약으로 정의하는 방식이다.

---

# 83. 체크리스트

학습 후 다음 항목을 확인한다.

- [ ] API가 무엇인지 설명할 수 있다.
- [ ] API가 Frontend와 Backend 사이의 계약이라는 것을 이해한다.
- [ ] REST가 무엇인지 대략 설명할 수 있다.
- [ ] HTTP와 REST가 같은 개념이 아니라는 것을 안다.
- [ ] REST와 CRUD가 같은 개념이 아니라는 것을 안다.
- [ ] Resource가 무엇인지 설명할 수 있다.
- [ ] Endpoint가 무엇인지 설명할 수 있다.
- [ ] Collection과 Single Resource를 구분할 수 있다.
- [ ] URL에서는 Resource를 명사로 표현하는 이유를 안다.
- [ ] HTTP Method를 작업 의미에 맞게 사용할 수 있다.
- [ ] Path Parameter와 Query Parameter를 구분할 수 있다.
- [ ] Request Body가 언제 필요한지 설명할 수 있다.
- [ ] 적절한 Status Code를 선택할 수 있다.
- [ ] 검색 조건을 Query Parameter로 설계할 수 있다.
- [ ] API와 Database Schema가 반드시 1:1로 대응하지 않는다는 것을 이해한다.
- [ ] Project Arco의 기본 Event CRUD API를 직접 설계할 수 있다.
- [ ] Project Arco의 복합 행사 검색 API를 직접 설계할 수 있다.

---

# 84. Chapter 1 정리

지금까지 `ch1-web-backend-basics`에서는 다음 흐름을 학습했다.

```text
01. Web Backend Basics
        ↓
Client / Server
Frontend / Backend / Database

02. HTTP Request / Response
        ↓
Request
Response
Header
Body

03. URL / HTTP Method
        ↓
Path
Query Parameter
GET / POST / PATCH / DELETE

04. HTTP Status Code
        ↓
200
201
204
400
404
409
500

05. REST API Basics
        ↓
Resource
Endpoint
API Contract
REST API 설계
```

이제 다음과 같은 HTTP Request를 보면 의미를 해석할 수 있어야 한다.

```http
GET /events?date=2026-09-12&category=ai
```

그리고 다음 질문에 답할 수 있어야 한다.

```text
누가 요청하는가?
→ Client / Frontend

누가 처리하는가?
→ Backend

무엇을 대상으로 하는가?
→ /events

어떤 작업인가?
→ GET

검색 조건은 무엇인가?
→ date, category

성공하면?
→ 200

결과는?
→ JSON Response
```

---

# 85. 다음 Chapter

다음부터는 HTTP와 REST라는 개념을 실제 JavaScript Backend 코드로 구현하는 방법을 학습한다.

```text
ch1-web-backend-basics
        ↓
완료

ch2-node-express
        ↓
Node.js
Express
Router
Request / Response
Middleware
```

다음 핵심 질문은 다음과 같다.

> 지금까지 설계한 `GET /events` 같은 HTTP API를 실제 Node.js와 Express 코드에서는 어떻게 구현하는가?