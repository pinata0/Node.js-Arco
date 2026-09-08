# 행사 데이터 수집 필드

## 목적

2026년 행사 데이터를 수집할 때 행사 하나당 어떤 정보를 확보해야 하는지 정의한다.

본 문서는 **수동 조사 및 Raw 데이터 수집 단계의 기준**을 정의한다.

수집 단계에서는 데이터를 지나치게 정규화하지 않고, 원문 정보를 함께 보존하는 것을 원칙으로 한다.

---

## 수집 대상

본 프로젝트는 기술 행사에 한정하지 않고, 사용자가 날짜를 기준으로 다양한 관심 분야의 행사를 탐색할 수 있도록 하는 것을 목표로 한다.

주요 수집 대상은 다음과 같다.

- AI
- Machine Learning
- Data
- Backend
- Frontend
- Web
- Mobile
- Cloud
- Security
- Open Source
- Game
- Game Development
- Indie Game
- Esports
- Architecture
- Interior
- Urban
- Spatial Design
- Graphic Design
- UX/UI
- Product Design
- Industrial Design
- Art
- Fine Art
- Media Art
- Digital Art
- Photography
- Illustration
- Animation
- Film
- Video
- Music
- Performance
- Literature
- Startup
- Entrepreneurship
- Business
- Career
- Education
- Science
- Technology

---

## 수집 필드

| 영역 | 필드 | 중요도 | 설명 |
|---|---|---|---|
| 식별 | `title` | 필수 | 행사명 |
| 식별 | `external_event_id` | 가능하면 | 외부 플랫폼에서 사용하는 행사 ID |
| 시간 | `start_at` | 필수 | 행사 시작 일시 |
| 시간 | `end_at` | 선택 | 행사 종료 일시 |
| 시간 | `timezone` | 권장 | 행사 시간대. 국내 행사는 기본적으로 `Asia/Seoul` |
| 분류 | `event_type` | 필수 | 행사의 형식 |
| 분류 | `tags` | 필수 | 행사의 관심 분야 |
| 분류 | `target_audience` | 선택 | 주요 참가 대상 |
| 장소 | `event_mode` | 필수 | `OFFLINE`, `ONLINE`, `HYBRID` |
| 장소 | `venue_name` | 선택 | 행사장 또는 시설명 |
| 장소 | `address` | 선택 | 상세 주소 |
| 장소 | `region` | 선택 | 서울, 광주, 부산 등 지역 |
| 장소 | `online_url` | 선택 | 온라인 행사 접속 또는 참여 URL |
| 신청 | `registration_start_at` | 선택 | 신청 시작 일시 |
| 신청 | `registration_deadline` | 선택 | 신청 마감 일시 |
| 신청 | `registration_url` | 선택 | 참가 신청 페이지 |
| 신청 | `registration_status` | 선택 | 신청 가능 상태 |
| 신청 | `registration_method` | 선택 | 사전 신청, 현장 등록, 선착순 등 |
| 비용 | `price` | 선택 | 참가 비용 |
| 비용 | `currency` | 선택 | 통화. 국내 행사는 기본적으로 `KRW` |
| 내용 | `description` | 선택 | 행사 내용을 요약한 설명 |
| 내용 | `organizer` | 선택 | 주최 또는 주관 기관 |
| 내용 | `official_site_url` | 선택 | 별도의 행사 공식 홈페이지 |
| 출처 | `source` | 필수 | 정보를 수집한 플랫폼 또는 출처 |
| 출처 | `source_url` | 필수 | 실제 확인한 원본 페이지 URL |
| 수집 | `collected_at` | 권장 | 데이터를 수집한 시점 |
| 원문 | `raw_date_text` | 권장 | 원본 페이지의 날짜 및 시간 표현 |
| 원문 | `raw_location_text` | 권장 | 원본 페이지의 장소 표현 |
| 원문 | `raw_category_text` | 권장 | 원본 페이지의 분야 및 카테고리 표현 |
| 원문 | `raw_registration_text` | 권장 | 원본 페이지의 신청 관련 표현 |
| 원문 | `raw_price_text` | 권장 | 원본 페이지의 가격 관련 표현 |
| 원문 | `raw_description` | 권장 | 원본 페이지의 행사 설명 |
| 원문 | `raw_data` | 선택 | 필요한 경우 원본 구조화 데이터 또는 추가 원문 |

---

# 필드 상세

## 1. 식별 정보

### `title`

행사의 공식 명칭을 저장한다.

```yaml
title: GIST AI Seminar
```

필수 필드이다.

가능하면 원본 페이지에서 사용한 행사명을 그대로 사용한다.

수집 단계에서 불필요하게 이름을 번역하거나 축약하지 않는다.

---

### `external_event_id`

EventUs, Meetup 등 외부 플랫폼이 행사마다 고유 ID를 제공하는 경우 저장한다.

```yaml
external_event_id: "123456"
```

중복 행사 탐지에 도움이 될 수 있으므로 확보할 수 있다면 저장한다.

플랫폼에서 명확하게 확인할 수 없는 경우 비워둔다.

---

# 2. 시간 정보

## `start_at`

행사가 실제로 시작하는 날짜와 시간을 저장한다.

```yaml
start_at: 2026-09-12 14:00
```

필수 필드이다.

행사가 여러 날에 걸쳐 진행되더라도 전체 행사의 최초 시작 시간을 저장한다.

---

## `end_at`

행사가 종료되는 날짜와 시간을 저장한다.

```yaml
end_at: 2026-09-12 18:00
```

종료 시간이 명확하지 않으면 비워둘 수 있다.

임의로 추측하지 않는다.

---

## `timezone`

행사가 진행되는 시간대를 저장한다.

```yaml
timezone: Asia/Seoul
```

국내 오프라인 행사와 한국 시간 기준 온라인 행사는 기본적으로 다음 값을 사용한다.

```text
Asia/Seoul
```

해외 온라인 행사 등 다른 시간대를 사용하는 경우 원본 시간대를 기록한다.

---

# 3. 행사 분류

## `event_type`

행사가 **어떤 형식으로 진행되는지** 표현한다.

예:

```text
SEMINAR
CONFERENCE
MEETUP
HACKATHON
WORKSHOP
LECTURE
EXHIBITION
FESTIVAL
COMPETITION
NETWORKING
CAREER
ETC
```

예를 들어 게임 개발자 컨퍼런스라면:

```yaml
event_type: CONFERENCE
```

현대 건축 특별전이라면:

```yaml
event_type: EXHIBITION
```

`event_type`은 행사의 주제를 나타내는 필드가 아니다.

---

## `tags`

행사가 **무엇에 관한 행사인지** 표현한다.

하나의 행사에는 여러 태그를 사용할 수 있다.

```yaml
tags:
  - AI
  - Machine Learning
  - Developer
```

또는:

```yaml
tags:
  - Architecture
  - Design
  - Art
```

데이터베이스에서는 별도의 N:M 관계로 관리할 예정이지만, Raw 데이터 수집 단계에서는 배열 형태로 저장할 수 있다.

---

## `target_audience`

행사의 주요 참가 대상이 명확한 경우 저장한다.

```yaml
target_audience:
  - Developer
  - Student
```

다음과 같은 표현을 포함할 수 있다.

```text
Developer
Designer
Student
Researcher
Startup
Professional
General Public
```

원본에 참가 대상이 명시되어 있지 않으면 임의로 추측하지 않는다.

---

# 4. 장소 정보

## `event_mode`

행사 진행 방식을 저장한다.

다음 중 하나를 사용한다.

```text
OFFLINE
ONLINE
HYBRID
```

필수 필드이다.

---

## `venue_name`

오프라인 행사장의 이름을 저장한다.

```yaml
venue_name: COEX Conference Room 301
```

온라인 전용 행사라면 비워둘 수 있다.

---

## `address`

확인 가능한 경우 상세 주소를 저장한다.

```yaml
address: 서울특별시 강남구 영동대로 513
```

주소가 원본에 없으면 임의로 추측할 필요는 없다.

장소 이름만 확인되는 경우 `venue_name`과 `raw_location_text`를 우선 보존한다.

---

## `region`

검색 및 추천에 사용할 수 있는 대략적인 지역 정보를 저장한다.

```yaml
region: 서울
```

예:

```text
서울
경기
인천
광주
대전
대구
부산
제주
```

수집 단계에서는 지나치게 세부적인 지역 정규화를 하지 않는다.

---

## `online_url`

온라인 또는 하이브리드 행사의 실제 접속 링크를 확인할 수 있을 때 저장한다.

```yaml
online_url: https://...
```

단순 행사 소개 페이지는 `source_url` 또는 `official_site_url`에 저장하고, 실제 온라인 행사 참여 주소가 별도로 있을 때만 사용한다.

---

# 5. 신청 정보

## `registration_start_at`

참가 신청이 시작되는 날짜와 시간을 저장한다.

```yaml
registration_start_at: 2026-09-01 09:00
```

확인할 수 없는 경우 비워둔다.

---

## `registration_deadline`

참가 신청 마감 날짜와 시간을 저장한다.

```yaml
registration_deadline: 2026-09-10 18:00
```

단순히 `"선착순 마감"`이라고만 적혀 있다면 임의의 날짜를 넣지 않는다.

대신 다음 필드에 원문을 남긴다.

```yaml
raw_registration_text: "선착순 마감"
```

---

## `registration_url`

실제로 참가 신청을 진행할 수 있는 페이지를 저장한다.

```yaml
registration_url: https://...
```

행사 소개 페이지와 신청 페이지가 동일한 경우 `source_url`과 동일할 수 있다.

---

## `registration_status`

조사 당시 확인할 수 있는 신청 상태를 저장한다.

예:

```text
OPEN
CLOSED
UPCOMING
UNKNOWN
```

단, 상태 판단이 애매한 경우 `UNKNOWN`으로 두거나 비워두고 원문을 보존한다.

---

## `registration_method`

신청 방식이 명확한 경우 저장한다.

예:

```text
사전 신청
선착순
현장 등록
초대
추첨
별도 신청 없음
```

예:

```yaml
registration_method: 선착순 사전 신청
```

가능하면 원문도 함께 저장한다.

---

# 6. 비용 정보

## `price`

행사의 참가 비용을 저장한다.

무료 행사의 경우:

```yaml
price: 0
```

유료 행사의 경우:

```yaml
price: 30000
```

가격 구조가 복잡한 경우 하나의 숫자로 억지로 변환하지 않는다.

예를 들어:

```text
학생 10,000원
일반 30,000원
얼리버드 20,000원
```

이라면 `raw_price_text`에 원문을 보존하는 것을 우선한다.

---

## `currency`

비용의 통화를 저장한다.

국내 행사의 기본값은 다음과 같다.

```yaml
currency: KRW
```

---

# 7. 행사 내용

## `description`

행사의 핵심 내용을 간략히 정리한다.

```yaml
description: 생성형 AI 기술과 실제 산업 적용 사례를 다루는 개발자 세미나.
```

Raw 페이지 전체를 그대로 복사하기보다는 사람이 빠르게 행사의 성격을 파악할 수 있는 수준으로 작성한다.

원문 설명은 `raw_description`에 별도로 보존한다.

---

## `organizer`

주최 또는 주관 기관을 저장한다.

```yaml
organizer: GIST AI Graduate School
```

여러 기관이 있는 경우 배열 또는 원문 형태로 보존할 수 있으며, 세부 정규화는 이후 단계에서 수행한다.

---

## `official_site_url`

조사한 페이지와 별도로 행사의 공식 홈페이지가 존재하면 저장한다.

예를 들어 EventUs에서 행사를 발견했지만 공식 홈페이지가 별도로 존재한다면:

```yaml
source: EventUs
source_url: https://event-us.kr/...
official_site_url: https://official-event.example.com
```

---

# 8. 출처 정보

## `source`

정보를 확인한 출처를 저장한다.

예:

```text
official
EventUs
Meetup
GIST
COEX
Instagram
Naver
```

가능하면 사이트 또는 플랫폼 단위로 일관성 있게 기록한다.

---

## `source_url`

실제로 데이터를 확인한 페이지의 URL을 저장한다.

```yaml
source_url: https://...
```

필수 필드이다.

이 값은 다음 작업에 중요하다.

- 중복 데이터 확인
- 원본 정보 재확인
- 잘못 파싱한 값 검증
- 출처 추적
- 데이터 갱신

따라서 가능한 한 실제 개별 행사 페이지 URL을 저장한다.

---

# 9. 수집 정보

## `collected_at`

해당 데이터를 언제 확인했는지 저장한다.

```yaml
collected_at: 2026-09-08
```

행사 정보는 이후 변경될 수 있으므로 수집 시점을 기록하는 것을 권장한다.

특히 다음 값은 시간이 지나면서 변경될 수 있다.

- 행사 일정
- 장소
- 신청 상태
- 신청 마감
- 가격

---

# 10. 원문 정보

Raw 데이터 수집 단계에서 가장 중요한 원칙 중 하나는 **정규화된 값과 원문을 함께 남기는 것**이다.

---

## `raw_date_text`

원본 페이지에 표시된 날짜와 시간 표현을 그대로 저장한다.

```yaml
raw_date_text: "9월 12일(토) 오후 2시~6시"
```

이 값이 있으면 `start_at` 또는 `end_at` 파싱이 잘못됐을 때 다시 확인할 수 있다.

---

## `raw_location_text`

원본 장소 표현을 그대로 저장한다.

```yaml
raw_location_text: "서울 코엑스 컨퍼런스룸 301"
```

다음과 같은 표현 차이를 나중에 처리하는 데 사용할 수 있다.

```text
코엑스
COEX
서울 코엑스
코엑스 컨퍼런스룸
```

---

## `raw_category_text`

원본 사이트에서 사용하는 행사 분야 또는 카테고리를 저장한다.

```yaml
raw_category_text: "AI / 개발자 / 스타트업"
```

이후 해당 원문이 어떤 `tags`로 변환되었는지 확인하는 데 사용한다.

---

## `raw_registration_text`

신청과 관련된 원문을 저장한다.

```yaml
raw_registration_text: "사전 신청 필수 / 선착순 마감"
```

다음과 같은 표현은 단순한 신청 마감 날짜만으로 표현하기 어렵기 때문에 반드시 원문을 보존하는 것이 좋다.

```text
선착순 마감
현장 등록 가능
사전 등록 필수
조기 마감 가능
초대자 한정
신청 없이 참석 가능
```

---

## `raw_price_text`

가격 관련 원문을 저장한다.

```yaml
raw_price_text: "학생 무료 / 일반 30,000원"
```

복잡한 가격 체계를 단일 `price` 값으로 표현하기 어려운 경우 특히 중요하다.

---

## `raw_description`

원본 행사 소개를 가능한 범위에서 보존한다.

```yaml
raw_description: "..."
```

`description`이 가공된 요약이라면 `raw_description`은 원문 검증용 데이터이다.

---

## `raw_data`

사이트에서 JSON-LD, API 응답 또는 기타 구조화된 원본 데이터를 확보한 경우 사용할 수 있다.

수동 조사에서는 필수 필드가 아니다.

---

# 권장 Raw 데이터 형식

수동 조사 결과는 행사별로 다음 형태의 YAML 구조를 사용하는 것을 권장한다.

```yaml
title:
external_event_id:

start_at:
end_at:
timezone: Asia/Seoul

event_type:

tags: []

target_audience: []

event_mode:

venue_name:
address:
region:
online_url:

registration_start_at:
registration_deadline:
registration_url:
registration_status:
registration_method:

price:
currency: KRW

organizer:
description:
official_site_url:

source:
source_url:
collected_at:

raw_date_text:
raw_location_text:
raw_category_text:
raw_registration_text:
raw_price_text:
raw_description:
```

---

# 예시

원본 페이지에 다음과 같이 적혀 있다고 가정한다.

```text
행사명: AI NEXT 2026
일시: 9월 12일(토) 오후 2시~6시
장소: 서울 코엑스 컨퍼런스룸 301
접수: 선착순 마감
분야: AI / 개발자 / 스타트업
참가비: 무료
```

Raw 수집 결과는 다음과 같이 저장할 수 있다.

```yaml
title: AI NEXT 2026
external_event_id:

start_at: 2026-09-12 14:00
end_at: 2026-09-12 18:00
timezone: Asia/Seoul

event_type: CONFERENCE

tags:
  - AI
  - Development
  - Startup

target_audience:
  - Developer

event_mode: OFFLINE

venue_name: COEX Conference Room 301
address:
region: 서울
online_url:

registration_start_at:
registration_deadline:
registration_url:
registration_status: UNKNOWN
registration_method: 선착순

price: 0
currency: KRW

organizer:
description: AI와 개발, 스타트업을 주제로 진행되는 컨퍼런스.
official_site_url:

source: official
source_url: https://...
collected_at: 2026-09-08

raw_date_text: "9월 12일(토) 오후 2시~6시"
raw_location_text: "서울 코엑스 컨퍼런스룸 301"
raw_category_text: "AI / 개발자 / 스타트업"
raw_registration_text: "선착순 마감"
raw_price_text: "무료"
raw_description:
```

---

# 반드시 확보할 정보

수동 조사 단계에서는 특히 다음 정보를 빠뜨리지 않는다.

## 1. 원본 URL

```yaml
source_url:
```

중복 제거와 출처 추적에 필요하다.

---

## 2. 원문 날짜 및 시간

```yaml
raw_date_text:
```

시간 파싱 오류를 나중에 검증하기 위해 필요하다.

---

## 3. 원문 장소

```yaml
raw_location_text:
```

장소명 정규화에 필요하다.

---

## 4. 원문 관심 분야 및 카테고리

```yaml
raw_category_text:
```

사이트의 원래 분류와 프로젝트 `tags` 사이의 매핑을 검증하기 위해 필요하다.

---

## 5. 신청 관련 원문

```yaml
raw_registration_text:
```

신청 상태가 단순한 날짜만으로 표현되지 않는 경우를 처리하기 위해 필요하다.

---

# 현재 우선순위가 낮은 정보

MVP 수동 조사 단계에서는 다음 정보의 우선순위를 낮게 둔다.

```text
주최자 SNS 계정
행사 이미지 URL
발표자 전체 프로필
세부 세션 전체 목록
행사장 전화번호
주차 정보
좌석 수
예상 참가자 수
실제 참가자 수
좋아요 수
조회 수
SNS 공유 수
```

향후 추천 기능이나 서비스 요구사항에서 필요해지는 경우 추가한다.

---

# 수집 원칙

## 1. 수집과 정규화를 분리한다.

Raw 단계에서 모든 값을 완벽하게 정규화하려 하지 않는다.

```text
웹의 원본 정보
      ↓
Raw 데이터
      ↓
검토
      ↓
Normalized 데이터
```

---

## 2. 알 수 없는 값은 추측하지 않는다.

확인할 수 없는 값은 빈 값으로 남긴다.

예를 들어 종료 시간이 없는 경우:

```yaml
end_at:
```

으로 남긴다.

임의로 예상 종료 시간을 입력하지 않는다.

---

## 3. 정규화된 값과 원문을 함께 저장한다.

예:

```yaml
start_at: 2026-09-12 14:00
raw_date_text: "9월 12일 오후 두 시"
```

이 구조를 통해 이후 파싱 또는 정규화 오류를 추적할 수 있다.

---

## 4. 하나의 행사는 여러 태그를 가질 수 있다.

예:

```yaml
tags:
  - Game
  - AI
  - Development
```

Raw 단계에서는 배열 형태로 저장하고, 데이터베이스 적재 단계에서 N:M 관계로 변환한다.

---

## 5. `event_type`과 `tags`를 구분한다.

`event_type`:

> 행사가 어떤 형태인가?

`tags`:

> 행사가 무엇에 관한 것인가?

예:

```yaml
title: Indie Game Developer Conference

event_type: CONFERENCE

tags:
  - Game
  - Indie Game
  - Development
```

---

## 6. Raw 데이터는 원칙적으로 수정하지 않는다.

수집 이후 오류가 발견된 경우 Raw 데이터를 덮어쓰기보다 `normalized` 단계에서 수정한다.

Raw 데이터는 **수집 당시 무엇을 확인했는지 추적하기 위한 기록**으로 사용한다.

---

# 향후 변경

본 필드 목록은 MVP 수동 데이터 수집을 위한 초기 기준이다.

실제 데이터 수집 과정에서 반복적으로 등장하지만 현재 구조로 표현하기 어려운 정보가 발견될 경우 별도의 Technical Decision 또는 Data Collection Decision을 작성한 뒤 필드를 확장한다.

단, 필드를 추가하기 전에 다음을 확인한다.

1. 실제 추천 또는 검색 기능에서 필요한가?
2. 여러 행사에서 반복적으로 등장하는 정보인가?
3. 기존 `raw_*` 필드만으로 충분히 보존할 수 없는가?
4. 수집 비용에 비해 활용 가치가 충분한가?

이 기준을 만족하는 경우에만 정식 수집 필드로 추가한다.