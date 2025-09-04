import { ReasonableAccommodation, AccommodationItem } from '../types';

export function parseAccommodation(raw: any): ReasonableAccommodation {
  return raw as ReasonableAccommodation;
}

// 必要な部分のみを動的にインポートする関数
export const getAccommodationData = async (): Promise<ReasonableAccommodation> => {
  try {
    // 動的インポートを使用
    const data = await import('./user/ReasonableAccommodation.json');
    return data.default;
  } catch (error) {
    console.error('Failed to load accommodation data:', error);
    return [];
  }
};

// 特定のドメインとシチュエーションのデータのみを取得する関数
export const getAccommodationByDomainAndSituation = async (
  domainId: string,
  situationId: string
): Promise<ReasonableAccommodation> => {
  try {
    const data = await getAccommodationData();
    return data.filter(item => {
      const domainField = `${domainId}でのシチュエーション`;
      return item[domainField as keyof AccommodationItem]?.includes(situationId);
    });
  } catch (error) {
    console.error('Failed to load specific accommodation data:', error);
    return [];
  }
}; 