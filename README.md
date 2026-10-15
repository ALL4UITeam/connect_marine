# 해양서비스 퍼블리싱

Vite + HTML + SCSS + JavaScript + Handlebars.

## 실행

```sh
npm install
npm run setup
npm run dev
```

[화면 목록](http://127.0.0.1:5173/list.html)에서 각 시안을 확인합니다.
서비스 화면은 1920 × 1080 기준이며 최소 1280 × 800을 유지합니다.

프로젝트에 포함된 Node 22를 사용합니다. 시스템 Node가 낮은 버전이면 최초 설치 후 `npm run setup`을 실행하세요. PowerShell에서 실행이 막히면 `npm.cmd`를 사용하세요.

## 작업 범위

- 체크박스, ON/OFF, 선택 상태, 슬라이더
- 탭 이동, 아코디언, 패널·팝업 열기와 닫기
- 팝업 Escape 닫기, 키보드 포커스 이동
- 지도 도구 선택·해제, 전체지도·초기화 시 컨트롤 복원
- 줌 +/− 버튼·슬라이더의 진행률과 단계 표시 (지도 크기는 고정)

조회, 재생, 측정 계산, 카메라 추적, 스타일 적용은 화면만 구성했습니다. 입력값을 지도나 목록에 반영하지 않습니다. 각 상태는 별도 HTML로 확인합니다.

## 파일

| 경로                                     | 내용                                 |
| ---------------------------------------- | ------------------------------------ |
| `src/list.html`                          | 화면 목록                            |
| `src/pages/`                             | 화면별 HTML                          |
| `src/partials/marine-*.hbs`              | 공통 영역                            |
| `src/data/images.js`                     | 이미지 경로                          |
| `src/data/marine.js`                     | 화면별 시안 데이터                   |
| `src/assets/scss/marine/_variables.scss` | 색상·글꼴·레이아웃 변수, 공통 믹스인 |
| `src/assets/scss/marine/`                | 영역별 스타일                        |
| `src/assets/scss/base/_fonts.scss`       | 폰트 선언                            |
| `src/assets/js/marine.js`                | 기본 UI 조작                         |
| `src/data/support.js`                    | 해양업무지원 화면 데이터             |
| `src/assets/js/support.js`               | 해양업무지원 동작                    |
| `src/assets/scss/marine/_support.scss`   | 해양업무지원 스타일                  |
| `public/images/`                         | 역할별 이미지·아이콘                 |
| `public/images/support/`                 | 해양업무지원 이미지                  |
| `public/fonts/`                          | 폰트와 라이선스                      |

## 화면 목록

| 파일 (`src/pages/`)      | 화면             |
| ------------------------ | ---------------- |
| drift.html               | 기본 조회 화면   |
| drift-cluster.html       | 클러스터 정보    |
| drift-date.html          | 날짜 펼침        |
| drift-set.html           | 세트 선택        |
| drift-play.html          | 회차 재생        |
| drift-style.html         | 스타일 수정      |
| drift-camera.html        | 카메라 추적      |
| drift-camera-target.html | 추적 대상 펼침   |
| ocean.html               | 해양정보         |
| terrain.html             | 지형정보         |
| style-surface.html       | 실측 표층 스타일 |
| style-depth10.html       | 실측 10m 스타일  |
| style-depth20.html       | 실측 20m 스타일  |
| style-prediction.html    | 예측 스타일      |
| style-ai.html            | AI 분석 스타일   |
| traffic.html             | 교통정보         |
| traffic-layers.html      | 교통정보 레이어  |
| traffic-active.html      | 활성 레이어      |
| accident.html            | 해양사고 조회    |
| accident-filter.html     | 사고종류 선택    |
| accident-results.html    | 사고 결과        |
| accident-selected.html   | 목록 선택        |
| accident-detail.html     | 상세 정보        |
| layer-collapsed.html     | 레이어 접힘      |
| layer-expanded.html      | 레이어 펼침      |
| layer-active.html        | 레이어 선택 목록 |

## 빌드

```sh
npm run check
npm run preview
```

`check`는 ESLint, 포맷 검사, 빌드를 실행합니다. 배포 파일은 `dist/`에 생성됩니다. Handlebars는 빌드 시 HTML로 변환되며 `dist/` 전체를 전달하면 됩니다.

`main`에 푸시하면 GitHub Actions가 Pages로 배포합니다. 주소는 https://all4uiteam.github.io/connect_marine/ 입니다.
