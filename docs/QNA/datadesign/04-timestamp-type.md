
# Timestamp Type

## 문제

행사 데이터에는 여러 종류의 날짜와 시간이 포함된다.

예를 들어 다음과 같은 값이 필요하다.

- 행사 시작 시각
- 행사 종료 시각
- 신청 마감 시각
- 데이터 생성 시각
- 데이터 수정 시각

PostgreSQL에서는 시간 정보를 저장할 때 주로 다음 두 타입을 사용할 수 있다.

```text
TIMESTAMP
TIMESTAMPTZ
```

이 프로젝트에서 어떤 타입을 사용할지 결정해야 한다.

---

## 두 타입의 차이

### `TIMESTAMP`

정확한 타입명은 다음과 같다.

```sql
TIMESTAMP WITHOUT TIME ZONE
```

예:

```text
2026-09-12 14:00:00
```

이 값은 단순히 "2026년 9월 12일 14시"라는 정보만 저장한다.

이 시간이 한국 시간인지, 일본 시간인지, UTC인지에 대한 정보는 포함하지 않는다.

---

### `TIMESTAMPTZ`

정확한 타입명은 다음과 같다.

```sql
TIMESTAMP WITH TIME ZONE
```

PostgreSQL은 입력된 시간과 시간대 정보를 이용해 **하나의 절대적인 시점**을 저장한다.

예를 들어 다음 두 값은 같은 시점을 의미한다.

```text
2026-09-12 14:00:00+09
2026-09-12 05:00:00+00
```

PostgreSQL은 이를 내부적으로 동일한 시점으로 처리한다.

조회할 때는 DB 세션의 timezone 설정에 따라 적절한 현지 시간으로 변환해 보여준다.

---

## 고려한 방식

### 1. `TIMESTAMP` 사용

예:

```sql
start_at TIMESTAMP NOT NULL,
end_at TIMESTAMP NOT NULL
```

#### 장점

- 데이터가 사람이 입력한 현지 시각 그대로 저장된다.
- 모든 행사가 동일한 시간대를 사용한다면 구조가 단순하다.
- 시간대 변환을 고려하지 않아도 된다.

#### 단점

- 해당 시간이 어느 시간대를 기준으로 하는지 데이터 자체만으로 알 수 없다.
- 서버나 애플리케이션의 timezone 설정에 의존할 수 있다.
- 해외 행사나 온라인 행사를 지원할 경우 시간 해석이 모호해질 수 있다.
- UTC 기반 시스템과 연동할 때 별도의 변환 규칙이 필요하다.

---

### 2. `TIMESTAMPTZ` 사용

예:

```sql
start_at TIMESTAMPTZ NOT NULL,
end_at TIMESTAMPTZ NOT NULL
```

#### 장점

- 하나의 명확한 절대 시점을 표현할 수 있다.
- 서로 다른 시간대의 행사를 일관되게 비교할 수 있다.
- 서버가 어느 지역에서 실행되더라도 시간 의미가 유지된다.
- API, JavaScript, 외부 서비스와 UTC 기반으로 연동하기 쉽다.
- 향후 해외 행사나 온라인 행사로 범위를 확장하기 쉽다.

#### 단점

- 입력 시 시간대 정보를 명확히 처리해야 한다.
- PostgreSQL이 원래 입력된 timezone 이름 자체를 보존하는 것은 아니다.
- 단순한 날짜 개념까지 무조건 `TIMESTAMPTZ`로 표현하면 오히려 부적절할 수 있다.

---

## 결정

**특정 시점을 표현하는 컬럼에는 `TIMESTAMPTZ`를 사용한다.**

예상 컬럼은 다음과 같다.

```sql
start_at TIMESTAMPTZ NOT NULL,
end_at TIMESTAMPTZ NOT NULL,
registration_deadline TIMESTAMPTZ,
created_at TIMESTAMPTZ NOT NULL,
updated_at TIMESTAMPTZ NOT NULL
```

---

## 선택 이유

현재 MVP는 국내 행사를 우선 대상으로 하므로 대부분의 행사 시간이 한국 표준시(`Asia/Seoul`, UTC+9)를 기준으로 할 가능성이 높다.

그렇더라도 행사 시간은 단순한 숫자 조합이 아니라 **현실 세계의 특정 시점**을 의미한다.

예를 들어 다음 정보는 서로 같은 시점을 가리킨다.

```text
서울: 2026-09-12 14:00
UTC:  2026-09-12 05:00
```

이 관계를 데이터베이스에서 명확하게 유지하려면 `TIMESTAMPTZ`가 더 적합하다.

또한 향후 다음과 같은 상황을 고려할 수 있다.

- 해외에서 진행되는 컨퍼런스
- 해외 주최 온라인 행사
- 서로 다른 시간대 사용자가 같은 행사를 조회
- API에서 UTC 기반 시간 사용
- 서버 배포 환경의 timezone 변경

따라서 MVP가 한국 중심이라고 해서 데이터 모델 자체를 한국 시간에만 의존하도록 만들 필요는 없다고 판단했다.

---

## 날짜만 필요한 값은 별도로 처리

모든 날짜 정보를 `TIMESTAMPTZ`로 저장하는 것은 아니다.

시간 자체가 중요하지 않고 날짜만 의미가 있는 데이터에는 `DATE`를 사용한다.

예:

```sql
event_date DATE
```

다만 행사 시작과 종료처럼 정확한 시각이 존재한다면 별도의 `event_date`를 중복 저장하지 않고 `start_at`에서 날짜를 계산하는 것을 우선한다.

---

## 입력 규칙

외부에서 행사 시간을 수집할 때는 반드시 해당 시간이 어느 시간대를 기준으로 하는지 확인한다.

예를 들어 한국 행사에서 다음과 같은 정보가 수집되었다고 가정한다.

```text
2026-09-12 14:00
```

출처가 한국 현지 행사이고 별도의 timezone이 명시되어 있지 않다면 수집 단계에서 이를 다음과 같이 해석한다.

```text
2026-09-12 14:00 Asia/Seoul
```

즉, 단순 문자열을 그대로 DB에 넣는 것이 아니라 수집 또는 정제 단계에서 timezone을 명시적으로 결정한다.

---

## JavaScript와의 연동

JavaScript의 `Date`는 하나의 절대 시점을 기반으로 동작하므로 `TIMESTAMPTZ`와 비교적 자연스럽게 연동할 수 있다.

API에서는 ISO 8601 형식을 사용하는 것을 기본 원칙으로 한다.

예:

```text
2026-09-12T14:00:00+09:00
```

또는 UTC로 반환할 경우:

```text
2026-09-12T05:00:00Z
```

두 값은 동일한 시점을 의미한다.

---

## 원래 행사 시간대 보존 문제

`TIMESTAMPTZ`는 절대 시점을 저장하지만, 사용자가 처음 입력한 timezone 이름 자체를 보존하지는 않는다.

예를 들어 다음 정보를 입력하더라도:

```text
2026-09-12 14:00 Asia/Seoul
```

PostgreSQL이 `"Asia/Seoul"`이라는 문자열을 `TIMESTAMPTZ` 값 내부에 별도로 저장하는 것은 아니다.

향후 해외 행사에서 **행사가 원래 어느 지역의 현지 시간을 기준으로 하는지** 표시해야 한다면 별도의 컬럼을 추가할 수 있다.

예:

```sql
timezone VARCHAR(50)
```

값:

```text
Asia/Seoul
America/New_York
Europe/London
```

현재 국내 중심 MVP에서는 이 컬럼을 필수로 두지 않는다.

---

## 예외: 시간이 확정되지 않은 행사

일부 행사 데이터는 다음과 같이 날짜만 공개될 수 있다.

```text
2026년 9월 12일
시간 추후 공개
```

이 경우 임의로 다음과 같은 값을 만들어 저장하지 않는다.

```text
2026-09-12 00:00
```

자정에 행사가 시작된다는 잘못된 의미가 생기기 때문이다.

시간 미확정 행사를 지원할 필요가 생긴다면 별도의 모델링을 검토한다.

예:

```text
start_at = NULL
event_date = 2026-09-12
```

또는 시간 확정 여부를 나타내는 별도 상태를 둘 수 있다.

이 문제는 실제 수집 데이터에서 이러한 사례가 등장할 때 다시 결정한다.

---

## 예상 스키마

```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,

    registration_deadline TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

추가로 다음과 같은 제약조건을 둘 수 있다.

```sql
CHECK (
    end_at IS NULL
    OR end_at >= start_at
)
```

행사 종료 시간이 존재한다면 시작 시간보다 빠를 수 없도록 한다.

---

## 결론

행사 시작, 종료, 신청 마감처럼 **현실 세계의 특정 시점을 표현하는 값에는 `TIMESTAMPTZ`를 사용한다.**

```text
행사 시작 시각
→ TIMESTAMPTZ

행사 종료 시각
→ TIMESTAMPTZ

신청 마감 시각
→ TIMESTAMPTZ

created_at / updated_at
→ TIMESTAMPTZ

날짜만 의미하는 값
→ DATE
```

현재 MVP는 국내 행사를 중심으로 하지만, 시간 데이터 자체는 특정 시간대에 종속되지 않는 절대적인 시점으로 저장한다.

이를 통해 서버 환경과 무관하게 일관된 시간 처리가 가능하고, 향후 해외 및 온라인 행사로 확장할 때도 데이터 모델을 변경할 필요가 없도록 한다.