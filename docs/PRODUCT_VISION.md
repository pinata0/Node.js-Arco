# Product Vision

## 1. 문서 목적

이 문서는 행사 추천 서비스가 장기적으로 어떤 제품이 되는 것을 목표로 하는지 기록한다.

현재 개발하는 MVP의 기능 범위를 정의하는 문서가 아니라,

> **최종적으로 어떤 문제를 해결하고 어떤 사용자 경험을 제공하고 싶은가**

를 보존하는 것을 목적으로 한다.

따라서 이 문서에 포함된 기능이 모두 현재 개발 범위에 포함되는 것은 아니다.

현재 구현 범위는 별도의 `MVP_PRD.md`에서 정의한다.

---

# 2. 제품 한 줄 정의

> **사용자가 비는 날짜와 관심 분야를 입력하면, 여러 곳에 흩어진 행사 정보를 수집·정리하여 실제 참석할 수 있는 행사를 추천하는 서비스**

핵심은 단순한 행사 목록 제공이 아니라,

```text
날짜
+
관심 분야
+
참석 가능 여부
```

를 기준으로 사용자에게 적합한 행사를 찾아주는 것이다.

---

# 3. 해결하려는 문제

세미나, 컨퍼런스, 밋업, 해커톤과 같은 행사는 다양한 사이트에 흩어져 있다.

사용자는 일반적으로 다음과 같은 곳을 직접 확인해야 한다.

- 행사 플랫폼
- 기업 홈페이지
- 개발자 커뮤니티
- 대학 홈페이지
- 협회
- 공공기관
- 기술 블로그
- 행사 공식 홈페이지

이 구조에서는 사용자가 좋은 행사를 발견하기 위해 상당한 탐색 비용을 지불해야 한다.

---

# 4. 기존 행사 탐색 방식의 문제

## 4.1 정보가 여러 곳에 분산되어 있다

행사 플랫폼 하나만 확인하면 다른 플랫폼이나 공식 홈페이지에 등록된 행사를 놓칠 수 있다.

---

## 4.2 날짜 중심 탐색이 어렵다

사용자가 실제로 궁금한 것은 종종 다음과 같다.

> “이번 주 토요일에 시간이 비는데 갈 만한 행사가 있을까?”

하지만 기존 서비스는 보통

```text
행사 발견
↓
행사 상세 확인
↓
날짜 확인
```

순서로 탐색하도록 되어 있다.

이 서비스는 이를 반대로 만든다.

```text
날짜 입력
↓
그날 참석할 수 있는 행사 발견
```

---

## 4.3 같은 관심 분야가 여러 표현으로 나타난다

사용자가 `AI`에 관심 있다고 하더라도 행사에서는 다음과 같이 표현될 수 있다.

```text
LLM
Generative AI
AI Agent
Machine Learning
Computer Vision
LangChain
NLP
```

단순 키워드 검색만으로는 관련 행사를 충분히 찾기 어렵다.

---

## 4.4 실제 참석할 수 없는 행사도 많다

좋은 행사라고 하더라도 다음 조건에 해당하면 사용자에게 의미가 없다.

- 신청이 이미 종료됨
- 매진됨
- 행사 날짜가 맞지 않음
- 너무 먼 지역에서 개최됨
- 행사 취소
- 온라인/오프라인 조건이 맞지 않음

따라서 행사의 존재 여부뿐 아니라 **참석 가능 여부**도 함께 판단해야 한다.

---

# 5. 핵심 사용자 경험

서비스가 제공하고 싶은 경험은 다음과 같다.

```text
사용자:

9월 12일 시간이 비어 있음
AI와 게임개발에 관심 있음
전국 이동 가능

↓

서비스:

해당 날짜에 참석 가능한 행사 탐색

↓

관련도 높은 순서로 추천

↓

추천 이유 제공

↓

행사 상세 확인

↓

공식 페이지에서 신청
```

사용자가 여러 사이트를 직접 돌아다닐 필요가 없어야 한다.

---

# 6. 핵심 가치

서비스가 제공하는 핵심 가치는 다음 세 가지다.

## 6.1 날짜 우선 탐색

> **“언제 시간이 비는가?”**

에서 검색을 시작한다.

---

## 6.2 관심 분야 기반 추천

사용자가 관심 있는 분야와 행사의 의미적 관련성을 판단한다.

---

## 6.3 실제 참석 가능성

다음 요소를 함께 고려한다.

```text
개최 날짜
신청 마감
모집 상태
지역
온라인 여부
```

단순히 관련된 행사가 아니라 **실제로 갈 수 있는 행사**를 보여준다.

---

# 7. 대상 사용자

초기 핵심 사용자는 다음과 같다.

## 대학생

- 새로운 분야를 탐색하고 싶음
- 세미나나 해커톤 경험을 쌓고 싶음
- 좋은 행사를 어디서 찾을지 모르는 경우가 많음

## 주니어 개발자

- 기술 세미나와 개발자 밋업에 관심이 있음
- 새로운 기술 트렌드를 접하고 싶음
- 커뮤니티와 네트워킹 기회를 찾고 싶음

## 기술 분야 취업 준비생

- 컨퍼런스
- 채용 연계 행사
- 기술 발표
- 커뮤니티 행사

등에 관심이 있음.

---

# 8. 대표 사용자 질문

서비스는 장기적으로 다음과 같은 질문에 답할 수 있어야 한다.

> “이번 주 토요일 서울에서 AI 관련 행사 없나?”

> “9월 12일에 전국에서 갈 만한 게임개발 행사를 찾아줘.”

> “이번 달 안에 참가할 수 있는 백엔드 세미나를 추천해줘.”

> “주말에 갈 만한 무료 개발자 행사만 보여줘.”

> “내 관심 분야에 맞는 새 행사가 생기면 알려줘.”

---

# 9. 행사 범위

장기적으로 다음 유형의 행사를 다룬다.

- 세미나
- 컨퍼런스
- 밋업
- 해커톤
- 워크숍
- 기술 발표회
- 개발자 행사
- 전시
- 박람회

추후 확장 대상으로 다음을 고려할 수 있다.

- 공모전
- 채용 행사
- 커리어 행사
- 단기 교육 프로그램

---

# 10. 관심 분야 구조

관심 분야는 계층 구조로 관리한다.

예:

```text
Development
├── Frontend
├── Backend
├── Mobile
├── DevOps
├── Cloud
└── Open Source

AI
├── Generative AI
├── LLM
├── Machine Learning
├── Computer Vision
├── NLP
├── AI Agent
└── Robotics

Game
├── Game Development
├── Indie Game
├── Unity
├── Unreal Engine
└── Game Design

Data
├── Data Science
├── Data Engineering
└── Database

Security
├── Cyber Security
└── Web Security

Design
├── UI/UX
└── Product Design

Business
├── Startup
├── Entrepreneurship
└── Career
```

하나의 행사는 여러 관심 분야에 속할 수 있다.

---

# 11. 검색 경험의 발전 방향

## 11.1 기본 조건 검색

사용자가 다음 조건을 선택한다.

```text
날짜
관심 분야
지역
행사 유형
```

---

## 11.2 자연어 검색

장기적으로 다음과 같은 입력도 지원한다.

> “이번 주말 서울에서 AI 관련해서 갈 만한 무료 행사 찾아줘.”

서비스 내부에서는 이를 다음과 같이 변환한다.

```text
date = this weekend
region = Seoul
category = AI
price = free
```

---

## 11.3 Semantic Search

사용자 관심사와 행사 설명을 단순 문자열이 아니라 의미적으로 비교한다.

예:

```text
사용자 관심:

AI Agent

행사 설명:

LLM 기반 autonomous workflow 구축 세미나
```

단어가 정확히 일치하지 않아도 관련 행사로 판단할 수 있어야 한다.

---

# 12. 추천 시스템의 발전 방향

초기에는 Rule-based Ranking을 사용한다.

```text
관심 분야 일치도
+
날짜 적합도
+
지역
+
신청 가능 여부
```

장기적으로 다음 데이터를 이용할 수 있다.

- 사용자가 선택한 관심 분야
- 클릭한 행사
- 저장한 행사
- 신청 페이지 이동 여부
- 선호 지역
- 선호 행사 유형

이를 이용해 개인화 추천으로 발전시킬 수 있다.

---

# 13. 데이터 수집 전략

이 서비스에서 가장 중요한 기술적 기반은 행사 데이터 수집이다.

행사 정보는 다음 방식으로 확보한다.

```text
API / RSS

Known Source Crawling

Search Discovery
```

---

# 14. Known Source 기반 수집

지속적으로 행사 정보를 제공하는 사이트를 `Source`로 관리한다.

예:

```text
행사 플랫폼
기업 기술 행사 페이지
대학 행사 페이지
공공기관
개발자 커뮤니티
```

각 Source에는 전용 Collector를 둘 수 있다.

```text
Source
↓
Collector
↓
행사 페이지
```

Scheduler가 일정 주기로 Source를 다시 확인한다.

---

# 15. Search Discovery

검색 엔진이나 AI Web Search는 메인 데이터 수집 방법으로 사용하지 않는다.

검색의 주요 목적은

> **아직 시스템이 알지 못하는 새로운 행사나 Source를 발견하는 것**

이다.

예:

```text
"AI 세미나" 2026 9월

"게임 개발 행사" 2026

"해커톤" 2026
```

검색 결과 중 새로운 URL을 발견하면 `Candidate URL`로 등록한다.

```text
Search
↓
Candidate URL
↓
검증
↓
일반 수집 파이프라인
```

---

# 16. AI의 역할

AI가 직접 인터넷 전체를 검색하고 행사 정보를 DB에 저장하도록 하지 않는다.

피하고 싶은 구조:

```text
Scheduler
↓
AI에게 행사 검색 요청
↓
행사 목록 생성
↓
DB 저장
```

AI 검색 결과는 매번 달라질 수 있기 때문에

- 누락 여부
- 행사 삭제 여부
- 변경 여부
- 출처
- 최신성

을 안정적으로 관리하기 어렵다.

따라서 AI는 **Crawler가 아니라 Extractor / Normalizer 역할**을 담당한다.

---

# 17. Local LLM 활용

행사 페이지를 정형 데이터로 변환하는 과정에서 Local LLM을 사용할 수 있다.

예:

```text
행사 페이지 본문
↓
Local LLM
↓
Structured Event
```

모델 후보:

```text
Qwen 계열 모델
```

실행 구조:

```text
Hugging Face
↓
Qwen Model
↓
Ollama / llama.cpp
↓
Local Model Server
↓
Node.js Backend
```

---

# 18. AI Extraction의 역할

AI는 다음과 같은 정보를 추출한다.

```text
title

start_at

end_at

registration_deadline

venue

region

organizer

categories

event_type

registration_status
```

예:

```text
제7회 AI 개발자 모임

9월 19일 오후 2시
판교 XX타워

생성형 AI와 AI Agent를 주제로 진행된다.

사전 등록은 9월 16일까지다.
```

↓

```json
{
  "title": "제7회 AI 개발자 모임",
  "startAt": "2026-09-19T14:00:00+09:00",
  "registrationDeadline": "2026-09-16",
  "venue": "판교 XX타워",
  "categories": [
    "AI",
    "Generative AI",
    "AI Agent"
  ]
}
```

---

# 19. Parser 우선 전략

모든 페이지를 AI로 처리하지 않는다.

다음 순서를 따른다.

```text
Page
↓
JSON-LD 존재?
↓
YES
→ Structured Parser

NO
↓
Source 전용 Parser 가능?
↓
YES
→ Source Parser

NO
↓
Local LLM
```

즉,

```text
JSON-LD
→ Source Parser
→ Local LLM
```

순서로 처리한다.

---

# 20. Structured Output

AI의 자연어 응답은 필요하지 않다.

모델은 지정된 Event Schema를 반환해야 한다.

```text
Local LLM
↓
JSON Schema
↓
Structured JSON
↓
Validation
```

TypeScript에서는 Zod와 같은 Schema Validator를 사용할 수 있다.

---

# 21. 데이터 검증

AI 또는 Parser가 생성한 결과를 바로 DB에 저장하지 않는다.

```text
Extraction
↓
Schema Validation
↓
Business Validation
↓
Deduplication
↓
Database
```

검증 예:

```text
start_at은 유효한 날짜인가?

end_at >= start_at 인가?

행사명이 존재하는가?

Category가 허용된 값인가?

원문 Source URL이 존재하는가?
```

---

# 22. 데이터 근거 보존

AI가 추출한 값은 가능하면 원문 근거와 함께 저장한다.

예:

```json
{
  "startAt": {
    "value": "2026-09-19T14:00:00+09:00",
    "evidence": "행사는 9월 19일 오후 2시에 진행됩니다."
  }
}
```

이를 통해

```text
AI 추출 값
↕
원문 근거
```

를 비교할 수 있다.

이는 디버깅과 데이터 검증에 활용한다.

---

# 23. 데이터 변경 감지

같은 페이지를 매번 다시 처리할 필요는 없다.

페이지 내용을 Hash로 관리한다.

```text
URL
+
content_hash
+
fetched_at
```

다음 수집에서

```text
previous_hash == current_hash
```

라면 변경되지 않은 것으로 판단한다.

```text
변경 없음
↓
Parser 재실행 X
↓
LLM 호출 X
↓
DB Update X
```

---

# 24. 중복 제거

같은 행사가 여러 Source에 등록될 수 있다.

예:

```text
공식 홈페이지

행사 플랫폼

개발자 커뮤니티
```

이를 서로 다른 세 개의 Event로 저장하면 안 된다.

초기 Deduplication 기준:

```text
normalized_title
+
start_at
+
organizer
+
location
```

중복으로 판단된 경우 하나의 Event에 여러 Source를 연결한다.

```text
Event
├── Official Source
├── Event Platform
└── Community
```

---

# 25. 데이터 신뢰성

사용자가 행사 정보의 신뢰도를 판단할 수 있어야 한다.

예:

```text
출처: 공식 행사 페이지

마지막 확인:
2026.09.07

현재 모집 상태:
OPEN
```

서비스 내부에서도 다음 정보를 유지한다.

```text
primary_source

last_verified_at

fetched_at

content_hash

registration_status
```

---

# 26. 최종 데이터 파이프라인

장기적으로 목표하는 데이터 파이프라인은 다음과 같다.

```text
                        Scheduler
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
       API/RSS        Known Source       Search Discovery
                       Crawling
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                      Candidate Page
                            ▼
                       Fetch Page
                            ▼
                     Change Detection
                            ▼
                      Content Cleanup
                            ▼
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          JSON-LD      Source Parser    Local LLM
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                     Structured Event
                            ▼
                        Validation
                            ▼
                      Deduplication
                            ▼
                       PostgreSQL
                            ▼
                 Search / Recommendation
                            ▼
                         Frontend
```

---

# 27. 사용자 기능의 장기 확장

## 관심 분야 저장

사용자가 자신의 관심 분야를 계정에 저장한다.

```text
User
↓
UserInterest
↓
Category
```

---

## 북마크

관심 있는 행사를 저장한다.

```text
User
↕
SavedEvent
↕
Event
```

---

## 개인화 추천

과거 행동을 이용해 추천 결과를 조정한다.

---

## 캘린더 연동

선택한 행사를 Google Calendar 등에 추가한다.

---

## 행사 알림

예:

> “다음 주 게임개발 행사 3개가 새로 등록됐습니다.”

---

## 신규 행사 알림

사용자가 관심 분야를 등록하면 새 행사가 수집될 때 자동으로 알려준다.

---

# 28. 추천 설명 가능성

추천 결과에는 가능하면 추천 이유를 함께 보여준다.

예:

```text
추천 이유

✓ 관심 분야 "AI"와 관련
✓ "게임개발" 태그 포함
✓ 선택한 날짜에 개최
✓ 현재 신청 가능
✓ 선택 지역 내 행사
```

추천 결과가 왜 나타났는지 사용자가 이해할 수 있도록 한다.

---

# 29. 장기적인 서비스 화면

최종 서비스는 크게 다음 화면으로 구성될 수 있다.

```text
Home

Search Results

Event Detail

Saved Events

Interest Settings

Calendar

Notifications
```

초기에는 이 중 일부만 구현한다.

---

# 30. 기술적 방향

서비스는 장기적으로 다음 영역을 다룬다.

```text
Frontend

Backend

Relational Database

Crawler

Scheduler

Data Pipeline

Local LLM Serving

Semantic Search

Recommendation
```

핵심은 모든 기능을 한 번에 구현하는 것이 아니라 점진적으로 확장하는 것이다.

---

# 31. 프로젝트의 핵심 도메인

## 사용자 기능

```text
Event

Interest

Recommendation
```

## 데이터 수집

```text
Source

Collection

Extraction

Normalization

Validation
```

## 세부 구조

```text
Event
├── Schedule
├── Location
├── Registration
├── Category
└── Source

Collection
├── Source
├── Collector
├── RawPage
├── Scheduler
└── ChangeDetection

Extraction
├── JsonLdParser
├── SourceParser
└── LocalLLM

Recommendation
├── Query
├── Filter
├── Matching
└── Ranking
```

---

# 32. 제품 성공의 핵심 조건

서비스의 가장 중요한 성공 조건은 추천 알고리즘의 복잡성이 아니다.

먼저 다음 질문에 YES라고 답할 수 있어야 한다.

> **사용자가 원하는 날짜에 실제로 참석 가능한 행사를 충분히 제공할 수 있는가?**

이를 위해 가장 중요한 것은

```text
Data Coverage

Freshness

Accuracy

Deduplication

Search Quality
```

이다.

---

# 33. 제품의 핵심 위험 요소

## 1. 행사 데이터 부족

좋은 행사가 충분히 수집되지 않는다면 추천 서비스의 가치가 낮아진다.

---

## 2. 오래된 행사 정보

이미 마감되거나 취소된 행사를 추천하면 서비스 신뢰도가 떨어진다.

---

## 3. Source 변경

사이트 구조가 변경되면 Collector나 Parser가 작동하지 않을 수 있다.

---

## 4. 중복 행사

동일 행사가 여러 번 노출되면 사용자 경험이 나빠진다.

---

## 5. AI Hallucination

Local LLM이 원문에 없는 정보를 생성할 가능성이 있다.

따라서 AI 결과에는 반드시 검증 과정이 필요하다.

---

# 34. 단계적 발전 방향

제품은 다음 순서로 발전시키는 것을 목표로 한다.

```text
1. 수동 Event DB

↓

2. 조건 검색

↓

3. Rule-based 추천

↓

4. 외부 Source 수집

↓

5. Scheduler

↓

6. 여러 Source 통합

↓

7. Local LLM Extraction

↓

8. Deduplication

↓

9. Search Discovery

↓

10. Semantic Search

↓

11. 사용자 계정

↓

12. 개인화 추천

↓

13. 알림 / 캘린더
```

각 단계가 이전 단계 없이도 독립적으로 동작하도록 설계한다.

---

# 35. 이 프로젝트에서 AI의 위치

AI는 제품의 중심 기능이 아니다.

제품의 중심은

> **신뢰할 수 있는 행사 데이터를 확보하고 사용자가 원하는 행사와 연결하는 것**

이다.

AI는 이를 지원하는 도구로 사용한다.

```text
Crawler
≠ AI

Search Engine
≠ AI

AI
=
Extraction
+
Normalization
+
Semantic Matching
```

필요한 곳에서만 사용한다.

---

# 36. 최종 제품 비전

최종적으로 사용자가 여러 행사 플랫폼과 커뮤니티를 직접 탐색하지 않아도 되는 서비스를 목표로 한다.

사용자는 단순히

> “언제 시간이 비는지”

와

> “무엇에 관심 있는지”

만 알려주면 된다.

서비스는 뒤에서

```text
행사 발견

↓

수집

↓

정보 정리

↓

최신 상태 확인

↓

중복 제거

↓

관심사 Matching

↓

추천

↓

참석 가능한 행사 제시
```

과정을 처리한다.

최종적으로 만들고 싶은 것은 단순한 행사 검색 엔진이 아니라,

> **사용자의 빈 시간과 관심사를 실제 경험으로 연결해주는 행사 발견 서비스**

이다.