# Registration Status

## 문제

행사 추천 서비스에서는 사용자가 현재 신청 가능한 행사인지 빠르게 판단할 수 있어야 한다.

예를 들어 다음과 같은 상태가 있을 수 있다.

- 신청 가능
- 신청 마감
- 신청 시작 전
- 신청 기간 정보 없음

이 상태를 `events` 테이블에 직접 저장할지, 신청 시작일과 마감일을 기준으로 계산할지 결정해야 한다.

---

## 고려한 방식

### 1. 신청 가능 여부를 컬럼으로 직접 저장

예:

```sql
is_registration_open BOOLEAN
```

또는 상태값으로 관리할 수도 있다.

```text
OPEN
CLOSED
NOT_STARTED
UNKNOWN
```

#### 장점

- 조회가 단순하다.
- 현재 신청 가능한 행사만 빠르게 필터링할 수 있다.
- API에서 별도 계산 없이 바로 상태를 반환할 수 있다.

#### 단점

- 시간이 지나면 값이 자동으로 변경되지 않는다.
- 신청 마감 시간이 지났는데도 `OPEN` 상태로 남을 수 있다.
- 상태를 최신으로 유지하기 위한 배치 작업이나 갱신 로직이 필요하다.
- 신청 마감일과 상태값이 서로 충돌할 수 있다.

예를 들어 다음과 같은 모순이 발생할 수 있다.

```text
registration_deadline = 2026-09-10 18:00
registration_status   = OPEN

현재 시각 = 2026-09-11 12:00
```

실제로는 신청이 마감되었지만 저장된 상태값은 여전히 `OPEN`이다.

---

### 2. 신청 기간을 저장하고 상태를 계산

다음과 같이 원본 사실만 저장한다.

```sql
registration_start_at TIMESTAMPTZ,
registration_deadline TIMESTAMPTZ
```

신청 상태는 현재 시각과 비교해서 계산한다.

예:

```text
현재 < registration_start_at
→ 신청 시작 전

registration_start_at <= 현재 <= registration_deadline
→ 신청 가능

현재 > registration_deadline
→ 신청 마감
```

#### 장점

- 상태가 시간의 흐름에 따라 자동으로 올바르게 결정된다.
- 상태값과 마감일 사이의 불일치가 발생하지 않는다.
- 별도의 상태 갱신 작업이 필요하지 않다.
- DB에는 실제 사실에 가까운 데이터만 저장하게 된다.

#### 단점

- 조회할 때마다 상태를 계산해야 한다.
- 신청 기간 정보가 불완전한 행사에 대한 별도 규칙이 필요하다.
- 주최 측이 마감일 이전에 신청을 조기 종료한 경우 날짜만으로는 정확한 상태를 알 수 없다.

---

## 결정

**신청 가능 여부를 별도의 컬럼으로 저장하지 않고, 신청 기간 정보를 기반으로 계산한다.**

즉, 다음과 같은 파생 값은 기본적으로 DB에 저장하지 않는다.

```text
is_registration_open
registration_status
```

대신 다음과 같은 원본 데이터를 저장한다.

```sql
registration_start_at TIMESTAMPTZ,
registration_deadline TIMESTAMPTZ
```

신청 시작 시간이 제공되지 않는 경우 `NULL`을 허용한다.

---

## 선택 이유

신청 가능 여부는 독립적인 사실이라기보다 **현재 시각과 신청 기간으로부터 결정되는 파생 상태**다.

예를 들어 신청 마감 시간이 다음과 같다면:

```text
2026-09-12 18:00
```

18시 이전과 이후의 신청 상태는 별도의 DB 수정 없이도 자연스럽게 달라져야 한다.

이를 `is_registration_open` 같은 컬럼으로 저장하면 시간이 지날 때마다 값을 갱신해야 하며, 갱신에 실패할 경우 실제 신청 기간과 저장된 상태가 서로 달라질 수 있다.

따라서 데이터베이스에는 가능한 한 다음과 같은 사실을 저장한다.

```text
신청 시작 시각
신청 마감 시각
```

그리고 다음과 같은 상태는 애플리케이션에서 계산한다.

```text
신청 시작 전
신청 가능
신청 마감
```

---

## 기본 상태 계산 규칙

신청 시작 시각과 마감 시각이 모두 존재한다면 다음과 같이 판단한다.

```text
now < registration_start_at
→ NOT_STARTED

registration_start_at <= now <= registration_deadline
→ OPEN

now > registration_deadline
→ CLOSED
```

신청 시작 시간이 없고 마감 시간만 존재한다면 다음과 같이 판단한다.

```text
now <= registration_deadline
→ OPEN

now > registration_deadline
→ CLOSED
```

---

## 신청 기간 정보가 없는 경우

일부 행사에서는 신청 마감일을 제공하지 않을 수 있다.

예:

```text
선착순 모집
현장 접수
신청 기간 미기재
```

이 경우 `registration_deadline`을 임의로 생성하지 않는다.

```sql
registration_deadline = NULL
```

그리고 신청 상태 역시 자동으로 `OPEN`이라고 판단하지 않는다.

기본적으로 다음과 같은 상태로 처리한다.

```text
UNKNOWN
```

즉:

```text
registration_deadline IS NULL
→ UNKNOWN
```

필요하다면 화면에서는 다음과 같이 표현할 수 있다.

```text
신청 가능 여부 확인 필요
```

---

## 신청 페이지 자체가 없는 경우

모든 행사가 사전 신청을 요구하는 것은 아니다.

예를 들어 다음과 같은 경우가 있을 수 있다.

- 무료 공개 행사
- 현장 입장 행사
- 신청 없이 참여 가능한 행사

따라서 `registration_url`이 없다는 이유만으로 해당 행사를 신청 마감 상태로 간주해서는 안 된다.

향후 실제 데이터 수집 과정에서 필요하다면 신청 방식을 별도로 표현할 수 있다.

예:

```text
ONLINE_REGISTRATION
ON_SITE
NO_REGISTRATION
UNKNOWN
```

현재 MVP에서는 실제 데이터 사례를 확인한 뒤 필요성이 있을 경우 별도 필드를 추가한다.

---

## 조기 마감과 외부 상태 변경

날짜 기반 계산에는 한계가 있다.

예를 들어 신청 마감일이 아직 지나지 않았더라도 다음과 같은 이유로 신청이 종료될 수 있다.

- 정원 마감
- 주최 측의 조기 모집 종료
- 행사 취소
- 신청 페이지 비활성화

따라서 다음 두 종류의 데이터를 구분해야 한다.

```text
계산 가능한 상태
→ 신청 기간을 기준으로 결정

외부에서 확인된 상태
→ 실제 신청 페이지 또는 주최 측 정보
```

MVP에서는 우선 신청 기간 기반 계산을 사용한다.

실제 데이터 수집 과정에서 조기 마감 사례가 빈번하게 발생한다면 별도의 외부 상태 필드 추가를 검토한다.

예:

```sql
registration_override_status VARCHAR(30)
```

다만 이는 기본 상태를 대체하는 예외 데이터이므로 필요성이 확인되기 전에는 추가하지 않는다.

---

## 예상 스키마

```sql
registration_start_at TIMESTAMPTZ,
registration_deadline TIMESTAMPTZ,
registration_url TEXT
```

필요하다면 다음과 같은 제약조건을 추가할 수 있다.

```sql
CHECK (
    registration_start_at IS NULL
    OR registration_deadline IS NULL
    OR registration_start_at <= registration_deadline
)
```

신청 시작 시각과 마감 시각이 모두 존재할 경우 시작 시각이 마감 시각보다 늦지 않도록 한다.

---

## 예시

### 신청 가능

```text
현재
2026-09-08 12:00

registration_start_at
2026-09-01 00:00

registration_deadline
2026-09-10 18:00

결과
OPEN
```

### 신청 마감

```text
현재
2026-09-11 12:00

registration_deadline
2026-09-10 18:00

결과
CLOSED
```

### 신청 시작 전

```text
현재
2026-09-08 12:00

registration_start_at
2026-09-10 09:00

registration_deadline
2026-09-20 18:00

결과
NOT_STARTED
```

### 신청 정보 없음

```text
registration_start_at = NULL
registration_deadline = NULL

결과
UNKNOWN
```

---

## 향후 재검토 기준

다음과 같은 요구가 생기면 별도의 신청 상태 저장을 검토한다.

- 조기 마감 행사가 자주 발생한다.
- 신청 페이지 상태를 주기적으로 수집한다.
- 행사 취소나 모집 중단 상태를 별도로 관리해야 한다.
- 운영자가 신청 상태를 수동으로 수정해야 한다.
- 신청 정원이나 잔여 좌석까지 추적한다.

이 경우 계산된 상태와 실제 외부 상태를 구분하는 구조를 설계한다.

---

## 결론

신청 가능 여부는 DB에 직접 저장하지 않고 **신청 시작 시각, 신청 마감 시각, 현재 시각으로부터 계산한다.**

```text
저장
→ registration_start_at
→ registration_deadline

계산
→ NOT_STARTED
→ OPEN
→ CLOSED
→ UNKNOWN
```

이는 시간이 지나면서 자동으로 변하는 값을 중복 저장하지 않고, 실제 사실에 가까운 데이터를 원본으로 유지하기 위한 선택이다.

조기 마감처럼 날짜만으로 판단할 수 없는 예외가 실제로 중요해질 경우에만 별도의 외부 상태 모델을 추가한다.