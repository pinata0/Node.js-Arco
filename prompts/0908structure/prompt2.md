현재 저장소에 FE/BE 개발을 위한 기본 프로젝트 골격을 생성해줘.

## 현재 저장소 상태

현재 저장소는 다음과 같다.

- Repository: `C:\Users\user\projects\Node.js-Arco`
- Git branch: `main`
- 기존 주요 디렉터리:
  - `docs/`
  - `prompts/`
- `frontend/`, `backend/`는 아직 없음
- 루트 `package.json` 없음
- `.gitignore` 없음
- `README.md` 없음
- `.env`, `.env.example` 없음

현재 Git working tree에는 기존 문서 작업 변경사항이 존재한다.

이 변경사항은 이번 작업과 무관하므로 절대 수정, 삭제, 복구, 이동하지 마.

특히 다음 영역은 건드리지 마.

```text
docs/
prompts/
```

기존 Git 변경사항을 stash, reset, checkout, restore 등의 명령으로 변경하지 마.

---

## 이번 단계의 목표

이번 단계에서는 앞으로 사용할 프로젝트 디렉터리 구조의 골격만 생성한다.

아직 Frontend나 Backend 패키지를 초기화하지 않는다.

아직 npm 또는 pnpm dependency를 설치하지 않는다.

---

## 생성할 구조

다음 구조를 만들어줘.

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

`docs/`, `prompts/`는 기존 디렉터리이므로 수정하지 않는다.

---

## 1. frontend/

`frontend/` 디렉터리를 생성한다.

현재 단계에서는 실제 Vite/React 프로젝트를 만들지 않는다.

`frontend/README.md`만 생성해서 다음 내용을 간단히 기록해줘.

- 이 디렉터리가 Frontend 애플리케이션용이라는 점
- 다음 단계에서 Vite 기반 Frontend를 초기화할 예정이라는 점
- 현재는 placeholder 상태라는 점

아직 다음 파일은 생성하지 마.

- `package.json`
- `vite.config.*`
- `src/`
- `node_modules/`

---

## 2. backend/

`backend/` 디렉터리를 생성한다.

현재 단계에서는 실제 Express 프로젝트를 만들지 않는다.

`backend/README.md`만 생성해서 다음 내용을 간단히 기록해줘.

- 이 디렉터리가 Backend API 서버용이라는 점
- 다음 단계에서 Node.js 기반 Backend를 초기화할 예정이라는 점
- PostgreSQL을 사용할 예정이라는 점
- 현재는 placeholder 상태라는 점

아직 다음 파일은 생성하지 마.

- `package.json`
- `src/`
- `.env`
- `node_modules/`

---

## 3. 루트 README.md

루트에 `README.md`를 생성해줘.

README에는 최소한 다음 내용을 포함해줘.

### Project Arco

이 프로젝트는 사용자가 날짜와 관심 분야를 입력하면 해당 날짜에 실제 참석할 수 있는

- 세미나
- 컨퍼런스
- 밋업
- 해커톤

등의 행사를 추천하는 웹서비스 MVP다.

초기 디렉터리 구조를 다음과 같이 설명해줘.

```text
frontend/  - Frontend application
backend/   - Backend API server
docs/      - Project documentation
prompts/   - Development prompts
```

그리고 아직 초기 scaffold 단계라는 점을 명시해줘.

README를 과도하게 길게 작성하지 마.

---

## 4. .gitignore

루트에 `.gitignore`를 생성한다.

Node.js 기반 FE/BE 프로젝트에서 공통적으로 사용할 수 있도록 다음 종류를 제외해줘.

### Dependencies

```text
node_modules/
```

### Environment variables

```text
.env
.env.*
!.env.example
```

### Build outputs

```text
dist/
build/
coverage/
```

### Logs

```text
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
```

### OS / Editor

Windows, macOS, VS Code 환경에서 일반적으로 생성되는 개인 환경 파일도 적절히 제외해줘.

단, 프로젝트에서 공유할 수 있는 VS Code 설정 전체를 무조건 제외하지는 마.

---

## 이번 단계에서 하지 말아야 할 작업

다음 작업은 절대 수행하지 마.

- `npm init`
- `pnpm init`
- `npm install`
- `pnpm install`
- Vite 프로젝트 생성
- React 설치
- Express 설치
- PostgreSQL 설치
- Docker 또는 Docker Compose 설정
- `package.json` 생성
- workspace 설정
- `.env` 생성
- application 코드 생성
- API 구현
- Git commit
- Git add
- Git stash
- Git reset
- Git restore
- Git checkout
- 기존 `docs/` 파일 수정
- 기존 `prompts/` 파일 수정

이번 단계에서는 프로젝트 골격 생성만 수행한다.

---

## 검증

작업 후 다음을 확인해줘.

1. `frontend/`가 생성되었는지
2. `backend/`가 생성되었는지
3. 각각 README가 존재하는지
4. 루트 README가 존재하는지
5. `.gitignore`가 존재하는지
6. 기존 `docs/`, `prompts/` 내용이 변경되지 않았는지
7. 기존 Git working tree의 문서 변경사항이 그대로 보존되었는지

`git status`를 이용해 작업 결과를 확인해도 되지만, Git 상태를 변경하는 명령은 사용하지 마.

---

## 작업 완료 보고

마지막에 다음 형식으로 결과를 알려줘.

### 생성된 파일

- ...

### 생성된 디렉터리

- ...

### 기존 파일 변경 여부

- 기존 `docs/`, `prompts/` 변경 여부
- 기존 Git 변경사항 보존 여부

### 현재 프로젝트 구조

작업 후 주요 디렉터리 구조를 tree 형태로 보여줘.

### 다음 단계

다음 단계에서 Frontend Node.js 개발환경을 초기화할 준비가 되었는지 알려줘.

이번 단계의 범위를 넘어서는 구현은 하지 마.