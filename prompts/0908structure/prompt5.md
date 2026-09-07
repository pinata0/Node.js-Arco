현재 Project Arco Backend에 Docker Compose 기반 PostgreSQL 개발환경과 최소 DB 연결 코드를 구성해줘.

## 현재 프로젝트 상태

저장소 경로:

```text
C:\Users\user\projects\Node.js-Arco
```

현재 주요 구조:

```text
Node.js-Arco/
├─ frontend/
│  └─ React + TypeScript + Vite
├─ backend/
│  ├─ src/
│  │  ├─ app.ts
│  │  └─ server.ts
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  ├─ pnpm-workspace.yaml
│  ├─ tsconfig.json
│  ├─ eslint.config.js
│  └─ README.md
├─ docs/
├─ prompts/
├─ .gitignore
└─ README.md
```

Backend는 현재 다음 상태다.

- Node.js `v24.14.0`
- pnpm `11.16.0`
- Express `5.2.1`
- TypeScript `6.0.3`
- tsx `4.23.13`
- ESLint `10.10.0`
- ESM 사용
- `tsconfig`: `NodeNext`
- Backend 기본 포트: `3000`

현재 다음 검증은 모두 성공한다.

```bash
pnpm lint
pnpm build
pnpm dev
pnpm start
```

현재 endpoint:

```http
GET /health
```

응답:

```json
{
  "status": "ok"
}
```

---

# 이번 단계의 목표

이번 단계에서는 다음까지만 수행한다.

1. Docker Compose 기반 PostgreSQL 개발환경 구성
2. Backend 환경변수 구성
3. `pg`를 이용한 PostgreSQL 연결 코드 작성
4. DB 연결 상태 확인 endpoint 작성
5. 실제 Docker PostgreSQL과 Backend의 연결 검증

이번 단계에서는 아직 실제 서비스용 테이블이나 schema를 만들지 않는다.

즉, 다음은 이후 단계에서 진행한다.

- events 테이블
- categories 테이블
- 행사 데이터 삽입
- migration system
- repository 구현
- 행사 API

---

# 1. 작업 범위

이번 단계에서 수정할 수 있는 영역은 기본적으로 다음이다.

```text
backend/
docker-compose.yml
```

루트 `.gitignore`는 기존 규칙이 충분하면 수정하지 않는다.

기존 다음 영역은 수정하지 마.

```text
frontend/
docs/
prompts/
```

기존 Git working tree의 변경사항도 모두 보존한다.

Git reset, restore, checkout, stash 등의 명령을 사용하지 마.

---

# 2. PostgreSQL 실행 방식

PostgreSQL은 로컬에 직접 설치하지 않는다.

Docker Compose를 사용한다.

현재 환경에는 다음이 설치되어 있다.

- Docker CLI `29.2.0`
- Docker Compose `v5.0.2`

이전 점검 당시 Docker daemon은 실행되지 않은 상태였으므로, 먼저 Docker engine 연결 가능 여부를 확인해줘.

예:

```bash
docker info
```

Docker daemon에 연결할 수 없다면 시스템 설정을 강제로 변경하지 마.

그 경우:

- 구성 파일은 작성
- 코드 구성
- 정적 검증

까지 수행하고, 실제 컨테이너 실행 검증은 실패 사유를 보고해줘.

Docker daemon에 정상 연결된다면 실제 컨테이너 실행 및 연결 검증까지 수행해줘.

---

# 3. docker-compose.yml

저장소 루트에:

```text
docker-compose.yml
```

을 생성해줘.

PostgreSQL 서비스 하나만 구성한다.

서비스 이름은 명확하게:

```text
postgres
```

정도로 사용한다.

PostgreSQL은 현재 안정적인 공식 이미지의 major version을 명시적으로 사용해줘.

`latest` 태그는 사용하지 않는다.

예:

```text
postgres:<major>
```

형태로 고정한다.

---

# 4. PostgreSQL 개발용 설정

로컬 개발환경용 DB 설정은 다음을 사용한다.

```text
database: arco
user: arco
password: arco_dev
port: 5432
```

이 값은 로컬 개발용이다.

실제 운영 환경의 credential로 사용하지 않는다.

Docker Compose에는 필요한 PostgreSQL 환경변수를 설정한다.

예:

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
```

PostgreSQL 데이터가 컨테이너 재시작 후에도 유지되도록 named volume을 사용한다.

예:

```text
postgres_data
```

---

# 5. Healthcheck

PostgreSQL container에 Docker healthcheck를 설정해줘.

가능하면 `pg_isready`를 사용한다.

목표는 단순히 container가 실행 중인지가 아니라 PostgreSQL이 실제 connection을 받을 준비가 되었는지 확인하는 것이다.

과도하게 짧은 polling 주기는 사용하지 않는다.

---

# 6. Backend dependency

`backend/`에 다음 runtime dependency를 pnpm으로 설치한다.

```text
pg
dotenv
```

필요하면 TypeScript type package도 설치한다.

예:

```text
@types/pg
```

현재 `pg` 자체 type 지원 상태를 확인해서 실제 필요한 경우에만 추가한다.

npm은 사용하지 않는다.

---

# 7. 환경변수 파일

`backend/.env.example`을 생성해줘.

예시 값은 다음 구조를 사용한다.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=arco
DB_USER=arco
DB_PASSWORD=arco_dev
```

실제로 실행하기 위한:

```text
backend/.env
```

도 로컬 개발용으로 생성할 수 있다.

단 다음 조건을 반드시 확인한다.

- `.env`는 Git에 추적되지 않아야 함
- `.env.example`은 Git에 추적 가능해야 함
- credential은 개발용 값만 사용
- 실제 비밀값을 작성하지 않음

루트 `.gitignore`가 이미:

```text
.env
.env.*
!.env.example
```

형태로 환경변수 파일을 적절히 제외하고 있다면 수정하지 않는다.

---

# 8. 환경변수 로딩

Backend에서 `dotenv`를 이용해 환경변수를 읽도록 구성한다.

단순한 프로젝트 규모이므로 지금은 별도의 복잡한 config framework를 만들지 않는다.

필요하면:

```text
backend/src/config/
```

디렉터리를 새로 만들어도 된다.

예를 들어:

```text
backend/src/config/env.ts
```

정도의 작은 파일로 환경변수를 읽고 검증할 수 있다.

환경변수가 없을 때 무조건 조용히 undefined를 사용하지 않도록 최소한의 안전장치를 둔다.

다만 현재 단계에서는 `zod` 같은 별도 validation library를 추가하지 않는다.

---

# 9. DB connection module

다음과 같이 DB 관련 코드를 별도 영역으로 분리해줘.

권장 구조:

```text
backend/
└─ src/
   ├─ config/
   │  └─ env.ts
   ├─ db/
   │  └─ pool.ts
   ├─ app.ts
   └─ server.ts
```

파일명은 현재 코드 스타일에 맞춰 약간 조정해도 된다.

`pg.Pool`을 사용한다.

DB connection pool 설정은 환경변수에서 읽는다.

예상 정보:

```text
host
port
database
user
password
```

현재 단계에서는 복잡한 connection pool tuning은 하지 않는다.

---

# 10. DB 연결 확인

DB connection을 확인할 수 있도록 최소 query를 실행하는 함수를 만들어줘.

예:

```sql
SELECT 1
```

또는 PostgreSQL 정보를 확인할 수 있는 간단한 query를 사용해도 된다.

테이블 생성 query는 실행하지 않는다.

---

# 11. DB health endpoint

기존:

```http
GET /health
```

는 그대로 유지한다.

추가로 다음 endpoint를 구현한다.

```http
GET /health/db
```

PostgreSQL 연결이 정상이라면:

```json
{
  "status": "ok",
  "database": "connected"
}
```

정도로 응답하면 된다.

HTTP status:

```text
200
```

DB 연결에 실패한다면:

```json
{
  "status": "error",
  "database": "disconnected"
}
```

처럼 응답하고 적절한 5xx HTTP status를 사용한다.

DB 연결 실패 시 password, connection string 등 민감한 정보를 HTTP response에 포함하지 않는다.

---

# 12. 서버 시작 정책

DB가 일시적으로 연결되지 않는다고 해서 반드시 Express 서버 자체가 시작하지 못하도록 만들 필요는 없다.

이번 단계에서는:

```text
Express server
+
DB connection health 확인
```

을 분리한다.

즉 `/health`는 애플리케이션 상태를 확인하고,

```text
/health/db
```

는 PostgreSQL 연결 상태를 확인하도록 한다.

현재 규모에서는 이 구조를 우선 사용한다.

---

# 13. Docker Compose 명령 검증

Docker daemon이 정상 실행 중이라면 다음을 검증한다.

## Container 시작

```bash
docker compose up -d
```

## 상태 확인

```bash
docker compose ps
```

PostgreSQL service가 running / healthy 상태인지 확인한다.

## 로그

필요하다면:

```bash
docker compose logs postgres
```

를 사용해 startup error가 없는지 확인한다.

무작정 전체 로그를 길게 출력하지 않는다.

---

# 14. PostgreSQL 직접 연결 검증

가능하다면 Docker container 내부의 `psql`을 이용해 실제 DB 연결을 확인한다.

예를 들어 다음과 유사한 방식이다.

```bash
docker compose exec postgres psql -U arco -d arco
```

interactive shell을 오래 유지하지 말고 command 실행 방식으로 검증해도 된다.

예:

```sql
SELECT current_database();
```

또는:

```sql
SELECT 1;
```

정도면 충분하다.

이번 단계에서는 테이블을 생성하지 않는다.

---

# 15. Backend 검증

PostgreSQL container가 실행 중인 상태에서 Backend를 실행한다.

```bash
cd backend
pnpm dev
```

다음을 실제 HTTP request로 확인한다.

## Application health

```http
GET http://127.0.0.1:3000/health
```

예상:

```json
{
  "status": "ok"
}
```

## Database health

```http
GET http://127.0.0.1:3000/health/db
```

예상:

```json
{
  "status": "ok",
  "database": "connected"
}
```

검증 후 Backend 개발 서버는 종료해줘.

PostgreSQL container는 개발환경으로 계속 사용할 수 있으므로 굳이 제거하지 않아도 된다.

단 마지막 보고에서 실행 상태를 알려줘.

---

# 16. Build/Lint 검증

DB 코드 추가 후 기존 Backend 검증이 깨지지 않았는지 확인한다.

```bash
pnpm lint
pnpm build
```

둘 다 성공해야 한다.

가능하면:

```bash
pnpm start
```

로 빌드 결과에서도 health endpoint가 정상 동작하는지 확인한다.

---

# 17. README 업데이트

`backend/README.md`에 PostgreSQL 개발환경 관련 최소한의 내용을 추가해줘.

다음 정도만 설명한다.

## PostgreSQL 시작

저장소 루트에서:

```bash
docker compose up -d
```

## Backend 실행

```bash
cd backend
pnpm install
pnpm dev
```

## 환경변수

```text
.env.example
```

을 참고하여 `.env`를 구성한다는 점.

## Health endpoint

```text
GET /health
GET /health/db
```

README를 과도하게 길게 작성하지 않는다.

---

# 이번 단계에서 하지 말아야 할 작업

다음은 아직 하지 마.

## Database schema

- CREATE TABLE
- DROP TABLE
- ALTER TABLE
- index 생성
- foreign key 설계
- seed data 삽입
- migration 생성

## ORM

다음은 설치하지 않는다.

- Prisma
- Drizzle
- TypeORM
- Sequelize
- Knex

이번 단계에서는 순수 `pg`를 사용한다.

## Service functionality

- 행사 CRUD
- 행사 검색
- 추천 API
- category API
- repository 구현
- controller 구조 확장

## Frontend

- `frontend/` 수정
- Vite proxy 설정
- Backend 호출 코드
- CORS 설정을 위한 Frontend 변경

## Infrastructure

- Redis
- nginx
- 별도 application container
- production Dockerfile
- CI/CD

## Git

- Git add
- Git commit
- Git stash
- Git reset
- Git restore
- Git checkout

---

# docker-compose.yml 위치

Docker Compose 파일은:

```text
Node.js-Arco/docker-compose.yml
```

즉 repository root에 둔다.

현재 Frontend와 Backend는 각각 독립 Node.js package이지만 PostgreSQL은 프로젝트 전체 개발 인프라이므로 루트에서 관리한다.

---

# 보안 확인

작업 후 반드시 확인한다.

다음 파일은 Git에 포함되면 안 된다.

```text
backend/.env
```

다음 파일은 Git에 포함될 수 있어야 한다.

```text
backend/.env.example
```

`git status` 등을 이용해 이를 확인해줘.

실제 password나 secret이 Git tracked file에 기록되지 않았는지도 확인한다.

---

# 변경 범위 검증

작업 후 이번 단계에서 의도적으로 변경된 파일을 확인한다.

예상 범위:

```text
docker-compose.yml

backend/
├─ package.json
├─ pnpm-lock.yaml
├─ README.md
├─ .env.example
└─ src/
   ├─ config/
   ├─ db/
   └─ ...
```

`.env`는 존재할 수 있지만 Git 추적 대상이어서는 안 된다.

다음 영역은 수정되지 않아야 한다.

```text
frontend/
docs/
prompts/
```

기존 Git working tree 변경사항은 모두 그대로 보존한다.

---

# 작업 완료 보고 형식

마지막에는 다음 형식으로 보고해줘.

## Docker / PostgreSQL

- Docker daemon:
- Docker Compose:
- PostgreSQL image:
- PostgreSQL container:
- Health status:
- Database:
- User:
- Host port:

## 생성 및 변경된 주요 파일

각 파일의 역할을 간단히 설명해줘.

예:

```text
docker-compose.yml
backend/.env.example
backend/src/config/env.ts
backend/src/db/pool.ts
...
```

## 설치된 Dependency

실제 설치 버전을 기준으로 알려줘.

- pg:
- dotenv:
- 추가 TypeScript type package가 있다면:

## 환경변수

어떤 환경변수를 사용하도록 구성했는지 나열해줘.

실제 password 값은 결과 보고에서 반복하지 않아도 된다.

## PostgreSQL 직접 연결 검증

실제로 실행한 query와 결과를 간단히 알려줘.

예:

```text
SELECT current_database();

arco
```

## Backend 검증

다음 각각을 성공/실패로 표시해줘.

- `pnpm lint`
- `pnpm build`
- `pnpm dev`
- `pnpm start`

## HTTP 검증

### GET /health

- HTTP status:
- response:

### GET /health/db

- HTTP status:
- response:

## Git / 보안 확인

다음을 알려줘.

- `backend/.env` Git 추적 여부
- `backend/.env.example` 상태
- credential이 tracked file에 포함되었는지
- 기존 Git 변경사항이 보존되었는지

## 현재 관련 구조

PostgreSQL 연결과 관련된 파일만 포함하여 tree 형태로 보여줘.

## 다음 단계 준비 여부

다음 단계에서는 2026년 행사 샘플 데이터를 저장하기 위한 PostgreSQL schema와 migration 전략을 설계할 예정이다.

이번 단계에서 아직 schema나 table을 생성하지 않았는지도 명시해줘.

이번 단계의 범위를 넘어서는 구현은 하지 마.