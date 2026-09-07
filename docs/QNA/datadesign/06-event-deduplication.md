# Event Deduplication

## 문제

행사 데이터는 여러 출처에서 수집될 수 있다.

예를 들어 동일한 행사가 다음과 같은 곳에 동시에 등록될 수 있다.

- 공식 행사 페이지
- EventUs
- Meetup
- 학교 또는 기관 공지
- 커뮤니티 게시글

이 경우 같은 행사가 여러 번 수집될 수 있으므로, 어떤 기준으로 동일 행사인지 판단하고 중복 저장을 방지할지 결정해야 한다.

---

## 고려한 방식

### 1. 출처 URL 기준

예:

```text id="u2q0rp"
https://example.com/events/123
```

같은 URL을 가진 데이터는 동일 행사로 판단한다.

#### 장점

- 구현이 가장 단순하다.
- 동일 페이지를 반복 수집하는 경우 확실하게 중복을 막을 수 있다.
- DB에 `UNIQUE` 제약조건을 적용하기 쉽다.

#### 단점

- 동일한 행사가 여러 사이트에 등록되어 있으면 서로 다른 행사로 인식한다.
- URL의 query parameter나 tracking parameter 때문에 같은 페이지가 다른 URL로 표현될 수 있다.
- 행사 페이지 URL이 변경될 수도 있다.

따라서 URL은 **같은 출처에서 반복 수집된 데이터의 중복 제거에는 적합하지만, 전체 행사 중복 판별 기준으로는 부족하다.**

---

### 2. 행사 속성 조합 기준

예:

```text id="h4du48"
(title, start_at, venue)
```

행사명, 시작 시각, 장소가 같으면 같은 행사로 판단하는 방식이다.

예:

```text id="jiu6iw"
title    = "AI Developer Conference 2026"
start_at = 2026-09-12 14:00
venue    = "COEX"
```

#### 장점

- 서로 다른 출처에서 수집한 동일 행사를 발견할 수 있다.
- 별도의 외부 ID가 없어도 사용할 수 있다.
- 대부분의 행사 데이터에 적용할 수 있다.

#### 단점

- 행사명 표기가 출처마다 다를 수 있다.
- 장소 표기가 다를 수 있다.
- 행사 시간이 변경될 수 있다.
- 같은 이름의 반복 행사가 존재할 수 있다.
- 문자열 정규화 규칙이 필요하다.

예:

```text id="nedg9q"
GIST AI Seminar
GIST AI 세미나
[GIST] AI Seminar
```

이 세 값이 실제로 동일 행사일 수도 있다.

따라서 정확한 DB `UNIQUE` 제약조건으로 사용하기에는 위험하다.

---

### 3. 외부 서비스의 Event ID 사용

데이터 출처에서 고유한 행사 ID를 제공한다면 이를 저장한다.

예:

```text id="42nnye"
source = "meetup"
external_event_id = "309284123"
```

#### 장점

- 같은 출처 내에서는 매우 안정적으로 동일 행사를 식별할 수 있다.
- 행사명이나 시간이 변경되어도 같은 행사임을 유지할 수 있다.
- API 기반 수집에 적합하다.

#### 단점

- 모든 출처가 고유 ID를 제공하지 않는다.
- 서로 다른 플랫폼의 동일 행사는 서로 다른 ID를 가진다.
- 외부 ID만으로 전체 데이터셋의 중복을 해결할 수 없다.

---

### 4. 내부 Event ID를 부여하고 수집 출처를 별도로 연결

서비스 내부에서는 모든 행사에 자체 ID를 부여한다.

예:

```text id="t2nhmx"
events
id = 42
```

그리고 한 행사에 연결된 외부 출처를 별도로 관리한다.

```text id="qnzphn"
event_sources
event_id | source     | external_event_id | source_url
42       | official   | NULL              | ...
42       | meetup     | 309284123         | ...
42       | eventus    | 91823             | ...
```

#### 장점

- 하나의 실제 행사와 여러 출처를 분리해서 관리할 수 있다.
- 서로 다른 사이트의 동일 행사를 하나의 행사로 통합할 수 있다.
- 출처별 URL이나 외부 ID를 모두 보존할 수 있다.
- 향후 데이터 수집 구조 확장에 유리하다.

#### 단점

- 구조가 복잡해진다.
- 서로 다른 출처가 같은 행사인지 판별하는 별도의 로직이 필요하다.
- MVP 단계에서는 구현량이 늘어날 수 있다.

---

## 결정

**단일 기준만으로 행사 중복 여부를 판단하지 않는다.**

다음과 같이 두 단계로 처리한다.

```text id="w9acmh"
1. 동일 출처 내 중복
→ source + external_event_id 또는 source_url로 식별

2. 서로 다른 출처 간 중복
→ title + start_at + venue 등의 속성을 이용해 후보를 탐지
```

그리고 서비스 내부의 행사는 자체 `id`로 식별한다.

즉:

```text id="bl54ds"
내부 식별자
→ events.id

외부 식별자
→ source + external_event_id

중복 탐지
→ 행사 속성 조합
```

---

## 선택 이유

출처 URL 하나만으로 중복을 판단하면 동일 행사가 여러 플랫폼에 등록된 경우를 처리할 수 없다.

반대로 다음과 같은 조합을 DB의 절대적인 고유 키로 사용하면:

```text id="s81khm"
(title, start_at, venue)
```

표기 차이나 일정 변경 때문에 서로 같은 행사임에도 다른 것으로 판단되거나, 반대로 다른 행사가 같은 것으로 처리될 위험이 있다.

따라서 **확실한 식별과 추정 기반 중복 탐지를 구분한다.**

확실한 식별은 다음 데이터를 사용한다.

```text id="ts3m0u"
source
external_event_id
source_url
```

반면 서로 다른 출처의 행사 통합은 완전한 DB 제약조건이 아니라 별도의 중복 탐지 로직으로 처리한다.

---

## 동일 출처 내 중복 판별

외부 ID를 제공하는 출처에서는 다음 조합을 우선 사용한다.

```text id="b0gz8y"
(source, external_event_id)
```

예:

```text id="0z5xxl"
source            = "MEETUP"
external_event_id = "309284123"
```

이 조합은 `UNIQUE` 제약조건을 적용할 수 있다.

예:

```sql id="bklxf1"
UNIQUE (source, external_event_id)
```

---

## 외부 ID가 없는 경우

외부 ID가 제공되지 않는 출처에서는 정규화된 URL을 이용한다.

예:

```text id="ezac6f"
source_url
```

다만 다음과 같은 tracking parameter는 제거한 뒤 비교하는 것이 좋다.

```text id="gkeomi"
utm_source
utm_medium
utm_campaign
ref
```

예:

```text id="6tt35c"
https://example.com/event/123?utm_source=instagram
```

를 정규화하여:

```text id="2ez59j"
https://example.com/event/123
```

처럼 비교한다.

---

## 서로 다른 출처 간 중복 탐지

서로 다른 플랫폼의 행사에는 공통 external ID가 없으므로 행사 자체의 속성을 비교해야 한다.

MVP에서는 다음 항목을 주요 후보로 사용한다.

```text id="1sy1s0"
title
start_at
venue_name
```

예:

```text id="notcvi"
normalized_title
start_at
normalized_venue_name
```

이 값들이 충분히 유사하면 중복 후보로 판단한다.

---

## 문자열 정규화

행사명과 장소를 비교하기 전에 기본적인 정규화를 수행할 수 있다.

예:

```text id="4psvep"
원본
"[GIST] AI Developer Meetup 2026"

정규화
"gist ai developer meetup 2026"
```

다음과 같은 처리를 고려한다.

- 앞뒤 공백 제거
- 연속 공백 통합
- 대소문자 통일
- 불필요한 특수문자 제거

다만 지나치게 공격적인 정규화는 서로 다른 행사를 잘못 합칠 수 있으므로 MVP에서는 단순한 규칙부터 적용한다.

---

## 자동 병합은 하지 않음

중복 후보가 탐지되었다고 해서 곧바로 하나의 행사로 자동 병합하지 않는다.

예를 들어:

```text id="hlg002"
AI Meetup
2026-09-12 14:00
COEX
```

와

```text id="euuqfp"
AI Meetup
2026-09-12 14:00
COEX
```

가 동일 행사일 가능성은 높지만, 서로 다른 세션이나 별도 행사일 수도 있다.

따라서 MVP에서 속성 기반 비교는 우선 다음 목적으로 사용한다.

```text id="xqkp2v"
중복 후보 탐지
```

확실하지 않은 데이터를 강제로 병합하는 것보다 일부 중복이 존재하는 것이 더 안전하다고 판단한다.

---

## 내부 ID

서비스 내부에서는 행사에 자체 ID를 부여한다.

예:

```sql id="4rwm5q"
id BIGSERIAL PRIMARY KEY
```

이 ID는 외부 사이트의 ID와 독립적이다.

따라서 외부 데이터가 변경되거나 다른 출처가 추가되어도 서비스 내부 관계는 유지할 수 있다.

---

## 예상 구조

현재 MVP에서 단순하게 구현한다면 다음과 같은 정보를 `events`에 둘 수 있다.

```text id="2ac94t"
events
├── id
├── title
├── start_at
├── venue_name
├── source
├── external_event_id
└── source_url
```

예상 제약조건:

```sql id="oylbtu"
UNIQUE (source, external_event_id)
```

단, `external_event_id`가 없는 출처도 있으므로 실제 NULL 처리 방식은 DDL 작성 단계에서 조정한다.

---

## 향후 `event_sources` 분리

하나의 행사에 여러 출처를 연결할 필요성이 커지면 다음 구조로 분리한다.

```text id="w9qd4g"
events
├── id
├── title
├── start_at
└── ...

event_sources
├── id
├── event_id
├── source
├── external_event_id
└── source_url
```

관계는 다음과 같다.

```text id="4crhij"
events
  1
  │
  N
event_sources
```

이 구조에서는 하나의 행사에 공식 페이지, Meetup, EventUs 등 여러 출처를 연결할 수 있다.

현재 MVP에서 반드시 필요한지는 실제 데이터 수집 과정에서 중복 사례를 확인한 뒤 결정한다.

---

## 중복 판별 우선순위

MVP에서는 다음 순서로 판단한다.

```text id="qbp92j"
1. source + external_event_id 일치
   → 동일 행사로 확정

2. 정규화된 source_url 일치
   → 동일 출처의 동일 행사로 간주

3. title + start_at + venue 유사
   → 중복 후보

4. 위 조건으로 판단할 수 없음
   → 별도 행사로 저장
```

즉, 확실한 근거가 있을 때만 자동으로 중복을 제거한다.

---

## 향후 재검토 기준

다음과 같은 상황이 발생하면 중복 제거 구조를 확장한다.

- 동일 행사가 여러 출처에서 자주 발견된다.
- 하나의 행사에 여러 출처 URL을 보존해야 한다.
- 자동 수집 데이터가 크게 증가한다.
- 중복 후보를 수동 검토하는 관리 기능이 필요하다.
- 제목 유사도 등을 활용한 자동 중복 탐지가 필요하다.

이 경우 다음과 같은 방법을 검토할 수 있다.

- `event_sources` 테이블 분리
- 제목 similarity 계산
- 장소 및 시간 tolerance 적용
- 중복 후보 score 계산
- 수동 merge 기능

---

## 결론

행사 중복은 하나의 필드만으로 완전히 식별하기 어렵기 때문에 **확정 식별과 중복 탐지를 분리한다.**

```text id="dp7eog"
내부 식별
→ events.id

동일 출처 내 식별
→ source + external_event_id
→ 또는 정규화된 source_url

서로 다른 출처 간 비교
→ title + start_at + venue 기반 중복 후보 탐지
```

속성 조합은 완전한 고유 키로 사용하지 않으며, 확실하지 않은 경우에는 자동 병합하지 않는다.

MVP에서는 데이터 손실 가능성이 있는 잘못된 병합보다 일부 중복을 허용하는 방향을 선택한다.