export type CharacteristicType = {
  id: string;
  name: string;
  description: string;
};

export type Domain = {
  id: string;
  name: string;
  situations: Situation[];
};

export type Situation = {
  id: string;
  name: string;
  domainId: string;
  difficulties: Difficulty[];
};

export type Difficulty = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  situations: string[];
  situationId: string;
  accommodations: Accommodation[];
};

export type Accommodation = {
  id: string;
  name: string;
  difficultyId: string;
  implementationDifficulty: '低' | '中' | '高';
  cost: '低' | '中' | '高';
  methodType: string;
  rippleEffect: '低' | '中' | '高';
  tags: string[];
};

export type UserSelection = {
  characteristics: CharacteristicType[];
  domain: Domain | null;
  situation: Situation | null;
  difficulties: Difficulty[];
};

// ReasonableAccommodation.jsonの型定義
export interface AccommodationItem {
  カテゴリ: string;
  配慮番号: string;
  困りごと内容: string;
  企業具体例: string;
  教育機関具体例: string;
  支援機関具体例: string;
  配慮内容: string;
  企業の具体的配慮例: string;
  教育機関の具体的配慮例: string;
  支援機関の具体的配慮例: string;
  具体的な配慮: string;
  職場での合理的配慮の要求のしやすさ: string;
  支援機関での合理的配慮の要求のしやすさ: string;
  教育機関での合理的配慮の要求のしやすさ: string;
  特性タイプ: string;
  ドメイン: string;
  企業でのシチュエーション: string;
  教育機関でのシチュエーション: string;
  支援機関でのシチュエーション: string;
}

export type ReasonableAccommodation = AccommodationItem[]; 