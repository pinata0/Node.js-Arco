현재 프로젝트 루트에 행사 데이터 수집 및 정제를 위한 `data/` 폴더 구조를 생성해줘.

목표는 2026년 행사 데이터를 월별로 수집한 뒤, `raw → normalized → import → PostgreSQL` 흐름으로 관리하는 것이다.

다음 구조를 생성해줘.

```text
data/
├─ README.md
│
├─ raw/
│  └─ 2026/
│     ├─ 01/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 02/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 03/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 04/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 05/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 06/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 07/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 08/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 09/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 10/
│     │  ├─ responses/
│     │  └─ sources/
│     ├─ 11/
│     │  ├─ responses/
│     │  └─ sources/
│     └─ 12/
│        ├─ responses/
│        └─ sources/
│
├─ normalized/
│  └─ 2026/
│
└─ import/
   └─ 2026/
```

빈 디렉터리가 Git에 포함될 수 있도록 필요한 경우 각 빈 디렉터리에 `.gitkeep` 파일을 추가해줘.

`data/README.md`에는 아래 내용을 작성해줘.

```markdown
# Event Dataset

2026년 행사 데이터를 수집하고 PostgreSQL에 적재하기 전까지 관리하기 위한 디렉터리다.

## 데이터 처리 흐름

```text
웹 조사 / ChatGPT 조사
        ↓
raw
        ↓
검토 / 중복 제거 / 정규화
        ↓
normalized
        ↓
DB 스키마에 맞게 변환
        ↓
import
        ↓
PostgreSQL
```

## 디렉터리

### `raw/`

수집한 데이터를 가능한 한 원본 그대로 저장한다.

월별로 다음 두 디렉터리를 사용한다.

- `responses/`
  - ChatGPT 또는 수동 조사 결과를 저장한다.
  - 한 달을 여러 번 조사할 경우 결과를 별도 파일로 저장한다.
  - 예:
    - `01-general-search.md`
    - `02-developer-events.md`
    - `03-ai-events.md`
    - `04-additional-search.md`

- `sources/`
  - 별도로 보존할 필요가 있는 원문, 텍스트, 참고 자료 등을 저장한다.
  - 모든 웹페이지를 저장할 필요는 없다.
  - 중요한 자료나 원본이 사라질 가능성이 있는 경우에 사용한다.

### `normalized/`

`raw` 데이터를 검토한 뒤 프로젝트의 데이터 모델에 맞게 정리한 데이터를 저장한다.

이 단계에서 다음 작업을 수행할 수 있다.

- 날짜 및 시간 형식 통일
- 행사 유형 정규화
- 태그 정규화
- 장소 및 지역명 정규화
- 중복 행사 제거
- 잘못 파싱된 값 수정

월별 파일 형태로 관리할 수 있다.

예:

```text
normalized/2026/01.yaml
normalized/2026/02.yaml
normalized/2026/09.yaml
```

### `import/`

PostgreSQL에 삽입하기 직전의 최종 데이터를 저장한다.

DB 스키마가 확정되면 다음과 같은 파일이 생성될 수 있다.

```text
events.csv
locations.csv
tags.csv
event_tags.csv
```

## 원칙

### 1. `raw` 데이터는 수정하지 않는다.

수집 당시의 정보를 보존하기 위한 영역이다.

잘못된 값이나 파싱 오류가 발견되더라도 `raw` 파일을 수정하지 않고 `normalized` 단계에서 처리한다.

### 2. 원문 정보를 최대한 보존한다.

행사 데이터에는 가능하면 다음 정보를 함께 남긴다.

- 원본 URL
- 원문 날짜/시간
- 원문 장소
- 원문 관심 분야 또는 카테고리
- 원문 신청 관련 문구

### 3. 정규화는 별도 단계에서 수행한다.

수집 단계에서 지나치게 형식을 통일하려 하지 않는다.

수집과 정규화를 분리하여 데이터 변환 과정에서 발생한 문제를 추적할 수 있도록 한다.
```

추가 요구사항:

1. 기존 파일이나 디렉터리를 삭제하거나 수정하지 말 것.
2. 이미 존재하는 디렉터리는 그대로 재사용할 것.
3. `normalized/2026/`과 `import/2026/`에는 아직 실제 데이터 파일을 만들지 말 것.
4. CSV나 YAML 샘플 데이터도 아직 생성하지 말 것.
5. 이번 작업은 디렉터리 구조와 `data/README.md` 생성까지만 수행할 것.
6. 작업 완료 후 생성된 파일과 디렉터리를 트리 형태로 출력해줘.