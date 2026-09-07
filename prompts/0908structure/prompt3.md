현재 저장소의 `frontend/` 디렉터리에 Frontend 개발환경을 초기화해줘.

## 현재 프로젝트 상태

현재 저장소 경로:

```text
C:\Users\user\projects\Node.js-Arco
```

현재 주요 구조:

```text
Node.js-Arco/
├─ frontend/
│  └─ README.md
├─ backend/
│  └─ README.md
├─ docs/
├─ prompts/
├─ .gitignore
└─ README.md
```

현재 Git working tree에는 기존 문서 작업 및 이전 scaffold 작업에 의한 변경사항이 존재한다.

이번 작업과 무관한 기존 변경사항은 절대 수정, 삭제, 복구하지 마.

특히 다음 디렉터리는 수정하지 마.

```text
docs/
prompts/
backend/
```

루트의 기존 `.gitignore`, `README.md` 역시 이번 단계에서 불필요하게 수정하지 마.

---

# 이번 단계의 목표

`frontend/` 내부에 다음 기술 스택으로 실제 실행 가능한 Frontend 개발환경을 구성한다.

- Node.js
- pnpm
- Vite
- React
- TypeScript
- ESLint

이번 단계에서는 Frontend 환경만 구성한다.

Backend, PostgreSQL, Docker, API 연동은 아직 하지 않는다.

---

# 패키지 매니저

이번 프로젝트에서는 Frontend 패키지 매니저로 `pnpm`을 사용한다.

현재 환경에는 pnpm이 이미 설치되어 있다.

다음 원칙을 지켜줘.

- npm과 pnpm을 혼용하지 않는다.
- `package-lock.json`을 생성하지 않는다.
- `pnpm-lock.yaml`을 사용한다.
- yarn을 사용하지 않는다.

---

# 1. Vite 프로젝트 초기화

기존 `frontend/` 디렉터리 안에 Vite 프로젝트를 초기화해줘.

템플릿은 다음을 사용한다.

```text
React + TypeScript
```

즉, 일반적인 Vite React TypeScript 프로젝트 구조를 생성한다.

예상되는 주요 구조는 대략 다음과 같다.

```text
frontend/
├─ src/
├─ public/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ eslint.config.js
└─ ...
```

Vite 버전에 따라 기본 생성 구조가 조금 다를 수 있으며, 현재 공식 scaffold 구조를 우선한다.

---

# 2. 기존 frontend/README.md 처리

현재 `frontend/README.md`는 placeholder 문서다.

Vite scaffold 과정에서 README가 생성되거나 기존 README와 충돌할 경우, 기존 placeholder README는 Frontend 프로젝트에 맞게 교체해도 된다.

다만 README에는 최소한 다음 내용을 남겨줘.

- Project Arco Frontend
- React
- TypeScript
- Vite
- pnpm 사용
- 개발 서버 실행 방법

예:

```bash
pnpm install
pnpm dev
```

README를 지나치게 길게 작성하지 마.

---

# 3. Dependency 설치

Vite scaffold 완료 후 `frontend/` 내부에서 필요한 dependency를 `pnpm`으로 설치한다.

설치 후 다음을 확인해줘.

- `node_modules/` 생성
- `pnpm-lock.yaml` 생성
- `package.json` dependency 정상 구성

새로운 UI framework나 라이브러리는 아직 추가하지 마.

이번 단계에서는 예를 들어 다음을 설치하지 않는다.

- Tailwind CSS
- React Router
- Axios
- Zustand
- Redux
- TanStack Query
- UI component library

Vite React TypeScript 기본 환경에 필요한 dependency만 사용한다.

---

# 4. 기본 생성 코드 정리

Vite가 생성하는 기본 예제 코드는 과도한 데모 요소를 제거해도 된다.

예를 들어 다음과 같은 Vite 기본 예제 요소는 제거 가능하다.

- Vite logo
- React logo
- counter 예제
- 데모용 안내 문구

대신 앱이 정상 작동하는지 확인하기 위한 최소 화면만 남겨줘.

예를 들어:

```text
Project Arco
Event Recommendation Service
```

정도의 단순한 화면이면 충분하다.

이번 단계에서는 실제 서비스 UI를 구현하지 않는다.

다음은 만들지 마.

- 검색 폼
- 날짜 선택
- 관심 분야 선택
- 행사 카드
- 추천 UI
- API 요청 코드

---

# 5. TypeScript 설정 확인

Vite 기본 TypeScript 설정을 유지하는 것을 우선한다.

다만 다음을 확인해줘.

- TypeScript compilation 오류가 없는지
- React JSX 설정이 정상인지
- `src/` 내부 코드가 TypeScript로 작성되어 있는지
- 불필요하게 `any`를 사용하지 않았는지

현재 단계에서 커스텀 path alias나 복잡한 tsconfig 설정은 추가하지 마.

예:

```text
@/components
```

같은 alias는 아직 설정하지 않는다.

---

# 6. ESLint 확인

Vite React TypeScript 기본 ESLint 구성을 사용한다.

다음을 확인해줘.

```bash
pnpm lint
```

가 정상적으로 실행되는지 확인한다.

현재 단계에서는 Prettier, Husky, lint-staged 등 추가 개발 도구를 설치하지 않는다.

---

# 7. 실행 검증

설치 완료 후 다음을 검증해줘.

## Build

```bash
pnpm build
```

정상 완료되는지 확인한다.

## Lint

```bash
pnpm lint
```

정상 완료되는지 확인한다.

## Development server

가능하다면:

```bash
pnpm dev
```

를 실행해서 Vite 개발 서버가 정상적으로 시작되는지 확인한다.

서버를 장시간 실행 상태로 둘 필요는 없다.

확인 후 종료해도 된다.

기본 포트가 이미 사용 중이라면 임의로 시스템 설정을 변경하지 말고 그 사실만 보고해줘.

---

# 이번 단계에서 하지 말아야 할 작업

다음은 절대 수행하지 마.

## Backend

- `backend/` 수정
- Express 설치
- API 구현
- Backend `package.json` 생성

## Database

- PostgreSQL 설치
- PostgreSQL 실행
- Docker Compose 생성
- DB 연결 코드 생성
- ORM 설치

## Frontend 기능 구현

- 실제 서비스 화면 구현
- 행사 검색 기능 구현
- API 호출 구현
- mock API 구현
- React Router 설치
- 상태관리 라이브러리 설치
- CSS framework 설치

## Repository 설정

- 루트 workspace 구성
- 루트 `package.json` 생성
- Git commit
- Git add
- Git stash
- Git reset
- Git restore
- Git checkout
- 기존 문서 변경사항 수정

이번 단계는 Frontend 기본 개발환경 구성까지만 수행한다.

---

# 변경 범위 확인

작업 후 반드시 `git status`를 확인해줘.

이번 단계에서 의도적으로 변경되어야 하는 영역은 기본적으로 다음뿐이다.

```text
frontend/
```

루트 `.gitignore`가 현재 생성되는 Vite 파일을 정상적으로 제외하고 있다면 수정하지 않는다.

수정이 꼭 필요하다고 판단하더라도 임의로 변경하지 말고 마지막 보고에서 필요한 변경사항으로만 알려줘.

---

# 작업 완료 보고 형식

작업 완료 후 다음 형식으로 결과를 정리해줘.

## 생성 및 변경된 주요 파일

- `frontend/package.json`
- ...
- 어떤 파일이 생성/변경되었는지 요약

## 설치된 핵심 기술

- Node.js:
- pnpm:
- Vite:
- React:
- TypeScript:
- ESLint:

실제 설치된 버전을 `package.json` 또는 CLI 결과를 기준으로 알려줘.

## 검증 결과

- `pnpm install`:
- `pnpm lint`:
- `pnpm build`:
- `pnpm dev`:

각 항목을 성공/실패로 표시하고, 실패했다면 원인을 간단히 설명해줘.

## Git 변경 범위

이번 작업으로 변경된 파일과 기존 변경사항이 보존되었는지 확인해줘.

특히:

- `docs/` 변경 여부
- `prompts/` 변경 여부
- `backend/` 변경 여부
- 기존 Git 변경사항 보존 여부

## 현재 frontend 구조

주요 파일만 tree 형태로 보여줘.

예:

```text
frontend/
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ ...
├─ public/
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
└─ vite.config.ts
```

## 다음 단계 준비 여부

다음 단계에서는 `backend/`에 Node.js + TypeScript + Express 기반 Backend 개발환경을 구성할 예정이다.

Frontend가 해당 단계로 넘어갈 수 있는 정상 상태인지 알려줘.

이번 단계의 범위를 넘어서는 구현은 하지 마.