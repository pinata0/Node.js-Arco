# 서버 워크로드(Server Workload)

## 1. 서버 워크로드란?

**서버 워크로드(Server Workload)** 는 서버가 처리해야 하는 **작업의 종류와 양**을 의미한다.

쉽게 말하면,

> 서버가 어떤 요청을 얼마나 많이 받고, 그 요청을 처리하기 위해 CPU·메모리·디스크·네트워크 같은 자원을 얼마나 사용하는가

를 나타내는 개념이다.

예를 들어 웹서비스 서버에는 다음과 같은 작업이 발생할 수 있다.

- 사용자의 HTTP 요청 처리
- 데이터베이스 조회
- 파일 업로드 및 다운로드
- 로그인 및 인증 처리
- 이미지 변환
- AI 모델 추론
- 이메일 발송
- 로그 기록
- 외부 API 호출

이러한 작업들의 전체적인 부하를 서버 워크로드라고 볼 수 있다.

---

## 2. 워크로드를 구성하는 주요 자원

서버 워크로드는 주로 다음 자원의 사용량으로 나타난다.

### CPU

계산 작업을 수행한다.

CPU 사용량이 높은 작업의 예시는 다음과 같다.

- 데이터 압축
- 영상 인코딩
- 암호화
- 복잡한 알고리즘 수행
- AI 모델 추론
- 대량 데이터 계산

이러한 작업을 **CPU-bound 작업**이라고 한다.

---

### Memory

실행 중인 프로그램과 데이터를 임시로 저장한다.

메모리를 많이 사용하는 작업의 예시는 다음과 같다.

- 대량 데이터 캐싱
- 큰 JSON 데이터 처리
- AI 모델 메모리 적재
- 많은 사용자의 세션 유지
- 대규모 데이터 분석

메모리가 부족하면 운영체제가 디스크의 Swap/Page File을 사용하거나 프로세스가 종료될 수 있다.

---

### Disk I/O

SSD나 HDD에 데이터를 읽고 쓰는 작업이다.

예를 들어 다음과 같은 경우 디스크 사용량이 증가한다.

- 파일 업로드
- 로그 저장
- 데이터베이스 데이터 기록
- 백업 생성
- 대용량 파일 읽기

디스크 접근 속도가 병목이 되는 작업을 **I/O-bound 작업**이라고 부르기도 한다.

---

### Network I/O

서버가 네트워크를 통해 데이터를 송수신하는 작업이다.

예시는 다음과 같다.

- HTTP 요청과 응답
- 이미지 및 영상 전송
- API 호출
- 데이터베이스 서버와 통신
- 다른 서버와의 통신

대용량 파일 서비스나 스트리밍 서비스에서는 네트워크 대역폭이 중요한 요소가 된다.

---

## 3. CPU-bound와 I/O-bound

서버 워크로드는 크게 **CPU-bound**와 **I/O-bound**로 구분할 수 있다.

### CPU-bound

CPU 계산 시간이 성능을 결정하는 작업이다.

```text
요청
 ↓
복잡한 계산
 ↓
CPU 사용
 ↓
응답
```

예시:

- 영상 인코딩
- 이미지 처리
- 데이터 압축
- 머신러닝 추론
- 암호학적 계산

CPU 성능이나 코어 수가 중요한 경우가 많다.

---

### I/O-bound

CPU 계산보다 **데이터를 기다리는 시간**이 더 긴 작업이다.

```text
요청
 ↓
DB 요청
 ↓
DB 응답 대기
 ↓
외부 API 요청
 ↓
응답 대기
 ↓
사용자에게 응답
```

예시:

- 데이터베이스 조회
- 파일 읽기
- 외부 API 호출
- 네트워크 통신

일반적인 웹 백엔드 서버는 I/O-bound 성격이 강하다.

---

## 4. 웹 서버의 일반적인 워크로드

웹서비스에서는 보통 다음과 같은 과정이 발생한다.

```text
Client
  ↓
HTTP Request
  ↓
Web Server
  ↓
Application Logic
  ↓
Database / External API
  ↓
Application Logic
  ↓
HTTP Response
  ↓
Client
```

예를 들어 행사 추천 서비스에서 사용자가

```text
GET /events?date=2026-09-12
```

요청을 보냈다고 하자.

서버에서는 다음과 같은 워크로드가 발생한다.

1. HTTP 요청 수신
2. URL 및 Query Parameter 분석
3. 요청 값 검증
4. PostgreSQL에 SQL Query 전송
5. DB 결과 대기
6. 조회 결과 가공
7. JSON 생성
8. HTTP 응답 전송
9. 요청 로그 기록

CPU 계산보다는 DB와 네트워크의 응답을 기다리는 시간이 많기 때문에 전형적인 **I/O-bound workload**에 해당한다.

---

## 5. 동시 요청과 워크로드

서버에서는 한 명만 요청을 보내는 것이 아니다.

예를 들어 동시에 1,000명이 다음 요청을 보낼 수도 있다.

```text
User 1 ─┐
User 2 ─┤
User 3 ─┤
...     ├─→ Server
User1000┘
```

따라서 서버 성능을 판단할 때는 단순히 하나의 요청이 얼마나 빠른지만 보는 것이 아니라

**동시에 얼마나 많은 요청을 처리할 수 있는가**

도 중요하다.

이를 **Concurrency(동시성)** 라고 한다.

---

## 6. Throughput

**Throughput**은 일정 시간 동안 서버가 처리할 수 있는 작업량이다.

웹 서버에서는 일반적으로 다음 단위를 사용한다.

```text
Requests Per Second
RPS
```

예:

```text
100 RPS
```

라면 서버가 평균적으로 초당 100개의 요청을 처리한다는 의미이다.

Throughput이 높을수록 많은 요청을 처리할 수 있다.

---

## 7. Latency

**Latency**는 하나의 요청을 처리하는 데 걸리는 시간이다.

예를 들어

```text
GET /events
```

요청에 대한 응답이

```text
200 ms
```

후에 도착했다면 해당 요청의 latency는 약 200ms이다.

웹서비스에서는 일반적으로 다음과 같은 지표를 함께 확인한다.

```text
Average latency
P50 latency
P95 latency
P99 latency
```

예를 들어

```text
P95 = 500 ms
```

라면 전체 요청 중 약 95%가 500ms 이내에 처리된다는 뜻이다.

---

## 8. 서버 부하가 증가하는 과정

사용자가 증가하면 일반적으로 다음과 같은 변화가 발생한다.

```text
사용자 증가
   ↓
요청 증가
   ↓
서버 워크로드 증가
   ↓
CPU / Memory / DB / Network 사용량 증가
   ↓
Latency 증가
   ↓
처리 가능 한계 도달
```

한계를 넘으면 다음 문제가 발생할 수 있다.

- 응답 지연
- 요청 Timeout
- 데이터베이스 Connection 부족
- 메모리 부족
- 서버 오류
- 서버 다운

---

## 9. 서버 병목(Bottleneck)

서버 성능을 제한하는 가장 느린 부분을 **병목(Bottleneck)** 이라고 한다.

예를 들어 다음 구조가 있다고 하자.

```text
Client
  ↓
Express
  ↓
PostgreSQL
```

Express 서버는 초당 10,000개의 요청을 처리할 수 있지만 PostgreSQL이 초당 500개의 Query만 처리할 수 있다면 전체 시스템의 성능은 PostgreSQL에 의해 제한된다.

즉,

```text
Server Capacity
≈ Slowest Component Capacity
```

라고 볼 수 있다.

병목이 될 수 있는 요소는 다양하다.

- CPU
- Memory
- Disk
- Network
- Database
- Connection Pool
- External API
- Application Code

---

## 10. Node.js와 서버 워크로드

Node.js는 일반적으로 **I/O-bound 웹 서버 워크로드**에 강하다.

Node.js의 기본 구조는 다음과 같다.

```text
       Event Loop
           │
    ┌──────┼──────┐
    ↓      ↓      ↓
   DB     File   Network
    ↓      ↓      ↓
 Callback / Promise
```

DB 조회나 네트워크 요청을 기다리는 동안 CPU를 계속 점유하지 않고 다른 요청을 처리할 수 있다.

따라서 다음과 같은 서비스에 적합하다.

- REST API
- 웹 백엔드
- 실시간 채팅
- WebSocket 서버
- API Gateway
- 데이터베이스 중심 서비스

반대로 CPU를 오랫동안 사용하는 작업이 메인 Event Loop에서 수행되면 다른 요청 처리까지 막을 수 있다.

예:

```javascript
while (true) {
  // 매우 무거운 계산
}
```

이런 코드가 실행되면 Event Loop가 점유되어 다른 HTTP 요청을 처리하지 못할 수 있다.

CPU-heavy 작업은 경우에 따라 다음과 같은 방법으로 분리한다.

- Worker Threads
- 별도의 서버
- Job Queue
- GPU 서버
- 별도의 Python 서비스

---

## 11. Express 서버의 워크로드 예시

예를 들어 Express에서 다음 API가 있다고 하자.

```javascript
app.get("/events", async (req, res) => {
  const events = await db.query(
    "SELECT * FROM events"
  );

  res.json(events);
});
```

실제 처리 흐름은 대략 다음과 같다.

```text
HTTP Request
     ↓
Express Router
     ↓
Handler 실행
     ↓
PostgreSQL Query
     ↓
DB 응답 대기
     ↓
결과 수신
     ↓
JSON 변환
     ↓
HTTP Response
```

이 과정에서는 대부분의 시간이 데이터베이스의 결과를 기다리는 데 사용될 가능성이 높다.

따라서 이러한 API 서버는 대표적인 I/O-bound 서버이다.

---

## 12. 데이터베이스 워크로드

백엔드 서비스에서는 데이터베이스도 별도의 서버 워크로드를 가진다.

PostgreSQL에서는 다음과 같은 작업이 수행된다.

```sql
SELECT
INSERT
UPDATE
DELETE
JOIN
ORDER BY
GROUP BY
```

특히 다음과 같은 Query는 비용이 커질 수 있다.

```sql
SELECT *
FROM events
WHERE category = 'development'
ORDER BY start_date;
```

데이터가 적을 때는 문제가 없지만 수백만 개로 증가하면 성능 문제가 발생할 수 있다.

이를 개선하기 위해 사용하는 것이 **Index**이다.

예:

```sql
CREATE INDEX idx_events_category
ON events(category);
```

즉, 서버 워크로드를 최적화할 때는 Application 서버만 보는 것이 아니라 DB workload 역시 함께 확인해야 한다.

---

## 13. Scaling

서버 워크로드가 증가하면 서버 용량을 늘려야 한다.

대표적인 방법은 두 가지이다.

### Vertical Scaling

하나의 서버의 성능을 높이는 방법이다.

```text
CPU 4 Core
RAM 8GB
```

에서

```text
CPU 16 Core
RAM 32GB
```

로 업그레이드하는 방식이다.

장점:

- 구조가 간단하다.
- 적용하기 쉽다.

단점:

- 하드웨어 확장에 한계가 있다.
- 고성능 서버는 가격이 급격하게 증가한다.

---

### Horizontal Scaling

서버의 개수를 늘리는 방법이다.

```text
         Load Balancer
        /      |      \
       ↓       ↓       ↓
   Server1 Server2 Server3
```

여러 서버가 요청을 나누어 처리한다.

예를 들어

```text
Server 1 → 1000 RPS
```

를 처리할 수 있다면

```text
Server 1
Server 2
Server 3
```

으로 확장하여 더 많은 요청을 처리할 수 있다.

대규모 웹서비스에서는 일반적으로 Horizontal Scaling이 중요하다.

---

## 14. 워크로드 측정 지표

서버 상태를 확인할 때 다음과 같은 지표를 확인한다.

| 지표 | 의미 |
|---|---|
| CPU Usage | CPU 사용률 |
| Memory Usage | 메모리 사용량 |
| Disk I/O | 디스크 읽기/쓰기 |
| Network I/O | 네트워크 송수신량 |
| RPS | 초당 처리 요청 수 |
| Latency | 요청 처리 시간 |
| Error Rate | 요청 실패 비율 |
| Active Connections | 현재 연결 수 |
| DB Connections | DB 연결 수 |

이러한 정보를 이용해 서버의 병목과 성능 문제를 찾는다.

---

## 15. 서버 워크로드 테스트

실제 서비스 운영 전에는 의도적으로 많은 요청을 보내 서버가 어느 정도까지 버티는지 확인하기도 한다.

이를 **Load Test**라고 한다.

예:

```text
100 User
 ↓
500 User
 ↓
1,000 User
 ↓
10,000 User
```

사용자 수를 증가시키면서 다음을 측정한다.

```text
RPS
Latency
CPU
Memory
Error Rate
```

대표적인 부하 테스트 도구로는 다음과 같은 것들이 있다.

- k6
- Apache JMeter
- Locust
- Artillery

---

## 16. 행사 추천 서비스에서 예상되는 워크로드

행사 추천 서비스 MVP를 예로 들면 서버의 핵심 요청은 다음과 비슷할 수 있다.

```text
GET /events
GET /events/:id
GET /recommendations
POST /favorites
```

주요 작업은

```text
HTTP 요청
→ PostgreSQL 조회
→ 조건 필터링
→ 간단한 추천 로직
→ JSON 응답
```

이 될 가능성이 높다.

따라서 초기 MVP에서는

> **CPU-intensive 서버보다는 PostgreSQL과 네트워크 요청을 중심으로 한 I/O-bound 웹 서버**

라고 보는 것이 적절하다.

특히 성능에 영향을 많이 줄 가능성이 있는 부분은 다음과 같다.

```text
DB Query
Index
Connection Pool
검색 조건
행사 데이터 개수
동시 사용자 수
```

초기 데이터가 수백~수천 개 수준이라면 서버의 순수 계산 성능보다는 **올바른 데이터 구조와 Query 설계**가 훨씬 중요하다.

---

## 핵심 정리

```text
Server Workload
    │
    ├─ CPU
    ├─ Memory
    ├─ Disk I/O
    └─ Network I/O
```

서버 워크로드는 서버가 처리해야 하는 작업 전체를 의미한다.

웹 백엔드에서는 특히

```text
Request
→ Application
→ Database
→ Response
```

형태의 I/O-bound workload가 많다.

서버 성능을 판단할 때는 단순 CPU 성능만 보는 것이 아니라

```text
Concurrency
Throughput
Latency
Database
Network
Memory
```

를 함께 고려해야 한다.

현재 행사 추천 서비스의 Express + PostgreSQL 구조에서는 **Node.js 자체의 연산 성능보다 DB 조회 구조, Index, Connection 관리가 실제 성능에 더 큰 영향을 줄 가능성이 높다.**