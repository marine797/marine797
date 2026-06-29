# Codex 앱 제작용 프롬프트

아래 JSON 파일을 데이터 소스로 사용해서 초보 해외여행 영어 발음·억양 연습 앱을 만들어줘.

## 데이터 파일

- `travel_english_app_data.json`
- 총 카테고리: 8개
- 총 학습 항목: 235개

## 앱 목표

한국어 초보자가 해외여행 영어를 익히는 앱이다.  
각 표현은 짧은 표현과 긴 표현으로 구성되어 있다.

## 필수 기능

1. 카테고리 목록 화면
2. 카테고리별 표현 카드 화면
3. 각 카드에 다음 정보 표시
   - 짧은 영어
   - 긴 영어
   - 한글 뜻
   - 한글 발음 보조
4. 발음 듣기 버튼
   - `audioTextShort`
   - `audioTextLong`
   - Web Speech API 또는 TTS 엔진 사용
5. 따라 말하기 연습
   - 짧은 영어 3번 반복
   - 긴 영어 3번 반복
6. 녹음 기능
   - 사용자가 말한 음성 녹음
   - 가능하면 STT로 텍스트 변환
7. 억양 연습
   - 문장을 천천히 듣기
   - 보통 속도로 듣기
   - 사용자가 따라 말하기
8. 즐겨찾기
9. 검색 기능
10. 학습 완료 체크

## 권장 UI

- 짧은 영어: 검정색 `#000000`
- 긴 영어: 진한 회색 `#555555`
- 한국어 뜻: 일반 검정 또는 `#222222`
- 한글 발음: 작고 연한 보조 텍스트
- 모바일 우선 레이아웃

## 데이터 필드 설명

```ts
type TravelEnglishItem = {
  id: string;
  categoryId: string;
  categoryTitleKo: string;
  order: number;
  type: "phrase" | "vocab";
  shortEnglish: string;
  longEnglish: string;
  koreanShort: string;
  koreanLong: string;
  pronunciationKoShort: string;
  pronunciationKoLong: string;
  audioTextShort: string;
  audioTextLong: string;
  tags: string[];
};
```

## 학습 카드 동작

각 카드에서 다음 순서로 학습한다.

1. 짧은 영어 보기
2. 짧은 영어 듣기
3. 사용자가 3번 따라 말하기
4. 긴 영어 보기
5. 긴 영어 듣기
6. 사용자가 3번 따라 말하기
7. 완료 체크

## 주의

한글 발음은 참고용이다. 실제 발음 평가는 반드시 `audioTextShort`, `audioTextLong` 기준으로 처리한다.
