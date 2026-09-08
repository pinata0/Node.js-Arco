# Project Arco 학습 커리큘럼

## 1. 학습 목표

이 프로젝트의 목적은 단순히 서비스를 완성하는 것이 아니라, 실제 서비스를 구현하면서 다음 내용을 익히는 것이다.

- JavaScript / TypeScript 기반 백엔드 개발
- Node.js와 Express의 역할 이해
- REST API 설계
- PostgreSQL과 관계형 데이터베이스 활용
- SQL 작성
- 정규화와 N:M 관계 이해
- Raw 데이터에서 서비스용 데이터로 변환하는 과정 이해
- 프론트엔드와 백엔드 사이의 데이터 흐름 이해

최종적으로 다음 흐름을 스스로 설명하고 구현할 수 있는 것을 목표로 한다.

```text
행사 데이터 수집
    ↓
Raw Data
    ↓
데이터 정제 / 검증
    ↓
PostgreSQL 저장
    ↓
Express API
    ↓
Frontend 요청
    ↓
행사 검색 및 추천
```

---

# 2. 학습 순서

## Phase 1. Web Backend의 기본 구조 이해

### 1. HTTP 기초

학습 내용:

- HTTP란 무엇인가
- Client와 Server
- Request와 Response
- URL 구조
- HTTP Method
  - GET
  - POST
  - PUT
  - PATCH
  - DELETE
- HTTP Status Code
  - 200
  - 201
  - 400
  - 404
  - 500

프로젝트 연결:

```http
GET /events
GET /events/123
POST /events
```

목표:

> 브라우저 또는 프론트엔드가 백엔드에 요청을 보내고 응답을 받는 과정을 설명할 수 있다.

---

### 2. REST API

학습 내용:

- REST란 무엇인가
- Resource 중심 API 설계
- Path Parameter
- Query Parameter
- Request Body

예시:

```http
GET /events/123
```

```text
123 = Path Parameter
```

```http
GET /events?date=2026-09-12&category=game
```

```text
date, category = Query Parameter
```

프로젝트에서 예상되는 API:

```text
GET /events
GET /events/:id
GET /events?startDate=...
GET /events?category=...
GET /events?tags=...
```

목표:

> 필요한 기능을 보고 적절한 API Endpoint를 설계할 수 있다.

---

# Phase 2. Node.js와 Express

## 3. Node.js

학습 내용:

- Node.js란 무엇인가
- JavaScript Runtime의 의미
- Browser JavaScript와 Node.js 차이
- npm / pnpm
- package.json
- module
- dependency

특히 확인할 내용:

```text
JavaScript
    ↓
Node.js Runtime
    ↓
Express
```

목표:

> Node.js가 라이브러리가 아니라 JavaScript 실행 환경이라는 것을 설명할 수 있다.

---

## 4. Express

학습 내용:

- Express 역할
- Application
- Router
- Request
- Response
- Middleware

기본 코드:

```ts
app.get("/events", (req, res) => {
  res.json([]);
});
```

중점적으로 익힐 것:

```ts
req.params
req.query
req.body
res.json()
res.status()
```

목표:

> HTTP 요청이 Express 코드 내부에서 어떻게 처리되는지 설명할 수 있다.

---

## 5. Middleware

학습 내용:

- Middleware 개념
- 요청 처리 Pipeline
- `next()`
- JSON parsing
- logging
- authentication
- error handling

구조:

```text
Request
  ↓
Middleware
  ↓
Router
  ↓
Controller
  ↓
Response
```

목표:

> Express Middleware가 왜 필요한지 설명할 수 있다.

---

# Phase 3. TypeScript

## 6. JavaScript 기본 문법

우선 익힐 내용:

- `const`
- `let`
- primitive type
- Object
- Array
- Function
- Arrow Function
- destructuring
- spread syntax
- map
- filter
- find
- async / await
- Promise

목표:

> 백엔드 코드를 읽는 데 필요한 JavaScript 문법을 이해한다.

---

## 7. TypeScript 기본

학습 내용:

- Type Annotation
- Type Inference
- `interface`
- `type`
- Optional Property
- Union Type
- Literal Type
- Generic
- `unknown`
- `any`

예시:

```ts
interface Event {
  id: number;
  title: string;
  startAt: string;
  endAt?: string;
}
```

중요한 비교:

```text
null
undefined
optional property
```

목표:

> API와 DB에서 사용하는 데이터 구조를 TypeScript 타입으로 표현할 수 있다.

---

# Phase 4. 관계형 데이터베이스

## 8. 관계형 데이터베이스 기초

학습 내용:

- Database
- Table
- Row
- Column
- Schema
- Relation

예시:

```text
events
-----------------
id
title
start_at
end_at
location_id
```

목표:

> JSON 객체와 DB Table의 차이를 설명할 수 있다.

---

## 9. Primary Key와 Foreign Key

학습 내용:

### Primary Key

행을 고유하게 식별한다.

```text
events.id
```

### Foreign Key

다른 테이블의 데이터를 참조한다.

```text
events.location_id
        ↓
locations.id
```

추가 학습:

- `PRIMARY KEY`
- `FOREIGN KEY`
- `NOT NULL`
- `UNIQUE`
- `CHECK`

목표:

> 테이블 간 관계를 PK와 FK로 표현할 수 있다.

---

# Phase 5. SQL

## 10. SELECT

가장 먼저 익힐 SQL.

```sql
SELECT *
FROM events;
```

조건:

```sql
SELECT *
FROM events
WHERE start_at >= '2026-09-01';
```

학습 내용:

- SELECT
- FROM
- WHERE
- AND
- OR
- ORDER BY
- LIMIT

목표:

> 원하는 행사 데이터를 DB에서 조회할 수 있다.

---

## 11. INSERT / UPDATE / DELETE

### INSERT

```sql
INSERT INTO events (title, start_at)
VALUES ('AI Conference', '2026-09-12');
```

### UPDATE

```sql
UPDATE events
SET title = 'GIST AI Conference'
WHERE id = 1;
```

### DELETE

```sql
DELETE FROM events
WHERE id = 1;
```

목표:

> 데이터의 CRUD를 SQL로 수행할 수 있다.

---

## 12. JOIN

이번 프로젝트에서 특히 중요한 부분이다.

구조:

```text
events
   |
   | 1:N
   v
event_tags
   ^
   | N:1
   |
tags
```

예시:

```sql
SELECT events.title, tags.name
FROM events
JOIN event_tags
  ON events.id = event_tags.event_id
JOIN tags
  ON tags.id = event_tags.tag_id;
```

학습할 JOIN:

- INNER JOIN
- LEFT JOIN

목표:

> 여러 테이블에 나누어진 데이터를 하나의 결과로 조회할 수 있다.

---

# Phase 6. 데이터 모델링

## 13. 1:1 / 1:N / N:M 관계

### 1:1

```text
A ─ B
```

### 1:N

```text
location
   |
   ├── event
   ├── event
   └── event
```

### N:M

```text
event
  ↕
tag
```

N:M은 중간 테이블이 필요하다.

```text
events
event_tags
tags
```

목표:

> 데이터 관계를 보고 적절한 테이블 구조를 선택할 수 있다.

---

## 14. 정규화

학습 내용:

- 데이터 중복 문제
- Update Anomaly
- Insert Anomaly
- Delete Anomaly
- 1NF
- 2NF
- 3NF의 기본 개념

이번 프로젝트에서는 깊은 이론보다 다음 질문을 중심으로 공부한다.

> 이 값을 `events` 테이블에 직접 넣어야 하는가?

또는

> 별도의 테이블로 분리해야 하는가?

예:

```text
event
location
tag
category
organizer
```

목표:

> 데이터 중복을 줄이기 위해 테이블을 분리하는 이유를 이해한다.

---

# Phase 7. Raw Data와 서비스 데이터

## 15. Raw Data

웹에서 수집한 원본 데이터.

예:

```json
{
  "title": "AI Conference",
  "date": "9월 12일",
  "location": "코엑스",
  "category": ["AI", "Data"]
}
```

Raw 데이터는 최대한 원본을 보존한다.

---

## 16. Normalized Data

서비스에서 사용하기 쉽게 변환한 데이터.

```json
{
  "title": "AI Conference",
  "start_at": "2026-09-12T10:00:00+09:00",
  "location_id": 15
}
```

그리고 별도로:

```text
event_categories
event_tags
locations
```

등에 데이터를 저장한다.

목표:

> 수집 데이터와 실제 DB 데이터의 역할이 다른 이유를 이해한다.

---

# Phase 8. 데이터 품질

## 17. 데이터 검증

학습 내용:

- required field
- null
- invalid value
- validation
- schema

예:

```text
title       필수
start_at    필수
source_url  필수
end_at      선택
```

목표:

> 잘못된 데이터가 DB에 들어가는 것을 방지할 수 있다.

---

## 18. 중복 제거

행사는 여러 사이트에 동시에 올라올 수 있다.

예:

```text
행사 공식 사이트
온오프믹스
이벤터스
SNS
```

하지만 실제 행사는 하나다.

학습할 개념:

- Natural Key
- Surrogate Key
- UNIQUE Constraint
- Deduplication
- Canonical Data

목표:

> 같은 행사를 여러 번 저장하지 않도록 판단 기준을 설계할 수 있다.

---

# Phase 9. PostgreSQL

## 19. PostgreSQL 기본

학습 내용:

- PostgreSQL 특징
- Database
- Schema
- Table
- Sequence
- Index

자주 사용할 타입:

```text
INTEGER
BIGINT
TEXT
VARCHAR
BOOLEAN
DATE
TIMESTAMP
TIMESTAMPTZ
JSONB
```

특히 공부할 것:

```text
TIMESTAMP
vs
TIMESTAMPTZ
```

목표:

> 프로젝트 DB Schema를 PostgreSQL에서 직접 작성할 수 있다.

---

## 20. Index

예:

```sql
CREATE INDEX idx_events_start_at
ON events(start_at);
```

왜 필요한가:

```text
"9월 12일 행사 찾아줘"
```

같은 요청을 빠르게 처리하기 위해서다.

학습 내용:

- Index
- Full Table Scan
- Query Performance

초기에는 깊게 공부할 필요는 없다.

목표:

> 검색 속도와 Index의 관계를 이해한다.

---

# Phase 10. Backend Architecture

## 21. Router / Controller / Service 분리

처음에는 다음 코드도 가능하다.

```ts
app.get("/events", async (req, res) => {
  // SQL
  // 데이터 처리
  // 응답
});
```

하지만 프로젝트가 커지면 역할을 분리한다.

```text
Router
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

각 역할:

### Router

URL 연결

### Controller

HTTP 요청/응답 처리

### Service

비즈니스 로직

### Repository

DB 접근

목표:

> 서버 코드가 커졌을 때 기능별로 코드를 분리할 수 있다.

---

# Phase 11. API와 Database 연결

## 22. DB Query

흐름:

```text
Frontend
   ↓
GET /events
   ↓
Express
   ↓
SQL
   ↓
PostgreSQL
   ↓
JSON Response
```

예:

```sql
SELECT *
FROM events
WHERE start_at >= $1
AND start_at < $2;
```

목표:

> API 요청을 PostgreSQL Query로 연결할 수 있다.

---

## 23. SQL Injection

위험한 코드:

```ts
const sql = `
SELECT *
FROM events
WHERE title = '${title}'
`;
```

권장 방식:

```sql
SELECT *
FROM events
WHERE title = $1;
```

학습 내용:

- SQL Injection
- Parameterized Query

목표:

> 사용자 입력을 안전하게 SQL Query에 사용할 수 있다.

---

# Phase 12. 행사 검색 기능 구현

## 24. 날짜 검색

예:

```text
2026-09-12에 참석 가능한 행사
```

SQL 개념:

```sql
WHERE start_at >= ...
AND start_at < ...
```

---

## 25. 관심 분야 검색

예:

```text
AI
Game
Architecture
Design
Art
```

필요 기술:

- JOIN
- WHERE
- N:M relation

---

## 26. 복합 검색

예:

```text
9월 12일
+
서울
+
AI 또는 Game
+
오프라인 행사
```

SQL 개념:

- JOIN
- AND
- OR
- IN
- DISTINCT

목표:

> 여러 조건을 조합하여 실제 서비스 검색 기능을 구현할 수 있다.

---

# Phase 13. 이후 학습

MVP가 어느 정도 구현된 후 공부한다.

## 27. Transaction

```text
행사 등록
+
태그 등록
+
카테고리 연결
```

여러 Query를 하나의 작업 단위로 처리한다.

학습:

```text
BEGIN
COMMIT
ROLLBACK
```

---

## 28. Database Migration

DB Schema도 코드처럼 변경 이력을 관리한다.

예:

```text
001_create_events
002_create_tags
003_add_registration_status
```

---

## 29. Pagination

행사가 수백 개 이상이면 한 번에 모두 보내지 않는다.

```http
GET /events?page=1&limit=20
```

또는 Cursor Pagination을 사용할 수 있다.

---

## 30. Logging / Error Handling

운영 단계에서 필요한 내용:

- 서버 오류 기록
- DB 오류 기록
- 요청 로그
- 적절한 Error Response

---

# 3. 학습 우선순위

## 반드시 먼저

```text
HTTP
↓
REST API
↓
Express
↓
SQL 기본
↓
PK / FK
↓
JOIN
↓
1:N / N:M
↓
PostgreSQL
```

## 그 다음

```text
TypeScript Type
↓
Normalization
↓
Raw → Normalized Data
↓
Validation
↓
Deduplication
↓
API ↔ DB 연결
```

## MVP 구현 중 학습

```text
Architecture
Index
Transaction
Migration
Pagination
Error Handling
```

---

# 4. 프로젝트 진행 단계와 학습 연결

## 현재: 데이터 수집 단계

공부하기 좋은 내용:

- SQL
- 관계형 DB
- PK / FK
- JOIN
- N:M 관계
- 정규화
- Raw Data / Normalized Data

---

## 데이터 수집 완료 후

공부할 내용:

- PostgreSQL Schema
- INSERT
- Validation
- Deduplication
- Migration

---

## API 개발 단계

공부할 내용:

- HTTP
- REST
- Express
- Router
- Controller
- Query Parameter
- Error Handling

---

## Frontend 연결 단계

공부할 내용:

- JSON
- Fetch API
- async / await
- API Response Type
- CORS

---

# 5. 추천 실습 방식

이론만 따로 공부하지 않는다.

모든 개념은 가능하면 Project Arco 데이터를 예제로 학습한다.

예를 들어 JOIN을 공부한다면:

```text
학생-수업
게시글-태그
상품-카테고리
```

같은 일반 예제보다 다음 구조를 사용한다.

```text
events
event_tags
tags
```

SQL 역시 실제 행사 검색 문제로 연습한다.

예:

> 2026년 9월 12일에 열리는 행사 찾기

> AI 태그가 포함된 행사 찾기

> AI 또는 Game 분야 행사를 날짜순으로 출력하기

> 서울에서 열리는 Design 행사 찾기

> 행사별 태그를 모두 출력하기

---

# 6. 최종 체크리스트

프로젝트가 끝날 때 다음 질문에 답할 수 있으면 된다.

- [ ] HTTP Request와 Response를 설명할 수 있다.
- [ ] REST API Endpoint를 설계할 수 있다.
- [ ] Express Router를 작성할 수 있다.
- [ ] `req.params`, `req.query`, `req.body` 차이를 안다.
- [ ] TypeScript로 API 데이터 타입을 작성할 수 있다.
- [ ] PostgreSQL Table을 직접 설계할 수 있다.
- [ ] Primary Key와 Foreign Key를 설명할 수 있다.
- [ ] 1:N과 N:M 관계를 설계할 수 있다.
- [ ] SELECT Query를 작성할 수 있다.
- [ ] JOIN Query를 작성할 수 있다.
- [ ] INSERT / UPDATE / DELETE를 작성할 수 있다.
- [ ] Raw 데이터와 정규화 데이터를 구분할 수 있다.
- [ ] 데이터 중복 제거 방법을 설명할 수 있다.
- [ ] Express에서 PostgreSQL 데이터를 조회할 수 있다.
- [ ] 사용자 입력을 안전하게 SQL에 전달할 수 있다.
- [ ] 날짜와 관심 분야를 조합한 행사 검색 Query를 작성할 수 있다.
- [ ] Frontend → Backend → Database 전체 흐름을 설명할 수 있다.

---

# 7. 가장 먼저 읽을 순서

현재 시점에는 다음 순서로 공부한다.

```text
1. 관계형 데이터베이스란?
2. Primary Key / Foreign Key
3. 1:N / N:M
4. SQL SELECT
5. SQL JOIN
6. 정규화
7. Raw Data와 Normalized Data
8. PostgreSQL 기본 타입
9. HTTP
10. REST API
11. Express
12. TypeScript 타입 설계
```

특히 첫 번째 실습 주제는 다음으로 한다.

> `events`, `tags`, `event_tags` 세 테이블을 만들고 특정 태그를 가진 행사를 JOIN으로 조회한다.