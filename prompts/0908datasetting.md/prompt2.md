TARGET_MONTH=01

2026년 `TARGET_MONTH`월에 대한민국에서 열리거나, 대한민국 거주자가 온라인으로 참여할 수 있는 행사 데이터를 조사해줘.

목표는 **Raw 행사 데이터 60개 이상**을 수집하는 것이다.

단순히 개발 행사만 찾지 말고, 아래 관심 분야를 폭넓게 조사해줘.

## 조사 대상 분야

### 기술
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
- Software
- Technology
- Science

### 게임
- Game
- Game Development
- Indie Game
- Esports

### 건축 및 공간
- Architecture
- Interior
- Urban
- Spatial Design

### 디자인
- Design
- Graphic Design
- UX/UI
- Product Design
- Industrial Design

### 예술 및 문화
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

### 스타트업 및 기타
- Startup
- Entrepreneurship
- Business
- Career
- Education

분야별 개수를 억지로 맞추지는 말되, 특정 분야에 지나치게 편중되지 않도록 조사해줘.

참고 목표는 다음과 같다.

- AI / ML / Data: 약 8개
- 개발 / SW / 보안 / Cloud: 약 10개
- 게임 / 인디게임 / e스포츠: 약 6개
- 스타트업 / 비즈니스 / 커리어: 약 6개
- 건축 / 공간 / 도시: 약 6개
- 디자인 / UX/UI / 제품: 약 6개
- 미술 / 전시 / 미디어아트: 약 8개
- 영상 / 음악 / 공연 / 문학: 약 6개
- 기타 과학 / 기술 / 융합: 약 4개

이 숫자는 강제 quota가 아니라 다양성 확보를 위한 참고 기준이다.

---

# 조사 대상 행사 유형

다음과 같은 실제 참여 또는 관람 가능한 행사를 포함해줘.

- SEMINAR
- CONFERENCE
- MEETUP
- HACKATHON
- WORKSHOP
- LECTURE
- EXHIBITION
- FESTIVAL
- COMPETITION
- NETWORKING
- CAREER
- ETC

단순 뉴스 기사, 온라인 콘텐츠, 상시 서비스, 행사성이 없는 홍보 페이지는 제외해줘.

---

# 날짜 기준

행사가 **2026년 `TARGET_MONTH`월에 실제로 진행되는 경우**만 포함해줘.

여러 날에 걸친 행사는 해당 월과 일정이 겹치면 포함할 수 있다.

예:
- 2026-01-30 ~ 2026-02-02 → 1월 조사와 2월 조사 양쪽에서 발견될 수 있음
- 이후 중복 제거는 별도 단계에서 수행하므로 Raw 단계에서는 발견 사실을 우선 기록해도 됨

행사 개최일과 신청일을 혼동하지 말아줘.

---

# 지역 기준

대한민국 전 지역을 대상으로 조사해줘.

예:
- 서울
- 경기
- 인천
- 광주
- 대전
- 대구
- 부산
- 울산
- 세종
- 강원
- 충북
- 충남
- 전북
- 전남
- 경북
- 경남
- 제주

ONLINE 또는 HYBRID 행사도 포함할 수 있다.

해외 주최 행사라도 대한민국에서 온라인 참여가 현실적으로 가능하고, 한국 거주자가 참여할 가치가 있는 경우 포함할 수 있다.

---

# 출처 조사 원칙

가능하면 다음과 같은 여러 출처를 폭넓게 확인해줘.

- 공식 행사 홈페이지
- 주최 기관 공식 홈페이지
- EventUs
- Meetup
- 대학 및 연구기관 공지
- 기업 공식 행사 페이지
- 전시관 및 미술관 공식 홈페이지
- 컨벤션센터 공식 일정
- 디자인 / 건축 관련 기관
- 게임 관련 기관 및 커뮤니티
- 정부 및 공공기관 행사 페이지
- 기타 신뢰할 수 있는 행사 플랫폼

동일한 행사가 여러 출처에 등장할 수 있다.

Raw 단계에서는 발견해도 되지만, 명백하게 동일한 행사임을 확인한 경우 가능하면 가장 신뢰도 높은 출처 하나를 대표 레코드로 사용해줘.

공식 출처를 찾을 수 있다면 공식 출처를 우선해줘.

---

# 행사별 수집 필드

행사 하나당 다음 필드를 작성해줘.

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

# 필드 작성 규칙

## `title`

공식 행사명을 가능한 한 원문 그대로 기록해줘.

임의로 번역하거나 축약하지 말아줘.

필수 필드다.

---

## `external_event_id`

EventUs, Meetup 등 플랫폼의 고유 행사 ID를 확인할 수 있는 경우 기록해줘.

알 수 없으면 빈 값으로 둬.

---

## `start_at`

실제 행사 시작 일시를 작성해줘.

형식:

```text
YYYY-MM-DD HH:mm
```

필수 필드다.

시간을 확인할 수 없고 날짜만 확인 가능한 행사라면 임의로 시간을 추측하지 말고 다음처럼 작성해줘.

```yaml
start_at: 2026-01-15
```

그리고 원문은 반드시 `raw_date_text`에 남겨줘.

---

## `end_at`

확인 가능한 경우 실제 행사 종료 일시를 작성해줘.

알 수 없으면 빈 값으로 둬.

절대로 예상 종료 시간을 임의로 만들지 말아줘.

---

## `timezone`

대한민국 기준 행사는:

```yaml
timezone: Asia/Seoul
```

해외 온라인 행사 등 다른 시간대를 사용하는 경우 실제 시간대를 기록해줘.

---

## `event_type`

행사가 어떤 형태인지 나타낸다.

가능하면 다음 값 중 하나를 사용해줘.

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

행사의 주제가 아니라 형식을 기준으로 판단해줘.

예:

```text
AI 개발자 컨퍼런스
```

→

```yaml
event_type: CONFERENCE
```

---

## `tags`

행사가 무엇에 관한 것인지 나타내는 관심 분야 태그다.

여러 개를 사용할 수 있다.

예:

```yaml
tags:
  - AI
  - Machine Learning
  - Startup
```

또는:

```yaml
tags:
  - Game
  - Indie Game
  - Development
```

또는:

```yaml
tags:
  - Architecture
  - Design
  - Art
```

Raw 단계이므로 태그를 지나치게 제한하지 않아도 된다.

다만 의미가 겹치는 태그를 과도하게 추가하지 말아줘.

---

## `target_audience`

원본 페이지에 참가 대상이 명시된 경우만 작성해줘.

예:

```yaml
target_audience:
  - Developer
  - Student
```

명시되어 있지 않다면 참가 대상을 추측하지 말고 빈 배열로 둬.

---

## `event_mode`

다음 중 하나를 사용해줘.

```text
OFFLINE
ONLINE
HYBRID
```

필수 필드다.

---

## `venue_name`

행사장 또는 시설명을 작성해줘.

예:

```yaml
venue_name: COEX
```

또는:

```yaml
venue_name: DDP
```

없으면 비워둬.

---

## `address`

확인 가능한 실제 주소를 기록해줘.

원본에서 주소가 확인되지 않는 경우 임의로 검색해서 추측해 채우기보다는 빈 값으로 두는 것을 우선해줘.

단, 공식 행사장 페이지 등 신뢰할 수 있는 출처에서 명확히 확인 가능한 경우 보완해도 된다.

---

## `region`

대한민국 행사는 광역 지역 수준으로 작성해줘.

예:

```text
서울
경기
광주
부산
대전
```

온라인 전용이고 특정 지역이 없다면 빈 값으로 둘 수 있다.

---

## `online_url`

실제 온라인 참여 링크가 명시된 경우 기록해줘.

행사 소개 페이지와 동일한 경우 억지로 넣지 않아도 된다.

---

## 신청 관련 필드

다음 필드는 확인 가능한 경우만 채워줘.

```yaml
registration_start_at:
registration_deadline:
registration_url:
registration_status:
registration_method:
```

`registration_status`는 가능하면 다음 값을 사용해줘.

```text
OPEN
CLOSED
UPCOMING
UNKNOWN
```

단, 상태가 애매하면 `UNKNOWN`을 사용해줘.

예를 들어:

```text
선착순 마감
```

이라고만 적혀 있다면 임의의 deadline을 생성하지 말아줘.

대신:

```yaml
registration_method: 선착순
raw_registration_text: "선착순 마감"
```

처럼 원문을 남겨줘.

---

## `price`

무료인 경우:

```yaml
price: 0
```

명확한 단일 가격이 있는 경우 숫자로 작성해줘.

예:

```yaml
price: 30000
```

다음과 같이 가격 체계가 여러 개면:

```text
학생 10,000원 / 일반 30,000원
```

하나를 임의로 선택하지 말고 `price`를 비워두고:

```yaml
raw_price_text: "학생 10,000원 / 일반 30,000원"
```

으로 남겨줘.

---

## `currency`

대한민국 행사는 기본적으로:

```yaml
currency: KRW
```

---

## `organizer`

공식적으로 확인되는 주최 또는 주관 기관을 기록해줘.

확실하지 않으면 비워둬.

---

## `description`

행사의 핵심 내용을 1~3문장으로 짧게 요약해줘.

검색 결과 문구만 보고 내용을 과장하거나 추측하지 말아줘.

---

## `official_site_url`

`source_url`이 EventUs나 Meetup 같은 중개 플랫폼이고 별도의 공식 행사 페이지를 찾은 경우 기록해줘.

없으면 비워둬.

---

## `source`

정보를 실제로 확인한 출처명을 기록해줘.

예:

```text
official
EventUs
Meetup
GIST
COEX
DDP
국립현대미술관
```

---

## `source_url`

실제로 행사 정보를 확인한 개별 페이지 URL을 기록해줘.

반드시 실제 행사 또는 공식 일정 페이지를 사용해줘.

검색 결과 페이지 URL만 기록하지 말아줘.

필수 필드다.

---

## `collected_at`

이번 조사 날짜를 기록해줘.

형식:

```text
YYYY-MM-DD
```

---

# Raw 원문 필드

다음 원문 정보는 특히 중요하다.

가능한 한 반드시 기록해줘.

## `raw_date_text`

웹페이지에 표시된 행사 날짜와 시간 표현을 가능한 한 그대로 기록해줘.

예:

```yaml
raw_date_text: "9월 12일(토) 오후 2시~6시"
```

---

## `raw_location_text`

원본의 장소 표현을 그대로 기록해줘.

예:

```yaml
raw_location_text: "서울 코엑스 컨퍼런스룸 301"
```

---

## `raw_category_text`

출처 사이트에서 사용하는 카테고리나 분야 표현을 그대로 기록해줘.

예:

```yaml
raw_category_text: "AI / 개발자 / 스타트업"
```

원본에 별도 카테고리가 없다면 행사 소개 문구에서 임의로 만들어내지 말고 비워둬.

---

## `raw_registration_text`

신청과 관련된 원문 표현을 기록해줘.

예:

```yaml
raw_registration_text: "사전 신청 필수 / 선착순 마감"
```

---

## `raw_price_text`

가격 원문을 기록해줘.

예:

```yaml
raw_price_text: "무료"
```

또는:

```yaml
raw_price_text: "얼리버드 20,000원 / 일반 30,000원"
```

---

## `raw_description`

출처에서 확인할 수 있는 핵심 행사 소개 원문을 짧게 보존해줘.

전체 페이지를 통째로 복사할 필요는 없다.

후속 검증에 필요한 핵심 문구만 남겨줘.

---

# 절대 하지 말아야 할 것

1. 확인할 수 없는 날짜나 시간을 추측하지 말 것.
2. 행사 종료 시간을 임의로 만들지 말 것.
3. 참가 대상을 추측하지 말 것.
4. 주소를 확신할 수 없는데 임의로 채우지 말 것.
5. 신청 마감일을 추측하지 말 것.
6. 가격 체계가 여러 개인데 임의로 하나만 `price`로 선택하지 말 것.
7. 2026년 `TARGET_MONTH`월 개최 여부가 불분명한 행사를 포함하지 말 것.
8. 검색 결과 제목만 보고 행사 정보를 생성하지 말 것.
9. 실제 존재 여부를 확인하지 않은 행사를 만들지 말 것.
10. 서로 다른 날짜의 동일 행사나 동일 행사의 중복 노출을 별개 행사인 것처럼 무분별하게 부풀리지 말 것.

---

# 출력 형식

결과는 Markdown으로 작성해줘.

맨 위에 다음 요약을 먼저 작성해줘.

```markdown
# 2026년 TARGET_MONTH월 행사 Raw 데이터

- 조사 목표: 60개 이상
- 실제 수집: N개
- 조사일: YYYY-MM-DD
```

그 다음 분야 분포를 표로 작성해줘.

예:

```markdown
| 분야군 | 개수 |
|---|---:|
| AI / ML / Data | 8 |
| 개발 / SW | 12 |
| 게임 | 7 |
| 건축 / 공간 | 4 |
| 디자인 | 6 |
| 예술 / 문화 | 15 |
| 스타트업 / 커리어 | 5 |
| 기타 | 3 |
```

그 다음 각 행사를 아래 형식으로 순서대로 작성해줘.

```markdown
## 001. 행사명

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
```

행사 번호는 `001`, `002`, `003`처럼 3자리로 작성해줘.

---

# 최종 검증

모든 수집이 끝난 뒤 마지막에 다음 항목을 검증해줘.

```markdown
## 수집 검증

- [ ] 60개 이상의 행사 후보를 조사했는가?
- [ ] 모든 행사에 `title`이 있는가?
- [ ] 모든 행사에 `start_at`이 있는가?
- [ ] 모든 행사에 `event_type`이 있는가?
- [ ] 모든 행사에 하나 이상의 `tags`가 있는가?
- [ ] 모든 행사에 `event_mode`가 있는가?
- [ ] 모든 행사에 `source`가 있는가?
- [ ] 모든 행사에 `source_url`이 있는가?
- [ ] 가능한 경우 `raw_date_text`를 확보했는가?
- [ ] 가능한 경우 `raw_location_text`를 확보했는가?
- [ ] 가능한 경우 `raw_category_text`를 확보했는가?
- [ ] 가능한 경우 `raw_registration_text`를 확보했는가?
- [ ] 명백한 중복 행사를 과도하게 포함하지 않았는가?
- [ ] 해당 월에 실제 개최되는 행사만 포함했는가?
```

마지막으로 발견한 문제나 부족한 분야가 있다면 간단히 적어줘.

예:

```markdown
## 조사 메모

- 건축 분야 행사 수가 적음
- 게임 행사 중 일부는 공식 일정 발표 전이라 제외함
- 일부 전시는 종료 시간 정보가 없어 `end_at`을 비워둠
```

중요: 이번 단계의 목적은 **완벽하게 정규화된 데이터 생성이 아니라, 검증 가능한 Raw 데이터 수집**이다. 원문과 출처를 최대한 보존하는 것을 우선해줘.