현재 저장소의 `backend/` 디렉터리에 Backend 개발환경을 초기화해줘.

## 현재 프로젝트 상태

저장소 경로:

```text
C:\Users\user\projects\Node.js-Arco
```

현재 주요 구조:

```text
Node.js-Arco/
├─ frontend/
│  └─ React + TypeScript + Vite 프로젝트
├─ backend/
│  └─ README.md
├─ docs/
├─ prompts/
├─ .gitignore
└─ README.md
```

Frontend는 이미 다음 환경으로 정상 구성되어 있다.

- Node.js `v24.14.0`
- pnpm `11.16.0`
- Vite `8.2.2`
- React `19.2.8`
- TypeScript `6.0.3`
- ESLint `10.10.0`

Frontend는 현재 `pnpm lint`, `pnpm build`, `pnpm dev`가 모두 정상 동작한다.

이번 단계에서는 `frontend/`를 절대 수정하지 않는다.

기존 Git working tree에는 문서 작업 및 이전 단계의 변경사항이 존재하므로, 이번 작업과 무관한 변경은 모두 보존해야 한다.

특히 다음 영역은 수정하지 마.

```text
frontend/
docs/
prompts/
```

루트 `.gitignore`와 `README.md`도 이번 단계에서 불필요하게 수정하지 마.

---

# 이번 단계의 목표

`backend/` 내부에 다음 기술 스택으로 실행 가능한 최소 Backend 개발환경을 구성한다.

- Node.js
- pnpm
- TypeScript
- Express
- ESLint
- tsx 또는 동등한 TypeScript 개발 실행 도구

이번 단계에서는 PostgreSQL 연결이나 실제 비즈니스 로직을 구현하지 않는다.

최종적으로 최소한 다음 명령이 정상 동작해야 한다.

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

그리고 서버에 다음 health check endpoint가 존재해야 한다.

```http
GET /health
```

응답 예시는 다음 정도면 충분하다.

```json
{
  "status": "ok"
}
```

---

# 1. 패키지 매니저

Backend에서도 Frontend와 동일하게 `pnpm`을 사용한다.

다음 원칙을 지켜줘.

- npm과 pnpm을 혼용하지 않는다.
- `package-lock.json`을 생성하지 않는다.
- `pnpm-lock.yaml`을 사용한다.
- yarn을 사용하지 않는다.

현재 단계에서는 루트 workspace를 만들지 않는다.

즉, `backend/`는 독립적인 Node.js package로 초기화한다.

---

# 2. Backend 프로젝트 초기화

`backend/` 내부에 `package.json`을 생성한다.

프로젝트는 TypeScript 기반으로 구성한다.

필요한 최소 dependency를 설치해줘.

런타임 dependency:

```text
express
```

필요한 개발 dependency:

```text
typescript
tsx
eslint
@types/node
@types/express
```

ESLint가 TypeScript를 정상적으로 검사하는 데 필요한 패키지가 있다면 추가해도 된다.

다만 현재 단계에서는 다음과 같은 불필요한 dependency는 설치하지 마.

- Prisma
- Drizzle
- TypeORM
- Sequelize
- pg
- dotenv
- cors
- helmet
- zod
- swagger
- jest
- vitest
- nodemon
- prettier
- husky
- lint-staged

이 중 필요한 패키지는 이후 단계에서 별도로 추가한다.

---

# 3. 기본 디렉터리 구조

초기 구조는 과도하게 복잡하게 만들지 말고 다음 수준으로 구성해줘.

```text
backend/
├─ src/
│  ├─ app.ts
│  └─ server.ts
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
├─ eslint.config.js
└─ README.md
```

필요하다면 TypeScript 또는 ESLint 관련 최소 설정 파일을 추가할 수 있다.

현재 단계에서는 다음과 같은 디렉터리는 아직 만들지 마.

```text
controllers/
routes/
services/
repositories/
models/
entities/
database/
config/
middlewares/
utils/
```

실제 기능이 생길 때 구조를 분리한다.

---

# 4. app.ts 역할

`src/app.ts`에는 Express application 설정을 작성한다.

예상 역할:

- Express app 생성
- 필요한 최소 middleware 설정
- `/health` route 등록
- Express app export

예를 들어 다음 형태의 책임만 갖도록 한다.

```text
Express application 구성
↓
GET /health
↓
app export
```

`app.listen()`은 `app.ts`에서 실행하지 않는다.

---

# 5. server.ts 역할

`src/server.ts`는 서버 실행 entry point로 사용한다.

다음 역할을 담당한다.

- `app.ts`에서 Express app import
- 포트 설정
- `app.listen()` 실행
- 서버 시작 로그 출력

기본 포트는:

```text
3000
```

을 사용한다.

현재 단계에서는 `.env`를 사용하지 않는다.

예:

```text
http://localhost:3000
```

에서 서버가 실행되면 된다.

---

# 6. Health endpoint

다음 endpoint를 구현한다.

```http
GET /health
```

정상 응답:

```json
{
  "status": "ok"
}
```

HTTP status code는 `200`을 사용한다.

health endpoint 외의 API는 아직 구현하지 않는다.

특히 다음은 만들지 마.

```text
/api/events
/api/recommendations
/api/search
```

---

# 7. TypeScript 설정

TypeScript는 현재 Node.js 환경에 적절한 현대적인 설정으로 구성해줘.

다음 사항을 충족해야 한다.

- strict mode 활성화
- Node.js에서 정상적으로 실행 가능
- Express import 정상 동작
- build 결과를 별도 디렉터리에 출력
- source file은 `src/`
- build output은 `dist/`

가능하면 최신 Node.js와 TypeScript 환경에서 일반적으로 사용하는 ESM 구성을 우선 검토해줘.

단, ESM과 CommonJS 중 선택할 때는 현재 Node.js 24 환경에서 안정적이고 설정이 단순한 방식을 선택해줘.

선택한 module 방식을 마지막 결과 보고에서 설명해줘.

불필요하게 복잡한 TypeScript 설정은 추가하지 마.

---

# 8. package.json scripts

최소한 다음 script를 제공해줘.

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "start": "...",
    "lint": "..."
  }
}
```

각 script의 의미는 다음과 같다.

## dev

TypeScript source를 직접 실행하고 개발 중 변경사항을 쉽게 반영할 수 있어야 한다.

가능하면 `tsx watch`를 사용해도 된다.

## build

TypeScript를 compile해서 `dist/`를 생성한다.

## start

build된 JavaScript를 실행한다.

즉, 다음 순서가 정상 동작해야 한다.

```bash
pnpm build
pnpm start
```

## lint

TypeScript source를 ESLint로 검사한다.

---

# 9. ESLint

Frontend와 마찬가지로 ESLint를 사용한다.

Backend TypeScript 코드에 대해 다음이 정상 동작해야 한다.

```bash
pnpm lint
```

현재 단계에서는 Prettier를 추가하지 않는다.

가능하면 ESLint flat config를 사용해줘.

즉:

```text
eslint.config.js
```

형태를 우선한다.

---

# 10. README.md

기존 `backend/README.md` placeholder를 실제 Backend 개발환경 설명으로 교체해도 된다.

README에는 최소한 다음 내용을 포함해줘.

- Project Arco Backend
- Node.js
- TypeScript
- Express
- pnpm

실행 명령:

```bash
pnpm install
pnpm dev
```

검증 명령:

```bash
pnpm lint
pnpm build
pnpm start
```

health endpoint:

```text
GET /health
```

README를 지나치게 길게 만들지 마.

---

# 11. 실행 검증

설치 및 구성 후 반드시 다음을 검증해줘.

## Install

```bash
pnpm install
```

## Lint

```bash
pnpm lint
```

## Build

```bash
pnpm build
```

## Development server

```bash
pnpm dev
```

서버가 정상적으로 시작되는지 확인한다.

## Health check

가능하다면 서버 실행 중 다음 요청을 실제로 보내서 확인해줘.

```http
GET http://127.0.0.1:3000/health
```

응답이 다음과 같은지 확인한다.

```json
{
  "status": "ok"
}
```

## Production-style execution

가능하면 다음도 확인해줘.

```bash
pnpm build
pnpm start
```

build된 `dist/` 결과로 서버가 정상 실행되는지 확인한다.

검증이 끝난 후 실행 중인 서버 프로세스는 종료해줘.

---

# 이번 단계에서 하지 말아야 할 작업

다음은 절대 수행하지 마.

## Frontend

- `frontend/` 수정
- Vite 설정 수정
- Frontend API 코드 추가
- proxy 설정

## Database

- PostgreSQL 설치
- PostgreSQL 실행
- PostgreSQL Docker container 생성
- Docker Compose 생성
- `pg` 설치
- ORM 설치
- migration 구성
- schema 작성
- DB 연결 코드 작성

## API 기능

- 행사 CRUD 구현
- 행사 검색 구현
- 추천 알고리즘 구현
- API controller/service/repository 구조 구현

## 기타

- `.env` 생성
- 환경변수 시스템 추가
- Swagger/OpenAPI 설정
- CORS 설정
- 인증 구현
- 테스트 framework 추가
- 루트 workspace 구성
- 루트 `package.json` 생성

## Git

- Git commit
- Git add
- Git stash
- Git reset
- Git restore
- Git checkout
- 기존 Git 변경사항 수정 또는 제거

이번 단계의 범위를 넘어서는 구현은 하지 마.

---

# 변경 범위 확인

작업 후 반드시 `git status`를 확인해줘.

이번 단계에서 의도적으로 변경되어야 하는 영역은 기본적으로:

```text
backend/
```

뿐이다.

루트 `.gitignore`가 이미 다음을 제외하고 있다면 수정하지 않는다.

```text
node_modules/
dist/
.env
```

루트 설정을 수정할 필요가 있다고 판단되더라도 이번 단계에서는 수정하지 말고 마지막 보고에서 제안만 해줘.

---

# 작업 완료 보고 형식

작업 완료 후 다음 형식으로 결과를 정리해줘.

## 생성 및 변경된 주요 파일

- `backend/package.json`
- `backend/src/app.ts`
- `backend/src/server.ts`
- ...
- 각 파일의 역할을 간단히 설명

## 설치된 핵심 기술

실제 설치 결과를 기준으로 버전을 알려줘.

- Node.js:
- pnpm:
- Express:
- TypeScript:
- tsx:
- ESLint:

## Node module 방식

다음을 알려줘.

- ESM 또는 CommonJS 중 무엇을 사용했는지
- 해당 방식을 선택한 이유
- `package.json`과 `tsconfig.json`에서 관련 설정이 무엇인지

## 검증 결과

다음 각각을 성공/실패로 표시해줘.

- `pnpm install`:
- `pnpm lint`:
- `pnpm build`:
- `pnpm dev`:
- `GET /health`:
- `pnpm start`:

실패한 항목이 있다면 원인과 필요한 조치를 설명해줘.

## Health check 결과

실제로 받은 HTTP status와 body를 알려줘.

예:

```text
HTTP 200

{
  "status": "ok"
}
```

## Git 변경 범위

이번 작업으로 변경된 영역과 기존 변경사항 보존 여부를 확인해줘.

특히:

- `frontend/` 변경 여부
- `docs/` 변경 여부
- `prompts/` 변경 여부
- 루트 파일 변경 여부
- 기존 Git working tree 변경사항 보존 여부

## 현재 backend 구조

주요 파일만 tree 형태로 보여줘.

## 다음 단계 준비 여부

다음 단계에서는 PostgreSQL 개발환경을 구성할 예정이다.

현재 Docker CLI와 Docker Compose는 설치되어 있으므로, 다음 단계에서는 Docker Compose 기반 PostgreSQL을 우선 고려한다.

Backend가 PostgreSQL 연결 단계로 넘어갈 수 있는 정상 상태인지 알려줘.

이번 단계의 범위를 넘어서는 구현은 하지 마.