# HTTP Status Code

## 1. 학습 목표

이 문서에서는 HTTP Response의 Status Code가 어떤 역할을 하는지 학습한다.

Project Arco를 기준으로 다음 상황을 적절한 Status Code로 구분할 수 있는 것이 목표다.

```text
행사 조회 성공
행사 생성 성공
잘못된 요청
존재하지 않는 행사 조회
중복 데이터 충돌
서버 내부 오류
```

학습 후 다음 질문에 답할 수 있어야 한다.

- HTTP Status Code는 왜 필요한가?
- 2xx, 4xx, 5xx는 각각 무엇을 의미하는가?
- `200`, `201`, `204`의 차이는 무엇인가?
- `400`과 `404`는 어떻게 다른가?
- `409`는 언제 사용하는가?
- `500`은 어떤 상황을 의미하는가?
- Express에서 Status Code를 어떻게 반환하는가?
- Project Arco API에서 어떤 Status Code를 사용할지 판단할 수 있는가?

---

# 2. HTTP Status Code란?

HTTP Status Code는 Server가 Request를 처리한 결과를 Client에게 알려주는 숫자 코드다.

예:

```text
200 OK
```

의미:

> 요청을 정상적으로 처리했다.

다른 예:

```text
404 Not Found
```

의미:

> 요청한 Resource를 찾지 못했다.

즉 HTTP Response에서는 데이터만 반환하는 것이 아니라,

```text
이 요청이 어떻게 처리되었는가?
```

도 함께 전달한다.

---

# 3. Status Code가 필요한 이유

다음 Response를 생각해보자.

```json
{
  "message": "Event not found"
}
```

사람이 보면 행사 데이터가 없다는 것을 이해할 수 있다.

하지만 프로그램 입장에서는 Response Body의 문자열을 직접 해석해야 한다.

예:

```ts
if (response.message === "Event not found") {
  // ...
}
```

이런 방식은 좋지 않다.

대신 HTTP Status Code를 사용한다.

```text
404 Not Found
```

그리고 Body에는 추가 설명을 넣는다.

```json
{
  "message": "Event not found"
}
```

Frontend에서는 다음처럼 처리할 수 있다.

```ts
if (response.status === 404) {
  // 행사를 찾지 못한 경우
}
```

즉 Status Code는

> 요청 처리 결과를 프로그램이 표준화된 방식으로 판단할 수 있도록 해준다.

---

# 4. HTTP Response에서 Status Code의 위치

HTTP Response는 대략 다음 구조를 가진다.

```text
Status Code
Header
Body
```

예:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "title": "GIST AI Seminar"
}
```

여기서:

```text
200
```

이 Status Code다.

```text
OK
```

는 사람이 읽기 쉬운 Reason Phrase다.

---

# 5. Status Code의 범위

HTTP Status Code는 첫 번째 숫자에 따라 크게 분류된다.

```text
1xx
2xx
3xx
4xx
5xx
```

각 범위는 다음 의미를 가진다.

| 범위 | 의미 |
|---|---|
| 1xx | Informational |
| 2xx | Success |
| 3xx | Redirection |
| 4xx | Client Error |
| 5xx | Server Error |

Project Arco 초반에는 주로 다음 세 범위를 사용한다.

```text
2xx
4xx
5xx
```

---

# 6. 2xx: 성공

`2xx`는 Request가 정상적으로 처리되었다는 의미다.

대표적으로 다음 세 개를 우선 알아두면 된다.

```text
200 OK
201 Created
204 No Content
```

---

# 7. 200 OK

가장 일반적인 성공 응답이다.

의미:

> 요청이 정상적으로 처리되었다.

예:

```http
GET /events
```

성공 Response:

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

또는:

```http
GET /events/123
```

Response:

```text
200 OK
```

```json
{
  "id": 123,
  "title": "GIST AI Seminar"
}
```

Project Arco에서는 조회 API에서 매우 자주 사용하게 된다.

---

# 8. 검색 결과가 0개라면 404일까?

다음 요청을 생각해보자.

```http
GET /events?category=quantum-banana
```

조건에 해당하는 행사가 하나도 없다고 하자.

이 경우 일반적으로:

```text
200 OK
```

를 반환하는 것이 자연스럽다.

Body:

```json
[]
```

왜냐하면 `/events`라는 Resource 자체를 찾지 못한 것이 아니라,

> 검색은 정상적으로 수행되었고 결과가 0개였다.

는 의미이기 때문이다.

즉 다음 둘을 구분해야 한다.

```text
GET /events?category=...
→ 검색 결과 0개
→ 200 + []
```

```text
GET /events/99999
→ 99999번 Event 자체가 없음
→ 404
```

이 구분은 중요하다.

---

# 9. 201 Created

새로운 Resource가 성공적으로 생성되었을 때 사용한다.

예:

```http
POST /events
```

Body:

```json
{
  "title": "GIST AI Seminar"
}
```

새 Event 생성 성공:

```text
201 Created
```

Response Body:

```json
{
  "id": 123,
  "title": "GIST AI Seminar"
}
```

`200`을 사용해도 통신 자체는 가능하지만,

새 Resource가 생성되었다는 의미를 정확히 표현하려면 `201`이 더 적절하다.

---

# 10. 200과 201 차이

간단히 구분하면:

```text
200
→ 요청 성공

201
→ 요청 성공 + 새로운 Resource 생성
```

예:

```http
GET /events
```

```text
200 OK
```

반면:

```http
POST /events
```

새 Event 생성 성공:

```text
201 Created
```

---

# 11. 204 No Content

요청은 성공했지만 Response Body를 보낼 필요가 없을 때 사용할 수 있다.

대표적인 예는 삭제다.

```http
DELETE /events/123
```

삭제 성공:

```text
204 No Content
```

이 경우 Response Body는 없다.

```text
Status
204

Body
없음
```

---

# 12. 200과 204 차이

삭제 성공 후 결과 데이터를 보내고 싶다면:

```text
200 OK
```

```json
{
  "message": "Event deleted"
}
```

처럼 할 수 있다.

반면 별도 데이터가 필요 없다면:

```text
204 No Content
```

를 사용할 수 있다.

둘 중 하나를 선택할 수 있지만 프로젝트 전체에서 일관된 규칙을 유지하는 것이 좋다.

Project Arco MVP에서는 예를 들어 다음처럼 정할 수 있다.

```text
DELETE 성공
→ 204 No Content
```

---

# 13. 4xx: Client Error

`4xx`는 Client가 보낸 Request에 문제가 있다는 의미다.

대표적으로:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
```

등이 있다.

Project Arco에서는 우선 다음 세 개를 중요하게 보면 된다.

```text
400
404
409
```

---

# 14. 400 Bad Request

Request 자체가 잘못되었을 때 사용한다.

예를 들어 날짜 형식이 잘못되었다고 하자.

```http
GET /events?date=banana
```

Backend가 날짜를 parsing할 수 없다.

Response:

```text
400 Bad Request
```

```json
{
  "message": "Invalid date format"
}
```

또 다른 예:

```http
POST /events
```

Body:

```json
{
  "title": ""
}
```

`title`이 필수인데 빈 문자열이라면:

```text
400 Bad Request
```

를 반환할 수 있다.

---

# 15. 400을 사용하는 상황

Project Arco에서는 다음 경우에 사용할 수 있다.

```text
필수 필드 누락
잘못된 날짜 형식
허용되지 않은 값
잘못된 Query Parameter
잘못된 JSON 데이터
Validation 실패
```

예:

```http
GET /events?limit=-100
```

`limit`이 양수만 허용된다면:

```text
400 Bad Request
```

---

# 16. 404 Not Found

요청한 Resource가 존재하지 않을 때 사용한다.

예:

```http
GET /events/123456
```

123456번 Event가 DB에 없다.

Response:

```text
404 Not Found
```

```json
{
  "message": "Event not found"
}
```

---

# 17. 400과 404 차이

둘은 자주 혼동한다.

다음 기준으로 보면 쉽다.

```text
400
→ 요청 형식이나 값 자체가 잘못됨

404
→ 요청 형식은 정상인데 대상 Resource가 없음
```

예:

```http
GET /events/abc
```

Event ID가 숫자만 가능하고 `abc`가 잘못된 값이라면:

```text
400 Bad Request
```

반면:

```http
GET /events/123
```

`123`은 정상적인 ID 형식이지만 실제 Event가 없다면:

```text
404 Not Found
```

---

# 18. 409 Conflict

Request 자체는 이해할 수 있지만 현재 Server의 데이터 상태와 충돌할 때 사용할 수 있다.

Project Arco에서는 중복 행사 등록 같은 상황을 생각할 수 있다.

예:

```http
POST /events
```

새 행사를 등록하려는데 동일한 행사가 이미 존재한다.

Response:

```text
409 Conflict
```

```json
{
  "message": "Event already exists"
}
```

---

# 19. Project Arco에서 409가 중요한 이유

행사 데이터는 여러 출처에 동시에 올라올 수 있다.

예:

```text
공식 사이트
온오프믹스
이벤터스
SNS
```

같은 행사를 중복으로 등록하려고 할 수 있다.

예를 들어 DB에 이미 다음 Event가 있다고 하자.

```text
title:
GIST AI Seminar

start_at:
2026-09-12 10:00

organizer:
GIST
```

같은 Event를 다시 생성하려 한다면 Backend가 중복으로 판단할 수 있다.

```text
POST /events
       ↓
Deduplication Check
       ↓
이미 존재
       ↓
409 Conflict
```

다만 실제 중복 제거 정책은 이후 별도로 설계한다.

---

# 20. 401 Unauthorized

인증이 필요한 요청인데 사용자가 인증되지 않았을 때 사용한다.

예:

```http
POST /admin/events
```

관리자만 접근 가능한 API라고 하자.

로그인 정보가 없다면:

```text
401 Unauthorized
```

현재 Project Arco MVP에서 인증 기능을 구현하지 않는다면 당장은 자주 사용하지 않을 수 있다.

---

# 21. 403 Forbidden

사용자가 누구인지는 확인되었지만 해당 작업을 수행할 권한이 없을 때 사용한다.

예:

```text
사용자 인증 완료
        ↓
관리자 권한 없음
        ↓
관리자 API 접근
        ↓
403 Forbidden
```

401과 비교하면:

```text
401
→ 누구인지 확인되지 않음

403
→ 누구인지는 알지만 권한이 없음
```

---

# 22. 5xx: Server Error

`5xx`는 Server 내부에서 문제가 발생했다는 의미다.

Client의 Request가 반드시 잘못된 것은 아니다.

대표적으로:

```text
500 Internal Server Error
```

가 있다.

---

# 23. 500 Internal Server Error

Server 내부에서 예상하지 못한 문제가 발생했을 때 사용한다.

예:

```http
GET /events
```

Request 자체는 정상이다.

하지만 PostgreSQL 연결이 실패했다.

```text
GET /events
    ↓
Express
    ↓
PostgreSQL
    ↓
Connection Error
```

이 경우:

```text
500 Internal Server Error
```

를 반환할 수 있다.

---

# 24. 400과 500의 중요한 차이

다음처럼 기억하면 된다.

```text
400
→ Client가 고쳐야 함

500
→ Server가 고쳐야 함
```

예:

```text
잘못된 날짜
→ 400

필수 값 누락
→ 400

DB 연결 실패
→ 500

서버 코드에서 예상치 못한 Exception
→ 500
```

---

# 25. Client Error와 Server Error 구분

예를 들어:

```http
GET /events?date=hello
```

Backend가:

```text
"날짜 형식이 잘못되었습니다."
```

라고 판단할 수 있다.

이것은 Client가 잘못된 값을 보낸 것이다.

```text
400 Bad Request
```

반면:

```http
GET /events?date=2026-09-12
```

Request는 완전히 정상인데 DB가 다운되어 있다면:

```text
500 Internal Server Error
```

이다.

---

# 26. Status Code만으로 충분한가?

Status Code는 결과 종류를 알려주지만 세부 내용까지 모두 표현하지는 못한다.

예:

```text
400 Bad Request
```

만 보면 무엇이 잘못되었는지 정확히 알 수 없다.

따라서 Response Body에 추가 정보를 넣는 것이 좋다.

예:

```json
{
  "message": "Invalid date format"
}
```

또는:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "reason": "required"
    }
  ]
}
```

즉 일반적인 Error Response는 다음 두 부분을 가진다.

```text
Status Code
+
Error Body
```

---

# 27. Error Response 설계

Project Arco에서는 초기에 다음 정도로 단순하게 시작할 수 있다.

```json
{
  "message": "Event not found"
}
```

Validation Error:

```json
{
  "message": "Invalid request"
}
```

조금 더 확장한다면:

```json
{
  "code": "INVALID_DATE",
  "message": "date must be YYYY-MM-DD"
}
```

처럼 Application 자체의 Error Code를 추가할 수도 있다.

HTTP Status Code와 Application Error Code는 서로 다른 개념이다.

```text
HTTP Status Code
→ HTTP 수준 결과

Application Error Code
→ Project Arco 내부에서 정의한 세부 오류 종류
```

---

# 28. Express에서 Status Code 반환하기

Express에서는 `res.status()`를 사용한다.

예:

```ts
app.get("/events", (req, res) => {
  res.status(200).json([]);
});
```

하지만 `res.json()`만 사용해도 기본적으로 `200`이 반환된다.

```ts
app.get("/events", (req, res) => {
  res.json([]);
});
```

즉 두 코드는 성공 조회에서는 비슷하게 동작한다.

---

# 29. 201 반환하기

행사 생성:

```ts
app.post("/events", (req, res) => {
  const event = {
    id: 123,
    ...req.body,
  };

  res.status(201).json(event);
});
```

Response:

```text
201 Created
```

---

# 30. 404 반환하기

특정 Event를 찾지 못했다고 하자.

```ts
app.get("/events/:id", (req, res) => {
  const event = undefined;

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  res.json(event);
});
```

중요한 부분:

```ts
return res.status(404).json(...)
```

Response를 보낸 뒤 Handler가 계속 실행되지 않도록 `return`을 함께 사용하는 경우가 많다.

---

# 31. 400 반환하기

날짜 Query Parameter를 검사한다고 하자.

```ts
app.get("/events", (req, res) => {
  const date = req.query.date;

  if (typeof date !== "string") {
    return res.status(400).json({
      message: "Invalid date",
    });
  }

  res.json([]);
});
```

실제 프로젝트에서는 Validation 코드를 별도로 분리할 수 있다.

현재는 HTTP Status Code와 연결되는 흐름만 이해하면 된다.

---

# 32. 204 반환하기

삭제 성공:

```ts
app.delete("/events/:id", (req, res) => {
  // delete event

  res.status(204).send();
});
```

`204 No Content`에서는 Body를 보내지 않는다.

따라서 다음처럼 JSON Body를 같이 보내는 것은 피하는 것이 좋다.

```ts
res.status(204).json({
  message: "Deleted",
});
```

`204`의 의미 자체가 Response Body가 없다는 것이기 때문이다.

---

# 33. 500 반환하기

예:

```ts
app.get("/events", async (req, res) => {
  try {
    // database query

    res.json([]);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
```

Server 내부 오류가 발생하면 `500`을 반환한다.

실제 프로젝트에서는 공통 Error Handling Middleware로 분리하는 것이 좋다.

---

# 34. 사용자에게 내부 오류를 그대로 보여주면 안 되는 이유

예를 들어 DB 오류가 발생했다고 하자.

실제 내부 오류:

```text
password authentication failed for user "postgres"
```

이 내용을 그대로 Client에 반환하는 것은 좋지 않을 수 있다.

내부 시스템 정보가 노출될 수 있기 때문이다.

Client에는 다음 정도로 반환한다.

```json
{
  "message": "Internal server error"
}
```

그리고 실제 상세 오류는 Server Log에 기록한다.

```text
Client
← 일반화된 Error Response

Server Log
← 상세 오류 정보
```

이 구조는 이후 Logging / Error Handling에서 다시 다룬다.

---

# 35. Project Arco 예제 1: 행사 목록 조회 성공

Request:

```http
GET /events
```

Response:

```text
200 OK
```

```json
[
  {
    "id": 1,
    "title": "GIST AI Seminar"
  }
]
```

---

# 36. Project Arco 예제 2: 검색 결과 없음

Request:

```http
GET /events?date=2026-01-01
```

해당 날짜에 Event가 없음.

Response:

```text
200 OK
```

```json
[]
```

중요:

```text
검색 결과 0개
≠
404
```

검색 자체는 성공했기 때문이다.

---

# 37. Project Arco 예제 3: 특정 행사 없음

Request:

```http
GET /events/99999
```

DB에 Event가 없음.

Response:

```text
404 Not Found
```

```json
{
  "message": "Event not found"
}
```

---

# 38. Project Arco 예제 4: 잘못된 날짜

Request:

```http
GET /events?date=2026-99-99
```

날짜가 유효하지 않다.

Response:

```text
400 Bad Request
```

```json
{
  "message": "Invalid date"
}
```

---

# 39. Project Arco 예제 5: 행사 생성

Request:

```http
POST /events
Content-Type: application/json
```

```json
{
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

생성 성공:

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

---

# 40. Project Arco 예제 6: 필수 데이터 누락

Request:

```http
POST /events
```

```json
{
  "title": "GIST AI Seminar"
}
```

`startAt`이 필수라고 하자.

Response:

```text
400 Bad Request
```

```json
{
  "message": "startAt is required"
}
```

---

# 41. Project Arco 예제 7: 중복 행사

Request:

```http
POST /events
```

이미 같은 Event가 존재한다.

Response:

```text
409 Conflict
```

```json
{
  "message": "Event already exists"
}
```

---

# 42. Project Arco 예제 8: DB 오류

Request:

```http
GET /events
```

PostgreSQL 연결 실패.

Response:

```text
500 Internal Server Error
```

```json
{
  "message": "Internal server error"
}
```

---

# 43. 어떤 Status Code를 선택해야 할까?

다음 순서로 생각하면 편하다.

```text
Request 처리 성공?
      │
   ┌──┴──┐
  Yes    No
   │      │
   │      ├─ Client 문제?
   │      │       │
   │      │    ┌──┴──┐
   │      │   Yes    No
   │      │    │      │
   │      │   4xx    5xx
   │
   ├─ Resource 생성?
   │      ↓
   │     201
   │
   ├─ Body 없음?
   │      ↓
   │     204
   │
   └─ 일반 성공
          ↓
         200
```

---

# 44. Resource가 없으면 항상 404인가?

아니다.

상황을 구분해야 한다.

## 특정 Resource 조회

```http
GET /events/123
```

123이 존재하지 않는다.

```text
404
```

---

## Collection 검색

```http
GET /events?category=ai
```

결과가 하나도 없다.

```text
200
```

```json
[]
```

이는 매우 중요한 API 설계 차이다.

---

# 45. 삭제하려는 Resource가 없으면?

예:

```http
DELETE /events/123
```

123번 Event가 이미 없다.

API 정책에 따라 다른 선택이 가능하다.

예를 들어:

```text
404 Not Found
```

로 처리할 수 있다.

```json
{
  "message": "Event not found"
}
```

현재 Project Arco에서는 이해하기 쉬운 방식으로:

```text
삭제 대상이 없음
→ 404
```

정도로 정해두는 것이 좋다.

---

# 46. 수정하려는 Resource가 없으면?

예:

```http
PATCH /events/123
```

123번 Event가 없다.

Response:

```text
404 Not Found
```

```json
{
  "message": "Event not found"
}
```

반대로 Event는 있지만 Body가 잘못되었다면:

```text
400 Bad Request
```

이다.

---

# 47. 하나의 요청에서 여러 문제가 발생할 수도 있다

예:

```http
PATCH /events/99999
```

Body:

```json
{
  "startAt": "banana"
}
```

여기에는 두 문제가 있을 수 있다.

```text
99999번 Event 없음
startAt 형식도 잘못됨
```

어떤 검증을 먼저 수행하느냐에 따라 반환되는 Error가 달라질 수 있다.

예:

```text
입력 Validation 먼저
→ 400
```

또는:

```text
Resource 존재 확인 먼저
→ 404
```

중요한 것은 프로젝트 전체에서 처리 순서를 일관되게 유지하는 것이다.

---

# 48. Status Code와 Frontend

Frontend는 Status Code를 보고 다른 UI를 보여줄 수 있다.

예:

```ts
if (response.status === 200) {
  // 행사 표시
}

if (response.status === 404) {
  // "행사를 찾을 수 없습니다."
}

if (response.status === 500) {
  // "잠시 후 다시 시도해주세요."
}
```

즉 Status Code는 Backend만을 위한 개념이 아니다.

```text
Backend
   ↓
Status Code
   ↓
Frontend
   ↓
적절한 사용자 경험
```

---

# 49. Fetch API에서 Status 확인

Frontend에서 다음 요청을 한다고 하자.

```ts
const response = await fetch("/events/123");
```

Status Code는 다음처럼 확인할 수 있다.

```ts
console.log(response.status);
```

예:

```text
200
404
500
```

또한:

```ts
response.ok
```

를 사용할 수 있다.

`response.ok`는 일반적으로 Status Code가 `200~299` 범위이면 `true`다.

예:

```ts
const response = await fetch("/events/123");

if (!response.ok) {
  throw new Error("Request failed");
}
```

---

# 50. fetch는 404에서 자동으로 예외를 발생시킬까?

중요한 점이 있다.

`fetch()`는 `404`나 `500` Response를 받았다고 해서 자동으로 Promise를 reject하지 않는다.

예:

```ts
const response = await fetch("/events/99999");
```

Server가:

```text
404 Not Found
```

를 반환해도 `response` 자체는 받을 수 있다.

따라서 직접 확인해야 한다.

```ts
if (!response.ok) {
  // error handling
}
```

이 점은 나중에 Frontend와 Backend를 연결할 때 중요하다.

---

# 51. Status Code를 무조건 세분화해야 하는가?

모든 상황마다 서로 다른 Status Code를 찾으려고 할 필요는 없다.

초기 MVP에서는 단순하고 일관된 규칙이 더 중요하다.

Project Arco 초기 기준으로는 다음 정도면 충분하다.

| 상황 | Status |
|---|---:|
| 조회 성공 | 200 |
| 검색 결과 없음 | 200 |
| 생성 성공 | 201 |
| 삭제 성공 | 204 |
| 입력 오류 | 400 |
| Resource 없음 | 404 |
| 중복 충돌 | 409 |
| Server 내부 오류 | 500 |

이 규칙만 잘 적용해도 MVP에서는 충분하다.

---

# 52. Status Code를 Body 안에만 넣으면 안 되는 이유

다음 Response는 피하는 것이 좋다.

```text
HTTP Status:
200 OK
```

```json
{
  "status": 404,
  "message": "Event not found"
}
```

HTTP 수준에서는 성공인데 Body 안에서는 실패라고 말하고 있다.

이렇게 되면 Client가 혼란스러워진다.

대신 실제 HTTP Status도 맞게 반환한다.

```text
404 Not Found
```

```json
{
  "message": "Event not found"
}
```

즉:

> HTTP 처리 결과는 실제 HTTP Status Code로 표현한다.

---

# 53. 모든 오류를 500으로 반환하면 안 되는 이유

다음 API를 생각해보자.

잘못된 날짜:

```text
500
```

존재하지 않는 Event:

```text
500
```

중복 Event:

```text
500
```

DB 장애:

```text
500
```

모두 500이면 Client는 원인을 구분할 수 없다.

더 적절하게 나누면:

```text
잘못된 날짜
→ 400

Event 없음
→ 404

중복
→ 409

DB 장애
→ 500
```

API를 사용하는 쪽에서 훨씬 정확한 처리가 가능하다.

---

# 54. 모든 오류를 200으로 반환하면 안 되는 이유

다음과 같은 API도 피하는 것이 좋다.

```text
200 OK
```

```json
{
  "success": false,
  "message": "Event not found"
}
```

물론 기술적으로 구현할 수 있지만 HTTP가 제공하는 표준 의미를 사용하지 못한다.

더 자연스러운 방식:

```text
404 Not Found
```

```json
{
  "message": "Event not found"
}
```

---

# 55. Status Code는 API 계약이다

Frontend와 Backend가 다음과 같이 약속할 수 있다.

```text
GET /events/:id

200
→ Event 존재

404
→ Event 없음

500
→ Server 오류
```

Frontend는 이 계약을 기반으로 UI를 구현한다.

```text
200
→ 상세 화면

404
→ "존재하지 않는 행사"

500
→ "서버 오류"
```

따라서 Status Code 선택 역시 API 설계의 일부다.

---

# 56. Project Arco 기본 Error 규칙

초기 프로젝트에서는 다음 규칙을 사용할 수 있다.

```text
Validation 실패
→ 400 Bad Request

Resource 없음
→ 404 Not Found

중복 데이터
→ 409 Conflict

예상하지 못한 Server Error
→ 500 Internal Server Error
```

성공:

```text
조회
→ 200 OK

생성
→ 201 Created

삭제
→ 204 No Content
```

---

# 57. API별 예상 Status Code

## `GET /events`

```text
200
→ 조회 성공

400
→ Query Parameter가 잘못됨

500
→ Server 오류
```

검색 결과가 없어도:

```text
200
```

```json
[]
```

---

## `GET /events/:id`

```text
200
→ Event 존재

400
→ id 형식이 잘못됨

404
→ Event 없음

500
→ Server 오류
```

---

## `POST /events`

```text
201
→ 생성 성공

400
→ 입력 데이터 오류

409
→ 중복 Event

500
→ Server 오류
```

---

## `PATCH /events/:id`

```text
200
→ 수정 성공

400
→ 입력 오류

404
→ Event 없음

409
→ 수정 결과가 다른 데이터와 충돌

500
→ Server 오류
```

---

## `DELETE /events/:id`

```text
204
→ 삭제 성공

404
→ Event 없음

500
→ Server 오류
```

---

# 58. 확인 문제

## 문제 1

행사 목록 조회에 성공했다.

어떤 Status Code가 적절한가?

```text
200 OK
```

---

## 문제 2

새로운 행사를 성공적으로 생성했다.

```text
201 Created
```

---

## 문제 3

행사를 성공적으로 삭제했고 반환할 데이터가 없다.

```text
204 No Content
```

---

## 문제 4

다음 요청의 날짜가 잘못되었다.

```http
GET /events?date=banana
```

정답:

```text
400 Bad Request
```

---

## 문제 5

다음 요청에서 123번 Event가 존재하지 않는다.

```http
GET /events/123
```

정답:

```text
404 Not Found
```

---

## 문제 6

같은 Event를 다시 등록하려고 한다.

정답:

```text
409 Conflict
```

---

## 문제 7

정상적인 Request를 받았지만 DB 연결이 실패했다.

정답:

```text
500 Internal Server Error
```

---

# 59. 확인 문제: 200 vs 404

다음 요청:

```http
GET /events?category=ai
```

AI Event가 하나도 없다.

어떤 Response가 적절한가?

정답:

```text
200 OK
```

```json
[]
```

이유:

```text
검색 요청 자체는 정상적으로 처리되었기 때문이다.
```

---

# 60. 실습 1: Status Code 결정하기

다음 상황에 적절한 Status Code를 작성한다.

```text
1. Event 상세 조회 성공
2. Event 생성 성공
3. title 누락
4. Event ID는 정상인데 DB에 없음
5. 중복 Event 등록
6. PostgreSQL 장애
7. 삭제 성공, Body 없음
```

정답:

```text
1. 200
2. 201
3. 400
4. 404
5. 409
6. 500
7. 204
```

---

# 61. 실습 2: Express 코드 읽기

다음 코드를 해석해보자.

```ts
app.get("/events/:id", (req, res) => {
  const event = findEvent(req.params.id);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  res.status(200).json(event);
});
```

흐름:

```text
GET /events/:id
        ↓
Event 검색
        ↓
존재?
 ┌──────┴──────┐
No            Yes
 ↓              ↓
404            200
```

---

# 62. 실습 3: 생성 API

다음 코드의 빈칸을 채운다.

```ts
app.post("/events", (req, res) => {
  const event = createEvent(req.body);

  res.status(???).json(event);
});
```

정답:

```ts
201
```

완성:

```ts
app.post("/events", (req, res) => {
  const event = createEvent(req.body);

  res.status(201).json(event);
});
```

---

# 63. 실습 4: 삭제 API

다음 Event를 삭제했다.

```http
DELETE /events/123
```

Response Body가 필요 없다.

Express 코드:

```ts
app.delete("/events/:id", (req, res) => {
  deleteEvent(req.params.id);

  res.status(204).send();
});
```

---

# 64. Project Arco에서 우선 외울 코드

초기에는 다음 Status Code만 바로 떠올릴 수 있으면 충분하다.

```text
200
OK

201
Created

204
No Content

400
Bad Request

404
Not Found

409
Conflict

500
Internal Server Error
```

외울 때 숫자만 외우기보다 상황과 연결한다.

```text
조회 성공
→ 200

생성 성공
→ 201

삭제 성공
→ 204

입력 문제
→ 400

대상 없음
→ 404

데이터 충돌
→ 409

서버 문제
→ 500
```

---

# 65. 핵심 요약

HTTP Status Code는 Server가 Request 처리 결과를 Client에게 알려주는 표준적인 방법이다.

가장 먼저 구분할 것은 다음 세 범위다.

```text
2xx
→ 성공

4xx
→ Client Request 문제

5xx
→ Server 문제
```

Project Arco에서는 우선 다음 코드를 사용한다.

```text
200 OK
→ 조회 성공

201 Created
→ 생성 성공

204 No Content
→ 성공했지만 Response Body 없음

400 Bad Request
→ 잘못된 입력

404 Not Found
→ Resource 없음

409 Conflict
→ 데이터 상태 충돌

500 Internal Server Error
→ Server 내부 오류
```

특히 다음 차이를 기억한다.

```text
GET /events?category=ai
결과 없음

→ 200 []
```

반면:

```text
GET /events/123
123번 Event 없음

→ 404
```

그리고 다음 기준도 중요하다.

```text
Client가 Request를 고쳐야 한다
→ 4xx

Server 쪽 문제를 고쳐야 한다
→ 5xx
```

---

# 66. 체크리스트

학습 후 다음 항목을 확인한다.

- [ ] HTTP Status Code가 왜 필요한지 설명할 수 있다.
- [ ] 2xx, 4xx, 5xx의 차이를 설명할 수 있다.
- [ ] `200 OK`를 언제 사용하는지 안다.
- [ ] `201 Created`를 언제 사용하는지 안다.
- [ ] `204 No Content`를 언제 사용하는지 안다.
- [ ] `400 Bad Request`를 언제 사용하는지 안다.
- [ ] `404 Not Found`를 언제 사용하는지 안다.
- [ ] `409 Conflict`를 언제 사용하는지 안다.
- [ ] `500 Internal Server Error`를 언제 사용하는지 안다.
- [ ] 검색 결과가 0개일 때 `200 + []`를 반환하는 이유를 설명할 수 있다.
- [ ] 특정 Resource가 없을 때 `404`를 반환할 수 있다.
- [ ] `400`과 `404`의 차이를 설명할 수 있다.
- [ ] `400`과 `500`의 차이를 설명할 수 있다.
- [ ] Express에서 `res.status()`를 사용할 수 있다.
- [ ] Frontend가 Status Code를 이용해 응답을 구분한다는 것을 이해한다.

---

# 67. 다음 학습

다음 문서에서는 지금까지 학습한 HTTP 개념을 이용해 REST API를 어떻게 설계하는지 정리한다.

```text
현재
04-http-status-code.md

        ↓

다음
05-rest-api-basics.md
```

다음 핵심 질문은 다음과 같다.

> HTTP Method, URL, Path Parameter, Query Parameter, Status Code를 조합해서 일관된 Project Arco API를 어떻게 설계해야 하는가?