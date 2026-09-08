# URL과 HTTP Method

## 1. 학습 목표

이 문서에서는 HTTP Request에서 URL과 Method가 어떤 역할을 하는지 학습한다.

Project Arco를 기준으로 다음 요청들을 보고 의미를 설명할 수 있는 것이 목표다.

```http
GET /events
GET /events/123
GET /events?category=ai
POST /events
PATCH /events/123
DELETE /events/123
```

학습 후 다음 질문에 답할 수 있어야 한다.

- URL은 어떤 구조로 이루어지는가?
- Path와 Query Parameter는 어떻게 다른가?
- Path Parameter는 언제 사용하는가?
- Query Parameter는 언제 사용하는가?
- GET, POST, PUT, PATCH, DELETE는 각각 어떤 의미인가?
- CRUD와 HTTP Method는 어떻게 연결되는가?
- Project Arco의 API URL을 보고 어떤 요청인지 설명할 수 있는가?

---

# 2. URL이란?

URL은

```text
Uniform Resource Locator
```

의 약자다.

웹에서 특정 Resource의 위치를 나타내는 주소다.

예를 들어 다음 URL이 있다고 하자.

```text
https://api.arco.example.com/events/123?category=ai
```

이 URL은 여러 부분으로 나뉜다.

```text
https://api.arco.example.com/events/123?category=ai
│       │                    │          │
scheme  host                 path       query
```

조금 더 세분화하면 다음과 같다.

```text
https://api.arco.example.com:443/events/123?category=ai
│       │                    │   │          │
scheme  host                 port path       query
```

---

# 3. URL의 주요 구성 요소

URL에서 우선 알아야 할 요소는 다음과 같다.

```text
Scheme
Host
Port
Path
Query
```

예:

```text
http://localhost:3000/events?category=ai
```

각 요소를 나누면:

```text
http
→ Scheme

localhost
→ Host

3000
→ Port

/events
→ Path

category=ai
→ Query
```

---

# 4. Scheme

Scheme은 어떤 프로토콜을 사용할지를 나타낸다.

대표적으로 다음 두 가지가 있다.

```text
http
https
```

예:

```text
http://localhost:3000
```

개발 환경에서는 자주 볼 수 있다.

운영 환경에서는 일반적으로 HTTPS를 사용한다.

```text
https://arco.example.com
```

---

# 5. Host

Host는 요청을 받을 Server의 주소다.

예:

```text
api.arco.example.com
```

또는 개발 환경에서:

```text
localhost
```

`localhost`는 현재 자신의 컴퓨터를 의미한다.

예:

```text
http://localhost:3000
```

즉 현재 컴퓨터의 3000번 Port에서 실행 중인 Server에 요청한다는 의미다.

---

# 6. Port

하나의 컴퓨터에서는 여러 Server 프로그램이 동시에 실행될 수 있다.

Port는 그중 어떤 프로그램과 통신할지를 구분하는 번호다.

예:

```text
http://localhost:3000
```

여기서:

```text
3000
```

이 Port 번호다.

Project Arco Backend가 3000번 Port에서 실행된다면:

```text
http://localhost:3000
```

으로 접근할 수 있다.

일반적으로 HTTP와 HTTPS에는 기본 Port가 있다.

```text
HTTP
→ 80

HTTPS
→ 443
```

기본 Port를 사용하는 경우 URL에서 생략할 수 있다.

---

# 7. Path

Path는 Server 내부에서 어떤 Resource를 요청하는지를 나타낸다.

예:

```text
/events
```

Project Arco에서는 행사 Resource를 의미하도록 설계할 수 있다.

```http
GET /events
```

의미:

> 행사 목록을 조회한다.

다음은:

```http
GET /events/123
```

의미:

> 123번 행사를 조회한다.

즉 Path는 Resource를 계층적으로 표현할 수 있다.

---

# 8. Resource란?

REST API에서는 데이터를 Resource 중심으로 생각한다.

Project Arco의 Resource 예:

```text
events
tags
categories
locations
organizers
```

이를 URL로 표현할 수 있다.

```text
/events
/tags
/categories
/locations
/organizers
```

중요한 점은 URL에 동사를 넣기보다 Resource를 명사로 표현하는 것이 일반적이라는 것이다.

좋은 예:

```text
/events
/events/123
```

피하는 것이 좋은 예:

```text
/getEvents
/createEvent
/deleteEvent
```

왜냐하면 작업의 종류는 HTTP Method가 이미 표현할 수 있기 때문이다.

---

# 9. Path Parameter

특정 Resource 하나를 식별하고 싶을 때 Path Parameter를 사용할 수 있다.

예:

```http
GET /events/123
```

여기서:

```text
123
```

은 특정 Event의 ID다.

Express에서는 보통 다음처럼 정의한다.

```ts
app.get("/events/:id", (req, res) => {
  // ...
});
```

여기서:

```text
:id
```

가 Path Parameter다.

실제 요청:

```http
GET /events/123
```

이면 Express에서는:

```ts
req.params.id
```

로 값을 읽을 수 있다.

개념적으로:

```text
/events/:id
         ↓
       변수
```

실제 요청:

```text
/events/123
         ↓
       id = 123
```

---

# 10. Path Parameter는 언제 쓰는가?

특정 Resource를 직접 식별할 때 사용한다.

예:

```http
GET /events/123
```

123번 행사 조회

```http
PATCH /events/123
```

123번 행사 수정

```http
DELETE /events/123
```

123번 행사 삭제

즉 다음 질문에 가깝다.

> 어떤 하나의 Resource를 대상으로 하는가?

---

# 11. Query Parameter

Query Parameter는 검색, 필터링, 정렬, Pagination 등 추가 조건을 전달할 때 주로 사용한다.

예:

```http
GET /events?category=ai
```

여기서:

```text
category=ai
```

가 Query Parameter다.

여러 개를 함께 사용할 수도 있다.

```http
GET /events?date=2026-09-12&category=ai
```

구조:

```text
?
→ Query 시작

date=2026-09-12
→ 첫 번째 Query Parameter

&
→ 여러 Parameter 구분

category=ai
→ 두 번째 Query Parameter
```

---

# 12. Express에서 Query Parameter 읽기

다음 요청이 있다고 하자.

```http
GET /events?category=ai
```

Express에서는:

```ts
req.query.category
```

로 읽을 수 있다.

다음 요청:

```http
GET /events?date=2026-09-12&category=ai
```

에서는:

```ts
req.query.date
req.query.category
```

를 사용할 수 있다.

---

# 13. Path Parameter와 Query Parameter 비교

가장 중요한 차이는 다음과 같다.

```text
Path Parameter
→ 어떤 Resource인가?

Query Parameter
→ 어떤 조건으로 찾을 것인가?
```

예:

```http
GET /events/123
```

의미:

> 123번 행사

반면:

```http
GET /events?category=ai
```

의미:

> AI 조건에 맞는 행사 목록

비교:

| 구분 | Path Parameter | Query Parameter |
|---|---|---|
| 목적 | Resource 식별 | 검색/필터 조건 |
| 예 | `/events/123` | `/events?category=ai` |
| Express | `req.params` | `req.query` |
| 일반적 대상 | 단일 Resource | Collection 검색 |

---

# 14. Collection과 Single Resource

REST API를 이해할 때 다음 두 개념을 구분하면 좋다.

## Collection

여러 Resource의 집합.

```text
/events
```

행사 전체 Collection을 의미한다.

예:

```http
GET /events
```

행사 목록 조회

---

## Single Resource

Collection 안의 특정 Resource 하나.

```text
/events/123
```

123번 행사를 의미한다.

예:

```http
GET /events/123
```

특정 행사 조회

구조:

```text
/events
   │
   ├── /1
   ├── /2
   ├── /3
   └── /123
```

---

# 15. HTTP Method란?

URL이

> 어떤 Resource를 대상으로 하는가

를 표현한다면,

HTTP Method는

> 그 Resource에 어떤 작업을 할 것인가

를 표현한다.

예:

```http
GET /events
```

여기서:

```text
/events
→ 행사 Resource

GET
→ 조회
```

즉 하나의 HTTP Request는 대략 다음 조합으로 생각할 수 있다.

```text
Method + URL
```

예:

```text
GET + /events
```

---

# 16. 주요 HTTP Method

백엔드 API를 개발할 때 우선 알아야 할 Method는 다음 다섯 개다.

```text
GET
POST
PUT
PATCH
DELETE
```

각각 일반적으로 다음 의미를 가진다.

| Method | 의미 |
|---|---|
| GET | 조회 |
| POST | 생성 |
| PUT | 전체 교체 또는 전체 수정 |
| PATCH | 일부 수정 |
| DELETE | 삭제 |

---

# 17. GET

GET은 Resource를 조회할 때 사용한다.

예:

```http
GET /events
```

행사 목록 조회

```http
GET /events/123
```

123번 행사 조회

```http
GET /events?category=ai
```

AI 행사 검색

일반적으로 GET Request에서는 Body를 사용하지 않는다.

검색 조건은 주로 Query Parameter를 이용한다.

---

# 18. POST

POST는 새로운 Resource를 생성할 때 자주 사용한다.

예:

```http
POST /events
```

Body:

```json
{
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

의미:

> 새로운 Event를 생성한다.

성공하면 보통:

```text
201 Created
```

를 반환한다.

---

# 19. PUT

PUT은 특정 Resource 전체를 새로운 표현으로 교체하는 의미로 주로 사용한다.

예:

```http
PUT /events/123
```

Body:

```json
{
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00",
  "endAt": "2026-09-12T12:00:00+09:00",
  "description": "AI seminar"
}
```

개념적으로:

```text
기존 Event 전체
      ↓
새 데이터로 교체
```

현재 Project Arco MVP에서는 PUT보다 PATCH를 더 많이 사용할 가능성이 높다.

---

# 20. PATCH

PATCH는 Resource의 일부만 수정할 때 사용한다.

예를 들어 행사 제목만 바꾸고 싶다고 하자.

```http
PATCH /events/123
```

Body:

```json
{
  "title": "Updated AI Seminar"
}
```

기존 Event가:

```json
{
  "id": 123,
  "title": "AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00",
  "location": "GIST"
}
```

라면 PATCH 이후에는 제목만 변경할 수 있다.

```json
{
  "id": 123,
  "title": "Updated AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00",
  "location": "GIST"
}
```

---

# 21. PUT과 PATCH 차이

둘은 자주 혼동한다.

간단히 기억하면:

```text
PUT
→ 전체 교체

PATCH
→ 일부 수정
```

예를 들어 기존 데이터가:

```json
{
  "title": "AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00",
  "location": "GIST"
}
```

라고 하자.

PATCH:

```json
{
  "title": "Updated Seminar"
}
```

의미:

> title만 변경

PUT은 일반적으로 Resource 전체 표현을 보내는 방식으로 생각한다.

```json
{
  "title": "Updated Seminar",
  "startAt": "2026-09-12T10:00:00+09:00",
  "location": "GIST"
}
```

---

# 22. DELETE

DELETE는 Resource를 삭제할 때 사용한다.

예:

```http
DELETE /events/123
```

의미:

> 123번 Event 삭제

성공 Response는 다음처럼 설계할 수 있다.

```text
204 No Content
```

이 경우 Response Body를 보내지 않는다.

또는:

```text
200 OK
```

와 함께 삭제 결과를 JSON으로 반환할 수도 있다.

---

# 23. CRUD란?

Database와 API를 학습할 때 자주 등장하는 개념이 CRUD다.

CRUD는 다음 네 가지 기본 작업을 의미한다.

```text
Create
Read
Update
Delete
```

HTTP Method와 연결하면 대략 다음과 같다.

| CRUD | HTTP Method |
|---|---|
| Create | POST |
| Read | GET |
| Update | PUT / PATCH |
| Delete | DELETE |

Project Arco에 적용하면:

```text
Create
→ 행사 등록

Read
→ 행사 조회

Update
→ 행사 수정

Delete
→ 행사 삭제
```

---

# 24. Project Arco CRUD 예시

## Create

```http
POST /events
```

새 Event 생성

---

## Read

```http
GET /events
```

행사 목록 조회

```http
GET /events/123
```

특정 행사 조회

---

## Update

```http
PATCH /events/123
```

특정 행사 일부 수정

---

## Delete

```http
DELETE /events/123
```

특정 행사 삭제

---

# 25. 같은 URL과 다른 Method

중요한 점은 같은 URL이라도 Method가 다르면 의미가 달라진다는 것이다.

예:

```text
/events
```

라는 URL이 있다고 하자.

GET:

```http
GET /events
```

의미:

> 행사 목록 조회

POST:

```http
POST /events
```

의미:

> 새로운 행사 생성

즉 URL만 보고 API의 의미를 완전히 알 수는 없다.

```text
Method + URL
```

을 함께 봐야 한다.

---

# 26. `/events/123`도 Method에 따라 달라진다

다음 세 요청을 비교해보자.

```http
GET /events/123
```

> 123번 행사 조회

```http
PATCH /events/123
```

> 123번 행사 수정

```http
DELETE /events/123
```

> 123번 행사 삭제

Resource는 동일하다.

```text
/events/123
```

하지만 작업이 다르다.

```text
GET
PATCH
DELETE
```

따라서 HTTP API에서는 다음 두 요소가 중요하다.

```text
무엇을?
→ URL

무엇을 할까?
→ Method
```

---

# 27. URL에는 동사를 넣지 않는 이유

다음 API를 생각해보자.

```text
/getEvents
/createEvent
/updateEvent
/deleteEvent
```

동작 자체는 이해할 수 있다.

하지만 REST 스타일에서는 보통 다음처럼 설계한다.

```http
GET /events
POST /events
PATCH /events/123
DELETE /events/123
```

이유는 Method가 이미 작업을 표현하기 때문이다.

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

따라서 URL에서는 Resource 자체를 표현하는 것이 더 일관적이다.

```text
/events
```

---

# 28. URL 이름은 보통 명사를 사용한다

REST API Path에서는 일반적으로 명사를 사용한다.

추천:

```text
/events
/tags
/categories
/locations
```

피하는 것이 좋은 형태:

```text
/getEvents
/searchEventsNow
/createNewEvent
```

또한 Collection Resource는 보통 복수형을 사용하면 일관성이 좋다.

```text
/events
/tags
/locations
```

프로젝트 전체에서 규칙을 일관되게 유지하는 것이 중요하다.

---

# 29. 검색 API 설계

Project Arco에서는 검색 기능이 핵심이다.

다음 조건을 생각해보자.

```text
날짜:
2026-09-12

카테고리:
AI

지역:
서울
```

이런 조건은 Query Parameter로 표현할 수 있다.

```http
GET /events?date=2026-09-12&category=ai&region=seoul
```

이 구조가 좋은 이유는 Resource 자체는 여전히 행사 Collection이기 때문이다.

```text
/events
```

그리고 추가 조건만 Query로 붙인다.

```text
?date=...
&category=...
&region=...
```

---

# 30. 여러 값 검색

사용자가 AI 또는 Game 분야를 찾고 싶다고 하자.

API 설계 방식은 여러 가지가 있다.

예를 들어 반복 Query Parameter:

```http
GET /events?category=ai&category=game
```

또는 쉼표 구분:

```http
GET /events?categories=ai,game
```

혹은 별도의 규칙을 정의할 수도 있다.

중요한 것은

> 한 가지 방식을 정하고 API 전체에서 일관되게 사용하는 것

이다.

Project Arco에서는 이후 실제 API 설계 단계에서 형식을 결정하면 된다.

---

# 31. 정렬도 Query Parameter로 표현할 수 있다

예:

```http
GET /events?sort=startAt
```

의미:

> 시작 시간 기준으로 정렬

내림차순까지 표현하고 싶다면:

```http
GET /events?sort=startAt&order=desc
```

같은 방식도 가능하다.

---

# 32. Pagination도 Query Parameter로 표현할 수 있다

행사가 많아지면 모든 데이터를 한 번에 반환하지 않을 수 있다.

예:

```http
GET /events?page=1&limit=20
```

의미:

```text
page=1
→ 첫 번째 페이지

limit=20
→ 최대 20개
```

이후 Pagination 학습에서 더 자세히 다룬다.

---

# 33. Path 계층 구조

Resource 간 관계를 Path로 표현할 수도 있다.

예를 들어 특정 Event의 Tag를 조회한다고 하자.

```http
GET /events/123/tags
```

구조:

```text
events
  ↓
123
  ↓
tags
```

의미:

> 123번 Event에 연결된 Tag 목록

하지만 모든 관계를 무조건 중첩 Path로 표현해야 하는 것은 아니다.

API가 지나치게 복잡해질 수 있기 때문이다.

현재 Project Arco MVP에서는 단순한 구조를 우선한다.

---

# 34. Path Parameter가 여러 개인 경우

다음과 같은 구조도 가능하다.

```http
GET /events/123/tags/5
```

여기에는 두 개의 식별자가 있다.

```text
123
→ event id

5
→ tag id
```

Express에서는 다음처럼 정의할 수 있다.

```ts
app.get("/events/:eventId/tags/:tagId", (req, res) => {
  const eventId = req.params.eventId;
  const tagId = req.params.tagId;
});
```

현재 Project Arco 초반에는 이런 복잡한 Route를 많이 만들 필요는 없다.

---

# 35. URL Encoding

URL에는 모든 문자를 그대로 넣을 수 있는 것은 아니다.

특수 문자나 한글 등이 Encoding되어 표현될 수 있다.

예를 들어:

```text
서울
```

이 URL에서는 `%`가 포함된 형태로 변환될 수 있다.

브라우저와 HTTP Client가 대부분 자동으로 처리한다.

현재 단계에서는 Encoding 규칙을 외울 필요는 없다.

다만:

> URL로 전달되는 값은 Encoding될 수 있다.

정도만 알아두면 된다.

---

# 36. HTTP Method와 안전성

HTTP Method에는 의미적인 특성이 있다.

GET은 일반적으로 데이터를 조회하기 위한 요청이다.

즉 GET 요청을 보냈다고 데이터가 삭제되거나 변경되는 API를 만드는 것은 좋지 않다.

나쁜 예:

```http
GET /deleteEvent?id=123
```

이 요청이 Event를 삭제한다면 GET의 의미와 맞지 않는다.

권장:

```http
DELETE /events/123
```

HTTP Method의 의미에 맞게 API를 설계하는 것이 중요하다.

---

# 37. Safe Method

HTTP에서 GET 같은 일부 Method는 Safe Method라고 부른다.

Safe라는 말은 보안상 안전하다는 뜻이 아니다.

의미는:

> 요청이 Server Resource의 상태를 변경하는 것을 목적으로 하지 않는다.

대표적으로:

```text
GET
HEAD
OPTIONS
```

등이 있다.

Project Arco에서 우선 기억할 것은:

```text
GET
→ 조회용
```

정도면 충분하다.

---

# 38. Idempotent란?

HTTP Method를 공부하다 보면 `idempotent`라는 용어가 나온다.

한국어로는 멱등성이라고 한다.

뜻은:

> 같은 요청을 여러 번 수행해도 결과 상태가 한 번 수행한 것과 동일한 성질

예를 들어:

```http
DELETE /events/123
```

를 한 번 요청하면 Event가 삭제된다.

같은 DELETE를 다시 보내더라도 Event가 추가로 더 삭제되는 것은 아니다.

최종 상태는 여전히:

```text
123번 Event가 없음
```

이다.

반면 POST로 Resource를 생성하는 요청을 반복하면 새로운 Resource가 여러 개 만들어질 수 있다.

현재 단계에서 깊이 파고들 필요는 없지만 다음 정도는 알아두면 좋다.

```text
GET
→ 일반적으로 idempotent

PUT
→ 일반적으로 idempotent

DELETE
→ 일반적으로 idempotent

POST
→ 일반적으로 idempotent가 아님
```

---

# 39. Project Arco API 예제 분석

다음 요청을 분석해보자.

```http
GET /events/123
```

```text
Method
GET

Resource
events

Path Parameter
123

의미
123번 행사 조회
```

---

다음 요청:

```http
GET /events?date=2026-09-12&category=game
```

```text
Method
GET

Resource
events

Query Parameter
date=2026-09-12
category=game

의미
2026년 9월 12일 Game 행사 검색
```

---

다음 요청:

```http
POST /events
```

```text
Method
POST

Resource
events

의미
새 행사 생성
```

---

다음 요청:

```http
PATCH /events/123
```

```text
Method
PATCH

Resource
123번 Event

의미
123번 행사 일부 수정
```

---

다음 요청:

```http
DELETE /events/123
```

```text
Method
DELETE

Resource
123번 Event

의미
123번 행사 삭제
```

---

# 40. Express Route와 연결하기

HTTP 요청은 Express Route와 연결된다.

예:

```ts
app.get("/events", (req, res) => {
  res.json([]);
});
```

이 코드는 다음 요청을 처리한다.

```http
GET /events
```

---

특정 Event:

```ts
app.get("/events/:id", (req, res) => {
  const id = req.params.id;

  res.json({
    id,
  });
});
```

처리 요청:

```http
GET /events/123
```

---

행사 생성:

```ts
app.post("/events", (req, res) => {
  res.status(201).json(req.body);
});
```

처리 요청:

```http
POST /events
```

---

# 41. Method마다 Express 함수도 달라진다

Express에서는 HTTP Method에 맞는 함수를 사용한다.

```text
GET
→ app.get()

POST
→ app.post()

PUT
→ app.put()

PATCH
→ app.patch()

DELETE
→ app.delete()
```

예:

```ts
app.get("/events", ...);

app.post("/events", ...);

app.patch("/events/:id", ...);

app.delete("/events/:id", ...);
```

같은 `/events`라도 Method에 따라 다른 Handler가 실행될 수 있다.

---

# 42. Project Arco 최소 API 설계

Project Arco MVP에서 가장 기본적인 Event API를 구성한다면 다음 정도부터 시작할 수 있다.

```text
GET    /events
GET    /events/:id
POST   /events
PATCH  /events/:id
DELETE /events/:id
```

각 의미:

```text
GET /events
→ 행사 목록 및 검색

GET /events/:id
→ 행사 상세 조회

POST /events
→ 행사 생성

PATCH /events/:id
→ 행사 수정

DELETE /events/:id
→ 행사 삭제
```

검색은 Query Parameter를 붙인다.

```http
GET /events?date=2026-09-12
```

```http
GET /events?category=ai
```

```http
GET /events?date=2026-09-12&category=ai
```

---

# 43. API 설계에서 피해야 할 예

다음처럼 모든 기능마다 새로운 동사 Path를 만드는 방식은 피하는 편이 좋다.

```text
/getAllEvents
/getEvent
/createEvent
/updateEvent
/deleteEvent
/searchEvents
```

대신 Resource와 Method를 조합한다.

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

를 사용한다.

이렇게 하면 API 구조가 훨씬 일관적이다.

---

# 44. Path Parameter와 Query Parameter 선택 기준

API를 설계하면서 헷갈리면 다음 질문을 사용하면 된다.

## 질문 1

> 특정 Resource 하나를 식별하는 값인가?

그렇다면 Path Parameter를 우선 고려한다.

예:

```text
event id = 123
```

```http
GET /events/123
```

---

## 질문 2

> 검색 결과를 좁히기 위한 조건인가?

그렇다면 Query Parameter를 우선 고려한다.

예:

```text
category = AI
```

```http
GET /events?category=ai
```

---

## 질문 3

> 새로 만들거나 수정할 실제 데이터인가?

그렇다면 Request Body를 고려한다.

예:

```http
POST /events
```

```json
{
  "title": "AI Seminar"
}
```

따라서:

```text
Resource 식별
→ Path Parameter

검색 조건
→ Query Parameter

생성/수정 데이터
→ Request Body
```

---

# 45. Project Arco 복합 검색 예제

사용자의 요청:

```text
2026년 9월 12일
서울
AI 또는 Game
오프라인 행사
```

API는 예를 들어 다음처럼 설계할 수 있다.

```http
GET /events?date=2026-09-12&region=seoul&categories=ai,game&format=offline
```

이를 분석하면:

```text
GET
→ 조회

/events
→ Event Collection

date
→ 날짜 필터

region
→ 지역 필터

categories
→ 관심 분야 필터

format
→ 참여 방식 필터
```

이 Query Parameter를 Express에서 받아 SQL 조건으로 바꾸게 된다.

```text
HTTP Query Parameter
        ↓
Express
        ↓
SQL WHERE 조건
        ↓
PostgreSQL
```

---

# 46. URL에서 DB 구조가 그대로 드러날 필요는 없다

API URL과 Database Schema는 서로 다른 개념이다.

DB에 다음 Table이 있다고 하자.

```text
events
event_tags
tags
locations
event_categories
categories
```

Frontend가 Event를 검색할 때 꼭 다음처럼 요청할 필요는 없다.

```text
/events/event_tags/tags/...
```

Backend가 내부적으로 JOIN을 처리하고 단순한 API를 제공하면 된다.

예:

```http
GET /events?tag=ai
```

Backend 내부:

```text
/events?tag=ai
      ↓
Express
      ↓
events
JOIN event_tags
JOIN tags
      ↓
Result
```

즉:

> API 구조와 DB 구조는 반드시 1:1로 일치할 필요가 없다.

이 점은 이후 Backend Architecture를 이해할 때 중요하다.

---

# 47. URL 설계는 API 계약의 일부다

Frontend와 Backend가 다음 API를 사용하기로 했다고 하자.

```http
GET /events/:id
```

이것은 하나의 계약이다.

Frontend는:

```text
특정 Event는 /events/{id}로 요청한다.
```

고 알고 있다.

Backend는:

```text
GET /events/:id 요청을 처리한다.
```

고 구현한다.

만약 Backend가 갑자기:

```text
/getEvent?id=123
```

으로 변경하면 Frontend 코드도 수정해야 한다.

따라서 API URL 설계 역시 프로젝트의 중요한 인터페이스다.

---

# 48. 핵심 비교

HTTP API를 볼 때 다음 네 요소를 구분해야 한다.

```text
Method
Path
Query
Body
```

예:

```http
PATCH /events/123?notify=true
Content-Type: application/json
```

Body:

```json
{
  "title": "Updated Seminar"
}
```

분석:

```text
Method
PATCH

Path
/events/123

Path Parameter
123

Query Parameter
notify=true

Body
{
  "title": "Updated Seminar"
}
```

---

# 49. 확인 문제

## 문제 1

다음 URL에서 Path는 무엇인가?

```text
https://api.arco.example.com/events/123?category=ai
```

정답:

```text
/events/123
```

---

## 문제 2

다음 요청의 Path Parameter는 무엇인가?

```http
GET /events/42
```

정답:

```text
42
```

---

## 문제 3

다음 요청의 Query Parameter를 모두 찾는다.

```http
GET /events?date=2026-09-12&category=ai
```

정답:

```text
date = 2026-09-12
category = ai
```

---

## 문제 4

특정 Event를 삭제할 때 가장 자연스러운 요청은?

```text
A. GET /deleteEvent/123
B. POST /deleteEvent
C. DELETE /events/123
D. GET /events?delete=123
```

정답:

```text
C. DELETE /events/123
```

---

## 문제 5

새 Event를 만드는 데 가장 적절한 Method는?

```text
A. GET
B. POST
C. DELETE
D. PATCH
```

정답:

```text
B. POST
```

---

## 문제 6

기존 Event의 제목만 수정하려고 한다.

가장 적절한 Method는?

```text
PATCH
```

---

## 문제 7

다음 두 요청의 차이를 설명한다.

```http
GET /events/123
```

```http
GET /events?category=ai
```

정답:

```text
/events/123
→ 특정 Event 하나를 식별하여 조회

/events?category=ai
→ Event Collection에서 AI 조건으로 검색
```

---

# 50. 실습 1: URL 분석

다음 URL을 분석한다.

```text
http://localhost:3000/events/123?category=ai
```

다음을 채워본다.

```text
Scheme:
Host:
Port:
Path:
Query Parameter:
```

정답:

```text
Scheme:
http

Host:
localhost

Port:
3000

Path:
/events/123

Query Parameter:
category=ai
```

---

# 51. 실습 2: API 설계

다음 기능에 적절한 Method와 URL을 작성한다.

## 행사 목록 조회

```text
GET /events
```

## 123번 행사 조회

```text
GET /events/123
```

## 새로운 행사 생성

```text
POST /events
```

## 123번 행사 제목 수정

```text
PATCH /events/123
```

## 123번 행사 삭제

```text
DELETE /events/123
```

---

# 52. 실습 3: 검색 API 설계

다음 조건으로 행사를 검색한다고 하자.

```text
날짜:
2026-09-12

카테고리:
AI

지역:
서울
```

예시 API:

```http
GET /events?date=2026-09-12&category=ai&region=seoul
```

각 요소의 역할을 설명한다.

```text
GET
→ 조회

/events
→ 행사 Collection

date
→ 날짜 조건

category
→ 관심 분야 조건

region
→ 지역 조건
```

---

# 53. 실습 4: req.params와 req.query 연결하기

Express Route:

```ts
app.get("/events/:id", (req, res) => {
  console.log(req.params.id);
});
```

Request:

```http
GET /events/123
```

출력:

```text
123
```

---

다음 코드:

```ts
app.get("/events", (req, res) => {
  console.log(req.query.category);
});
```

Request:

```http
GET /events?category=ai
```

출력:

```text
ai
```

따라서 다시 정리하면:

```text
/events/:id
→ req.params

/events?category=ai
→ req.query
```

---

# 54. Project Arco 기준으로 기억할 API 패턴

Project Arco에서는 우선 다음 패턴을 기억하면 된다.

```text
Collection 조회
GET /events

Single Resource 조회
GET /events/:id

검색
GET /events?...

생성
POST /events

부분 수정
PATCH /events/:id

삭제
DELETE /events/:id
```

이 패턴만 이해해도 초기 API 대부분을 읽고 설계할 수 있다.

---

# 55. 핵심 요약

URL은 어떤 Resource를 대상으로 하는지 나타낸다.

```text
/events
/events/123
```

HTTP Method는 그 Resource에 어떤 작업을 수행할지 나타낸다.

```text
GET
POST
PUT
PATCH
DELETE
```

따라서 API는 다음 조합으로 이해한다.

```text
Method + URL
```

예:

```http
GET /events
```

> Event Collection 조회

```http
POST /events
```

> Event 생성

```http
GET /events/123
```

> 123번 Event 조회

```http
PATCH /events/123
```

> 123번 Event 일부 수정

```http
DELETE /events/123
```

> 123번 Event 삭제

그리고 입력 값의 위치는 다음 기준으로 구분한다.

```text
특정 Resource 식별
→ Path Parameter

검색 / 필터링 / 정렬
→ Query Parameter

생성 / 수정할 데이터
→ Request Body
```

Project Arco에서 특히 많이 사용할 요청은 다음 형태다.

```http
GET /events?date=2026-09-12&category=ai
```

이 요청은

> Event Collection에서 2026년 9월 12일이며 AI 조건을 만족하는 데이터를 조회한다.

라는 의미다.

---

# 56. 체크리스트

학습 후 다음 항목을 확인한다.

- [ ] URL이 무엇인지 설명할 수 있다.
- [ ] Scheme, Host, Port, Path를 구분할 수 있다.
- [ ] Path Parameter가 무엇인지 설명할 수 있다.
- [ ] Query Parameter가 무엇인지 설명할 수 있다.
- [ ] Path Parameter와 Query Parameter의 차이를 설명할 수 있다.
- [ ] GET의 역할을 설명할 수 있다.
- [ ] POST의 역할을 설명할 수 있다.
- [ ] PUT과 PATCH의 차이를 대략 설명할 수 있다.
- [ ] DELETE의 역할을 설명할 수 있다.
- [ ] CRUD와 HTTP Method를 연결할 수 있다.
- [ ] `Method + URL`을 함께 보고 API의 의미를 해석할 수 있다.
- [ ] `/events/:id`와 `/events?...`의 차이를 안다.
- [ ] Express의 `req.params`와 `req.query`가 각각 어디에서 오는지 설명할 수 있다.
- [ ] Project Arco의 기본 Event API를 직접 설계할 수 있다.

---

# 57. 다음 학습

다음 문서에서는 HTTP Response에서 사용되는 Status Code를 더 자세히 학습한다.

```text
현재
03-url-http-method.md

        ↓

다음
04-http-status-code.md
```

다음 핵심 질문은 다음과 같다.

> 같은 `/events` API라도 성공, 잘못된 입력, 존재하지 않는 행사, 서버 오류를 Client에게 어떻게 구분해서 알려줄 수 있는가?