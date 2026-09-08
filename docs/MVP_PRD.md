# MVP PRD

## 1. 문서 목적

이 문서는 행사 추천 서비스의 **첫 번째 동작 가능한 버전(MVP)** 에서 구현할 기능과 완료 기준을 정의한다.

장기적으로 구현하고 싶은 기능과 기술적 확장 아이디어는 `PRODUCT_VISION.md`에서 관리한다.

이 문서에서는 다음 질문에만 답한다.

> **이번 버전에서 무엇을 구현하면 MVP가 완성된 것으로 볼 것인가?**

---

# 2. MVP 한 줄 정의

> **사용자가 날짜와 관심 분야를 입력하면, DB에 저장된 행사 중 실제 참석 가능한 행사를 관련도 순으로 보여주는 웹서비스**

---

# 3. MVP의 핵심 목표

사용자가 여러 행사 플랫폼을 직접 탐색하지 않고도 다음 흐름을 사용할 수 있게 한다.

```text
날짜 선택

↓

관심 분야 선택

↓

지역 / 행사 유형 선택

↓

검색

↓

관련 행사 목록 확인

↓

행사 상세 확인

↓

공식 신청 페이지 이동
```

MVP에서는 추천 알고리즘의 복잡성보다

> **검색부터 실제 행사 신청 페이지 이동까지의 전체 흐름이 정상적으로 동작하는 것**

을 우선한다.

---

# 4. 대상 사용자

## Primary User

개발, AI, 게임, 데이터, 디자인 등의 분야에 관심 있는

- 대학생
- 주니어 개발자
- 취업 준비생

을 주요 사용자로 가정한다.

### 대표 상황

> “이번 주 토요일에 AI 관련 행사 없나?”

> “9월 12일에 서울에서 갈 만한 개발자 행사를 찾고 싶다.”

> “게임개발 관련 세미나나 밋업이 있는지 알고 싶다.”

---

# 5. MVP에서 해결할 문제

## 5.1 날짜 중심 행사 탐색

사용자가 특정 날짜를 기준으로 행사를 찾을 수 있어야 한다.

## 5.2 관심 분야 기준 필터링

사용자가 선택한 관심 분야와 관련된 행사만 우선적으로 보여준다.

## 5.3 실제 참석 가능 여부 확인

다음과 같은 행사는 기본 검색 결과에서 제외한다.

```text
모집 종료

매진

행사 취소

검색 날짜와 무관한 행사
```

## 5.4 공식 행사 페이지 연결

사용자는 서비스 안에서 모든 신청 과정을 처리하는 것이 아니라, 행사 상세 정보를 확인한 뒤 공식 페이지로 이동한다.

---

# 6. MVP 사용자 입력

검색 조건은 네 가지로 제한한다.

## 6.1 날짜

필수 입력.

예:

```text
2026-09-12
```

## 6.2 관심 분야

필수 입력.

복수 선택 가능.

예:

```text
AI
Backend
Game Development
Indie Game
Data
Security
Design
Startup
```

## 6.3 지역

선택 입력.

예:

```text
전국
서울
수도권
광주
온라인
```

기본값:

```text
전국
```

## 6.4 행사 유형

선택 입력.

```text
전체
세미나
컨퍼런스
밋업
해커톤
워크숍
전시/박람회
```

기본값:

```text
전체
```

---

# 7. MVP 핵심 화면

MVP에서는 세 개의 페이지를 구현한다.

```text
/

/events

/events/:id
```

---

# 8. 메인 검색 화면

경로:

```text
/
```

역할:

> 사용자가 행사 검색 조건을 입력하는 페이지

예:

```text
----------------------------------

언제 시간이 비나요?

[ 2026. 09. 12 ]

어떤 것에 관심 있나요?

[AI] [Backend] [게임개발]
[인디게임] [데이터] [보안]

어디까지 갈 수 있나요?

[전국 ▼]

어떤 행사를 찾나요?

[전체 ▼]


      [행사 찾아보기]

----------------------------------
```

---

# 9. 검색 결과 화면

경로:

```text
/events
```

검색 조건 예:

```text
/events?date=2026-09-12&categories=ai,game&region=all
```

결과 화면에서는 다음 정보를 보여준다.

```text
행사명

날짜 / 시간

지역

행사 유형

관심 분야 태그

참가비

현재 모집 상태

추천 점수 또는 추천 이유
```

예:

```text
AI Game Developer Meetup

AI · 게임개발

2026.09.12
14:00 - 18:00

서울

무료

현재 신청 가능

관심 분야 "AI", "게임개발"과 일치

[자세히 보기]
```

---

# 10. 행사 상세 화면

경로:

```text
/events/:id
```

표시 정보:

- 행사명
- 행사 설명
- 행사 날짜
- 시작 시간
- 종료 시간
- 장소
- 지역
- 온라인 여부
- 행사 유형
- 관심 분야
- 참가비
- 주최자
- 신청 마감일
- 모집 상태
- 공식 신청 링크
- 데이터 출처

사용자는 여기에서 공식 행사 페이지로 이동한다.

---

# 11. 관심 분야 구조

MVP에서는 지나치게 많은 태그를 만들지 않는다.

초기 Category는 다음 수준으로 제한한다.

```text
Development
├── Frontend
├── Backend
└── DevOps

AI
├── Generative AI
├── LLM
└── Machine Learning

Game
├── Game Development
├── Indie Game
├── Unity
└── Unreal Engine

Data
├── Data Science
└── Database

Security

Design

Startup
```

필요한 경우 개발하면서 카테고리를 추가한다.

---

# 12. 추천 방식

MVP에서는 머신러닝 또는 생성형 AI 추천을 사용하지 않는다.

Rule-based Ranking을 사용한다.

예:

```text
추천 점수

=

관심 분야 일치
+
지역 일치
+
모집 가능 상태
```

예시 점수:

```text
관심 분야 정확 일치
+40

관련 하위 카테고리 일치
+20

선호 지역 일치
+10

현재 신청 가능
+10
```

날짜는 추천 점수를 높이는 요소가 아니라 **검색 필터 조건**으로 사용한다.

즉 날짜가 맞지 않는 행사는 먼저 제외한다.

---

# 13. 추천 이유

추천 결과에는 간단한 추천 이유를 표시한다.

예:

```text
✓ 관심 분야 "AI"와 일치
✓ 게임개발 관련 행사
✓ 선택한 날짜에 개최
✓ 현재 신청 가능
```

백엔드는 다음과 같이 Reason Code를 반환할 수 있다.

```json
{
  "reasons": [
    "INTEREST_MATCH",
    "RELATED_CATEGORY",
    "REGISTRATION_AVAILABLE"
  ]
}
```

프론트엔드에서 사용자에게 보여줄 문장으로 변환한다.

생성형 AI는 사용하지 않는다.

---

# 14. 날짜 정책

최소한 다음 세 값을 구분한다.

```text
start_at

end_at

registration_deadline
```

검색 조건:

```text
start_at <= 검색 날짜 <= end_at
```

하루짜리 행사라면 일반적으로

```text
행사 날짜 == 검색 날짜
```

가 된다.

---

# 15. 모집 상태

MVP에서는 다음 상태를 사용한다.

```text
OPEN

CLOSED

SOLD_OUT

CANCELED

UNKNOWN
```

기본 검색 결과에 포함:

```text
OPEN
UNKNOWN
```

기본 검색 결과에서 제외:

```text
CLOSED
SOLD_OUT
CANCELED
```

---

# 16. 핵심 데이터 모델

MVP에서는 다음 테이블을 우선 구현한다.

```text
events

categories

event_categories

sources
```

---

# 17. Event

```text
events
```

| 컬럼 | 설명 |
|---|---|
| id | PK |
| title | 행사명 |
| description | 행사 설명 |
| start_at | 행사 시작 |
| end_at | 행사 종료 |
| registration_deadline | 신청 마감 |
| location_name | 장소 |
| region | 지역 |
| event_type | 행사 유형 |
| is_online | 온라인 여부 |
| price | 참가비 |
| organizer | 주최 |
| registration_url | 공식 신청 URL |
| source_id | 데이터 출처 |
| status | 모집 상태 |
| created_at | 생성일 |
| updated_at | 수정일 |

---

# 18. Category

```text
categories
```

| 컬럼 | 설명 |
|---|---|
| id | PK |
| name | 카테고리명 |
| parent_id | 상위 카테고리 |

예:

```text
AI

├── Generative AI

└── LLM
```

---

# 19. EventCategory

Event와 Category는 N:M 관계를 가진다.

```text
event_categories
```

| 컬럼 | 설명 |
|---|---|
| event_id | Event FK |
| category_id | Category FK |

예:

```text
AI Developer Meetup

↓

AI
Generative AI
Backend
```

---

# 20. Source

행사 정보가 어디에서 왔는지 기록한다.

```text
sources
```

| 컬럼 | 설명 |
|---|---|
| id | PK |
| name | 출처명 |
| base_url | 사이트 주소 |
| source_type | MANUAL / CRAWL |
| last_crawled_at | 마지막 수집 시각 |

MVP에서는 복잡한 Source 관리 시스템을 만들지 않는다.

---

# 21. API

## 21.1 행사 검색

```http
GET /api/events
```

예:

```text
/api/events
?date=2026-09-12
&categories=ai,game
&region=SEOUL
&type=SEMINAR
```

---

## 21.2 행사 검색 Response

예:

```json
{
  "count": 3,
  "events": [
    {
      "id": 101,
      "title": "AI Game Developer Meetup",
      "startAt": "2026-09-12T14:00:00+09:00",
      "endAt": "2026-09-12T18:00:00+09:00",
      "region": "SEOUL",
      "categories": [
        "AI",
        "Game Development"
      ],
      "status": "OPEN",
      "score": 90,
      "reasons": [
        "INTEREST_MATCH",
        "REGISTRATION_AVAILABLE"
      ]
    }
  ]
}
```

---

## 21.3 행사 상세

```http
GET /api/events/:id
```

---

## 21.4 카테고리 목록

```http
GET /api/categories
```

---

# 22. 초기 데이터

처음부터 크롤러 개발을 시작하지 않는다.

먼저 수동으로 샘플 행사 데이터를 준비한다.

목표:

```text
30~50개 Event
```

샘플 데이터로 먼저 다음 기능을 완성한다.

```text
DB

↓

API

↓

검색

↓

추천

↓

Frontend
```

---

# 23. 외부 데이터 수집

기본 검색 기능이 완성된 이후 실제 외부 Source를 **1곳만** 연결한다.

흐름:

```text
외부 행사 사이트

↓

Collector

↓

Parser

↓

Event Schema

↓

PostgreSQL
```

Collector는 해당 사이트에서 행사 데이터를 가져오는 역할을 한다.

MVP에서는 여러 사이트를 동시에 지원하지 않는다.

---

# 24. Scheduler

외부 Source 수집이 정상적으로 동작한 이후 간단한 Scheduler를 추가한다.

예:

```text
하루 1회
```

또는

```text
12시간마다 1회
```

동작:

```text
Scheduler

↓

Collector 실행

↓

새 행사 저장

↓

기존 행사 갱신
```

MVP에서는 복잡한 Job Queue를 사용하지 않는다.

필요하다면 `node-cron` 정도로 구현한다.

---

# 25. Local LLM

Local Qwen 기반 데이터 추출은 **MVP 필수 기능이 아니다.**

다음 단계에서 검토한다.

```text
Parser로 처리하기 어려운 Source 추가

↓

Local LLM Extraction 도입
```

따라서 MVP 완료를 위해 다음 기능은 필요하지 않다.

```text
Ollama

Qwen

Structured AI Extraction

Cloud AI Fallback
```

---

# 26. 중복 제거

MVP에서는 여러 Source를 사용하지 않으므로 복잡한 Deduplication 시스템을 구현하지 않는다.

동일 Source 내부에서

```text
source URL
```

또는

```text
title + start_at
```

정도로 중복 삽입만 방지한다.

다중 Source Deduplication은 이후 버전에서 구현한다.

---

# 27. MVP에서 하지 않을 것

다음 기능은 이번 버전의 완료 조건에 포함하지 않는다.

- 회원가입
- 로그인
- 개인화 추천
- 사용자 행동 기반 추천
- 북마크
- 알림
- 캘린더 연동
- 자연어 검색
- Semantic Search
- Embedding
- 생성형 AI 추천
- Local Qwen
- AI Extraction
- 여러 Source 통합
- Search Discovery
- Google 검색 기반 행사 발견
- 복잡한 Deduplication
- Hash 기반 변경 감지
- Redis
- BullMQ
- 모바일 앱
- 커뮤니티
- 리뷰
- 행사 직접 등록
- 티켓 결제

---

# 28. 개발 순서

## Phase 1 — Database

구현:

```text
Event

Category

EventCategory

Source
```

샘플 데이터 30~50개를 입력한다.

---

## Phase 2 — Search API

구현:

```text
날짜 필터

관심 분야 필터

지역 필터

행사 유형 필터

모집 상태 필터
```

---

## Phase 3 — Ranking

Rule-based 추천 점수를 구현한다.

```text
Interest Match

Region Match

Registration Status
```

---

## Phase 4 — Frontend

구현:

```text
검색 화면

검색 결과 화면

행사 상세 화면
```

---

## Phase 5 — End-to-End 연결

```text
Frontend

↓

API

↓

PostgreSQL
```

전체 검색 흐름을 완성한다.

---

## Phase 6 — 외부 Source 1개

Collector를 작성해 실제 행사 데이터를 가져온다.

```text
Source

↓

Collector

↓

Parser

↓

Database
```

---

## Phase 7 — Scheduler

Collector를 일정 주기로 실행한다.

```text
Scheduler

↓

Collector

↓

Database Update
```

---

# 29. MVP 완료 조건

다음 시나리오가 정상적으로 동작하면 MVP를 완료한 것으로 판단한다.

```text
1. 사용자가 웹사이트 접속

2. 날짜 선택

3. 관심 분야 선택

4. 지역 선택

5. 검색

6. 조건에 맞는 행사 조회

7. 관련도 순으로 결과 표시

8. 행사 상세 페이지 이동

9. 행사 정보 확인

10. 공식 신청 페이지 이동
```

그리고 데이터 측면에서는 다음 조건을 만족해야 한다.

```text
PostgreSQL에 Event 저장

Event ↔ Category N:M 관계 동작

외부 Source 최소 1곳 연결

Scheduler를 통해 데이터 자동 갱신
```

---

# 30. MVP 성공 기준

MVP 단계에서 가장 중요한 질문은 다음이다.

> **사용자가 원하는 날짜와 관심 분야를 입력했을 때 실제로 유용한 행사 결과를 얻을 수 있는가?**

따라서 초기 성공 여부는 다음을 중심으로 판단한다.

```text
검색이 정상적으로 동작하는가?

검색 결과가 조건과 일치하는가?

행사 정보가 실제 행사와 일치하는가?

모집 종료 행사가 잘 제외되는가?

공식 신청 페이지까지 이동할 수 있는가?

외부 행사 데이터가 자동으로 갱신되는가?
```

---

# 31. MVP 최종 구조

```text
                 Frontend
                    │
                    ▼
              Node.js Backend
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
      Search API          Ranking
          │                   │
          └─────────┬─────────┘
                    ▼
                PostgreSQL
                    ▲
                    │
                 Parser
                    ▲
                    │
                Collector
                    ▲
                    │
            External Source
                    ▲
                    │
                Scheduler
```

---

# 32. MVP 최종 정의

이번 버전에서 만들 것은 다음 한 문장으로 정의한다.

> **날짜와 관심 분야를 입력하면 관련 행사를 검색·추천하고, 실제 외부 행사 사이트 한 곳의 데이터가 주기적으로 갱신되는 웹서비스**

여기까지 구현되면 MVP를 완료한다.

그 이후 기능은 `PRODUCT_VISION.md`를 기준으로 별도 버전에서 확장한다.