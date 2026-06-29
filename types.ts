export type TravelEnglishItem = {
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

export type TravelEnglishCategory = {
  id: string;
  order: number;
  titleKo: string;
  descriptionKo: string;
  items: TravelEnglishItem[];
};

export type TravelEnglishDataset = {
  version: string;
  titleKo: string;
  nativeLanguage?: string;
  targetLanguage?: string;
  purpose?: string;
  categories: TravelEnglishCategory[];
};
