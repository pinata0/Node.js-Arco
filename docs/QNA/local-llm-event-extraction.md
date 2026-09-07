# 행사 데이터 처리에 로컬 LLM을 사용할 수 있을까?

## 질문

행사 추천 서비스를 만들 때 AI API를 외부 서비스로 호출하는 대신,

> Hugging Face에서 Qwen 같은 오픈소스 LLM을 받아서 로컬에서 실행하면 어떨까?

예를 들어 다음과 같은 구조를 생각할 수 있다.

```text
Crawler
↓
행사 페이지 수집
↓
Local LLM
↓
행사 정보 추출
↓
Database
```

이 방식이 실제로 가능한지, 그리고 프로젝트에 적합한지 검토한다.

---

# 1. 결론

가능하다.

오히려 이 프로젝트에서 AI가 담당할 작업은

> 웹 전체를 자유롭게 탐색하고 복잡한 추론을 수행하는 것

보다는

> 이미 수집된 행사 페이지에서 필요한 정보를 추출하고 정규화하는 것

에 가깝기 때문에 로컬 LLM을 사용하기 좋은 편이다.

예를 들어 AI에게 다음 정보를 추출하게 할 수 있다.

```text
행사명
행사 시작일
행사 종료일
신청 마감일
장소
지역
주최자
관심 분야
행사 유형
```

이런 작업은 비교적 명확한 Schema를 가진 정보 추출 문제이므로 수십~수백 B 규모의 거대한 모델이 반드시 필요한 것은 아니다.

---

# 2. 왜 로컬 LLM으로 가능한가?

## 2.1 AI에게 맡기는 작업이 제한적이다

예를 들어 행사 페이지의 내용이 다음과 같다고 하자.

```text
제7회 AI 개발자 모임

9월 19일 오후 2시부터
판교 XX타워에서 진행됩니다.

생성형 AI와 AI Agent를 주제로
개발자 발표가 진행됩니다.

사전 등록은 9월 16일까지입니다.
```

AI가 해야 할 작업은 이를 읽고 다음과 같이 변환하는 것이다.

```json
{
  "title": "제7회 AI 개발자 모임",
  "startAt": "2026-09-19T14:00:00+09:00",
  "registrationDeadline": "2026-09-16",
  "venue": "판교 XX타워",
  "categories": [
    "AI",
    "Generative AI"
  ]
}
```

즉 작업 자체는 크게 보면

```text
정보 추출
+
분류
+
날짜 해석
+
JSON 생성
```

이다.

이 정도 작업은 비교적 작은 모델로도 처리할 수 있다.

---

# 3. 외부 AI API를 반드시 사용할 필요가 없는 이유

일반적으로 AI 기능을 사용할 때는 다음과 같은 외부 API를 생각할 수 있다.

```text
Backend
↓
External AI API
↓
Response
```

하지만 모델을 로컬에 띄워두면 다음처럼 구성할 수 있다.

```text
Backend
↓
Local LLM Server
↓
Qwen
```

백엔드 입장에서는 둘 다 사실상 HTTP API 호출이다.

예를 들어 외부 API 대신

```text
localhost
```

에 실행 중인 모델 서버에 요청을 보내면 된다.

따라서 애플리케이션 구조 자체를 크게 변경할 필요도 없다.

---

# 4. 추천 구조

로컬 LLM을 애플리케이션 내부 코드에 직접 포함하기보다는 별도의 모델 서버로 실행하는 것이 좋다.

```text
Node.js Backend
       │
       │ HTTP
       ▼
Local LLM Server
       │
       ▼
     Qwen
```

예를 들어 Ollama를 사용하면 다음과 같은 구조가 된다.

```text
Node.js / TypeScript
        ↓
      Ollama
        ↓
      Qwen
```

이렇게 하면 웹 백엔드와 AI 모델을 분리할 수 있다.

---

# 5. 왜 모델 서버로 분리하는 것이 좋은가?

## 5.1 백엔드와 AI 구현이 분리된다

백엔드는 다음과 같은 인터페이스만 알면 된다.

```text
event text
↓
AI request
↓
structured event
```

어떤 모델을 사용하는지는 백엔드에서 알 필요가 없다.

예를 들어 처음에는

```text
Qwen3 4B
```

를 사용하다가 나중에

```text
Qwen3 8B
```

로 바꿔도 된다.

또는 이후 외부 AI API로 변경할 수도 있다.

```text
Local Qwen
↓
Cloud AI API
```

백엔드 구조는 거의 그대로 유지할 수 있다.

---

# 6. Hugging Face는 어떤 역할을 하는가?

Hugging Face는 모델을 실행하는 프로그램이라기보다는 모델 파일을 받아오는 저장소 역할에 가깝다.

전체 구조를 단순화하면 다음과 같다.

```text
Hugging Face
↓
Qwen 모델 다운로드
↓
Inference Runtime
↓
Model Server
↓
Backend
```

Inference Runtime으로는 여러 선택지가 있다.

```text
Ollama

llama.cpp

Transformers

vLLM
```

---

# 7. 가장 간단한 방법: Ollama

프로젝트 초기에는 Ollama가 가장 간단하다.

```text
Qwen 모델
↓
Ollama
↓
localhost API
↓
Node.js Backend
```

백엔드에서는 Ollama를 일반적인 외부 API처럼 호출한다.

예를 들어 다음과 같은 구조다.

```ts
const response = await localLLM.extract({
  text: pageText
});
```

그러면 내부적으로

```text
Node Backend
↓
HTTP Request
↓
Ollama
↓
Qwen
↓
JSON Response
```

가 수행된다.

---

# 8. JSON Schema와 함께 사용할 수 있다

이 프로젝트에서는 자연어 응답이 필요하지 않다.

다음과 같은 응답은 오히려 불필요하다.

```text
행사 정보를 분석해보겠습니다.

행사의 이름은 ...
날짜는 ...

다음과 같이 정리할 수 있습니다.
```

필요한 것은 정확한 JSON이다.

```json
{
  "title": "...",
  "startAt": "...",
  "venue": "..."
}
```

따라서 AI 출력에 Schema를 지정하는 것이 좋다.

예:

```text
EventSchema

title
startAt
endAt
registrationDeadline
venue
region
categories
organizer
```

AI에게 이 구조를 따르도록 하고, 백엔드에서 다시 검증한다.

---

# 9. Zod를 함께 사용할 수 있다

TypeScript를 사용한다면 Zod를 사용해 Schema를 정의할 수 있다.

예:

```ts
const EventSchema = z.object({
  title: z.string(),
  startAt: z.string().nullable(),
  endAt: z.string().nullable(),
  registrationDeadline: z.string().nullable(),
  venue: z.string().nullable(),
  region: z.string().nullable(),
  categories: z.array(z.string()),
  organizer: z.string().nullable(),
});
```

전체 구조는 다음과 같다.

```text
Local LLM
↓
JSON
↓
Zod
↓
Validation
↓
Database
```

AI가 이상한 데이터를 반환하면 DB에 넣기 전에 차단할 수 있다.

---

# 10. AI에게 모든 페이지를 보낼 필요는 없다

로컬 모델을 사용한다고 해서 모든 페이지를 AI로 처리할 필요는 없다.

먼저 일반적인 프로그램으로 처리한다.

```text
행사 페이지
↓
JSON-LD 존재?
↓
YES → 직접 파싱
↓
NO
↓
사이트 전용 Parser 사용 가능?
↓
YES → 직접 파싱
↓
NO
↓
Local LLM
```

즉 AI는 fallback으로 사용한다.

---

# 11. 왜 이 방식이 좋은가?

일반적인 Parser가 더 빠르고 정확하게 처리할 수 있는 데이터를 굳이 LLM에게 보낼 필요가 없다.

예를 들어 페이지에 이미 다음 정보가 존재한다면

```json
{
  "@type": "Event",
  "name": "AI Conference",
  "startDate": "2026-09-19"
}
```

직접 읽으면 된다.

AI는 다음과 같이 구조가 애매한 페이지를 처리하는 데 사용한다.

```text
오는 19일 오후 2시 판교에서 열립니다.

사전 신청은 수요일까지 가능합니다.
```

---

# 12. HTML 전체를 AI에 넣으면 안 된다

웹페이지 전체 HTML을 그대로 모델에 넣는 방식은 좋지 않다.

실제 HTML에는 다음과 같은 정보가 많다.

```text
CSS
JavaScript
Navigation
Footer
광고
버튼
메뉴
Tracking code
```

따라서 먼저 본문을 정리해야 한다.

```text
HTML
↓
불필요한 태그 제거
↓
본문 추출
↓
텍스트 정리
↓
Local LLM
```

예를 들어

```text
70KB HTML
↓
4KB 행사 본문
↓
Qwen
```

형태로 줄이는 것이 좋다.

---

# 13. 작은 모델로도 충분할 가능성이 높다

이 프로젝트에서 모델이 해야 하는 것은 복잡한 창작이나 긴 추론이 아니다.

주요 작업은 다음과 같다.

```text
Entity Extraction

Date Parsing

Classification

Schema Conversion
```

따라서 처음부터 매우 큰 모델을 사용할 필요가 없다.

예를 들어 다음과 같이 실험할 수 있다.

```text
Qwen 4B
↓
성능 확인

부족하면
↓
Qwen 8B
```

즉 작은 모델부터 시작하고, 실제 행사 데이터에서 정확도가 부족할 때 모델을 키우는 것이 좋다.

---

# 14. Local LLM을 사용하면 비용을 줄일 수 있다

외부 AI API를 사용하면 보통 호출량에 따라 비용이 발생한다.

행사 페이지가 많아질수록

```text
페이지 수
×
AI 호출
×
입력 토큰
```

만큼 비용이 증가한다.

로컬 모델을 사용하면 API 호출 비용 대신 자신의 하드웨어 자원을 사용한다.

```text
API 비용

대신

GPU / CPU / RAM 사용
```

특히 동일한 종류의 정보 추출을 반복적으로 수행하는 서비스에서는 로컬 모델이 적합할 수 있다.

---

# 15. 외부 서비스 의존성을 줄일 수 있다

외부 AI API만 사용하는 경우 다음 문제들이 존재한다.

```text
API 가격 변경

Rate Limit

서비스 장애

모델 변경

API 정책 변경
```

로컬 모델을 사용하면 핵심 데이터 처리 파이프라인을 직접 통제할 수 있다.

```text
Crawler
↓
Local LLM
↓
DB
```

따라서 외부 서비스에 대한 의존성이 감소한다.

---

# 16. 데이터 프라이버시 측면에서도 장점이 있다

크롤링한 원문을 외부 AI API로 보내지 않고 로컬에서 처리할 수 있다.

```text
Page
↓
Local Machine
↓
Local LLM
↓
Database
```

데이터가 외부 AI 서비스로 전달되지 않는다.

이 프로젝트의 행사 정보 자체는 대부분 공개 데이터이지만, 이후 다른 종류의 데이터 처리 시스템으로 확장할 경우 의미 있는 장점이 될 수 있다.

---

# 17. 로컬 모델도 결과를 그대로 믿으면 안 된다

로컬 LLM이라고 해서 hallucination 문제가 사라지는 것은 아니다.

예를 들어 AI가 실제로 존재하지 않는 날짜를 생성할 수도 있다.

```json
{
  "startAt": "2026-09-19"
}
```

하지만 원문에는 단순히

```text
9월 중 개최 예정
```

이라고만 적혀 있을 수도 있다.

따라서 다음 검증 단계가 필요하다.

```text
Local LLM
↓
Schema Validation
↓
Business Rule Validation
↓
Database
```

---

# 18. 근거 문장도 함께 추출하면 좋다

AI가 단순히 값만 반환하는 것보다 해당 값의 근거도 반환하게 만들 수 있다.

예:

```json
{
  "startAt": {
    "value": "2026-09-19T14:00:00+09:00",
    "evidence": "행사는 9월 19일 오후 2시에 진행됩니다."
  }
}
```

이를 이용하면

```text
AI 생성 값
↕
원문 근거
```

를 비교할 수 있다.

데이터 검증과 디버깅이 쉬워진다.

---

# 19. Local LLM과 외부 API를 함께 사용할 수도 있다

모든 작업을 반드시 로컬에서 해결할 필요도 없다.

다음과 같은 hybrid 구조도 가능하다.

```text
Parser
↓
실패

Local Qwen
↓
결과 검증

정상
├────────→ Database
│
└─ 실패
     ↓
External AI API
     ↓
Database
```

예를 들어

```text
쉬운 페이지
→ Parser

일반적인 비정형 페이지
→ Local Qwen

매우 어려운 페이지
→ External AI API
```

로 역할을 나눌 수 있다.

---

# 20. 프로젝트에 적용할 최종 구조

행사 수집 시스템 전체에 적용하면 다음과 같다.

```text
Scheduler
     ↓
Collector
     ↓
Fetch Page
     ↓
본문 정리
     ↓
┌───────────────┐
│ JSON-LD Parser│
└───────┬───────┘
        │ 실패
        ↓
┌───────────────────┐
│ Source-specific   │
│ Parser            │
└────────┬──────────┘
         │ 실패
         ↓
┌───────────────────┐
│ Local LLM         │
│ Qwen              │
└────────┬──────────┘
         ↓
   Structured JSON
         ↓
   Zod Validation
         ↓
 Business Validation
         ↓
   Deduplication
         ↓
    PostgreSQL
```

---

# 21. 이 프로젝트에 특히 적합한 이유

이 프로젝트의 AI 사용 목적은

```text
질문 답변

창작

복잡한 Reasoning
```

보다는

```text
웹페이지 이해

정보 추출

태그 분류

데이터 정규화
```

에 가깝다.

이런 작업은 상대적으로 작은 모델을 사용해도 충분한 성능을 기대할 수 있다.

따라서

> Hugging Face에서 Qwen 같은 오픈소스 모델을 받아 로컬에서 실행하는 방식

은 이 프로젝트에서 충분히 검토할 가치가 있다.

---

# 결론

다음과 같은 구조는 현실적으로 구현 가능하다.

```text
Hugging Face
↓
Qwen 다운로드
↓
Ollama / llama.cpp
↓
Local Model Server
↓
Node.js Backend
↓
Event Extraction
↓
PostgreSQL
```

특히 이 프로젝트에서는 AI를

> 행사 데이터를 직접 찾아오는 검색 엔진

으로 사용하기보다

> 이미 수집한 행사 페이지를 구조화된 Event 데이터로 변환하는 Extractor

로 사용하는 것이 적절하다.

로컬 모델을 사용하면 다음 장점을 얻을 수 있다.

```text
반복적인 AI API 비용 감소

외부 서비스 의존성 감소

모델과 데이터 처리 과정 직접 제어

백엔드와 모델 서버 분리

작은 모델로도 충분한 작업 특성

Structured Output 활용 가능

AI/Backend/Data Pipeline을 함께 학습 가능
```

따라서 초기 구현에서는

```text
Node.js / TypeScript
+
PostgreSQL
+
Ollama
+
Qwen 4B 또는 8B
+
Zod
```

조합으로 시작하고, 실제 행사 페이지들을 대상으로 정확도를 측정한 뒤 모델 크기를 조정하는 방식이 적절하다.