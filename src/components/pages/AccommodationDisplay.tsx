import React, { useEffect, useState } from 'react';
import { ReasonableAccommodation } from '../../types';
// import reasonableAccommodations from '../../data/user/ReasonableAccommodation.json';
import { getBase64Image } from '../../utils/imageUtils';
import { Domain } from '../../types';
import { useIsMobile } from '../../hooks/useIsMobile';
// @ts-ignore
import { loadStore, buildViewModel, getAccommodationsFromViewModel, getDomainFromName, buildFilteredViewModel } from '../../data/newDataLoader';
import { ViewModel } from '../../types/newDataStructure';
import { Domain as NewDomain } from '../../types/newDataStructure';
import StepFooter from '../layout/StepFooter';
import { logPromptGeneration, logSelection } from '../../lib/analytics';
import supportTags from '../../data/supporter/support_tags.json';
import { recommend, Accommodation, ScoredResult } from '../../lib/recommender';

// PDF関連の動的インポート
let PDFComponents: any = null;

type Care = {
  id: string;
  title: string;
  icon: string;
  cares: string[];
};

type DifficultyItem = {
  id: string;
  title: string;
  icon: string;
  cares: string[];
};

type Difficulty = {
  id: string;
  title: string;
  icon: string;
};

interface AccommodationDisplayProps {
  selectedDifficulties: Difficulty[];
  selectedDomain: Domain | null;
  onRestart: () => void;
  onBack: () => void;
  viewModel?: ViewModel | null | undefined;
  characteristics?: any[];
  situations?: any[];
}

// アイコン画像パス
const ICONS = {
  star: '/icons/star.png',
  blue: '/icons/blue-square.png',
  orange: '/icons/orange-square.png',
  yellow: '/icons/yellow-square.png',
  note: '/icons/note.png',
};
const ACC_ICONS = ['🟦', '🟧', '🟨']; // 画面表示用は絵文字
const ACC_LABELS = ['A', 'B', 'C'];

// カテゴリアイコンと背景色の定義
const CATEGORY_STYLES = {
  '身体症状・体調': { icon: '🏥', bgColor: '#FFF0F5' },
  '感覚・環境': { icon: '💡', bgColor: '#FFFACD' },
  '注意・集中': { icon: '🎯', bgColor: '#F0E6FF' },
  '実行・計画・記憶': { icon: '📋', bgColor: '#E6F3FF' },
  '感情・ストレス反応': { icon: '❤️', bgColor: '#FFF4E6' },
  'コミュニケーション': { icon: '💬', bgColor: '#E6FFE6' },
  '生活・変化対応': { icon: '🔄', bgColor: '#E0FFFF' },
  '職場・社会不安': { icon: '🏢', bgColor: '#F5F5F5' }
};

// 困りごとタイトルからカテゴリを特定する関数（新データ構造対応）
const getCategoryFromTitle = (title: string, viewModel: ViewModel | null | undefined, reconstructedViewModel?: ViewModel | null) => {
  const effectiveViewModel = viewModel || reconstructedViewModel;
  if (!effectiveViewModel) return null;
  
  const item = effectiveViewModel.find((vm: any) => vm.concern.title === title);
  return item ? item.concern.category : null;
};

// PDF用アイコン画像パス
const PDF_ACC_ICONS = [
  '/icons/blue-square.png',
  '/icons/orange-square.png',
  '/icons/yellow-square.png',
];
const PDF_ACC_LABELS = ['A', 'B', 'C'];

const points = [
  '数より質を重視：配慮は3件以内に絞るのが理想',
  '配慮と負担のバランスを意識：双方に無理のない形を探る',
  '人事や支援担当を必ず通す：共有してリスクを減らす',
  '段階的な導入を検討：一気にではなく、試行→拡張の流れで',
  '定期的に見直す：状況に応じて調整や更新を行う',
  'その場で即決しない：「持ち帰って検討します」と伝える',
];

// support_tags.jsonから属性タグを取得する関数
  const getSupportTags = (careId: string) => {
    const supportTag = supportTags.items.find((item: any) => item.care_id === careId);
    if (supportTag) {
      // コストレベルを短縮形に変換
      const costLevelMap: { [key: string]: string } = {
        '低コスト': '低',
        '中コスト': '中',
        '高コスト': '高'
      };
      return {
        ...supportTag,
        cost_level: costLevelMap[supportTag.cost_level] || supportTag.cost_level
      };
    }
    return null;
  };

  // 推薦ロジック用のヘルパー関数
  const convertToAccommodation = (acc: any, accIdx: number): Accommodation => {
    const supportTag = getSupportTags(acc.id);
    return {
      id: acc.id,
      label: `配慮案${ACC_LABELS[accIdx % ACC_LABELS.length]}`,
      title: acc['配慮案タイトル'] || acc.description || '',
      tags: {
        cost: supportTag?.cost_level as any,
        difficulty: supportTag?.difficulty_level as any,
        legal: supportTag?.legal_basis === '努力義務' ? '努力義務' : 
               supportTag?.legal_basis === '任意配慮' ? '任意' : '任意',
        psychological: supportTag?.psychological_cost_level === '低' ? '高' :
                      supportTag?.psychological_cost_level === '中' ? '中' : '低',
        effect: supportTag?.effects?.immediacy === '即効' ? '即効性' : '持続性',
        leadTimeDays: supportTag?.lead_time === '即時' ? 0 : 
                     supportTag?.lead_time === '短期' ? 7 : 30,
        upkeepHoursPerMonth: supportTag?.ongoing_effort === '運用工数低' ? 1 :
                            supportTag?.ongoing_effort === '運用工数中' ? 4 : 8,
        stakeholders: supportTag?.people_involved === '少数' ? 2 :
                     supportTag?.people_involved === '中程度' ? 5 : 10,
        expertise: supportTag?.expertise_level === 'なし' ? '低' :
                   supportTag?.expertise_level === '基本研修' ? '中' :
                   supportTag?.expertise_level === 'IT基本' ? '中' :
                   supportTag?.expertise_level === 'マネジメント' ? '高' : '低'
      }
    };
  };

  // 推薦結果を取得
  const getRecommendations = (accommodations: any[]): ScoredResult[] => {
    const accommodationItems = accommodations.map((acc, idx) => convertToAccommodation(acc, idx));
    const results = recommend(accommodationItems);
    
    // デバッグ用：各配慮案の重みづけ詳細をコンソールに出力
    console.log('=== 配慮案の重みづけデバッグ情報 ===');
    results.forEach((rec, index) => {
      console.log(`\n【配慮案${index + 1}】${rec.title} (${rec.label})`);
      console.log('最終スコア:', rec.score.toFixed(4));
      console.log('バッジ:', rec.badges);
      console.log('理由:', rec.reason);
      
      // 各項目のスコア詳細
      if (rec.debug) {
        console.log('各項目スコア:');
        console.log(`  💰コスト: ${rec.debug.s_cost?.toFixed(4) || 'N/A'}`);
        console.log(`  ⚡難易度: ${rec.debug.s_diff?.toFixed(4) || 'N/A'}`);
        console.log(`  💬心理的負担: ${rec.debug.s_psy?.toFixed(4) || 'N/A'}`);
        console.log(`  🌱効果: ${rec.debug.s_eff?.toFixed(4) || 'N/A'}`);
        console.log(`  ⚖️法的根拠: ${rec.debug.s_legal?.toFixed(4) || 'N/A'}`);
        console.log(`  ⏰リードタイム: ${rec.debug.s_lead?.toFixed(4) || 'N/A'}`);
        console.log(`  🔧維持管理: ${rec.debug.s_keep?.toFixed(4) || 'N/A'}`);
        console.log(`  👥関係者数: ${rec.debug.s_people?.toFixed(4) || 'N/A'}`);
        console.log(`  🎓専門性: ${rec.debug.s_expt?.toFixed(4) || 'N/A'}`);
        
        if (rec.debug.weights) {
          console.log('重み係数:');
          Object.entries(rec.debug.weights).forEach(([key, value]) => {
            console.log(`  ${key}: ${(value as number).toFixed(4)}`);
          });
        }
        
        if (rec.debug.raw_tags) {
          console.log('元のタグデータ:', rec.debug.raw_tags);
        }
      }
    });
    console.log('=====================================\n');
    
    return results;
  };

// 配慮案抽出関数（新データ構造のみ）
const getAccommodations = (difficultyTitle: string, viewModel: ViewModel | null | undefined, selectedDomain: Domain | null, reconstructedViewModel?: ViewModel | null) => {
  // console.log('getAccommodations called with:', { difficultyTitle, viewModel, selectedDomain });
  
  // まず元のviewModelを試し、なければ再構築されたviewModelを使用
  const effectiveViewModel = viewModel || reconstructedViewModel;
  
  if (!effectiveViewModel || !selectedDomain) {
    // console.log('getAccommodations - returning empty array due to missing data');
    return []; // データが読み込まれていない場合は空配列を返す
  }
  
  const domain = getDomainFromName(selectedDomain.name);
  const accommodations = getAccommodationsFromViewModel(effectiveViewModel, difficultyTitle, domain);
  
  // care_idの若い順（A、B、C）にソート
  const sortedAccommodations = accommodations.sort((a: any, b: any) => {
    const aId = parseInt(a.id?.replace('care_', '') || '0');
    const bId = parseInt(b.id?.replace('care_', '') || '0');
    return aId - bId;
  });
  
  // console.log('getAccommodations - found accommodations:', sortedAccommodations);
  return sortedAccommodations;
};


// PDF関連の動的インポート用
const loadPDFComponents = async () => {
  if (!PDFComponents) {
    PDFComponents = await import('@react-pdf/renderer');
  }
  return PDFComponents;
};


export const AccommodationDisplay: React.FC<AccommodationDisplayProps> = ({
  selectedDifficulties,
  selectedDomain,
  onRestart,
  onBack,
  viewModel,
  characteristics = [],
  situations = []
}) => {
  const [reconstructedViewModel, setReconstructedViewModel] = useState<ViewModel | null>(null);
  // console.log('AccommodationDisplay - viewModel:', viewModel);
  // console.log('AccommodationDisplay - selectedDifficulties:', selectedDifficulties);
  // console.log('AccommodationDisplay - selectedDomain:', selectedDomain);
  const isMobile = useIsMobile();

  // viewModelがnullの場合に再構築を試行
  useEffect(() => {
    const reconstructViewModel = async () => {
      if (!viewModel && selectedDomain && selectedDifficulties.length > 0) {
        try {
          // 実際の選択情報を使用して再構築
          const query = {
            traits: characteristics.map(c => c.name || c),
            domain: selectedDomain.name,
            situations: situations.map(s => s.name || s)
          };
          
          const vm = await buildFilteredViewModel(query);
          setReconstructedViewModel(vm);
        } catch (error) {
          console.error('viewModel再構築に失敗:', error);
        }
      }
    };

    reconstructViewModel();
  }, [viewModel, selectedDomain, selectedDifficulties, characteristics, situations]);
  
  // 選択状態を管理するstate
  const [selectedItems, setSelectedItems] = useState<{
    difficulties: string[];
    accommodations: { [difficultyId: string]: string[] };
  }>(() => {
    // リロード時にlocalStorageから選択状態を復元
    const saved = localStorage.getItem('accommodation_selections');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (error) {
        console.error('選択状態の復元に失敗:', error);
      }
    }
    return {
      difficulties: [],
      accommodations: {}
    };
  });

  // 選択状態をlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('accommodation_selections', JSON.stringify(selectedItems));
  }, [selectedItems]);
  
  // プロンプト生成用のstate
  const [promptMode, setPromptMode] = useState<'colleague' | 'supervisor'>('supervisor');
  const [communicationMethod, setCommunicationMethod] = useState<'email' | 'oral' | 'chat' | 'document'>('email');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');

  // XSS対策：入力値のサニタイズ
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // < > を除去
      .replace(/javascript:/gi, '') // javascript: を除去
      .replace(/on\w+=/gi, '') // onイベントハンドラを除去
      .trim();
  };
  const [activeTab, setActiveTab] = useState<'accommodations' | 'prompt'>('accommodations');
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [showPDFModal, setShowPDFModal] = useState<boolean>(false);
  const [pdfType, setPdfType] = useState<'supervisor' | 'personal'>('supervisor');
  
  // ファイル名の生成（YYYYMMDD形式）
  const today = new Date();
  const dateStr = today.getFullYear() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');

  const [base64Images, setBase64Images] = useState<{ [key: string]: string }>({});
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);
  const [showRecommendationReason, setShowRecommendationReason] = useState<{ difficultyId: string; accommodationId: string } | null>(null);
  
  // 困りごとの選択状態を切り替える関数
  const toggleDifficultySelection = (difficultyId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      difficulties: prev.difficulties.includes(difficultyId)
        ? prev.difficulties.filter(id => id !== difficultyId)
        : [...prev.difficulties, difficultyId]
    }));
  };
  
  // 配慮案の選択状態を設定する関数（ラジオボタン用）
  const setAccommodationSelection = (difficultyId: string, accommodationId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      accommodations: {
        ...prev.accommodations,
        [difficultyId]: [accommodationId] // 1つの困りごとに対して1つの配慮案のみ
      }
    }));
    
    // 配慮案選択ログ（IDのみ）
    const difficulty = selectedDifficulties.find(d => d.id === difficultyId);
    const accommodations = getAccommodations(difficulty?.title || '', viewModel, selectedDomain, reconstructedViewModel);
    const selectedAccommodation = accommodations[parseInt(accommodationId)];
    
    const accommodationId_final = selectedAccommodation?.id || `care_${1000 + parseInt(accommodationId)}`;
    
    logSelection('step5', 'accommodation_select', {
      difficulty_id: difficultyId, // conc_1～conc_123形式
      accommodation_id: accommodationId_final, // care_1000～care_1368形式
      action: 'select'
    });
  };
  
  // 選択された困りごとのみをフィルタリングする関数
  const getSelectedDifficulties = () => {
    return selectedDifficulties.filter(difficulty => 
      selectedItems.difficulties.includes(difficulty.id)
    );
  };
  
  // 選択された配慮案のみをフィルタリングする関数
  const getSelectedAccommodations = (difficultyId: string, accommodations: any[]) => {
    const selectedAccommodationIds = selectedItems.accommodations[difficultyId] || [];
    const selectedAccommodations = accommodations.filter((_, index) => 
      selectedAccommodationIds.includes(String(index))
    );
    return selectedAccommodations;
  };
  
  // プロンプト生成関数
  const generatePrompt = () => {
    // viewModelが利用できない場合でもフォールバック配慮案でプロンプト生成を続行
    
    const selectedDifficultiesToShow = getSelectedDifficulties();
    if (selectedDifficultiesToShow.length === 0) {
      alert('困りごとを選択してください。');
      return;
    }
    
    // 困りごとテキストを生成
    let difficultyText = '';
    selectedDifficultiesToShow.forEach((difficulty: any) => {
      difficultyText += `・${difficulty.title}\n`;
    });
    
    // 配慮案テキストを生成
    let accommodationText = '';
    selectedDifficultiesToShow.forEach((difficulty: any) => {
      const accommodations = getAccommodations(difficulty.title, viewModel, selectedDomain, reconstructedViewModel);
      const selectedAccommodations = getSelectedAccommodations(difficulty.id, accommodations);
      
      if (selectedAccommodations.length > 0) {
        accommodationText += `【${difficulty.title}】\n`;
        selectedAccommodations.forEach((acc: any, accIndex: number) => {
          // 選択された配慮案の実際のインデックスを取得
          const selectedAccommodationIds = selectedItems.accommodations[difficulty.id] || [];
          const actualIndex = selectedAccommodationIds[accIndex];
          const accLabel = ['A', 'B', 'C'][parseInt(actualIndex)] || String(parseInt(actualIndex) + 1);
          accommodationText += `配慮案${accLabel}: ${acc['配慮案タイトル'] || acc.description}\n`;
          if (acc['詳細説明']) {
            const details = acc['詳細説明'].split('\n').filter((line: string) => line.trim());
            details.forEach((detail: string) => {
              accommodationText += `  • ${detail.trim()}\n`;
            });
          }
        });
        accommodationText += `\n`;
      }
    });
    
    let prompt = '';
    
    if (promptMode === 'colleague') {
      // 同僚向けAIプロンプト
      const methodText = communicationMethod === 'email' ? 'メール' : 
                        communicationMethod === 'oral' ? '口頭' : 
                        communicationMethod === 'chat' ? 'チャット' : 'メール';
      
      prompt = `あなたは、チーム内の相互理解を促進し、パフォーマンスを最大化させるためのコミュニケーション設計の専門家です。
次の困りごとと配慮案を、同僚に「チームを円滑にするための工夫」として${methodText}で伝える想定で整理してください。

条件：
- 「配慮」や「障害」といった言葉は避け、「チームのルール」「作業の効率化」といった前向きな言葉に置き換える
- 相手に負担を強いる印象を避け、「お互いに協力し合う」という姿勢を示す
- この工夫が、個人のミスやストレスを減らすだけでなく、チーム全体の生産性向上につながることを示唆する
- 同僚に「簡単に」「すぐに」できる具体的アクションを提示する
- 依頼文は、親しみやすく、かつ建設的なトーンにする

# 困りごと
${difficultyText.trim()}

# 配慮案
${accommodationText.trim()}

# 自由記述（ユーザー入力）
${userInput.trim() || '（記述なし）'}

出力形式：
1. 目的（例：チーム全体の集中力・ミスの削減を目指して）
2. 依頼したい具体的なアクションと、それがチームにもたらすメリット
3. 同僚に伝えるための具体的な文面（${methodText}での相談を想定）`;
      
    } else {
      // 上司・人事向けAIプロンプト
      const methodText = communicationMethod === 'email' ? 'メール' : 
                        communicationMethod === 'oral' ? '口頭' : 
                        communicationMethod === 'chat' ? 'チャット' : 'メール';
      
      prompt = `あなたは、合理的配慮と生産性向上を両立させる調整のスペシャリストです。上司や人事が前向きに検討できる、建設的で論理的な「合理的配慮の調整案」を提示してください。

👔 上司・人事向け
次の困りごとと配慮案を、上司や人事に${methodText}で相談する想定で整理してください。

条件：
- 「要望」ではなく「提案」として書く
- 業務への影響や実現性がイメージしやすいようにする
- 協働姿勢を示す（会社への貢献意欲と、配慮が叶った際のメリットを明確にする）
- 「他の社員に示しがつかない」などと言われないように、この調整が業務遂行上なぜ必要かというロジックを構成する
- 依頼用の文面は、謙虚かつ前向きな姿勢を保ち、感謝の意と成果で貢献する意思を必ず盛り込む
- 提案が実現した場合の費用対効果（生産性向上、ミス削減など）を間接的に示唆する
- 上司や相手方に取ってほしいアクションが明確になるように依頼文を構成する
- 自分の側で対策を行う上で、上司に支援してほしいことを明確にして、提案してください

# 困りごと
${difficultyText.trim()}

# 配慮案
${accommodationText.trim()}

# 自由記述（ユーザー入力）
${userInput.trim() || '（記述なし）'}

出力形式：
1. 目的（例：チーム全体の集中力・ミスの削減を目指して）
2. 依頼したい具体的なアクションと、それがチームにもたらすメリット
3. 上長・人事に伝えるための具体的な文面（${methodText}での相談を想定）`;
    }
    
    setGeneratedPrompt(prompt);
    
    // デバッグ：プロンプト生成時のパラメータを確認
    
    // プロンプト生成ログ
    logPromptGeneration(promptMode, communicationMethod);
  };
  
  // プロンプトをコピーする関数
  const copyPrompt = () => {
    if (!generatedPrompt) {
      alert('プロンプトが生成されていません。');
      return;
    }
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(generatedPrompt)
        .then(() => {
          alert('プロンプトをコピーしました');
        })
        .catch((err) => {
          console.error('コピーに失敗しました:', err);
          fallbackCopyTextToClipboard(generatedPrompt);
        });
    } else {
      fallbackCopyTextToClipboard(generatedPrompt);
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const images = {
        star: await getBase64Image(ICONS.star),
        note: await getBase64Image(ICONS.note),
        acc0: await getBase64Image(PDF_ACC_ICONS[0]),
        acc1: await getBase64Image(PDF_ACC_ICONS[1]),
        acc2: await getBase64Image(PDF_ACC_ICONS[2]),
      };
      setBase64Images(images);
    };
    loadImages();
  }, []);
  
  // 初期化時にすべての困りごとを選択状態にし、各困りごとの最初の配慮案を自動選択する
  // ただし、保存された選択状態がある場合はそれを優先
  useEffect(() => {
    if (selectedDifficulties.length > 0) {
      // 保存された選択状態をチェック
      const saved = localStorage.getItem('accommodation_selections');
      if (saved) {
        try {
          const savedSelections = JSON.parse(saved);
          // 保存された選択状態が現在の困りごとと一致するかチェック
          const currentDifficultyIds = selectedDifficulties.map(d => d.id);
          const savedDifficultyIds = savedSelections.difficulties || [];
          
          if (currentDifficultyIds.every(id => savedDifficultyIds.includes(id))) {
            // 保存された選択状態を使用
            setSelectedItems(savedSelections);
            
            // 各困りごとで配慮案が選択されていない場合は、デフォルトで配慮案Aを選択
            const updatedSelections = { ...savedSelections };
            let hasChanges = false;
            
            selectedDifficulties.forEach(difficulty => {
              const accommodations = getAccommodations(difficulty.title, viewModel, selectedDomain, reconstructedViewModel);
              if (accommodations.length > 0) {
                const currentSelections = updatedSelections.accommodations[difficulty.id] || [];
                if (currentSelections.length === 0) {
                  // 配慮案が選択されていない場合は、デフォルトで配慮案Aを選択
                  updatedSelections.accommodations[difficulty.id] = ['0'];
                  hasChanges = true;
                  
                  // デフォルト選択のログを送信
                  const defaultAccommodation = accommodations[0];
                  logSelection('step5', 'accommodation_select', {
                    difficulty_id: difficulty.id,
                    accommodation_id: defaultAccommodation?.id || `care_${1000}`,
                    action: 'select'
                  });
                }
              }
            });
            
            if (hasChanges) {
              setSelectedItems(updatedSelections);
            }
            return;
          }
        } catch (error) {
          console.error('保存された選択状態の読み込みに失敗:', error);
        }
      }
      
      // 保存された選択状態がない場合、デフォルトの初期化を行う
      const initialAccommodations: { [difficultyId: string]: string[] } = {};
      
      selectedDifficulties.forEach(difficulty => {
        const accommodations = getAccommodations(difficulty.title, viewModel, selectedDomain, reconstructedViewModel);
        
        if (accommodations.length > 0) {
          initialAccommodations[difficulty.id] = ['0']; // 配慮案A（インデックス0）をデフォルト選択
          
          // デフォルト選択の配慮案Aのログを送信
          const defaultAccommodation = accommodations[0]; // インデックス0の配慮案
          
          logSelection('step5', 'accommodation_select', {
            difficulty_id: difficulty.id, // conc_1～conc_123形式
            accommodation_id: defaultAccommodation?.id || `care_${1000}`, // care_1000～care_1368形式
            action: 'select'
          });
        }
      });
      
      const newSelectedItems = {
        difficulties: selectedDifficulties.map(d => d.id),
        accommodations: initialAccommodations
      };
      
      setSelectedItems(newSelectedItems);
      
      // 既存の配慮案選択状態をsessionDataに反映
      selectedDifficulties.forEach(difficulty => {
        const accommodations = getAccommodations(difficulty.title, viewModel, selectedDomain, reconstructedViewModel);
        const selectedAccommodationIds = newSelectedItems.accommodations[difficulty.id] || [];
        
        selectedAccommodationIds.forEach(accommodationId => {
          const selectedAccommodation = accommodations[parseInt(accommodationId)];
          if (selectedAccommodation) {
            
            logSelection('step5', 'accommodation_select', {
              difficulty_id: difficulty.id,
              accommodation_id: selectedAccommodation.id || `care_${1000 + parseInt(accommodationId)}`,
              action: 'select'
            });
          }
        });
      });
      
      // デフォルト選択状態をlocalStorageに保存
      localStorage.setItem('accommodation_selections', JSON.stringify(newSelectedItems));
    }
  }, [selectedDifficulties, viewModel, selectedDomain, reconstructedViewModel]);


  const getCategoryIcon = (category: string) => {
    const CATEGORY_ICONS = {
      '身体症状・体調': '🏥',
      '感覚・環境': '💡',
      '注意・集中': '🎯',
      '実行・計画・記憶': '📋',
      '感情・ストレス反応': '❤️',
      'コミュニケーション': '💬',
      '生活・変化対応': '🔄',
      '職場・社会不安': '🏢'
    };
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '🎯';
  };


  const handleCopyToClipboard = () => {
    // 新しいUI構造に対応したコピー機能
    if (!viewModel || !selectedDifficulties || !selectedDomain) {
      alert('データが読み込まれていません。ページを再読み込みしてください。');
      return;
    }

    // 選択された困りごとのみを対象とする
    const selectedDifficultiesToShow = getSelectedDifficulties();
    
    if (selectedDifficultiesToShow.length === 0) {
      alert('困りごとを選択してください。');
      return;
    }

    // 配慮依頼案のテキストを直接構築
    let accommodationText = '';
    selectedDifficultiesToShow.forEach((difficulty: any, index: number) => {
      const category = getCategoryFromTitle(difficulty.title, viewModel, reconstructedViewModel);
      const categoryIcon = getCategoryIcon(category || '');
      
      accommodationText += `${categoryIcon}${difficulty.title}\n`;
      accommodationText += `カテゴリ: ${category}\n`;
      
      const accommodations = getAccommodations(difficulty.title, viewModel, selectedDomain, reconstructedViewModel);
      const selectedAccommodations = getSelectedAccommodations(difficulty.id, accommodations);
      
      if (selectedAccommodations.length === 0) {
        accommodationText += `（配慮案が選択されていません）\n`;
      } else {
        selectedAccommodations.forEach((acc: any, accIndex: number) => {
          // 選択された配慮案の実際のインデックスを取得
          const selectedAccommodationIds = selectedItems.accommodations[difficulty.id] || [];
          const actualIndex = selectedAccommodationIds[accIndex];
          const accLabel = ['A', 'B', 'C', 'D'][parseInt(actualIndex)] || String(parseInt(actualIndex) + 1);
          accommodationText += `配慮案${accLabel}: ${acc['配慮案タイトル'] || acc.description}\n`;
        });
      }
      accommodationText += '\n';
    });

    // 合意形成のポイントのテキストを構築
    let pointsText = '';
    points.forEach((point, index) => {
      pointsText += `・${point}\n`;
    });

    // 具体的配慮案の詳細を追加
    let detailedAccommodations = '';
    selectedDifficultiesToShow.forEach((difficulty: any, index: number) => {
      const accommodations = getAccommodations(difficulty.title, viewModel, selectedDomain, reconstructedViewModel);
      const selectedAccommodations = getSelectedAccommodations(difficulty.id, accommodations);
      
      if (selectedAccommodations.length > 0) {
        detailedAccommodations += `\n【${difficulty.title}の具体的配慮案】\n`;
        selectedAccommodations.forEach((acc: any, accIndex: number) => {
          // 選択された配慮案の実際のインデックスを取得
          const selectedAccommodationIds = selectedItems.accommodations[difficulty.id] || [];
          const actualIndex = selectedAccommodationIds[accIndex];
          const accLabel = ['A', 'B', 'C', 'D'][parseInt(actualIndex)] || String(parseInt(actualIndex) + 1);
          detailedAccommodations += `配慮案${accLabel}: ${acc['配慮案タイトル'] || acc.description}\n`;
          if (acc['詳細説明']) {
            const details = acc['詳細説明'].split('\n').filter((line: string) => line.trim());
            details.forEach((detail: string) => {
              detailedAccommodations += `  • ${detail.trim()}\n`;
            });
          }
          detailedAccommodations += '\n';
        });
      }
    });

    // 日付の生成
    const today = new Date();
    const dateStr = today.getFullYear() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    const text = [
      '配慮案を確認しましょう。',
      'これは、支援を進めるための調整マニュアルです。',
      `${dateStr} InclusiBridge`,
      '',
      '【配慮依頼案】',
      accommodationText.trim(),
      '',
      '【合意形成のポイント】',
      pointsText.trim(),
      '',
      detailedAccommodations.trim()
    ].join('\n');

    // クリップボードにコピー
    if (navigator.clipboard && window.isSecureContext) {
      // モダンブラウザ（HTTPS環境）
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('メモをコピーしました');
        })
        .catch((err) => {
          console.error('コピーに失敗しました:', err);
          // フォールバック: 古い方法を試す
          fallbackCopyTextToClipboard(text);
        });
    } else {
      // 古いブラウザやHTTP環境
      fallbackCopyTextToClipboard(text);
    }
  };

  // モーダルを開く関数
  const openModal = (title: string, content: string) => {
    setModalContent({ title, content });
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setModalContent(null);
  };

  // フォールバック用のクリップボード機能
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('メモをコピーしました');
      } else {
        alert('コピーに失敗しました。手動でコピーしてください。');
      }
    } catch (err) {
      console.error('フォールバックコピーに失敗しました:', err);
      alert('コピーに失敗しました。手動でコピーしてください。');
    }
    
    document.body.removeChild(textArea);
  };

  const handleDownloadPDF = async () => {
    try {
      // 選択された困りごとのみを対象とする
      const selectedDifficultiesToShow = getSelectedDifficulties();
      
      if (selectedDifficultiesToShow.length === 0) {
        alert('困りごとを選択してください。');
        return;
      }
      
      // console.log('PDF生成開始...');
      // console.log('選択された困りごと:', selectedDifficultiesToShow);
      // console.log('画像データ:', base64Images);
      
      // PDFコンポーネントを動的インポート
      const pdfComponents = await loadPDFComponents();
      const { pdf, Document, Page, Text, View, StyleSheet, Font, Image } = pdfComponents;
      
      // フォント登録
      Font.register({
        family: 'NotoSansJP',
        src: '/fonts/NotoSansJP-Regular.ttf',
      });

      Font.register({
        family: 'IPAexGothic',
        src: '/fonts/ipaexg.ttf',
      });
      
      // PDFスタイル定義
const styles = StyleSheet.create({
  page: {
          padding: 30,
    fontFamily: 'NotoSansJP',
          backgroundColor: '#faf7f0',
  },
  title: {
          fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
          textAlign: 'center',
    color: '#374151',
    fontFamily: 'NotoSansJP',
          fontWeight: 'bold',
          textDecoration: 'underline',
        },
        mainTitle: {
          fontSize: 18,
    fontWeight: 'bold',
          marginBottom: 15,
          color: '#1f2937',
    fontFamily: 'NotoSansJP',
        },
        section: {
          marginBottom: 20,
        },
        sectionHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          backgroundColor: '#f3f4f6',
          padding: 10,
          borderRadius: 5,
        },
        sectionTitle: {
    fontSize: 14,
          fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'NotoSansJP',
          flex: 1,
  },
  icon: {
          width: 16,
          height: 16,
          marginRight: 8,
        },
        accommodationList: {
          marginLeft: 10,
  },
  accommodationItem: {
    flexDirection: 'column',
          marginBottom: 12,
        },
        accommodationLabel: {
          fontSize: 11,
    fontWeight: 'bold',
          color: '#6b7280',
    marginBottom: 4,
    fontFamily: 'NotoSansJP',
  },
        accommodationText: {
    fontSize: 12,
    color: '#374151',
          lineHeight: 1.4,
          fontFamily: 'NotoSansJP',
          marginBottom: 8,
        },
        exampleContainer: {
          marginTop: 8,
          paddingLeft: 16,
          borderLeft: 2,
          borderColor: '#e5e7eb',
        },
        exampleLabel: {
    fontSize: 10,
    color: '#6b7280',
          fontWeight: 'bold',
          marginBottom: 4,
          fontFamily: 'NotoSansJP',
        },
        exampleText: {
          fontSize: 11,
          color: '#4b5563',
          lineHeight: 1.3,
          fontFamily: 'NotoSansJP',
        },
        accommodationContent: {
          marginTop: 4,
          marginBottom: 8,
        },
        accommodationTitleText: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: 8,
          fontFamily: 'NotoSansJP',
        },
        accommodationDetailContainer: {
          marginTop: 8,
          marginLeft: 16,
          paddingLeft: 12,
          borderLeftWidth: 3,
          borderLeftColor: '#d1d5db',
    backgroundColor: '#f9fafb',
          padding: 8,
          borderRadius: 4,
        },
        accommodationDetailText: {
          fontSize: 10,
          color: '#4b5563',
          lineHeight: 1.6,
          fontFamily: 'NotoSansJP',
        },
        pointsSection: {
          marginTop: 20,
    marginBottom: 20,
  },
        pointsHeader: {
          backgroundColor: '#14b8a6',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        },
        pointsTitle: {
          fontSize: 16,
    fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          fontFamily: 'NotoSansJP',
        },
        pointsContainer: {
          backgroundColor: '#f0fdfa',
          borderWidth: 2,
          borderColor: '#14b8a6',
          borderRadius: 8,
          padding: 16,
  },
  pointItem: {
          marginBottom: 8,
        },
        pointText: {
          fontSize: 11,
          color: '#0f766e',
          lineHeight: 1.5,
          fontFamily: 'NotoSansJP',
        },
        header: {
          marginBottom: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
        },
        headerLeft: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#374151',
          fontFamily: 'NotoSansJP',
        },
        headerRight: {
    fontSize: 12,
          color: '#6b7280',
          fontFamily: 'NotoSansJP',
        },
        footer: {
          position: 'absolute',
          bottom: 20,
          left: 30,
          right: 30,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          backgroundColor: '#faf7f0',
        },
        footerLeft: {
          fontSize: 9,
          color: '#6b7280',
          fontFamily: 'NotoSansJP',
          flex: 1,
        },
        footerRight: {
          fontSize: 9,
          color: '#6b7280',
          fontFamily: 'NotoSansJP',
          fontWeight: 'bold',
        },
        accommodationSection: {
          marginTop: 20,
          padding: 16,
          backgroundColor: '#f0fdfa',
          borderWidth: 2,
          borderColor: '#14b8a6',
          borderRadius: 8,
        },
        accommodationTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: '#14b8a6',
          padding: 8,
          textAlign: 'center',
          marginBottom: 12,
    fontFamily: 'NotoSansJP',
  },
});

      const today = new Date();
      const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      // PDFドキュメント作成
      const pdfDoc = (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerLeft}>InclusiBridge Self Report</Text>
        <Text style={styles.headerRight}>{formattedDate}</Text>
      </View>
      <Text style={styles.title}>
        あなたの支援を一歩前に進めるための"調整マニュアル"です
      </Text>
            <View style={styles.accommodationSection}>
              <Text style={styles.accommodationTitle}>配慮依頼案</Text>
              {selectedDifficultiesToShow.map((item, idx) => (
                <View key={idx} style={styles.section}>
                <View style={styles.sectionHeader}>
                  {base64Images.star && (
                    <Image src={base64Images.star} style={styles.icon} />
                  )}
                  <Text style={styles.sectionTitle}>困りごと：{item.title}</Text>
            </View>
                <View style={styles.accommodationList}>
                  {(() => {
                    const accommodations = getAccommodations(item.title, viewModel, selectedDomain, reconstructedViewModel);
                    const selectedAccommodationIds = selectedItems.accommodations[item.id] || [];
                    const selectedAccommodations = accommodations.filter((_, index) => 
                      selectedAccommodationIds.includes(index.toString())
                    );
                    
                    if (selectedAccommodations.length === 0) {
                      return (
                        <View style={styles.accommodationItem}>
                          <Text style={styles.accommodationText}>（配慮案が選択されていません）</Text>
              </View>
                      );
                    }
                    
                    return selectedAccommodations.map((acc: any, accIdx: number) => {
                      // 選択された配慮案の実際のインデックスを取得
                      const actualIndex = accommodations.findIndex(originalAcc => 
                        originalAcc['配慮案タイトル'] === acc['配慮案タイトル'] && 
                        originalAcc['具体的な配慮'] === acc['具体的な配慮']
                      );
                      return (
                      <View key={accIdx} style={styles.accommodationItem}>
                        <Text style={styles.accommodationTitleText}>
                          配慮案：{acc['配慮案タイトル'] || acc.description}
                        </Text>
                        {acc['具体的な配慮'] && (
                          <View style={styles.accommodationDetailContainer}>
                            {acc['具体的な配慮'].split('\n').map((bullet: string, bulletIdx: number) => (
                              <Text key={bulletIdx} style={styles.accommodationDetailText}>
                                ・{bullet}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                      );
                    });
                  })()}
                </View>
          </View>
        ))}
      </View>
            <View style={styles.pointsSection}>
              <View style={styles.pointsHeader}>
                <Text style={styles.pointsTitle}>合意形成・調整のポイント</Text>
              </View>
              <View style={styles.pointsContainer}>
                {points.map((point, idx) => (
                  <View key={idx} style={styles.pointItem}>
                    <Text style={styles.pointText}>・{point}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerLeft}>
                This document is a self-managed support record generated by InclusiBridge.
              </Text>
              <Text style={styles.footerRight}>
                InclusiBridge © 2025
              </Text>
      </View>
    </Page>
  </Document>
);

      const blob = await pdf(pdfDoc).toBlob();
      // console.log('PDF Blob生成完了:', blob);
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // ファイル名をPDFタイプに応じて設定
      const downloadDate = new Date();
      const downloadFormattedDate = downloadDate.getFullYear() + '-' +
        String(downloadDate.getMonth() + 1).padStart(2, '0') + '-' +   
        String(downloadDate.getDate()).padStart(2, '0');
      
      const fileName = pdfType === 'personal' 
        ? `IB_SelfReport_${downloadFormattedDate}.pdf`
        : `InclusiBridge_${downloadFormattedDate}.pdf`;
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // console.log('PDFダウンロード完了');
    } catch (error) {
      console.error('PDFの生成に失敗しました:', error);
      const errorMessage = error instanceof Error ? error.message : '不明なエラー';
      const errorStack = error instanceof Error ? error.stack : 'スタックトレースなし';
      const errorName = error instanceof Error ? error.name : '不明';
      
      console.error('エラーの詳細:', {
        message: errorMessage,
        stack: errorStack,
        name: errorName
      });
      alert(`PDFの生成に失敗しました: ${errorMessage}`);
    }
  };

  // モーダルをレンダリング
  const renderModal = () => (
    <Modal
      isOpen={modalContent !== null}
      onClose={closeModal}
      title={modalContent?.title || ''}
      content={modalContent?.content || ''}
    />
  );

  // PDF作成モーダルをレンダリング
  const renderPDFModal = () => {
    if (!showPDFModal) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-24">
        <div className="bg-sand rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-auto">
          <div className="relative p-4 border-b">
            <div className="flex items-center justify-center relative">
              <h3 className="text-lg font-semibold text-gray-800">📄 PDFを生成する</h3>
              <button
                onClick={() => setShowPDFModal(false)}
                className="absolute right-0 text-white hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-600 transition"
              >
                ✕
              </button>
            </div>
            <div className="border-t border-gray-200 my-3"></div>
            <p className="text-sm text-gray-600 text-center">
              選択した困りごとと配慮案に基づき、用途に合わせたPDFを作成します。
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-4">
      <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">PDFの種類を選択してください</h4>
                <div className="space-y-3">
                  <label className="flex items-start cursor-pointer px-2 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="pdfType"
                      value="supervisor"
                      checked={pdfType === 'supervisor'}
                      onChange={(e) => setPdfType(e.target.value as 'supervisor' | 'personal')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-700">上司・人事に渡す提案書</div>
                      <div className="text-sm text-gray-500">要点を1枚に整理／依頼文テンプレ付</div>
                    </div>
                  </label>
                  <label className="flex items-start cursor-pointer px-2 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="pdfType"
                      value="personal"
                      checked={pdfType === 'personal'}
                      onChange={(e) => setPdfType(e.target.value as 'supervisor' | 'personal')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-700">個人の記録用レポート</div>
                      <div className="text-sm text-gray-500">選んだ困りごと・配慮案を一覧化</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 p-4 border-t border-gray-200">
            <button
              onClick={() => setShowPDFModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              取消
            </button>
            <button
              onClick={async () => {
                setShowPDFModal(false);
                await handleDownloadPDF();
              }}
              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            >
              生成する
            </button>
          </div>
        </div>
      </div>
    );
  };

  // プロンプト生成モーダルをレンダリング
  const renderPromptModal = () => {
    if (!showPromptModal) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-24">
        <div className="bg-sand rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto mx-auto">
          <div className="relative p-4 border-b">
            <div className="flex items-center justify-center relative">
              <h3 className="text-lg font-semibold text-gray-800">🤖 AIプロンプト生成</h3>
              <button
                onClick={() => setShowPromptModal(false)}
                className="absolute right-0 text-white hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-600 transition"
              >
                ✕
              </button>
            </div>
            <div className="border-t border-gray-200 my-3"></div>
            <p className="text-sm text-gray-600 text-center">
              選択した困りごとと配慮案に基づき、話す相手に合わせたプロンプトを生成します。生成したプロンプトをコピーしてChatGPT等のAIに入力すると、あなたの状況に合わせた配慮依頼が作成できます。
            </p>
          </div>
          <div className="p-4">
            {/* プロンプト生成タブの内容をここに配置 */}
            <div className="space-y-4">
      <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">伝えたい相手を選んでください</h4>
                <div className="space-y-3">
                  <label className="flex items-start cursor-pointer px-2 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="promptMode"
                      value="supervisor"
                      checked={promptMode === 'supervisor'}
                      onChange={(e) => setPromptMode(e.target.value as 'colleague' | 'supervisor')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-700">上司・人事（合理的配慮モード）</div>
                      <div className="text-sm text-gray-500">法的な配慮を前提にした相談（オープン想定）</div>
                    </div>
                  </label>
                  <label className="flex items-start cursor-pointer px-2 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="promptMode"
                      value="colleague"
                      checked={promptMode === 'colleague'}
                      onChange={(e) => setPromptMode(e.target.value as 'colleague' | 'supervisor')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-700">同僚（環境調整モード）</div>
                      <div className="text-sm text-gray-500">特性を伝えずに調整も可（クローズOK）</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">どのように伝えますか？</h4>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center space-x-2 cursor-pointer px-2 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="communicationMethod"
                      value="email"
                      checked={communicationMethod === 'email'}
                      onChange={(e) => setCommunicationMethod(e.target.value as 'email')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">メール</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer px-2 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="communicationMethod"
                      value="oral"
                      checked={communicationMethod === 'oral'}
                      onChange={(e) => setCommunicationMethod(e.target.value as 'oral')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">口頭</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer px-2 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="communicationMethod"
                      value="chat"
                      checked={communicationMethod === 'chat'}
                      onChange={(e) => setCommunicationMethod(e.target.value as 'chat')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">チャット</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  職場での立場や状況を補足してください（任意）
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(sanitizeInput(e.target.value))}
                  placeholder="例：新入社員で在宅勤務が多い／管理職としてチームをまとめている／上司が忙しく話しかけづらい　など"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal resize-none"
                  rows={3}
                />
              </div>

              <div className="flex">
                <button
                  onClick={generatePrompt}
                  className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                >
                  依頼文作成プロンプトを生成
                </button>
              </div>

              {/* AI出力に関する注意書き */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <span className="font-medium">⚠️ ご注意：</span>
                  AIが生成する内容は必ずしも正確ではありません。生成された依頼文は参考としてご活用いただき、実際の相談時は専門家や関係者と十分にご確認ください。
                </p>
              </div>

              {generatedPrompt && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      生成されたプロンプト
                    </label>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(generatedPrompt);
                          alert('クリップボードにコピーしました！');
                        } catch (err) {
                          alert('コピーに失敗しました。手動でコピーしてください。');
                        }
                      }}
                      className="px-4 py-2 text-sm bg-teal-500 text-white rounded-lg border border-teal-300 hover:bg-teal-600 transition"
                    >
                      クリップボードにコピー
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                      {generatedPrompt}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // モバイル用UI
  if (isMobile) {
  return (
      <div className="max-w-none mx-auto p-4 space-y-6">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes cardGlow {
              0%, 100% { 
                box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
                transform: scale(1);
              }
              50% { 
                box-shadow: 0 0 30px rgba(255, 193, 7, 0.6);
                transform: scale(1.02);
              }
            }
            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .line-clamp-3 {
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `
        }} />
        {renderModal()}
        {renderPDFModal()}
        {renderPromptModal()}
      
      {/* ヒーローヘッダー */}
      <div className="text-center py-8 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl border-2 border-yellow-200 shadow-lg">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-4">
          ✨ あなたが選んだ重要な困りごと ✨
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          選んだカードから実用的な配慮案を準備しました。必要な案を選び、AIに依頼文を作成してもらえるようプロンプトを作成しましょう。
        </p>
      </div>

        
        {/* 配慮案の確認 */}
        <div className="space-y-4">
          
          {selectedDifficulties.map((item, idx) => {
            const category = getCategoryFromTitle(item.title, viewModel || null, reconstructedViewModel);
            const categoryStyle = category ? CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES] : null;
            const isDifficultySelected = selectedItems.difficulties.includes(item.id);
                const accommodations = getAccommodations(item.title, viewModel || null, selectedDomain, reconstructedViewModel);
            
            return (
              <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* 困りごとの表示 */}
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryStyle ? categoryStyle.icon : '🎯'}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">カテゴリ: {category}</p>
                    </div>
                  </div>
                </div>
                
                {/* 配慮案の選択 - モバイル版は縦並びカード形式 */}
                {(
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">配慮案から1つを選択してください</h4>
                    <div className="space-y-4">
                         {(() => {
                           // 推薦結果を取得
                           const recommendations = getRecommendations(accommodations);
                           const topRecommendation = recommendations[0];
                           
                           return accommodations.map((acc: any, accIdx: number) => {
                             const accommodationId = String(accIdx);
                             const isAccommodationSelected = selectedItems.accommodations[item.id]?.includes(accommodationId) || false;
                             const supportTag = getSupportTags(acc.id);
                             const isRecommended = topRecommendation && topRecommendation.id === acc.id;
                             
                             return (
                               <div 
                                 key={accIdx} 
                                 className={`relative border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                                   isAccommodationSelected 
                                     ? 'border-teal-500 bg-teal-50 shadow-md' 
                                     : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                 }`}
                                 onClick={() => setAccommodationSelection(item.id, accommodationId)}
                               >
                                
                                <div className="flex flex-col">
                                  {/* ヘッダー部分 */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name={`mobile-accommodation-${item.id}`}
                                         id={`mobile-accommodation-${item.id}-${accIdx}`}
                                         checked={isAccommodationSelected}
                                         onChange={() => setAccommodationSelection(item.id, accommodationId)}
                                         className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                                         onClick={(e) => e.stopPropagation()}
                                       />
                                       {/* 配慮タイトル */}
                                       <h5 className="text-gray-800 font-medium text-base leading-tight">
                                         {acc['配慮案タイトル'] || acc.description}
                                       </h5>
                                     </div>
                                   </div>
                                 
                                 {/* 配慮内容 */}
                                 <div className="mb-3">
                                   {/* 配慮内容（短縮版） */}
                                   {acc.bullets && acc.bullets.length > 0 && (
                                     <p className="text-xs text-gray-600 line-clamp-2">
                                       {acc.bullets[0]}
                                     </p>
                                   )}
                                 </div>
                                 
                                 {/* バッジ（推薦結果から取得） */}
                                 {(() => {
                                   const recommendations = getRecommendations(accommodations);
                                   const currentRec = recommendations.find(rec => rec.id === acc.id);
                                   return currentRec && currentRec.badges && currentRec.badges.length > 0 ? (
                                     <div className="flex flex-wrap gap-1 mb-3">
                                       {currentRec.badges.map((badge, badgeIdx) => (
                                         <span key={badgeIdx} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                           {badge}
                                         </span>
                                       ))}
                                     </div>
                                   ) : null;
                                 })()}
                                 
                                 {/* 詳細を見るボタンとオススメバッジ */}
                                 <div className="flex items-center justify-between">
                                   <button
                                     onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       openModal(`${acc['配慮案タイトル'] || acc.description}の具体的な配慮案`, acc['詳細説明'] || '');
                                     }}
                                     className="text-teal-600 hover:text-teal-800 text-xs font-medium transition-colors flex items-center gap-1"
                                     title="具体的な配慮案を表示"
                                   >
                                     詳細を見る　＞
                                   </button>
                                   
                                   {/* オススメバッジ - 右下に配置 */}
                                   {isRecommended && (
                                     <div 
                                       className="text-yellow-600 text-sm font-bold cursor-pointer hover:text-yellow-700 transition-colors"
                                       title={topRecommendation?.reason || 'この配慮案がおすすめです'}
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         setShowRecommendationReason({ difficultyId: item.id, accommodationId });
                                       }}
                                     >
                                       ⭐オススメ
                                     </div>
                                   )}
                                 </div>
                                 
                                 {/* オススメ理由ポップアップ - モバイル版 */}
                                 {showRecommendationReason?.difficultyId === item.id && 
                                  showRecommendationReason?.accommodationId === accommodationId && (
                                   <div 
                                     className="absolute bottom-12 right-2 bg-white border-2 border-yellow-300 rounded-lg shadow-lg p-3 z-20 max-w-[80%] sm:hidden"
                                     onClick={(e) => e.stopPropagation()}
                                   >
                                     <div className="flex items-start justify-between gap-2">
                                       <p className="text-xs text-gray-700 leading-relaxed">
                                         {topRecommendation?.reason || 'この配慮案がおすすめです'}
                                       </p>
                                       <button
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           setShowRecommendationReason(null);
                                         }}
                                         className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                                       >
                                         ×
                                       </button>
                                     </div>
                                   </div>
                                 )}
                               </div>
                             </div>
                           );
                         });
                       })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>


        {/* スマホ版：最終ガイド（シリアスな締め） */}
        <div className="md:hidden bg-gradient-to-br from-gray-50 to-teal-50 rounded-2xl shadow-lg p-6 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            📖 合意形成・調整のポイント
        </h2>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="text-gray-800 font-medium">数より質を重視：</div>
                  <div className="text-gray-700">配慮は3件以内に絞るのが理想</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="text-gray-800 font-medium">配慮と負担のバランスを意識：</div>
                  <div className="text-gray-700">双方に無理のない形を探る</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="text-gray-800 font-medium">人事や支援担当を必ず通す：</div>
                  <div className="text-gray-700">共有してリスクを減らす</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="text-gray-800 font-medium">段階的な導入を検討：</div>
                  <div className="text-gray-700">一気にではなく、試行→拡張の流れで</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="text-gray-800 font-medium">定期的に見直す：</div>
                  <div className="text-gray-700">状況に応じて調整や更新を行う</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="text-gray-800 font-medium">その場で即決しない：</div>
                  <div className="text-gray-700">「持ち帰って検討します」と伝える</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* PC版：最終ガイド（シリアスな締め） */}
        <div className="hidden md:block bg-gradient-to-br from-gray-50 to-teal-50 rounded-2xl shadow-lg p-6 border-2 border-gray-200 mb-10">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            📖 合意形成・調整のポイント
          </h2>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <span className="text-gray-800 font-medium">数より質を重視：</span>
                  <span className="text-gray-700">配慮は3件以内に絞るのが理想</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <span className="text-gray-800 font-medium">配慮と負担のバランスを意識：</span>
                  <span className="text-gray-700">双方に無理のない形を探る</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <span className="text-gray-800 font-medium">人事や支援担当を必ず通す：</span>
                  <span className="text-gray-700">共有してリスクを減らす</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <span className="text-gray-800 font-medium">段階的な導入を検討：</span>
                  <span className="text-gray-700">一気にではなく、試行→拡張の流れで</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <span className="text-gray-800 font-medium">定期的に見直す：</span>
                  <span className="text-gray-700">状況に応じて調整や更新を行う</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <span className="text-gray-800 font-medium">その場で即決しない：</span>
                  <span className="text-gray-700">「持ち帰って検討します」と伝える</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => setShowPromptModal(true)}
            className="w-full px-4 py-3 rounded-lg border border-teal-300 bg-teal-500 text-white font-medium shadow hover:bg-teal-600 transition"
          >
            🤖 AIプロンプト生成
          </button>
          <button
            onClick={handleDownloadPDF}
            className="w-full px-4 py-3 rounded-lg border border-teal-300 bg-teal-500 text-white font-medium shadow hover:bg-teal-600 transition"
          >
            📄 PDFを生成する
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="w-full px-4 py-3 rounded-lg border border-teal-300 bg-teal-500 text-white font-medium shadow hover:bg-teal-600 transition"
          >
            📝 自分のメモに追加
          </button>
        </div>
        
        <div className="text-xs text-gray-400 mt-2 text-center">
          ※支援者に渡す前に、自分でもメモに残しておくと安心です
        </div>
        
        <StepFooter
          showBackButton={true}
          onBack={onBack}
          onNext={onRestart}
          nextButtonText="🎮 最初から"
          nextButtonDisabled={false}
          isMobile={true}
        />
      </div>
    );
  }

  // PC版UI
  return (
    <div className="max-w-6xl mx-auto py-10 min-h-screen pb-32">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes cardGlow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 0 30px rgba(255, 193, 7, 0.6);
              transform: scale(1.02);
            }
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />
      {renderModal()}
      {renderPDFModal()}
      {renderPromptModal()}
      
      {/* ヒーローヘッダー */}
      <div className="text-center py-8 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl border-2 border-yellow-200 shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ✨ あなたが選んだ重要な困りごと ✨
        </h1>
        <p className="text-gray-600 text-sm">
          選んだカードから実用的な配慮案を準備しました。必要な案を選び、AIに依頼文を作成してもらえるようプロンプトを作成しましょう。
        </p>
      </div>

      
      <div>
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <ul className="space-y-6">
            {selectedDifficulties.map((item, idx) => {
                const category = getCategoryFromTitle(item.title, viewModel || null, reconstructedViewModel);
                const categoryStyle = category ? CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES] : null;
                const isDifficultySelected = selectedItems.difficulties.includes(item.id);
                const accommodations = getAccommodations(item.title, viewModel || null, selectedDomain, reconstructedViewModel);
              
              return (
              <li key={idx} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  {/* 困りごとの表示 */}
                  <div className="mb-4">
                    {categoryStyle && (
                      <div 
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: categoryStyle.bgColor }}
                      >
                        <span className="text-lg">{categoryStyle.icon}</span>
                        <span className="text-gray-700 text-lg font-medium">{item.title}</span>
                </div>
                    )}
                    {categoryStyle && (
                      <div className="text-sm text-gray-500 mb-3 ml-2">
                        カテゴリ: {category}
                      </div>
                    )}
                  </div>
                  
                  {/* 配慮案の選択 - PC版は横並びカード形式 */}
                  {(
                    <div className="ml-8 border-l-2 border-gray-200 pl-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">配慮案から1つを選択してください</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {(() => {
                           // 推薦結果を取得
                           const recommendations = getRecommendations(accommodations);
                           const topRecommendation = recommendations[0];
                           
                           return accommodations.map((acc: any, accIdx: number) => {
                             const accommodationId = String(accIdx);
                             const isAccommodationSelected = selectedItems.accommodations[item.id]?.includes(accommodationId) || false;
                             const supportTag = getSupportTags(acc.id);
                             const isRecommended = topRecommendation && topRecommendation.id === acc.id;
                             
                             return (
                               <div 
                                 key={accIdx} 
                                 className={`relative border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                                   isAccommodationSelected 
                                     ? 'border-teal-500 bg-teal-50 shadow-md' 
                                     : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                 }`}
                                 onClick={() => setAccommodationSelection(item.id, accommodationId)}
                               >
                                
                                <div className="flex flex-col h-full">
                                  {/* ヘッダー部分 */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name={`accommodation-${item.id}`}
                                         id={`accommodation-${item.id}-${accIdx}`}
                                         checked={isAccommodationSelected}
                                         onChange={() => setAccommodationSelection(item.id, accommodationId)}
                                         className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                                         onClick={(e) => e.stopPropagation()}
                                       />
                                       {/* 配慮タイトル */}
                                       <h5 className="text-gray-800 font-medium text-base leading-tight">
                                         {acc['配慮案タイトル'] || acc.description}
                                       </h5>
                                     </div>
                                   </div>
                                 
                                 {/* 配慮内容 */}
                                 <div className="mb-3">
                                   {/* 配慮内容（短縮版） */}
                                   {acc.bullets && acc.bullets.length > 0 && (
                                     <p className="text-xs text-gray-600 line-clamp-2">
                                       {acc.bullets[0]}
                                     </p>
                                   )}
                                 </div>
                                 
                                 {/* バッジ（推薦結果から取得） */}
                                 {(() => {
                                   const recommendations = getRecommendations(accommodations);
                                   const currentRec = recommendations.find(rec => rec.id === acc.id);
                                   return currentRec && currentRec.badges && currentRec.badges.length > 0 ? (
                                     <div className="flex flex-wrap gap-1 mb-3">
                                       {currentRec.badges.map((badge, badgeIdx) => (
                                         <span key={badgeIdx} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                           {badge}
                      </span>
                                       ))}
                                     </div>
                                   ) : null;
                                 })()}
                                 
                                 {/* 詳細を見るボタンとオススメバッジ */}
                                 <div className="flex items-center justify-between">
                                   <button
                                     onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       openModal(`${acc['配慮案タイトル'] || acc.description}の具体的な配慮案`, acc['詳細説明'] || '');
                                     }}
                                     className="text-teal-600 hover:text-teal-800 text-xs font-medium transition-colors flex items-center gap-1"
                                     title="具体的な配慮案を表示"
                                   >
                                     詳細を見る　＞
                                   </button>
                                   
                                   {/* オススメバッジ - 右下に配置 */}
                                   {isRecommended && (
                                     <div 
                                       className="text-yellow-600 text-sm font-bold cursor-pointer hover:text-yellow-700 transition-colors"
                                       title={topRecommendation?.reason || 'この配慮案がおすすめです'}
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         setShowRecommendationReason({ difficultyId: item.id, accommodationId });
                                       }}
                                     >
                                       ⭐オススメ
                                     </div>
                                   )}
                                 </div>
                                 
                                 {/* オススメ理由ポップアップ - PC版 */}
                                 {showRecommendationReason?.difficultyId === item.id && 
                                  showRecommendationReason?.accommodationId === accommodationId && (
                                   <div 
                                     className="absolute bottom-12 right-2 bg-white border-2 border-yellow-300 rounded-lg shadow-lg p-3 z-20 max-w-xs hidden sm:block"
                                     onClick={(e) => e.stopPropagation()}
                                   >
                                     <div className="flex items-start justify-between gap-2">
                                       <p className="text-xs text-gray-700 leading-relaxed">
                                         {topRecommendation?.reason || 'この配慮案がおすすめです'}
                                       </p>
                                       <button
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           setShowRecommendationReason(null);
                                         }}
                                         className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                                       >
                                         ×
                                       </button>
                                     </div>
                                   </div>
                                 )}
                               </div>
                             </div>
                           );
                         });
                       })()}
                      </div>
                    </div>
                  )}
              </li>
              );
            })}
          </ul>

        </div>
        
        {/* 合意形成・調整のポイント */}
        <div className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-2xl shadow-lg p-6 border-2 border-gray-200 mb-10">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            📖 合意形成・調整のポイント
          </h2>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="md:hidden">
                    <div className="text-gray-800 font-medium">数より質を重視：</div>
                    <div className="text-gray-700">配慮は3件以内に絞るのが理想</div>
      </div>
                  <span className="hidden md:inline">
                    <span className="text-gray-800 font-medium">数より質を重視：</span>
                    <span className="text-gray-700">配慮は3件以内に絞るのが理想</span>
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="md:hidden">
                    <div className="text-gray-800 font-medium">配慮と負担のバランスを意識：</div>
                    <div className="text-gray-700">双方に無理のない形を探る</div>
                  </div>
                  <span className="hidden md:inline">
                    <span className="text-gray-800 font-medium">配慮と負担のバランスを意識：</span>
                    <span className="text-gray-700">双方に無理のない形を探る</span>
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="md:hidden">
                    <div className="text-gray-800 font-medium">人事や支援担当を必ず通す：</div>
                    <div className="text-gray-700">共有してリスクを減らす</div>
                  </div>
                  <span className="hidden md:inline">
                    <span className="text-gray-800 font-medium">人事や支援担当を必ず通す：</span>
                    <span className="text-gray-700">共有してリスクを減らす</span>
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="md:hidden">
                    <div className="text-gray-800 font-medium">段階的な導入を検討：</div>
                    <div className="text-gray-700">一気にではなく、試行→拡張の流れで</div>
                  </div>
                  <span className="hidden md:inline">
                    <span className="text-gray-800 font-medium">段階的な導入を検討：</span>
                    <span className="text-gray-700">一気にではなく、試行→拡張の流れで</span>
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="md:hidden">
                    <div className="text-gray-800 font-medium">定期的に見直す：</div>
                    <div className="text-gray-700">状況に応じて調整や更新を行う</div>
                  </div>
                  <span className="hidden md:inline">
                    <span className="text-gray-800 font-medium">定期的に見直す：</span>
                    <span className="text-gray-700">状況に応じて調整や更新を行う</span>
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-1 font-bold">•</span>
                <div>
                  <div className="md:hidden">
                    <div className="text-gray-800 font-medium">その場で即決しない：</div>
                    <div className="text-gray-700">「持ち帰って検討します」と伝える</div>
                  </div>
                  <span className="hidden md:inline">
                    <span className="text-gray-800 font-medium">その場で即決しない：</span>
                    <span className="text-gray-700">「持ち帰って検討します」と伝える</span>
                  </span>
                </div>
              </li>
          </ul>
        </div>
      </div>
        
      </div>
      <div className="mt-10 flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={() => setShowPromptModal(true)}
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-teal-300 bg-teal-500 text-white font-medium shadow hover:bg-teal-600 transition"
        >
          🤖 AIプロンプト生成
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-teal-300 bg-teal-500 text-white font-medium shadow hover:bg-teal-600 transition"
        >
          📄 PDFを生成する
        </button>
        <button
          onClick={handleCopyToClipboard}
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-teal-300 bg-teal-500 text-white font-medium shadow hover:bg-teal-600 transition"
        >
          📝 自分のメモに追加
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-2 flex justify-end">
        ※支援者に渡す前に、自分でもメモに残しておくと安心です
      </div>
      <div className="mt-8 mb-4">
        <StepFooter
          showBackButton={true}
          onBack={onBack}
          onNext={onRestart}
          nextButtonText="🎮 最初から"
          nextButtonDisabled={false}
          isMobile={false}
        />
      </div>
    </div>
  );
};

// モーダルコンポーネント
const Modal = ({ isOpen, onClose, title, content }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  content: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
            ✕
        </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {content.includes('\n') ? (
            <ul className="text-gray-700 leading-relaxed space-y-2">
              {content.split('\n').filter(line => line.trim()).map((line, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-teal mr-2 mt-1">•</span>
                  <span>{line.trim()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationDisplay; 