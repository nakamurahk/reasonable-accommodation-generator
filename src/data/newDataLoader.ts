import { Store, Concern, Care, CareVariant, Bundle, Domain, ViewModelItem, CareCard } from '../types/newDataStructure';

export type ViewModel = ViewModelItem[];

// インデックス型定義
export interface SearchIndex {
  traits: Map<string, Set<string>>; // trait -> concern_ids
  domains: Map<string, Set<string>>; // domain -> concern_ids  
  situations: Map<string, Set<string>>; // situation -> concern_ids
}

// 4分割JSON用のローダー関数（src/data/userから直接import）
export async function loadStore(): Promise<Store> {
  // console.log('=== データロード開始 ===');
  
  // src/data/userから直接import
  const [concerns, cares, variants, bundles] = await Promise.all([
    import('./user/concerns.json').then(m => m.default),
    import('./user/cares.json').then(m => m.default),
    import('./user/care_variants.json').then(m => m.default),
    import('./user/bundles.json').then(m => m.default),
  ]);

  // console.log('生データ件数:', {
  //   concerns: concerns.length,
  //   cares: cares.length,
  //   variants: variants.length,
  //   bundles: bundles.length
  // });
  
  // 実際のデータ内容を確認
  // console.log('concernsの最初の3件:', concerns.slice(0, 3).map(c => ({ id: c.id, title: c.title })));

  const map = <T extends {id: string}>(arr: T[]) =>
    Object.fromEntries(arr.map(x => [x.id, x]));

  const result = {
    concerns: map<Concern>(concerns),
    cares: map<Care>(cares),
    variants: map<CareVariant>(variants.map(v => ({ ...v, domain: v.domain as Domain }))),
    bundles: bundles as Bundle[],
  };

  // console.log('マップ後件数:', {
  //   concerns: Object.keys(result.concerns).length,
  //   cares: Object.keys(result.cares).length,
  //   variants: Object.keys(result.variants).length,
  //   bundles: result.bundles.length
  // });
  
  // console.log('=== データロード終了 ===');
  
  return result;
}

// インデックス作成（検索を速くするための逆引き）
export function buildSearchIndex(store: Store): SearchIndex {
  const traits = new Map<string, Set<string>>();
  const domains = new Map<string, Set<string>>();
  const situations = new Map<string, Set<string>>();

  // concernsからインデックスを構築
  Object.values(store.concerns).forEach(concern => {
    // 特性タイプのインデックス
    concern.trait_types.forEach(trait => {
      if (!traits.has(trait)) traits.set(trait, new Set());
      traits.get(trait)!.add(concern.id);
    });

    // ドメインのインデックス
    Object.keys(concern.contexts).forEach(domain => {
      if (!domains.has(domain)) domains.set(domain, new Set());
      domains.get(domain)!.add(concern.id);
    });

    // シチュエーションのインデックス
    Object.entries(concern.contexts).forEach(([domain, situations_list]) => {
      situations_list.forEach(situation => {
        const key = `${domain}:${situation}`;
        if (!situations.has(key)) situations.set(key, new Set());
        situations.get(key)!.add(concern.id);
      });
    });
  });

  return { traits, domains, situations };
}

// クエリでconcernsをフィルタ
export function filterConcernsByQuery(
  store: Store, 
  index: SearchIndex, 
  query: { traits: string[]; domain: string; situations: string[]; }
): Concern[] {
  const { traits, domain, situations } = query;
  
  // console.log('=== フィルタリング開始 ===');
  // console.log('クエリ:', query);
  // console.log('総concerns数:', Object.keys(store.concerns).length);
  
  // 各条件でマッチするconcern_idのセットを取得
  const traitMatches = new Set<string>();
  traits.forEach(trait => {
    const matches = index.traits.get(trait);
    if (matches) {
      matches.forEach(id => traitMatches.add(id));
    }
  });
  // console.log('特性マッチ数:', traitMatches.size, '特性:', traits);

  const domainMatches = new Set<string>();
  if (domain) {
    const matches = index.domains.get(domain);
    if (matches) {
      matches.forEach(id => domainMatches.add(id));
    }
  }
  // console.log('ドメインマッチ数:', domainMatches.size, 'ドメイン:', domain);

  const situationMatches = new Set<string>();
  situations.forEach(situation => {
    const key = `${domain}:${situation}`;
    const matches = index.situations.get(key);
    if (matches) {
      matches.forEach(id => situationMatches.add(id));
    }
  });
  // console.log('シチュエーションマッチ数:', situationMatches.size, 'シチュエーション:', situations);

  // 交集合を計算（AND条件）
  const allMatches = new Set<string>();
  
  // 特性タイプの条件
  if (traits.length > 0) {
    traitMatches.forEach(id => allMatches.add(id));
  } else {
    // 特性が指定されていない場合は全てのconcernを含める
    Object.keys(store.concerns).forEach(id => allMatches.add(id));
  }
  // console.log('特性フィルタ後:', allMatches.size);
  
  // ドメインの条件
  if (domain) {
    const domainFiltered = new Set<string>();
    allMatches.forEach(id => {
      if (domainMatches.has(id)) {
        domainFiltered.add(id);
      }
    });
    allMatches.clear();
    domainFiltered.forEach(id => allMatches.add(id));
  }
  // console.log('ドメインフィルタ後:', allMatches.size);
  
  // シチュエーションの条件
  if (situations.length > 0) {
    const situationFiltered = new Set<string>();
    allMatches.forEach(id => {
      if (situationMatches.has(id)) {
        situationFiltered.add(id);
      }
    });
    allMatches.clear();
    situationFiltered.forEach(id => allMatches.add(id));
  }
  // console.log('シチュエーションフィルタ後:', allMatches.size);

  // 最終的なconcernsを返す
  const result = Array.from(allMatches).map(id => store.concerns[id]).filter(Boolean);
  // console.log('最終結果:', result.length);
  // console.log('=== フィルタリング終了 ===');
  
  return result;
}

// concernsからViewModelを構築
export function buildViewModelFromConcerns(
  store: Store, 
  concerns: Concern[], 
  domain: Domain
): ViewModel {
  return concerns.map(concern => {
    // bundlesから該当するconcernのbundleを探す
    const bundle = store.bundles.find(b => b.concern === concern.id);
    if (!bundle) {
      return {
        concern,
        careCards: []
      };
    }

    // bundleのcaresを順序通りに処理
    const careCards: CareCard[] = bundle.cares.map(({ care, variants }) => {
      const careData = store.cares[care];
      if (!careData) {
        return {
          care: { id: care, title: '不明', bullets: [], tags: [] },
          bullets: [],
          detail: [],
          difficulty: 0
        };
      }

      // 指定ドメインのvariantを取得
      const domainVariants = variants
        .map(id => store.variants[id])
        .filter(v => v && v.domain === domain);


      // フォールバック：bulletsが空ならdetailから抽出（先頭3〜5）
      const bullets = (careData.bullets?.length ? careData.bullets : 
        (domainVariants[0]?.detail_paragraphs_user ?? []).slice(0, 5));

      return {
        care: careData,
        bullets,
        detail: domainVariants.length ? domainVariants[0].detail_paragraphs_user : [],
        difficulty: domainVariants.length ? domainVariants[0].request_difficulty : 0,
      };
    });

    return { concern, careCards };
  });
}

// 元のbuildViewModel（後方互換用）
export function buildViewModel(store: Store, domain: Domain): ViewModel {
  return store.bundles.map(bundle => {
    const concern = store.concerns[bundle.concern];
    const careCards = bundle.cares.map(({ care, variants }) => {
      const c = store.cares[care];
      const vForDomain = variants
        .map(id => store.variants[id])
        .filter(v => v && v.domain === domain);
      
      // フォールバック：bulletsが空ならdetailから抽出（先頭3〜5）
      const bullets = (c.bullets?.length ? c.bullets : 
        (vForDomain[0]?.detail_paragraphs_user ?? []).slice(0, 5));
      
      return {
        care: c,
        bullets,
        detail: vForDomain.length ? vForDomain[0].detail_paragraphs_user : [],
        difficulty: vForDomain.length ? vForDomain[0].request_difficulty : 0,
      };
    });
    return { concern, careCards };
  });
}

// ViewModelから配慮案を取得（後方互換用）
export function getAccommodationsFromViewModel(
  viewModel: ViewModel, 
  difficultyTitle: string, 
  domain: Domain
) {
  const item = viewModel.find(vm => vm.concern.title === difficultyTitle);
  if (!item) return [];

  return item.careCards.map(card => ({
    'id': card.care.id, // care_1000～care_1368形式のIDを追加
    '困りごと内容': item.concern.title,
    'カテゴリ': item.concern.category,
    '配慮案タイトル': card.care.title, // cares.jsonのtitle
    '具体的な配慮': card.bullets.join('\n'), // cares.jsonのbullets
    '詳細説明': card.detail.join('\n'), // detail_paragraphs_user
    '難易度': card.difficulty,
    'タグ': card.care.tags.join(','),
    'examples': {
      'workplace': item.concern.examples['企業']?.join(',') || '',
      'education': item.concern.examples['教育機関']?.join(',') || '',
      'support': item.concern.examples['支援機関']?.join(',') || ''
    },
    // concern情報を追加
    'concern': item.concern
  }));
}

// ドメイン名からDomain型に変換
export function getDomainFromName(domainName: string): Domain {
  switch (domainName) {
    case '企業': return '企業';
    case '教育機関': return '教育機関';
    case '支援機関': return '支援機関';
    default: return '企業';
  }
}

// メインのフィルタリング関数（指定された流れ）
export async function buildFilteredViewModel(
  query: { traits: string[]; domain: string; situations: string[]; }
): Promise<ViewModel> {
  // 1. JSONをロード
  const store = await loadStore();
  
  // 2. Indexを作る
  const index = buildSearchIndex(store);
  
  // 3. クエリでconcernをフィルタ
  const filteredConcerns = filterConcernsByQuery(store, index, query);
  
  // 4. A/B/Cの順でcareを束ね、指定ドメインのvariantを当てる
  const domain = getDomainFromName(query.domain);
  const viewModel = buildViewModelFromConcerns(store, filteredConcerns, domain);
  
  // 5. UIに渡すViewModel（title＋bullets＋detail_paragraphs_user）
  return viewModel;
}
