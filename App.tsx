import { useEffect, useMemo, useState } from "react";
import type { TravelEnglishCategory, TravelEnglishDataset, TravelEnglishItem } from "./data/types";

const STORAGE_KEYS = {
  favorites: "travel-english-favorites",
  completed: "travel-english-completed",
};

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveSet(key: string, value: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...value]));
}

function speak(text: string, rate = 0.82) {
  if (!("speechSynthesis" in window)) {
    alert("이 브라우저는 음성 듣기를 지원하지 않습니다.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export default function App() {
  const [dataset, setDataset] = useState<TravelEnglishDataset | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(() => loadSet(STORAGE_KEYS.favorites));
  const [completed, setCompleted] = useState<Set<string>>(() => loadSet(STORAGE_KEYS.completed));
  const [repeatCounts, setRepeatCounts] = useState<Record<string, number>>({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.82);

  useEffect(() => {
    fetch("/travel_english_app_data.min.json")
      .then((res) => res.json())
      .then(setDataset)
      .catch(() => alert("학습 데이터를 불러오지 못했습니다."));
  }, []);

  useEffect(() => saveSet(STORAGE_KEYS.favorites, favorites), [favorites]);
  useEffect(() => saveSet(STORAGE_KEYS.completed, completed), [completed]);

  const categories = dataset?.categories ?? [];

  const allItems = useMemo(() => {
    return categories.flatMap((category) => category.items);
  }, [categories]);

  const filteredItems = useMemo(() => {
    const lower = query.trim().toLowerCase();

    return allItems.filter((item) => {
      const matchCategory = selectedCategoryId === "all" || item.categoryId === selectedCategoryId;
      const matchFavorite = !showFavoritesOnly || favorites.has(item.id);
      const searchable = [
        item.shortEnglish,
        item.longEnglish,
        item.koreanShort,
        item.koreanLong,
        item.pronunciationKoShort,
        item.pronunciationKoLong,
        item.categoryTitleKo,
        ...(item.tags ?? []),
      ].join(" ").toLowerCase();
      const matchQuery = !lower || searchable.includes(lower);
      return matchCategory && matchFavorite && matchQuery;
    });
  }, [allItems, selectedCategoryId, query, showFavoritesOnly, favorites]);

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleCompleted(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function addRepeat(id: string) {
    setRepeatCounts((prev) => {
      const current = prev[id] ?? 0;
      return { ...prev, [id]: Math.min(3, current + 1) };
    });
  }

  if (!dataset) {
    return (
      <main className="appShell">
        <section className="loadingCard">학습 데이터를 불러오는 중입니다...</section>
      </main>
    );
  }

  return (
    <main className="appShell">
      <header className="hero">
        <p className="eyebrow">초보 해외여행 영어</p>
        <h1>발음·억양 연습 앱</h1>
        <p className="subtitle">
          짧은 표현부터 듣고, 3번 따라 말한 뒤 긴 표현으로 확장해보세요.
        </p>
      </header>

      <section className="toolbar">
        <input
          className="searchInput"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="hotel, passport, wifi, 택시 검색"
        />

        <div className="rateControl">
          <label htmlFor="rate">듣기 속도</label>
          <select id="rate" value={speechRate} onChange={(event) => setSpeechRate(Number(event.target.value))}>
            <option value={0.68}>천천히</option>
            <option value={0.82}>보통</option>
            <option value={1}>빠르게</option>
          </select>
        </div>

        <button
          className={showFavoritesOnly ? "pill active" : "pill"}
          onClick={() => setShowFavoritesOnly((value) => !value)}
        >
          ★ 즐겨찾기
        </button>
      </section>

      <section className="categoryGrid" aria-label="카테고리">
        <button
          className={selectedCategoryId === "all" ? "categoryButton selected" : "categoryButton"}
          onClick={() => setSelectedCategoryId("all")}
        >
          <span>전체</span>
          <strong>{allItems.length}</strong>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className={selectedCategoryId === category.id ? "categoryButton selected" : "categoryButton"}
            onClick={() => setSelectedCategoryId(category.id)}
          >
            <span>{category.order}. {category.titleKo}</span>
            <strong>{category.items.length}</strong>
          </button>
        ))}
      </section>

      <section className="sectionHeader">
        <div>
          <h2>{selectedCategory ? selectedCategory.titleKo : "전체 표현"}</h2>
          <p>{selectedCategory ? selectedCategory.descriptionKo : "모든 여행 영어 표현을 한 번에 봅니다."}</p>
        </div>
        <span className="countBadge">{filteredItems.length}개</span>
      </section>

      <section className="cards">
        {filteredItems.map((item) => (
          <PhraseCard
            key={item.id}
            item={item}
            isFavorite={favorites.has(item.id)}
            isCompleted={completed.has(item.id)}
            repeatCount={repeatCounts[item.id] ?? 0}
            speechRate={speechRate}
            onFavorite={() => toggleFavorite(item.id)}
            onCompleted={() => toggleCompleted(item.id)}
            onRepeat={() => addRepeat(item.id)}
          />
        ))}
      </section>
    </main>
  );
}

function PhraseCard({
  item,
  isFavorite,
  isCompleted,
  repeatCount,
  speechRate,
  onFavorite,
  onCompleted,
  onRepeat,
}: {
  item: TravelEnglishItem;
  isFavorite: boolean;
  isCompleted: boolean;
  repeatCount: number;
  speechRate: number;
  onFavorite: () => void;
  onCompleted: () => void;
  onRepeat: () => void;
}) {
  return (
    <article className={isCompleted ? "phraseCard completed" : "phraseCard"}>
      <div className="cardTop">
        <span className="categoryLabel">{item.categoryTitleKo} · {item.order}</span>
        <div className="cardActions">
          <button className={isFavorite ? "iconButton active" : "iconButton"} onClick={onFavorite} aria-label="즐겨찾기">
            ★
          </button>
          <button className={isCompleted ? "doneButton done" : "doneButton"} onClick={onCompleted}>
            {isCompleted ? "완료됨" : "완료 체크"}
          </button>
        </div>
      </div>

      <div className="phraseBlock">
        <p className="label">짧은 표현</p>
        <h3 className="shortEnglish">{item.shortEnglish}</h3>
        <p className="korean">{item.koreanShort}</p>
        <p className="pronunciation">{item.pronunciationKoShort}</p>
        <button className="speakButton" onClick={() => speak(item.audioTextShort || item.shortEnglish, speechRate)}>
          ▶ 짧은 표현 듣기
        </button>
      </div>

      <div className="phraseBlock long">
        <p className="label">긴 표현</p>
        <h3 className="longEnglish">{item.longEnglish}</h3>
        <p className="korean">{item.koreanLong}</p>
        <p className="pronunciation">{item.pronunciationKoLong}</p>
        <button className="speakButton secondary" onClick={() => speak(item.audioTextLong || item.longEnglish, speechRate)}>
          ▶ 긴 표현 듣기
        </button>
      </div>

      <div className="practiceRow">
        <button className="repeatButton" onClick={onRepeat}>
          따라 말하기 체크 {repeatCount}/3
        </button>
        <div className="repeatDots" aria-label={`반복 ${repeatCount}회`}>
          {[1, 2, 3].map((count) => (
            <span key={count} className={repeatCount >= count ? "dot filled" : "dot"} />
          ))}
        </div>
      </div>
    </article>
  );
}
