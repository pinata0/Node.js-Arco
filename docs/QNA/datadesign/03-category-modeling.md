# Category Modeling

## 문제

행사 추천 서비스에서는 행사를 일정한 기준으로 분류해야 한다.

대표적으로 다음 두 종류의 분류가 있다.

- 행사 종류
  - 세미나
  - 컨퍼런스
  - 밋업
  - 해커톤
  - 전시
- 관심 분야
  - AI
  - Backend
  - Web
  - Game
  - Data

이러한 값을 데이터베이스에서 어떻게 제한하고 관리할지 결정해야 한다.

---

## 고려한 방식

### 1. 애플리케이션 enum 또는 DB enum 사용

예:

```text
event_type = SEMINAR
event_type = CONFERENCE
event_type = MEETUP
```

PostgreSQL에서는 다음과 같이 enum 타입을 정의할 수 있다.

```sql
CREATE TYPE event_type AS ENUM (
    'SEMINAR',
    'CONFERENCE',
    'MEETUP',
    'HACKATHON'
);
```

#### 장점

- 허용되는 값을 명확하게 제한할 수 있다.
- 잘못된 값이 저장되는 것을 방지하기 쉽다.
- 별도의 테이블이나 JOIN이 필요하지 않다.
- 행사 종류처럼 값의 종류가 적고 안정적이라면 구조가 단순하다.

#### 단점

- 새로운 값을 추가하거나 기존 값을 변경할 때 스키마 변경이 필요하다.
- 값 자체에 설명이나 표시명 등의 추가 정보를 붙이기 어렵다.
- 분류 체계가 자주 바뀌는 경우 관리가 불편하다.

---

### 2. 별도 테이블로 관리

예:

```text
event_categories
├── id
├── name
└── display_name
```

행사와 연결하면 다음과 같은 구조가 된다.

```text
event_categories
       1
       │
       N
     events
```

#### 장점

- 새로운 분류를 데이터 추가만으로 확장할 수 있다.
- 분류에 설명, 표시명, 정렬 순서 등의 속성을 추가하기 쉽다.
- 운영 중 분류 체계를 변경하기 쉽다.

#### 단점

- 별도의 테이블이 필요하다.
- 단순한 값 하나를 조회하기 위해 JOIN이 필요할 수 있다.
- 값의 종류가 거의 변하지 않는 경우 구조가 과도하게 복잡해질 수 있다.

---

## 행사 종류와 관심 분야는 성격이 다름

처음에는 두 값을 같은 방식으로 관리할 수 있어 보이지만, 실제로는 역할이 다르다.

### 행사 종류

행사 종류는 보통 하나의 행사에 하나의 대표 값이 붙는다.

예:

```text
SEMINAR
CONFERENCE
MEETUP
HACKATHON
```

값의 종류도 비교적 제한적이고 급격히 늘어날 가능성이 낮다.

따라서 단일 값으로 제한하기 적합하다.

---

### 관심 분야

관심 분야는 하나의 행사에 여러 개가 붙을 수 있다.

예:

```text
AI
Backend
Web
```

또한 추천과 검색의 핵심 기준이므로 독립적으로 관리할 필요가 있다.

이 부분은 `01-tag-modeling.md`에서 결정한 대로 N:M 구조를 사용한다.

즉, 관심 분야를 별도의 category enum으로 다시 만들지 않고 `tags` 테이블을 사용한다.

---

## 결정

### 행사 종류

**행사 종류는 제한된 값으로 관리한다.**

MVP에서는 별도의 `event_categories` 테이블을 만들지 않고 enum 성격의 값으로 관리한다.

예상 값은 다음과 같다.

```text
SEMINAR
CONFERENCE
MEETUP
HACKATHON
WORKSHOP
EXHIBITION
ETC
```

구현 시에는 PostgreSQL enum 또는 애플리케이션 레벨 enum 중 하나를 선택할 수 있다.

---

### 관심 분야

**관심 분야는 별도의 enum이나 category 테이블을 만들지 않는다.**

`01-tag-modeling.md`에서 결정한 `tags`와 `event_tags` 구조를 그대로 사용한다.

```text
events
  │
  │ N:M
  ▼
tags
```

예:

```text
AI
Backend
Frontend
Game
Data
Cloud
Security
```

---

## 선택 이유

행사 종류와 관심 분야는 데이터 특성이 다르기 때문에 동일한 모델링 방식을 적용하지 않는다.

행사 종류는 다음과 같은 특징을 가진다.

- 한 행사에 보통 하나의 값만 필요하다.
- 값의 종류가 비교적 적다.
- 값이 자주 변경될 가능성이 낮다.

따라서 별도의 테이블로 분리하는 것보다 제한된 값으로 관리하는 편이 단순하다.

반면 관심 분야는 다음과 같은 특징을 가진다.

- 하나의 행사에 여러 값이 붙을 수 있다.
- 추천과 검색에서 핵심적으로 사용된다.
- 새로운 분야가 추가될 가능성이 높다.
- 여러 행사에서 동일한 값이 반복적으로 재사용된다.

따라서 관심 분야는 `tags` 테이블로 관리한다.

---

## 예상 스키마

행사 종류를 문자열과 CHECK 제약조건으로 구현한다면 다음과 같이 구성할 수 있다.

```sql
event_type VARCHAR(30) NOT NULL
    CHECK (
        event_type IN (
            'SEMINAR',
            'CONFERENCE',
            'MEETUP',
            'HACKATHON',
            'WORKSHOP',
            'EXHIBITION',
            'ETC'
        )
    )
```

PostgreSQL enum을 사용할 경우에는 다음과 같이 구현할 수도 있다.

```sql
CREATE TYPE event_type AS ENUM (
    'SEMINAR',
    'CONFERENCE',
    'MEETUP',
    'HACKATHON',
    'WORKSHOP',
    'EXHIBITION',
    'ETC'
);
```

```sql
event_type event_type NOT NULL
```

---

## PostgreSQL enum과 CHECK 제약조건

현재 단계에서는 행사 종류를 제한된 값으로 관리한다는 원칙만 확정한다.

실제 구현 방식은 다음 두 가지를 사용할 수 있다.

```text
PostgreSQL ENUM
```

또는

```text
VARCHAR + CHECK
```

MVP에서는 값 변경 가능성을 고려하면 `VARCHAR + CHECK`가 조금 더 유연할 수 있다.

PostgreSQL enum은 타입 안정성이 높지만, 분류 값을 수정하거나 제거할 때 상대적으로 관리가 번거롭다.

따라서 실제 DDL 작성 단계에서 두 방식 중 하나를 최종 선택한다.

---

## 향후 재검토 기준

다음과 같은 요구가 생기면 행사 종류도 별도 테이블로 분리하는 것을 검토한다.

- 관리자가 행사 종류를 직접 추가하거나 삭제해야 한다.
- 행사 종류에 설명이나 아이콘 등의 추가 정보가 필요하다.
- 행사 종류의 다국어 표시명이 필요하다.
- 행사 종류별 정렬 순서나 노출 여부를 관리해야 한다.
- 분류 체계가 자주 변경된다.

이 경우 다음과 같은 구조로 변경할 수 있다.

```text
event_types
├── id
├── name
├── display_name
├── description
└── sort_order
```

그리고 `events`는 `event_type_id`를 참조한다.

---

## 결론

MVP에서는 분류 성격에 따라 서로 다른 모델링 방식을 사용한다.

```text
행사 종류
→ 제한된 단일 값
→ enum 성격으로 관리

관심 분야
→ 여러 값 허용
→ tags + event_tags N:M 관계로 관리
```

행사 종류는 현재 요구사항에서 독립 엔티티로 관리할 실익이 크지 않으므로 별도 테이블을 만들지 않는다.

관심 분야는 검색과 추천의 핵심 데이터이며 여러 행사에서 반복적으로 사용되므로 `01-tag-modeling.md`에서 결정한 태그 모델을 사용한다.