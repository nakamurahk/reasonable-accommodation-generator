// 新データ構造（4分割JSON）の型定義

export type Domain = "企業" | "教育機関" | "支援機関";

export interface Concern {
  id: string;
  title: string;
  category: string;
  primary_tags: string[];
  secondary_tags: string[];
  trait_types: string[];
  contexts: Record<Domain, string[]>;
  examples: Record<Domain, string[]>;
  care_ids: string[];
}

export interface Care {
  id: string;
  title: string;
  bullets: string[];     // 0〜5行想定
  tags: string[];
}

export interface CareVariant {
  id: string;
  care_id: string;
  domain: Domain;
  detail_paragraphs: string[]; // 段落/短文
  request_difficulty: number; // 必須フィールド
}

export interface Bundle {
  concern: string; // Concern.id
  cares: { care: string; variants: string[] }[];
}

export interface Store {
  concerns: Record<string, Concern>;
  cares: Record<string, Care>;
  variants: Record<string, CareVariant>;
  bundles: Bundle[];
}

// ViewModel用の型定義
export interface CareCard {
  care: Care;
  bullets: string[];
  detail: string[];
  difficulty: number;
}

export interface ViewModelItem {
  concern: Concern;
  careCards: CareCard[];
}

export type ViewModel = ViewModelItem[];
