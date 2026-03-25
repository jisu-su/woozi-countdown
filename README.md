# 🩷 WOOZI Discharge Countdown

> **세븐틴 우지(이지훈)의 전역을 기다리는 캐럿들을 위한 카운트다운 웹사이트**  
> 🔗 [woozi-countdown.pages.dev](https://woozi-countdown.pages.dev/)

---

## ✨ 프로젝트 소개

좋아하는 아티스트의 전역일을 매일 기다리는 팬으로서, 그 기다림을 조금 더 설레게 만들어보고 싶었어요.  
그래서 만들게 된 **우지 전역 카운트다운 웹사이트**입니다.

카운트다운 시계 하나로 시작했지만, 거기에 급식표도 붙이고, 우지 솔로곡도 틀고, 같은 마음으로 기다리는 캐럿들과 응원을 나눌 수 있는 공간도 만들었어요.

---

## 🖼 화면 구성

왼쪽 사이드바 아이콘으로 4개 화면을 이동할 수 있어요.

| 아이콘 | 화면 | 설명 |
|:---:|:---:|---|
| ⏱ `timer.svg` | 카운트다운 | 전역일(2027.03.14)까지 남은 D-day 시계 |
| 🐾 `뾰풀이.svg` | 급식표 | 우지가 먹고 있을 군 급식 주간 메뉴 |
| 🎸 `우주공장.jpg` | 솔로곡 | 우지 솔로곡 유튜브 모음 (어떤 미래, Ruby, 운명 등) |
| 🐰 `봉봉이.svg` | 캐럿 소통창 | 우지에게 남기는 응원 댓글 |

---

## 🎨 디자인 컨셉

2016 팬톤 올해의 색에서 영감을 받았어요.

```
--rose-quartz : #F7C9CB  (로즈쿼츠)
--serenity    : #91A8D2  (세레나티)
```

두 색이 딱 반반이 아니라, `135deg` 그라데이션으로 자연스럽게 융화되는 배경을 사용했어요.  
유리질감(glassmorphism) 카드 위에 카운트다운 숫자가 떠 있는 구조입니다.

---

## 🛠 초기 개발 과정

```
1단계 기획  →  2단계 다이어그램  →  3단계 설계(Figma/FigJam)
     →  4단계 프로토타입  →  5단계 CI/CD 배포
```

- **기획**: 카운트다운 + 댓글 + 급식표 + 솔로곡 4개 섹션
- **설계**: Figma로 레이아웃 프로토타입 제작
- **초기 배포**: Cloudflare Pages (`deploy-test-7-2.pages.dev` → 현재 도메인)
- **식단 데이터**: 급식표 이미지를 직접 받아 `meals.js`에 정적 데이터로 수동 정리

현재 파일 구조는 단순한 3파일 구성이에요.

```
woozi-countdown/
├── index.html
├── script.js
└── meals.js
```

---

## 🔧 현재 진행 중인 유지보수

처음엔 빠르게 만드는 게 목표였다면, 지금은 **오래 쓸 수 있는 구조**로 바꾸는 중이에요.  
크게 3가지를 개선하고 있어요.

---

### 1. 파일 모듈화

현재 `script.js` 하나에 카운트다운 로직, 댓글, 라우팅이 모두 섞여 있어요.  
카운트다운 블럭을 다른 작업물에도 재사용하고 싶어서, 기능 단위로 파일을 분리하는 작업을 진행 중이에요.

목표 구조:

```
src/
├── app/
│   ├── bootstrap.js         # 앱 시작점
│   ├── router.js            # 페이지 전환
│   └── state.js             # 전역 상태
│
├── features/
│   ├── countdown/
│   │   ├── countdown.config.js    # 목표 날짜 설정
│   │   ├── countdown.logic.js     # 시간 계산/포맷
│   │   └── countdown.view.js      # DOM 렌더
│   │
│   ├── meals/
│   │   ├── meals.service.js       # API 호출
│   │   ├── meals.adapter.js       # 응답 → 내부 포맷 변환
│   │   ├── meals.view.js          # 주간 달력 렌더
│   │   └── meals.fallback.json    # API 실패 시 대체 데이터
│   │
│   ├── music/
│   │   ├── music.data.js          # 곡 목록 데이터
│   │   └── music.view.js          # 유튜브 카드 렌더
│   │
│   └── comments/
│       ├── comments.service.js    # 댓글 CRUD API
│       ├── comments.view.js       # 목록/입력 렌더
│       ├── comments.schema.js     # 유효성 검사
│       └── comments.storage.js    # localStorage fallback
│
├── shared/
│   ├── api/client.js        # fetch 공통 래퍼
│   ├── utils/date.js
│   ├── utils/dom.js
│   └── constants.js
│
└── styles/
    ├── base.css
    ├── layout.css
    ├── theme.css
    └── features/
        ├── countdown.css
        ├── meals.css
        ├── music.css
        └── comments.css
```

---

### 2. 식단표 공공데이터 API 연동

현재는 `meals.js`에 급식 메뉴를 직접 손으로 입력해서 매달 수동 업데이트를 해야 해요.  
공공데이터 Open API를 연결해서 자동으로 불러오는 방식으로 전환할 예정이에요.

- `meals.service.js`: 외부 API 호출
- `meals.adapter.js`: API 응답을 내부 공통 포맷으로 변환 → `{ date, menu[] }`
- API가 바뀌어도 `adapter`만 수정하면 되도록 설계
- 실패 시 `meals.fallback.json` 사용

---

### 3. 댓글창 DB 연결

현재 댓글은 `localStorage`에만 저장되어 브라우저를 닫으면 사라져요.  
**Cloudflare Workers + D1(SQLite)** 을 이용해서 실제 DB에 저장하도록 연결할 예정이에요.

```
worker/
├── src/index.js
└── wrangler.toml
```

추가로:
- **Cloudflare Turnstile**: 스팸 방지
- **Rate limiting**: 도배 방지
- `is_hidden`, `is_deleted` 필드로 댓글 관리

---

## 🗺 앞으로의 작업 순서

- [x] 초기 배포 완료
- [ ] 파일 모듈화 (app → countdown → meals → comments 순)
- [ ] 식단 공공데이터 API 연동
- [ ] 댓글 DB 연결 (Workers + D1)
- [ ] 스팸 방지 / 에러 UI 정리

---

## 만만든 이유

우지가 군대에 있는 동안 팬들에게는 긴 기다림의 시간이에요.  
이 사이트가 그 시간을 조금이라도 즐겁게, 함께 기다리는 느낌으로 만들어줄 수 있으면 좋겠어요.

같은 마음으로 기다리는 캐럿이라면 누구든 환영해요.

---

> 🪖 **우지 전역일: 2027년 3월 14일**  