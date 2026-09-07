# Technical Decisions

## 1. 문서 목적

이 문서는 행사 추천 서비스 개발 과정에서 내린 주요 기술적 결정과 그 이유를 기록한다.

`PRODUCT_VISION.md`가 장기적인 제품 방향을 설명하고, `MVP_PRD.md`가 현재 구현할 범위를 정의한다면, 이 문서는 다음 질문에 답한다.

> **왜 이 구조를 선택했는가?**

기술 선택이 변경되더라도 당시 판단 근거를 남겨 이후 설계를 다시 검토할 수 있도록 한다.

---

# 2. 전체 기술 방향

서비스는 다음 구조를 기본 방향으로 한다.

```text
Frontend
↓
Backend API
↓
PostgreSQL
```

행사 데이터 수집은 별도 파이프라인으로 분리한다.

```text
External Source
↓
Collector
↓
Parser / Normalizer
↓
Validation
↓
Database
```

장기적으로는 다음 구조까지 확장한다.

```text
API / RSS
Known Source Crawling
Search Discovery
        ↓
     Raw Page
        ↓
JSON-LD Parser
        ↓
Source Parser
        ↓
Local LLM Fallback
        ↓
Validation
        ↓
Deduplication
        ↓
PostgreSQL
```

---

# 3. JavaScript / TypeScript 기반으로 구현한다

## Decision

프론트엔드와 백엔드를 모두 JavaScript 생태계로 구성한다.

가능하면 TypeScript를 사용한다.

예:

```text
Frontend
→ React + TypeScript

Backend
→ Node.js + TypeScript
```

## Reason

이 프로젝트의 주요 학습 목표 중 하나가 JavaScript와 Backend 개발 경험을 쌓는 것이기 때문이다.

프론트엔드와 백엔드를 동일 언어로 구성하면 다음 장점이 있다.

- 언어 전환 비용 감소
- 타입 공유 가능
- API Schema 관리 용이
- 프로젝트 전체 구조 이해가 쉬움

또한 이후 AI 서버를 별도로 구성하더라도 메인 서비스는 계속 JavaScript / TypeScript 기반으로 유지할 수 있다.

---

# 4. 데이터베이스는 PostgreSQL을 사용한다

## Decision

행사, 관심 분야, Source 등의 주요 데이터를 PostgreSQL에 저장한다.

## Reason

이 프로젝트에서는 다음과 같은 관계형 데이터가 중요하다.

```text
Event
↕
Category

Event
↕
Source
```

특히 Event와 Category는 N:M 관계를 가진다.

또한 다음 기능들을 학습하기에 적합하다.

```sql
JOIN
WHERE
ORDER BY
GROUP BY
INDEX
```

행사 검색 또한 날짜, 지역, 관심 분야, 모집 상태 등 여러 조건을 조합해야 하므로 관계형 DB를 사용하는 것이 적절하다.

---

# 5. Event와 Category는 N:M 관계로 설계한다

## Decision

행사 하나가 여러 관심 분야에 속할 수 있으므로 중간 테이블을 사용한다.

```text
events

categories

event_categories
```

## Reason

예를 들어 하나의 행사가 다음 분야를 동시에 포함할 수 있다.

```text
AI
LLM
Backend
Cloud
```

Event 테이블에 문자열 배열로만 저장하면 Category 자체의 계층 구조나 관계를 관리하기 어려워진다.

따라서 다음 구조를 사용한다.

```text
Event
    ↕
EventCategory
    ↕
Category
```

---

# 6. 날짜는 추천 요소가 아니라 우선 필터 조건으로 사용한다

## Decision

사용자가 특정 날짜를 입력하면 해당 날짜에 개최되는 행사만 먼저 검색한다.

그 이후 관심 분야와 지역 등을 기준으로 Ranking한다.

## Reason

서비스의 핵심 목적이

> 특정 날짜에 실제로 갈 수 있는 행사 찾기

이기 때문이다.

따라서 날짜가 맞지 않는 행사는 추천 점수가 낮은 것이 아니라 검색 후보 자체에서 제외되어야 한다.

```text
날짜 Filter
↓
후보 Event
↓
Interest Ranking
↓
Region Ranking
```

---

# 7. MVP 추천은 Rule-based Ranking으로 시작한다

## Decision

초기 추천 시스템에 ML 모델이나 LLM을 사용하지 않는다.

Rule-based 점수 계산을 사용한다.

예:

```text
interest_match
+
related_category
+
region_match
+
registration_available
```

## Reason

초기 단계에서 가장 중요한 것은 추천 모델의 정교함이 아니다.

먼저 다음 흐름이 정상적으로 동작해야 한다.

```text
검색
↓
필터링
↓
정렬
↓
결과 표시
```

Rule-based 방식은 다음 장점이 있다.

- 구현이 간단함
- 결과를 설명하기 쉬움
- 디버깅이 쉬움
- DB Query와 Ranking 로직 학습에 적합함

Semantic Search나 개인화 추천은 충분한 데이터와 사용 로그가 확보된 이후 도입한다.

---

# 8. 행사 수집을 AI에게 직접 맡기지 않는다

## Decision

다음과 같은 구조는 사용하지 않는다.

```text
Scheduler
↓
AI API
↓
"오늘 행사들을 찾아줘"
↓
AI 결과
↓
Database
```

## Reason

AI 검색 결과를 지속적인 데이터 수집의 기준으로 사용하면 다음 문제가 발생한다.

### 결과가 매번 달라질 수 있다

예:

```text
어제:
A
B
C

오늘:
B
D
```

이 경우 `A`, `C`가 실제로 사라진 것인지 단순 검색 누락인지 판단하기 어렵다.

### 누락 여부를 추적하기 어렵다

검색 결과에 나타나지 않았다고 해서 행사가 취소되거나 종료된 것은 아니다.

### 변경 여부를 확인하기 어렵다

행사의 장소나 신청 마감일이 변경되었는지 정확하게 추적하기 힘들다.

### Source 관리가 어렵다

출처와 마지막 수집 시각을 안정적으로 관리하기 어려워진다.

따라서 AI는 데이터 수집의 주체가 아니라 수집한 데이터를 이해하는 보조 도구로 사용한다.

---

# 9. Google 검색 결과 페이지 직접 크롤링을 메인 수집 방식으로 사용하지 않는다

## Decision

Google 검색 결과 HTML을 직접 크롤링하는 방식에 핵심 데이터 파이프라인을 의존하지 않는다.

## Reason

검색 결과 페이지는 원본 데이터가 아니다.

실제 행사 정보는 다음과 같은 사이트에 존재한다.

```text
공식 행사 홈페이지
행사 플랫폼
대학 홈페이지
기업 홈페이지
기관 홈페이지
```

또한 검색 결과 HTML 구조에 의존하면 다음 문제가 생긴다.

```text
검색 페이지 구조 변경
↓
Crawler 오류
↓
수집 중단
```

따라서 검색 엔진은 장기적으로 **새로운 행사나 Source를 발견하는 Discovery 용도**로만 사용한다.

---

# 10. Source 중심으로 데이터를 수집한다

## Decision

지속적으로 행사 정보를 제공하는 사이트를 `Source`로 관리한다.

예:

```text
Source A
Source B
University Events
Company Tech Events
Developer Community
```

각 Source에는 별도의 Collector를 둘 수 있다.

```text
collectors/
├── source-a.ts
├── source-b.ts
├── university.ts
└── company.ts
```

## Reason

Source를 명시적으로 관리하면 다음을 알 수 있다.

```text
어떤 사이트를 수집하고 있는가?

마지막 수집은 언제인가?

수집이 성공했는가?

사이트 구조가 변경되었는가?
```

또한 문제가 발생했을 때 Source 단위로 디버깅하기 쉽다.

---

# 11. Collector와 Parser의 역할을 분리한다

## Decision

Collector는 데이터를 가져오는 역할만 수행하고, Parser는 데이터를 이해하고 Event 형태로 변환한다.

```text
Collector
= 가져오기

Parser
= 이해하기
```

## Reason

두 역할을 분리하면 사이트 HTML 구조가 바뀌었을 때 전체 수집 코드를 다시 작성할 필요가 줄어든다.

예:

```text
Collector
↓
Raw Page
↓
Parser
↓
Normalized Event
```

Collector 결과를 Raw 데이터로 남길 수도 있기 때문에 Parser 오류를 별도로 재현하고 수정하기 쉽다.

---

# 12. API / RSS가 있다면 크롤링보다 우선한다

## Decision

Source가 공식 API 또는 RSS를 제공한다면 먼저 사용한다.

우선순위:

```text
API / RSS
↓
Structured HTML
↓
Source-specific Crawling
↓
Local LLM
```

## Reason

API와 RSS는 일반적으로 HTML Parsing보다 구조가 안정적이다.

또한 데이터가 이미 구조화되어 있어 다음 정보들을 직접 사용할 수 있다.

```text
title
startDate
location
URL
```

불필요한 HTML Parsing과 AI 호출을 줄일 수 있다.

---

# 13. JSON-LD를 일반 Parser보다 우선한다

## Decision

행사 페이지에 `application/ld+json` 형식의 Event 데이터가 존재하는지 먼저 확인한다.

예:

```html
<script type="application/ld+json">
{
  "@type": "Event",
  "name": "AI Conference",
  "startDate": "2026-09-12T14:00:00"
}
</script>
```

## Reason

이미 기계가 읽을 수 있는 구조화 데이터가 존재한다면 LLM이나 복잡한 Parser를 사용할 필요가 없다.

따라서 처리 순서는 다음과 같다.

```text
JSON-LD
↓ 실패
Source Parser
↓ 실패
Local LLM
```

---

# 14. AI는 Crawler가 아니라 Extractor / Normalizer로 사용한다

## Decision

AI의 핵심 역할을 다음으로 제한한다.

```text
Information Extraction
Classification
Normalization
Date Parsing
```

예:

```text
행사 페이지 본문
↓
AI
↓
Structured Event JSON
```

## Reason

이 프로젝트에서 AI가 해결해야 하는 문제는 복잡한 범용 추론보다 비정형 데이터를 정형 데이터로 변환하는 문제에 가깝다.

예:

```text
9월 19일 오후 2시
판교 XX타워
AI Agent 세미나
16일까지 사전등록
```

↓

```json
{
  "startAt": "2026-09-19T14:00:00+09:00",
  "venue": "판교 XX타워",
  "categories": ["AI", "AI Agent"],
  "registrationDeadline": "2026-09-16"
}
```

이 용도라면 비교적 작은 Local LLM도 사용할 수 있다.

---

# 15. Local LLM을 사용할 수 있도록 설계한다

## Decision

향후 AI Extraction이 필요할 경우 Hugging Face의 Qwen 계열 모델 등을 로컬에서 실행하는 방식을 우선 검토한다.

예:

```text
Hugging Face
↓
Qwen
↓
Ollama
↓
Local Model API
↓
Node.js Backend
```

## Reason

행사 페이지 정보 추출은 반복적인 작업이므로 Local LLM과 잘 맞을 가능성이 높다.

장점:

- 외부 AI API 비용 감소
- Rate Limit 영향 감소
- 모델 직접 제어 가능
- 서비스 백엔드와 AI 서버 분리 가능
- 공개 행사 데이터를 반복 처리하기 적합함

다만 Local LLM은 MVP 필수 요구사항으로 두지 않는다.

---

# 16. 모델 서버와 서비스 Backend를 분리한다

## Decision

Qwen 같은 모델을 Node.js Backend 프로세스 안에서 직접 실행하지 않는다.

별도의 Local Model Server를 둔다.

```text
Node Backend
↓ HTTP
Ollama
↓
Qwen
```

## Reason

이렇게 하면 백엔드는 AI 모델의 세부 구현을 알 필요가 없다.

추후 모델을 변경하더라도

```text
Qwen 4B
↓
Qwen 8B
↓
다른 모델
↓
Cloud AI API
```

Backend의 주요 구조를 유지할 수 있다.

---

# 17. AI 출력에는 Structured Output을 사용한다

## Decision

AI가 자유로운 자연어로 결과를 반환하도록 하지 않는다.

정해진 JSON Schema를 사용한다.

예:

```json
{
  "title": "...",
  "startAt": "...",
  "endAt": null,
  "registrationDeadline": "...",
  "venue": "...",
  "categories": []
}
```

## Reason

다음과 같은 출력은 서비스에 필요하지 않다.

```text
행사 정보를 분석해보겠습니다.

먼저 행사명은...
```

Backend에서 바로 처리할 수 있는 정형 데이터가 필요하다.

Structured Output을 사용하면 Parsing 실패 가능성을 줄일 수 있다.

---

# 18. AI 결과는 반드시 다시 검증한다

## Decision

LLM의 출력을 바로 DB에 저장하지 않는다.

```text
LLM
↓
JSON
↓
Schema Validation
↓
Business Validation
↓
DB
```

TypeScript에서는 Zod 등의 Validator를 사용할 수 있다.

## Reason

LLM은 원문에 없는 값을 생성할 수 있다.

따라서 최소한 다음을 확인한다.

```text
title이 존재하는가?

start_at은 정상적인 날짜인가?

end_at >= start_at 인가?

Category가 허용된 값인가?

Source URL이 존재하는가?
```

---

# 19. 가능하면 AI 추출 결과에 Evidence를 함께 남긴다

## Decision

AI가 추출한 주요 값에는 원문 근거를 함께 반환하도록 할 수 있다.

예:

```json
{
  "startAt": {
    "value": "2026-09-19T14:00:00+09:00",
    "evidence": "행사는 9월 19일 오후 2시에 진행됩니다."
  }
}
```

## Reason

이를 통해

```text
추출 결과
↕
원문
```

을 쉽게 비교할 수 있다.

특히 Local LLM Extraction을 디버깅하거나 Hallucination을 확인하는 데 유용하다.

---

# 20. HTML 전체를 LLM에 넣지 않는다

## Decision

웹페이지 전체 HTML을 AI에게 그대로 전달하지 않는다.

먼저 불필요한 정보를 제거한다.

```text
HTML
↓
script 제거
style 제거
navigation 제거
footer 제거
본문 추출
↓
LLM
```

## Reason

웹페이지에는 행사 정보와 무관한 데이터가 많다.

예:

```text
CSS
JavaScript
광고
메뉴
Footer
Tracking Code
```

입력 크기를 줄이면

- 처리 속도 향상
- 메모리 사용 감소
- Local LLM 정확도 향상
- Token 사용 감소

효과를 기대할 수 있다.

---

# 21. 동일 페이지를 불필요하게 다시 처리하지 않는다

## Decision

장기적으로 페이지 내용에 Hash를 사용해 변경 여부를 확인한다.

예:

```text
source_url
content_hash
fetched_at
```

다음 수집 시:

```text
previous_hash == current_hash
```

라면 재처리하지 않는다.

## Reason

대부분의 행사 페이지는 매번 변경되지 않는다.

따라서

```text
변경 없음
↓
Parser X
↓
LLM X
↓
DB Update X
```

로 처리하면 자원을 절약할 수 있다.

Hash 기반 Change Detection은 MVP 이후 확장 기능으로 둔다.

---

# 22. Search Discovery는 보조 기능으로 사용한다

## Decision

검색 엔진이나 AI Web Search는 새로운 Source 또는 행사 URL 발견에 사용한다.

예:

```text
"AI 세미나" 2026 9월

"게임 개발 행사" 2026

"해커톤" 2026
```

검색 결과:

```text
Search
↓
Candidate URL
↓
Known URL인가?
↓
NO
↓
수집 후보 등록
```

## Reason

Search는 새로운 정보를 발견하는 데 강하지만 지속적인 상태 관리에는 적합하지 않다.

따라서

```text
Search
= Discovery
```

로 역할을 제한한다.

---

# 23. 중복 행사를 삭제하지 않고 묶는 방향으로 설계한다

## Decision

동일 행사가 여러 Source에 존재한다면 하나의 Event로 묶는다.

```text
Event
├── 공식 홈페이지
├── 행사 플랫폼
└── 커뮤니티
```

## Reason

같은 행사에 여러 Source가 존재하는 것 자체는 유용한 정보다.

따라서 중복 Source를 삭제하기보다 Event와 Source의 관계를 관리하는 것이 좋다.

장기적으로는 다음 요소를 이용해 Deduplication한다.

```text
normalized_title
start_at
organizer
location
```

MVP에서는 Source가 하나이므로 복잡한 Deduplication은 구현하지 않는다.

---

# 24. Scheduler는 단순한 방식으로 시작한다

## Decision

MVP에서는 `node-cron` 등 단순한 Scheduler를 사용할 수 있다.

예:

```text
하루 1회
```

또는

```text
12시간마다 1회
```

## Reason

초기 Source 수가 적다면 Redis나 Job Queue를 사용할 필요가 없다.

처음에는 다음 구조면 충분하다.

```text
Scheduler
↓
Collector
↓
DB Update
```

---

# 25. BullMQ / Redis는 필요할 때 도입한다

## Decision

초기에는 BullMQ와 Redis를 도입하지 않는다.

다음과 같은 요구사항이 생기면 검토한다.

```text
Source 증가

동시 수집

Retry

Job Priority

Failure Queue

분산 Worker
```

## Reason

현재 단계에서 Redis와 Queue까지 추가하면 관리할 인프라가 늘어난다.

기능이 실제로 필요해지는 시점에 도입한다.

---

# 26. Raw Data와 Normalized Event는 장기적으로 분리한다

## Decision

장기적으로는 수집된 원본 페이지와 최종 Event 데이터를 분리한다.

```text
Raw Page

↓

Parser

↓

Normalized Event
```

## Reason

다음 상황에서 Raw Data가 필요하다.

- Parser 오류 재현
- LLM 결과 재평가
- 사이트 구조 변경 대응
- 기존 Event 재처리
- 데이터 변경 추적

MVP에서는 구조를 단순화할 수 있지만 향후 분리할 수 있도록 설계한다.

---

# 27. Source의 신뢰성을 기록한다

## Decision

행사마다 가능한 한 원본 Source와 마지막 확인 시점을 유지한다.

예:

```text
출처: 공식 행사 홈페이지

마지막 확인:
2026-09-07
```

## Reason

행사 정보는 변경될 수 있다.

특히 다음 정보는 최신성이 중요하다.

```text
행사 취소

장소 변경

모집 종료

매진

신청 마감 변경
```

따라서 서비스가 데이터를 언제 확인했는지 추적할 수 있어야 한다.

---

# 28. 공식 Source를 우선한다

## Decision

동일 행사에 여러 Source가 있다면 공식 홈페이지를 Primary Source로 우선한다.

예:

```text
공식 홈페이지
> 행사 플랫폼
> 커뮤니티 게시글
```

## Reason

행사 일정 변경이나 취소 정보는 공식 Source가 가장 신뢰할 가능성이 높다.

---

# 29. 서비스와 데이터 파이프라인을 논리적으로 분리한다

## Decision

서비스의 사용자 요청 처리와 행사 데이터 수집 작업을 서로 다른 책임으로 본다.

```text
User-facing

Search
Recommendation
Event Detail
```

와

```text
Data Pipeline

Collection
Parsing
Normalization
Validation
```

을 분리한다.

## Reason

수집 작업이 실패한다고 해서 기존 검색 서비스까지 중단되어서는 안 된다.

반대로 사용자의 검색 요청이 많아진다고 Collector가 영향을 받아서도 안 된다.

초기에는 하나의 프로젝트 안에 구현하더라도 논리적으로 모듈을 분리한다.

---

# 30. 추천 AI보다 데이터 품질을 우선한다

## Decision

초기 기술 투자 우선순위를 다음과 같이 둔다.

```text
Data Coverage

↓

Data Freshness

↓

Data Accuracy

↓

Search

↓

Recommendation
```

## Reason

추천 알고리즘이 아무리 좋아도 DB에 좋은 행사가 없다면 추천할 수 없다.

따라서 이 서비스에서 가장 중요한 기술 문제는

```text
Recommendation AI
```

보다는

```text
Collection
Normalization
Validation
```

에 가깝다.

---

# 31. MVP와 장기 기술을 분리한다

## Decision

다음 기능은 기술적으로 유용하지만 MVP 완료 조건에서 제외한다.

```text
Local Qwen

Search Discovery

Hash Change Detection

다중 Source

복잡한 Deduplication

Semantic Search

BullMQ

Redis

Cloud AI Fallback
```

## Reason

초기 단계부터 모두 구현하면 프로젝트 범위가 지나치게 커진다.

MVP에서는 다음 구조까지만 완성한다.

```text
Frontend
↓
Backend
↓
PostgreSQL

+

External Source 1개
↓
Collector
↓
Parser
↓
PostgreSQL
```

이 구조가 완성된 이후 필요에 따라 기술을 추가한다.

---

# 32. 현재 MVP 기술 구조

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

# 33. 장기 기술 구조

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
                         Raw Page
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

# 34. 현재 결정 요약

| 영역 | 결정 |
|---|---|
| 주 언어 | TypeScript |
| Frontend | React |
| Backend | Node.js |
| Database | PostgreSQL |
| Event ↔ Category | N:M |
| 초기 추천 | Rule-based |
| 데이터 수집 | Known Source 중심 |
| 검색 엔진 | Discovery 용도 |
| AI 역할 | Extractor / Normalizer |
| Local AI | Qwen 계열 검토 |
| Local Model Server | Ollama 우선 검토 |
| Parsing 순서 | JSON-LD → Source Parser → LLM |
| Validation | Schema + Business Rule |
| Scheduler | 초기에는 단순 cron |
| Queue | 필요 시 BullMQ / Redis |
| Deduplication | 다중 Source 확장 시 구현 |
| Semantic Search | MVP 이후 |
| 개인화 | MVP 이후 |

---

# 35. 기술 설계 원칙

프로젝트 전체에서 다음 원칙을 유지한다.

## 1. 가장 단순한 방법부터 사용한다

```text
Parser로 해결 가능
→ Parser 사용

AI가 필요한 경우
→ AI 사용
```

---

## 2. AI를 사용하기 위해 AI를 사용하지 않는다

AI가 명확한 이점을 제공하는 경우에만 사용한다.

---

## 3. 데이터의 출처를 잃지 않는다

모든 Event는 가능한 한 원본 Source까지 추적 가능해야 한다.

---

## 4. 자동화된 결과는 검증한다

특히 AI 출력은 DB 저장 전에 반드시 Validation한다.

---

## 5. MVP 범위를 넘는 기술은 미룬다

좋은 아이디어를 삭제하지는 않되, 현재 일정에 포함시키지 않는다.

---

## 6. 데이터 품질을 추천 복잡성보다 우선한다

추천 가능한 좋은 데이터가 먼저 확보되어야 한다.

---

# 36. 최종 기술 방향

이 서비스의 기술적 중심은 단순한 CRUD나 AI API 호출이 아니다.

장기적으로 다음 데이터 흐름을 안정적으로 만드는 것이 핵심이다.

```text
Discover

↓

Collect

↓

Extract

↓

Normalize

↓

Validate

↓

Deduplicate

↓

Store

↓

Search

↓

Recommend
```

AI는 이 파이프라인의 일부를 보조한다.

최종적으로 목표하는 구조는

> **신뢰할 수 있는 행사 데이터를 지속적으로 확보하고, 이를 사용자의 날짜와 관심사에 연결하는 데이터 중심 Backend 시스템**

이다.