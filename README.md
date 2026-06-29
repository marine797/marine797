# 초보 해외여행 영어 발음 연습 웹앱

React + TypeScript + Vite 기반의 모바일 우선 영어 학습 앱입니다.

## 기능

- 카테고리 목록
- 표현 카드
- 짧은 영어 / 긴 영어 표시
- 한글 뜻 표시
- 한글 발음 보조 표시
- TTS 듣기 버튼
- 듣기 속도 선택
- 따라 말하기 3회 체크
- 즐겨찾기
- 학습 완료 체크
- 검색 기능

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:5173
```

## 데이터

학습 데이터는 아래 파일에서 불러옵니다.

```text
public/travel_english_app_data.min.json
```

## 배포

Vite 빌드:

```bash
npm run build
```

빌드 결과는 `dist/` 폴더에 생성됩니다.
