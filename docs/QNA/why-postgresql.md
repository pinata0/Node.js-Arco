# 왜 PostgreSQL을 선택했는가?

## Q. MongoDB나 다른 SQL 데이터베이스 대신 PostgreSQL을 선택한 이유는 무엇인가?

이 프로젝트에서 PostgreSQL을 선택한 이유는 단순히 많이 사용되는 데이터베이스이기 때문이 아니다.

행사 추천 서비스의 데이터 구조가 관계형 데이터베이스에 잘 맞고, 프로젝트의 학습 목표인 **백엔드 개발과 관계형 데이터베이스 활용 경험**을 얻기에 PostgreSQL이 가장 적합하다고 판단했기 때문이다.

---

## 1. 행사 데이터는 관계형 구조에 가깝다

서비스에서 다루게 될 주요 엔티티는 다음과 같다.

```text
Event
Category
Organizer
Venue
User
Favorite
Recommendation
```

이들은 서로 독립적으로 존재하기보다 여러 관계를 가진다.

```text
Organizer 1:N Event
Venue     1:N Event
Event     N:M Category
User      N:M Event
```

예를 들어 하나의 행사는 여러 카테고리를 가질 수 있고, 하나의 카테고리에는 여러 행사가 포함될 수 있다.

또한 향후 즐겨찾기나 추천 기록이 추가되면 사용자와 행사 사이에도 관계가 생긴다.

따라서 문서 하나를 독립적으로 저장하는 방식보다는, 각 엔티티를 분리하고 관계를 명확하게 정의할 수 있는 관계형 데이터베이스가 적합하다.

---

## 2. MongoDB보다 PostgreSQL이 적합한 이유

MongoDB를 사용하면 행사 데이터를 다음과 같이 하나의 JSON 문서로 쉽게 저장할 수 있다.

```json
{
  "title": "GIST Developer Meetup",
  "date": "2026-09-20",
  "categories": ["AI", "Backend", "Developer"],
  "location": {
    "city": "Gwangju",
    "venue": "GIST"
  }
}
```

이 방식은 초기 개발이나 크롤링 데이터를 그대로 저장하는 데 편리하다.

하지만 서비스가 확장되면서 다음과 같은 관계가 중요해진다.

```text
행사
├── 여러 카테고리
├── 하나의 주최자
├── 하나의 장소
├── 여러 출처
├── 여러 사용자의 즐겨찾기 대상
└── 여러 추천 결과에 포함
```

MongoDB에서도 이러한 관계를 구현할 수 있지만, 다음과 같은 선택을 계속 해야 한다.

- 관련 데이터를 문서 안에 중복 저장할 것인지
- 다른 Collection의 ID만 저장할 것인지
- 데이터가 변경될 때 중복 데이터를 어떻게 동기화할 것인지

관계가 많아질수록 MongoDB의 장점인 **문서 독립성과 유연한 스키마**보다 관계 관리 비용이 커질 가능성이 있다.

반대로 PostgreSQL에서는 이러한 관계를 `FOREIGN KEY`, `JOIN`, `UNIQUE` 등의 기능을 사용해 직접 표현할 수 있다.

---

## 3. PostgreSQL은 JSON 데이터도 처리할 수 있다

PostgreSQL을 선택한다고 해서 모든 데이터를 엄격한 관계형 구조로만 저장해야 하는 것은 아니다.

PostgreSQL은 `JSON`과 `JSONB` 타입을 지원한다.

예를 들어 크롤링 과정에서 사이트마다 서로 다른 추가 데이터가 존재한다면 다음과 같은 구조를 사용할 수 있다.

```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    raw_data JSONB
);
```

서비스에서 직접 사용하는 핵심 데이터는 정규화해서 저장하고,

```text
title
start_at
category_id
venue_id
organizer_id
```

원본 사이트에서 가져온 비정형 데이터는 `JSONB`로 보존할 수 있다.

따라서 PostgreSQL을 사용하면 다음 두 가지를 함께 활용할 수 있다.

```text
관계형 데이터베이스의 정합성
+
JSON 기반 데이터 저장의 유연성
```

---

## 4. MySQL보다 PostgreSQL을 선택한 이유

MySQL을 사용해도 현재 MVP를 구현하는 데에는 큰 문제가 없다.

현재 규모에서는 PostgreSQL과 MySQL의 성능 차이가 프로젝트 성공 여부를 좌우하지도 않는다.

그럼에도 PostgreSQL을 선택한 이유는 향후 서비스 기능과 관련된 기능들이 잘 갖춰져 있기 때문이다.

특히 이 서비스에서 **날짜와 시간은 핵심 도메인 데이터**이다.

향후 다음과 같은 기능을 구현할 수 있다.

> 사용자가 14:00~18:00에 시간이 있을 때 실제로 참석 가능한 행사를 찾는다.

PostgreSQL은 Range Type을 지원하므로 행사 시간 자체를 하나의 구간으로 표현할 수도 있다.

```sql
event_time TSTZRANGE
```

두 시간 구간의 겹침 여부 역시 다음과 같은 연산으로 확인할 수 있다.

```sql
event_time && user_available_time
```

향후 위치 기반 행사 추천까지 확장한다면 PostGIS를 사용할 수도 있다.

예를 들어 다음과 같은 기능이다.

> 현재 위치에서 10km 이내에서 열리는 행사를 추천한다.

MySQL에서도 날짜 및 위치 검색을 구현할 수 있지만, 시간·공간·JSON 등의 복합적인 데이터를 다루는 확장성과 생태계를 고려하면 PostgreSQL이 이 프로젝트와 잘 맞는다.

---

## 5. SQLite보다 PostgreSQL을 선택한 이유

현재 계획된 데이터 규모는 다음과 같다.

```text
월 40개 × 12개월
= 약 480개의 행사
```

이 정도의 데이터는 SQLite로도 충분히 처리할 수 있다.

따라서 PostgreSQL을 선택한 이유는 데이터 규모 때문이 아니다.

이 프로젝트의 목표 중 하나는 다음과 같다.

> 백엔드 분야에서 데이터베이스 활용법을 익힌다.

SQLite를 사용하면 하나의 로컬 파일로 데이터베이스를 사용할 수 있기 때문에 초기 개발은 매우 간단하다.

```text
Application
    ↓
SQLite File
```

반면 PostgreSQL은 실제 서버형 데이터베이스의 구조를 경험할 수 있다.

```text
Backend Server
      ↓
PostgreSQL Server
      ↓
Database / Schema
```

이를 통해 다음과 같은 개념을 직접 다룰 수 있다.

- Database와 Schema
- Connection
- Primary Key / Foreign Key
- JOIN
- Constraint
- Index
- Transaction
- Query Optimization
- 실제 배포 환경의 DB 연결

따라서 단순히 MVP를 빠르게 만드는 것보다 **실제 백엔드 환경에서 관계형 데이터베이스를 학습하는 것**까지 고려하면 PostgreSQL이 더 적합하다.

---

## 6. Firestore와 같은 NoSQL 서비스보다 적합한 이유

Firestore와 같은 서비스는 빠르게 MVP를 만드는 데 매우 편리하다.

하지만 프로젝트의 주요 목표가 다음과 같기 때문에 우선순위가 다르다.

```text
JavaScript / TypeScript 학습
+
Backend 개발 경험
+
Database 활용 경험
```

Firestore를 사용하면 데이터베이스 서버 관리나 SQL, 관계 모델링 등의 상당 부분을 추상화할 수 있다.

따라서 목표가 다음과 같다면 Firestore가 좋은 선택일 수 있다.

> 가능한 한 빠르게 MVP를 완성한다.

하지만 현재 프로젝트의 목표는 다음에 더 가깝다.

> 직접 백엔드와 데이터베이스를 설계하면서 MVP를 만든다.

따라서 PostgreSQL을 선택했다.

---

## 7. PostgreSQL의 데이터 무결성 기능

행사 데이터를 직접 수집하거나 향후 크롤링하게 되면 다음과 같은 문제가 발생할 수 있다.

```text
같은 행사 중복 저장
잘못된 Category ID
존재하지 않는 Event에 Favorite 생성
필수 필드 누락
```

PostgreSQL에서는 다음과 같은 제약조건을 통해 이를 데이터베이스 수준에서 방지할 수 있다.

```sql
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
CHECK
```

예를 들어 행사 URL을 중복해서 저장하지 않도록 다음과 같이 설정할 수 있다.

```sql
source_url TEXT UNIQUE
```

카테고리가 반드시 실제 존재하는 카테고리만 참조하도록 만들 수도 있다.

```sql
category_id REFERENCES categories(id)
```

이러한 데이터 정합성 관리 역시 관계가 많은 행사 추천 서비스와 잘 맞는다.

---

## 8. 데이터베이스 선택 과정

데이터베이스 선택 논리는 다음과 같이 정리할 수 있다.

```text
행사 데이터가 정형화되어 있는가?
        │
       YES
        ↓
엔티티 간 관계가 많은가?
        │
       YES
        ↓
관계형 데이터베이스가 적합
        │
        ├── SQLite
        ├── MySQL
        └── PostgreSQL
                │
                ├── 날짜/시간 검색이 중요
                ├── JSON 데이터도 일부 저장하고 싶음
                ├── 향후 위치 검색 확장 가능
                ├── 데이터 무결성이 중요
                └── 관계형 DB 학습이 프로젝트 목표
                         ↓
                    PostgreSQL
```

---

## 결론

MongoDB를 선택하지 않은 이유는 NoSQL이 좋지 않아서가 아니라, 이 서비스가 본질적으로 **문서 중심의 문제보다 관계 중심의 문제에 가깝기 때문**이다.

또한 SQL 데이터베이스 중 PostgreSQL을 선택한 이유는 다음과 같다.

1. 행사, 카테고리, 주최자, 사용자 등 엔티티 간 관계를 명확하게 표현할 수 있다.
2. 날짜와 시간 데이터를 강력하게 처리할 수 있다.
3. 필요할 경우 `JSONB`를 사용해 비정형 데이터도 함께 저장할 수 있다.
4. 데이터 무결성을 Constraint로 보장할 수 있다.
5. 향후 PostGIS 등을 활용한 위치 기반 기능 확장이 가능하다.
6. SQLite보다 실제 백엔드 서버 환경의 데이터베이스 경험을 얻기 좋다.
7. 프로젝트 목표인 관계형 데이터베이스 설계와 활용법 학습에 적합하다.

따라서 이 프로젝트에서는 **PostgreSQL이 반드시 필요한 규모이기 때문이 아니라, 서비스의 데이터 모델과 프로젝트의 학습 목표를 함께 만족시키는 가장 균형 잡힌 선택이기 때문에 채택했다.**