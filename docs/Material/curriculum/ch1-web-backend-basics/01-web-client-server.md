# Web Backend Basics

## 1. 학습 목표

이 문서에서는 웹 서비스에서 백엔드가 어떤 역할을 하는지 이해한다.

Project Arco를 기준으로 다음 흐름을 설명할 수 있는 것을 목표로 한다.

```text
User
  ↓
Frontend
  ↓
Backend
  ↓
Database
```

학습 후 다음 질문에 답할 수 있어야 한다.

- 웹 서비스에서 Client와 Server는 무엇인가?
- Frontend와 Backend는 어떻게 다른가?
- Backend는 어떤 일을 담당하는가?
- Project Arco에서 Express와 PostgreSQL은 각각 어디에 위치하는가?
- 사용자가 행사 목록을 요청했을 때 전체 시스템에서는 어떤 일이 일어나는가?

---

# 2. 웹 서비스의 기본 구조

웹 서비스는 크게 다음 구성 요소로 나눌 수 있다.

```text
Client
  ↓
Frontend
  ↓
Backend
  ↓
Database
```

조금 더 구체적으로 표현하면 다음과 같다.

```text
사용자
  ↓
브라우저
  ↓
Frontend
  ↓
HTTP Request
  ↓
Backend Server
  ↓
Database
  ↓
Backend Server
  ↓
HTTP Response
  ↓
Frontend
  ↓
사용자 화면
```

Project Arco에서는 대략 다음과 같은 구조가 된다.

```text
Browser
  ↓
Frontend
  ↓
Express
  ↓
PostgreSQL
```

각 구성 요소는 서로 다른 역할을 담당한다.

---

# 3. Client란?

Client는 Server에 어떤 작업을 요청하는 쪽이다.

대표적인 Client는 웹 브라우저다.

예를 들어 사용자가 Project Arco에서 다음 조건으로 행사를 검색한다고 하자.

```text
날짜: 2026-09-12
관심 분야: AI
```

Frontend는 Backend에게 다음과 같은 요청을 보낼 수 있다.

```http
GET /events?date=2026-09-12&category=ai
```

이때 요청을 보내는 쪽이 Client다.

Client는 반드시 브라우저일 필요는 없다.

다음도 Client가 될 수 있다.

- 웹 브라우저
- 모바일 앱
- 다른 서버
- API 테스트 프로그램
- CLI 프로그램

즉, Client라는 말은 프로그램의 종류를 의미하기보다는

> 요청을 보내는 역할

을 의미한다.

---

# 4. Server란?

Server는 Client의 요청을 받아 처리하고 결과를 반환하는 쪽이다.

예를 들어 Client가 다음 요청을 보냈다고 하자.

```http
GET /events
```

Server는 요청을 받아 다음과 같은 작업을 수행할 수 있다.

```text
1. 요청 확인
2. 필요한 데이터 판단
3. Database 조회
4. 결과 가공
5. Client에 응답
```

예를 들어 데이터베이스에서 행사 목록을 조회한 뒤 다음 JSON을 반환할 수 있다.

```json
[
  {
    "id": 1,
    "title": "GIST AI Seminar"
  },
  {
    "id": 2,
    "title": "Indie Game Conference"
  }
]
```

Client 입장에서는 Server 내부에서 어떤 SQL이 실행되었는지 알 필요가 없다.

Client는 단순히 다음 관계만 알면 된다.

```text
Request
  ↓
Server
  ↓
Response
```

---

# 5. Client와 Server는 고정된 개념이 아니다

Client와 Server는 프로그램 자체의 고정된 속성이 아니다.

어떤 관계에서 요청을 보내느냐에 따라 달라질 수 있다.

예를 들어 Project Arco Backend는 Frontend와 통신할 때 Server다.

```text
Frontend
   ↓ Request
Backend
```

하지만 Backend가 외부 API를 호출한다면 Backend가 Client가 된다.

```text
Project Arco Backend
        ↓ Request
External API
```

따라서 Client와 Server는 다음처럼 이해하는 것이 좋다.

```text
Client = 요청하는 쪽
Server = 요청을 처리하는 쪽
```

---

# 6. Frontend란?

Frontend는 사용자가 직접 보는 부분이다.

웹 서비스에서는 주로 브라우저에서 실행된다.

예를 들어 Project Arco의 Frontend에서는 다음 UI가 있을 수 있다.

```text
날짜 선택
관심 분야 선택
지역 선택
검색 버튼
행사 목록
행사 상세 화면
```

Frontend의 주요 역할은 다음과 같다.

- 화면 표시
- 사용자 입력 처리
- Backend API 호출
- Backend에서 받은 데이터 표시
- 화면 상태 관리

예를 들어 Backend에서 다음 데이터가 왔다고 하자.

```json
{
  "id": 123,
  "title": "AI Conference",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

Frontend는 이를 사용자가 읽기 좋은 화면으로 표현한다.

```text
AI Conference

2026년 9월 12일
오전 10시
```

즉 Frontend의 핵심 역할은

> 사용자와 시스템 사이의 인터페이스

라고 볼 수 있다.

---

# 7. Backend란?

Backend는 사용자가 직접 보지 않는 서버 측 영역이다.

Frontend에서 요청을 받으면 필요한 작업을 처리한다.

대표적인 역할은 다음과 같다.

- HTTP 요청 처리
- 데이터 검증
- 비즈니스 로직 실행
- Database 조회
- Database 수정
- 사용자 인증
- 권한 검사
- 데이터 가공
- 오류 처리
- API Response 생성

Project Arco의 Backend는 Express로 구현한다.

예를 들어 다음 요청이 들어왔다고 하자.

```http
GET /events?date=2026-09-12
```

Backend에서는 대략 다음 과정이 진행된다.

```text
Request 수신
   ↓
date 값 확인
   ↓
SQL Query 생성
   ↓
PostgreSQL 조회
   ↓
행사 데이터 획득
   ↓
JSON으로 변환
   ↓
Response 반환
```

---

# 8. Backend와 Database는 다르다

Backend와 Database를 같은 것으로 생각하면 안 된다.

두 시스템은 서로 다른 역할을 한다.

## Backend

Backend는 요청을 처리한다.

```text
"9월 12일 행사 보여줘"
```

라는 요청을 받으면 무엇을 조회해야 할지 판단한다.

## Database

Database는 데이터를 저장하고 조회한다.

예를 들어 다음과 같은 데이터가 저장되어 있을 수 있다.

```text
events
-------------------------------------
id | title          | start_at
-------------------------------------
1  | AI Conference  | 2026-09-12
2  | Game Meetup    | 2026-09-13
```

Backend는 Database에 다음과 같은 SQL Query를 보낼 수 있다.

```sql
SELECT *
FROM events
WHERE start_at >= '2026-09-12'
  AND start_at < '2026-09-13';
```

관계를 정리하면 다음과 같다.

```text
Frontend
   ↓
Backend
   ↓
Database
```

Backend가 Database를 직접 대체하는 것이 아니다.

---

# 9. Project Arco에서 각 기술의 위치

Project Arco에서 사용할 핵심 기술을 구조에 넣으면 다음과 같다.

```text
User
  ↓
Browser
  ↓
Frontend
  ↓
HTTP
  ↓
Node.js
  ↓
Express
  ↓
PostgreSQL
```

조금 더 정확하게 보면 다음과 같다.

```text
┌─────────────────────────────┐
│          Browser            │
│                             │
│          Frontend           │
└──────────────┬──────────────┘
               │
               │ HTTP
               ▼
┌─────────────────────────────┐
│          Backend            │
│                             │
│ Node.js Runtime             │
│        ↓                    │
│ Express Application         │
└──────────────┬──────────────┘
               │
               │ SQL
               ▼
┌─────────────────────────────┐
│        PostgreSQL           │
│                             │
│ events                      │
│ tags                        │
│ event_tags                  │
│ locations                   │
└─────────────────────────────┘
```

각 기술의 역할은 다음과 같다.

| 구성 요소 | 역할 |
|---|---|
| Browser | 사용자가 웹서비스에 접근하는 프로그램 |
| Frontend | 화면 및 사용자 입력 처리 |
| HTTP | Frontend와 Backend가 통신하는 방식 |
| Node.js | JavaScript를 서버에서 실행하는 Runtime |
| Express | HTTP 서버와 API를 구현하는 Web Framework |
| PostgreSQL | 행사 데이터를 저장하는 관계형 Database |

---

# 10. 예제: 행사 목록 조회

사용자가 Project Arco를 열고 행사 목록을 조회한다고 하자.

Frontend가 다음 요청을 보낸다.

```http
GET /events
```

전체 흐름은 다음과 같다.

```text
1. 사용자가 행사 목록 페이지를 연다.

2. Frontend가 Backend에 요청한다.

   GET /events

3. Express가 요청을 받는다.

4. Backend가 PostgreSQL에 SQL Query를 보낸다.

   SELECT *
   FROM events;

5. PostgreSQL이 행사 데이터를 반환한다.

6. Backend가 결과를 JSON 형태로 변환한다.

7. Backend가 Frontend에 응답한다.

8. Frontend가 행사 목록을 화면에 표시한다.
```

그림으로 표현하면 다음과 같다.

```text
User
 │
 │ 행사 목록 보기
 ▼
Frontend
 │
 │ GET /events
 ▼
Express Backend
 │
 │ SELECT * FROM events;
 ▼
PostgreSQL
 │
 │ rows
 ▼
Express Backend
 │
 │ JSON Response
 ▼
Frontend
 │
 │ 화면 렌더링
 ▼
User
```

---

# 11. 예제: 날짜별 행사 검색

사용자가 다음 조건으로 검색했다고 하자.

```text
2026년 9월 12일 행사
```

Frontend는 다음과 같은 API 요청을 보낼 수 있다.

```http
GET /events?date=2026-09-12
```

Backend는 `date` 값을 확인한다.

```text
date = 2026-09-12
```

그리고 다음과 같은 SQL을 실행할 수 있다.

```sql
SELECT *
FROM events
WHERE start_at >= '2026-09-12 00:00:00+09'
  AND start_at < '2026-09-13 00:00:00+09';
```

PostgreSQL이 결과를 반환하면 Backend는 JSON Response를 생성한다.

```json
[
  {
    "id": 15,
    "title": "AI Seminar",
    "startAt": "2026-09-12T10:00:00+09:00"
  }
]
```

Frontend는 이 데이터를 화면에 표시한다.

---

# 12. API란?

Frontend가 Backend의 기능을 사용하기 위한 통로를 API라고 할 수 있다.

예를 들어 Project Arco Backend가 다음 기능을 제공한다고 하자.

```text
행사 목록 조회
행사 상세 조회
날짜별 행사 검색
카테고리별 행사 검색
```

이를 HTTP API로 표현하면 다음과 같이 설계할 수 있다.

```http
GET /events
GET /events/123
GET /events?date=2026-09-12
GET /events?category=game
```

Frontend는 Backend 내부 코드를 직접 실행하지 않는다.

대신 공개된 API를 통해 요청한다.

```text
Frontend
   │
   │ API
   ▼
Backend
```

이 덕분에 Frontend와 Backend는 서로 독립적으로 개발할 수 있다.

---

# 13. JSON의 역할

Frontend와 Backend가 데이터를 주고받을 때 JSON이 자주 사용된다.

JSON은 데이터를 표현하는 형식이다.

예:

```json
{
  "id": 1,
  "title": "GIST AI Seminar",
  "startAt": "2026-09-12T10:00:00+09:00"
}
```

Frontend에서는 이를 JavaScript 객체처럼 다룰 수 있다.

```ts
const event = {
  id: 1,
  title: "GIST AI Seminar",
  startAt: "2026-09-12T10:00:00+09:00",
};
```

중요한 것은 JSON과 Database Table이 같은 것은 아니라는 점이다.

Database에서는 데이터가 다음과 같이 저장될 수 있다.

```text
events
------------------------------------------------
id | title            | start_at
------------------------------------------------
1  | GIST AI Seminar  | 2026-09-12 10:00:00+09
```

Backend가 이 데이터를 조회하고 JSON 형태로 변환하여 Frontend에 전달한다.

```text
Database Row
    ↓
Backend
    ↓
JSON
    ↓
Frontend
```

---

# 14. Backend가 필요한 이유

Frontend에서 Database에 직접 접근하면 안 될까?

일반적인 웹 서비스에서는 그렇게 하지 않는다.

다음과 같은 문제가 있기 때문이다.

## 14.1 보안

Frontend 코드에서 Database 접속 정보를 가지고 있다면 사용자에게 노출될 수 있다.

```text
DB 주소
DB 사용자명
DB 비밀번호
```

이런 정보는 Backend에서 관리해야 한다.

---

## 14.2 데이터 검증

사용자가 잘못된 데이터를 보낼 수 있다.

예:

```json
{
  "title": "",
  "startAt": "abc"
}
```

Backend는 이런 데이터를 검증해야 한다.

---

## 14.3 비즈니스 로직

단순히 데이터를 저장하는 것 이상의 판단이 필요할 수 있다.

예:

```text
같은 행사가 이미 존재하는가?
등록 기간이 끝났는가?
사용자가 실제 참석 가능한 행사인가?
```

이러한 판단은 Backend가 담당한다.

---

## 14.4 Database 구조 숨기기

Frontend가 Database 구조를 직접 알 필요는 없다.

예를 들어 Database 내부에서는 다음처럼 여러 Table을 사용할 수 있다.

```text
events
tags
event_tags
locations
categories
```

하지만 Frontend에는 하나의 JSON으로 전달할 수 있다.

```json
{
  "id": 1,
  "title": "AI Conference",
  "location": "COEX",
  "tags": ["AI", "Data"]
}
```

Backend가 Database 구조와 Frontend 사이의 중간 계층 역할을 한다.

---

# 15. Project Arco에서 Backend가 담당할 일

Project Arco의 MVP를 기준으로 Backend는 주로 다음 기능을 담당하게 된다.

```text
행사 조회
행사 상세 조회
날짜 필터링
카테고리 필터링
태그 필터링
지역 필터링
온라인 / 오프라인 필터링
Database Query
데이터 Validation
Error Response
```

예를 들어 사용자가 다음 조건을 입력한다.

```text
날짜: 2026-09-12
지역: 서울
분야: AI 또는 Game
참여 방식: Offline
```

Frontend는 이를 Backend에 전달한다.

```text
Frontend
   ↓
Search Conditions
   ↓
Backend
```

Backend는 조건을 SQL Query로 변환한다.

```text
Backend
   ↓
SQL
   ↓
PostgreSQL
```

결과를 다시 Frontend에 반환한다.

```text
PostgreSQL
   ↓
Rows
   ↓
Backend
   ↓
JSON
   ↓
Frontend
```

이것이 Project Arco Backend의 핵심 역할이다.

---

# 16. 전체 흐름 다시 보기

Project Arco 전체 데이터 흐름은 다음과 같다.

```text
행사 데이터 수집
        ↓
Raw Data
        ↓
데이터 정제 / 검증
        ↓
PostgreSQL
        ↓
Express Backend
        ↓
HTTP API
        ↓
Frontend
        ↓
User
```

사용자의 요청 방향으로 보면 다음과 같다.

```text
User
  ↓
Frontend
  ↓
HTTP Request
  ↓
Express Backend
  ↓
SQL Query
  ↓
PostgreSQL
```

응답은 반대로 돌아온다.

```text
PostgreSQL
  ↓
Query Result
  ↓
Express Backend
  ↓
JSON Response
  ↓
Frontend
  ↓
User
```

---

# 17. 핵심 용어 정리

| 용어 | 의미 |
|---|---|
| Client | 요청을 보내는 쪽 |
| Server | 요청을 받아 처리하는 쪽 |
| Frontend | 사용자가 직접 보는 영역 |
| Backend | 요청 처리 및 비즈니스 로직을 담당하는 서버 영역 |
| Database | 데이터를 저장하고 조회하는 시스템 |
| HTTP | Client와 Server가 통신하는 프로토콜 |
| API | 프로그램이 다른 프로그램의 기능을 사용하는 인터페이스 |
| JSON | 데이터를 표현하고 전달하기 위한 형식 |
| Node.js | JavaScript 실행 Runtime |
| Express | Node.js 기반 Web Framework |
| PostgreSQL | 관계형 Database |

---

# 18. 자주 혼동하는 개념

## JavaScript와 Node.js

```text
JavaScript
= 프로그래밍 언어

Node.js
= JavaScript를 브라우저 밖에서 실행할 수 있는 Runtime
```

---

## Node.js와 Express

```text
Node.js
= JavaScript 실행 환경

Express
= Node.js 위에서 HTTP 서버를 만들기 쉽게 해주는 Framework
```

관계는 다음과 같다.

```text
JavaScript
    ↓
Node.js
    ↓
Express
```

---

## Backend와 Database

```text
Backend
= 요청 처리

Database
= 데이터 저장
```

Backend가 Database에 Query를 보내는 구조다.

---

## HTTP와 API

```text
HTTP
= 통신 방식

API
= 기능을 사용할 수 있도록 정한 인터페이스
```

Project Arco에서는 HTTP를 이용해 API를 제공한다.

---

# 19. Project Arco 기준으로 기억할 한 문장

Project Arco의 Backend를 한 문장으로 표현하면 다음과 같다.

> Express Backend는 Frontend의 HTTP 요청을 받아 필요한 PostgreSQL 데이터를 조회하고, 서비스 로직을 적용한 뒤 JSON 형태의 HTTP Response를 반환한다.

더 간단히 줄이면 다음과 같다.

```text
Frontend 요청
    ↓
Express 처리
    ↓
PostgreSQL 조회
    ↓
JSON 응답
```

---

# 20. 확인 문제

## 문제 1

다음 중 Client에 해당할 수 있는 것은 무엇인가?

```text
A. 웹 브라우저
B. 모바일 앱
C. 다른 Backend Server
D. 모두 가능
```

정답:

```text
D
```

Client는 프로그램 종류가 아니라 요청하는 역할을 의미한다.

---

## 문제 2

Project Arco에서 다음 중 Database 역할을 하는 것은 무엇인가?

```text
A. Express
B. Node.js
C. PostgreSQL
D. HTTP
```

정답:

```text
C. PostgreSQL
```

---

## 문제 3

다음 흐름에서 빈칸을 채워보자.

```text
Frontend
   ↓
HTTP Request
   ↓
[        ]
   ↓
SQL
   ↓
PostgreSQL
```

정답:

```text
Express Backend
```

---

## 문제 4

다음 중 Backend의 역할이 아닌 것은 무엇인가?

```text
A. Database 조회
B. 데이터 Validation
C. HTTP Request 처리
D. 사용자의 모니터에 직접 픽셀을 그리기
```

정답:

```text
D
```

사용자 화면 렌더링은 주로 Frontend의 역할이다.

---

# 21. 실습

다음 상황을 Project Arco의 데이터 흐름으로 직접 표현해보자.

> 사용자가 2026년 9월 12일에 열리는 AI 행사를 검색한다.

최소한 다음 요소가 포함되어야 한다.

```text
User
Frontend
HTTP Request
Backend
SQL
PostgreSQL
HTTP Response
```

예시:

```text
User
  ↓
"9월 12일 AI 행사 검색"
  ↓
Frontend
  ↓
GET /events?date=2026-09-12&category=ai
  ↓
Express Backend
  ↓
SQL Query
  ↓
PostgreSQL
  ↓
행사 데이터
  ↓
Express Backend
  ↓
JSON Response
  ↓
Frontend
  ↓
행사 목록 표시
```

---

# 22. 체크리스트

학습 후 다음 항목을 확인한다.

- [ ] Client와 Server의 차이를 설명할 수 있다.
- [ ] Frontend와 Backend의 역할을 구분할 수 있다.
- [ ] Backend와 Database의 차이를 설명할 수 있다.
- [ ] Project Arco에서 Express의 위치를 설명할 수 있다.
- [ ] Project Arco에서 PostgreSQL의 위치를 설명할 수 있다.
- [ ] HTTP가 어느 구간에서 사용되는지 설명할 수 있다.
- [ ] API가 무엇인지 대략 설명할 수 있다.
- [ ] JSON이 어떤 역할을 하는지 설명할 수 있다.
- [ ] `GET /events` 요청이 들어왔을 때의 전체 흐름을 설명할 수 있다.

---

# 23. 다음 학습

다음 문서에서는 Client와 Server가 실제로 데이터를 주고받을 때 사용하는 HTTP를 조금 더 자세히 살펴본다.

```text
현재
01-web-backend-basics.md

        ↓

다음
02-http-request-response.md
```

다음 핵심 질문은 이것이다.

> `GET /events`라는 요청은 실제로 어떤 정보로 구성되어 있으며, Server는 어떤 형태로 응답하는가?