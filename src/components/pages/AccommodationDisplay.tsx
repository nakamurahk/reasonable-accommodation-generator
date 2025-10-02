import React, { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { ReasonableAccommodation } from '../../types';
// import reasonableAccommodations from '../../data/user/ReasonableAccommodation.json';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { getBase64Image } from '../../utils/imageUtils';
import { Domain } from '../../types';
import { useIsMobile } from '../../hooks/useIsMobile';
// @ts-ignore
import { loadStore, buildViewModel, getAccommodationsFromViewModel, getDomainFromName, buildFilteredViewModel } from '../../data/newDataLoader';
import { ViewModel } from '../../types/newDataStructure';
import { Domain as NewDomain } from '../../types/newDataStructure';
import StepFooter from '../layout/StepFooter';

// フォント登録
Font.register({
  family: 'NotoSansJP',
  src: '/fonts/NotoSansJP-Regular.ttf',
  fontStyle: 'normal',
  fontWeight: 'normal',
});

Font.register({
  family: 'IPAexGothic',
  src: '/fonts/ipaexg.ttf',
  fontStyle: 'normal',
  fontWeight: 'normal',
});

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
  '配慮は"数"より"質"。伝える数は3件以内にしぼるのがおすすめです',
  '配慮案を支援者の担当や体制も意識して整理しましょう',
  '配慮を伝えるときは、上司だけでなく人事や支援担当にも共有しましょう（異動時のリスク低減）',
  'その場で決めず「一度持ち帰って検討いただく」とも伝えると安心です',
];

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
  // console.log('getAccommodations - found accommodations:', accommodations);
  return accommodations;
};


// PDFのスタイル定義
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'NotoSansJP',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1a1a1a',
    fontFamily: 'NotoSansJP',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  mainTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 6,
  },
  accommodationList: {
    marginLeft: 28,
    width: '100%',
  },
  accommodationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  accommodationLabel: {
    width: 80,
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: 'bold',
    marginRight: 8,
  },
  accommodationText: {
    flex: 1,
    fontSize: 12,
    color: '#4b5563',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    padding: 24,
    marginBottom: 20,
  },
  difficultyItem: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'column',
  },
  difficultyTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#1f2937',
    fontFamily: 'NotoSansJP',
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    marginRight: 4,
  },
  accIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  accLabel: {
    fontWeight: 'bold',
    color: '#374151',
    marginRight: 2,
  },
  accType: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
  },
  pointCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    padding: 20,
    marginBottom: 20,
  },
  pointTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 6,
  },
  pointItem: {
    fontSize: 10,
    marginBottom: 4,
    color: '#4b5563',
    fontFamily: 'NotoSansJP',
  },
  pointText: {
    fontSize: 11,
    color: '#4b5563',
    fontFamily: 'NotoSansJP',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 8,
    color: '#6b7280',
    fontFamily: 'NotoSansJP',
  },
});

// PDFドキュメントコンポーネント
const AccommodationPDFDocument = ({ difficulties, base64Images, viewModel, selectedDomain, selectedItems, reconstructedViewModel }: { 
  difficulties: Difficulty[], 
  base64Images: { [key: string]: string },
  viewModel: ViewModel | null | undefined,
  selectedDomain: Domain | null,
  selectedItems: { difficulties: string[], accommodations: { [difficultyId: string]: string[] } },
  reconstructedViewModel?: ViewModel | null
}) => {
  const today = new Date();
  const dateStr = today.getFullYear() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');

  return (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        このページは、あなたの支援を一歩前に進めるための"調整マニュアル"です
      </Text>
        <Text style={styles.mainTitle}>配慮依頼案</Text>
        {difficulties.map((item, idx) => (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              {base64Images.star && (
                <Image src={base64Images.star} style={styles.icon} />
              )}
              {base64Images.note && (
                <Image src={base64Images.note} style={styles.icon} />
              )}
              <Text style={styles.sectionTitle}>{item.title}</Text>
            </View>
            <View style={styles.accommodationList}>
              {(() => {
                const accommodations = getAccommodations(item.title, viewModel || null, selectedDomain, reconstructedViewModel);
                const selectedAccommodationIds = selectedItems.accommodations[item.id] || [];
                const selectedAccommodations = accommodations.filter((_, index) => 
                  selectedAccommodationIds.includes(String(index))
                );
                
                if (selectedAccommodations.length === 0) {
                  return (
                    <View style={styles.accommodationItem}>
                      <Text style={styles.accommodationText}>（配慮案が選択されていません）</Text>
              </View>
                  );
                }
                
                return selectedAccommodations.map((acc: any, accIdx: number) => (
                  <View key={accIdx} style={styles.accommodationItem}>
                    {base64Images[`acc${accIdx}`] && (
                      <Image src={base64Images[`acc${accIdx}`]} style={styles.icon} />
                    )}
                    <Text style={styles.accommodationLabel}>
                      配慮案{PDF_ACC_LABELS[accIdx % PDF_ACC_LABELS.length]}:
                    </Text>
                    <Text style={styles.accommodationText}>{acc['配慮案タイトル'] || acc.description}</Text>
                  </View>
                ));
              })()}
            </View>
          </View>
        ))}
        <View style={styles.section}>
          <Text style={styles.mainTitle}>合意形成のポイント</Text>
          <View style={styles.accommodationList}>
            {points.map((point, idx) => (
              <View key={idx} style={styles.accommodationItem}>
                <Text style={styles.pointText}>・{point}</Text>
      </View>
        ))}
      </View>
        </View>
        <Text style={styles.footer}>
          {dateStr} FitBridge
        </Text>
    </Page>
  </Document>
);
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
          
          console.log('viewModel再構築中:', query);
          const vm = await buildFilteredViewModel(query);
          setReconstructedViewModel(vm);
          console.log('viewModel再構築完了:', vm);
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
        console.log('保存された選択状態を復元:', parsed);
        return parsed;
      } catch (error) {
        console.error('選択状態の復元に失敗:', error);
      }
    }
    console.log('デフォルト選択状態を初期化');
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
  const [activeTab, setActiveTab] = useState<'accommodations' | 'prompt'>('accommodations');
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  
  // ファイル名の生成（YYYYMMDD形式）
  const today = new Date();
  const dateStr = today.getFullYear() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');

  const [base64Images, setBase64Images] = useState<{ [key: string]: string }>({});
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);
  
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
    console.log(`配慮案選択状態 - 困りごとID: ${difficultyId}, 選択されたインデックス: ${selectedAccommodationIds}`);
    
    const selectedAccommodations = accommodations.filter((_, index) => 
      selectedAccommodationIds.includes(String(index))
    );
    
    console.log(`選択された配慮案:`, selectedAccommodations);
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
                        communicationMethod === 'chat' ? 'チャット' : '資料';
      
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
                        communicationMethod === 'chat' ? 'チャット' : '資料';
      
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
    if (selectedDifficulties.length > 0 && selectedItems.difficulties.length === 0) {
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
        }
      });
      
      const newSelectedItems = {
        difficulties: selectedDifficulties.map(d => d.id),
        accommodations: initialAccommodations
      };
      
      setSelectedItems(newSelectedItems);
      
      // デフォルト選択状態をlocalStorageに保存
      localStorage.setItem('accommodation_selections', JSON.stringify(newSelectedItems));
    }
  }, [selectedDifficulties, selectedItems.difficulties.length, viewModel, selectedDomain, reconstructedViewModel]);


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
      `${dateStr} FitBridge`,
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
      
      const pdfDoc = (
        <AccommodationPDFDocument
          difficulties={selectedDifficultiesToShow}
          base64Images={base64Images}
          viewModel={viewModel}
          selectedDomain={selectedDomain}
          selectedItems={selectedItems}
          reconstructedViewModel={reconstructedViewModel}
        />
      );
      
      // console.log('PDFドキュメント作成完了');
      
      const blob = await pdf(pdfDoc).toBlob();
      // console.log('PDF Blob生成完了:', blob);
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FitBridge_${dateStr}.pdf`;
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

  // プロンプト生成モーダルをレンダリング
  const renderPromptModal = () => {
    if (!showPromptModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-sand rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-auto">
          <div className="relative p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800 text-center">🤖 AIプロンプト生成</h3>
            <div className="border-t border-gray-200 my-3"></div>
            <p className="text-sm text-gray-600 text-center">
              選択した困りごとと配慮案に基づき、話す相手に合わせたプロンプトを生成します。これをChatGPT等のAIに入力すると、あなたの状況に合わせた配慮依頼文が作成できます。
            </p>
            <button
              onClick={() => setShowPromptModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="p-4">
            {/* プロンプト生成タブの内容をここに配置 */}
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">モードを選択してください</h4>
                <div className="space-y-3">
                  <label className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="promptMode"
                      value="supervisor"
                      checked={promptMode === 'supervisor'}
                      onChange={(e) => setPromptMode(e.target.value as 'colleague' | 'supervisor')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-700">合理的配慮モード</div>
                      <div className="text-sm text-gray-500">上長・人事に法的根拠に基づく依頼</div>
                    </div>
                  </label>
                  <label className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="promptMode"
                      value="colleague"
                      checked={promptMode === 'colleague'}
                      onChange={(e) => setPromptMode(e.target.value as 'colleague' | 'supervisor')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-700">環境調整モード</div>
                      <div className="text-sm text-gray-500">同僚に協力的な依頼</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">伝達手段を選択してください</h4>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="communicationMethod"
                      value="email"
                      checked={communicationMethod === 'email'}
                      onChange={(e) => setCommunicationMethod(e.target.value as 'email')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                    />
                    <div>
                      <div className="font-medium text-gray-900">メール</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="communicationMethod"
                      value="oral"
                      checked={communicationMethod === 'oral'}
                      onChange={(e) => setCommunicationMethod(e.target.value as 'oral')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                    />
                    <div>
                      <div className="font-medium text-gray-900">口頭</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="communicationMethod"
                      value="chat"
                      checked={communicationMethod === 'chat'}
                      onChange={(e) => setCommunicationMethod(e.target.value as 'chat')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                    />
                    <div>
                      <div className="font-medium text-gray-900">チャット</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <input
                      type="radio"
                      name="communicationMethod"
                      value="document"
                      checked={communicationMethod === 'document'}
                      onChange={(e) => setCommunicationMethod(e.target.value as 'document')}
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                    />
                    <div>
                      <div className="font-medium text-gray-900">資料</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  追加の情報や要望があれば記入してください（任意）
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="例：特に伝えたいこと、状況の詳細など"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generatePrompt}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                >
                  プロンプトを生成
                </button>
                <button
                  onClick={() => setShowPromptModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  キャンセル
                </button>
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
          `
        }} />
        {renderModal()}
        {renderPromptModal()}
      
      {/* ヒーローヘッダー */}
      <div className="text-center py-8 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl border-2 border-yellow-200 shadow-lg">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-4">
          ✨ あなたが選んだ重要な困りごと ✨
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          選んだカードから実用的な配慮案を準備しました。必要な案を選び、AIに依頼文を作成してもらえるようプロンプトを作成しましょう。
        </p>
      </div>

        
        {/* 配慮案の確認 */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
              📋 配慮案の確認
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">必要な困りごとにチェックを入れ、各困りごとから1つの配慮案を選択してください</p>
          
          {selectedDifficulties.map((item, idx) => {
            const category = getCategoryFromTitle(item.title, viewModel || null, reconstructedViewModel);
            const categoryStyle = category ? CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES] : null;
            const isDifficultySelected = selectedItems.difficulties.includes(item.id);
                const accommodations = getAccommodations(item.title, viewModel || null, selectedDomain, reconstructedViewModel);
            
            return (
              <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* 困りごとの選択チェックボックス */}
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`mobile-difficulty-${item.id}`}
                      checked={isDifficultySelected}
                      onChange={() => toggleDifficultySelection(item.id)}
                      className="w-5 h-5 text-teal border-gray-300 rounded focus:ring-teal"
                    />
                    <label htmlFor={`mobile-difficulty-${item.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{categoryStyle ? categoryStyle.icon : '🎯'}</span>
      <div>
                          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-600">カテゴリ: {category}</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* 配慮案の選択（困りごとが選択されている場合のみ表示） */}
                {isDifficultySelected && (
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">配慮案から1つを選択してください</h4>
                    <div className="space-y-3">
                      {accommodations.map((acc: any, accIdx: number) => {
                        const accommodationId = String(accIdx);
                        const isAccommodationSelected = selectedItems.accommodations[item.id]?.includes(accommodationId) || false;
                        
                        return (
                          <div key={accIdx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name={`mobile-accommodation-${item.id}`}
                                id={`mobile-accommodation-${item.id}-${accIdx}`}
                                checked={isAccommodationSelected}
                                onChange={() => setAccommodationSelection(item.id, accommodationId)}
                                className="w-4 h-4 text-teal border-gray-300 focus:ring-teal mt-1"
                              />
                              <label htmlFor={`mobile-accommodation-${item.id}-${accIdx}`} className="flex-1 cursor-pointer">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="bg-sand text-teal-700 px-2 py-1 rounded text-xs font-medium">
                                        配慮案{ACC_LABELS[accIdx % ACC_LABELS.length]}
                                      </span>
                                      <span className="text-gray-800 font-medium">
                                        {acc['配慮案タイトル'] || acc.description}
                                      </span>
                                    </div>
                                    {acc.bullets && acc.bullets.length > 0 && (
                                      <ul className="ml-4 space-y-1">
                                        {acc.bullets.map((bullet: string, bulletIdx: number) => (
                                          <li key={bulletIdx} className="text-sm text-gray-600 list-disc">
                                            {bullet}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      openModal(`${acc['配慮案タイトル'] || acc.description}の具体的な配慮案`, acc['詳細説明'] || '');
                                    }}
                                    className="ml-3 text-teal hover:text-teal-800 text-lg transition-colors flex-shrink-0"
                                    title="具体的な配慮案を表示"
                                  >
                                    ▶
                                  </button>
                                </div>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>


        {/* 最終ガイド（シリアスな締め） */}
        <div className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-2xl shadow-lg p-6 border-2 border-gray-200">
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
                  <span className="text-gray-700">「持ち帰って検討します」と伝える安心ワード</span>
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
    <div className="max-w-6xl mx-auto py-10">
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
        `
      }} />
      {renderModal()}
      {renderPromptModal()}
      
      {/* ヒーローヘッダー */}
      <div className="text-center py-8 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl border-2 border-yellow-200 shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ✨ あなたが選んだ重要な困りごと ✨
        </h1>
        <p className="text-gray-600 text-lg">
          選んだカードから実用的な配慮案を準備しました。必要な案を選び、AIに依頼文を作成してもらえるようプロンプトを作成しましょう。
        </p>
      </div>

      
      <div>
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            📋 配慮案の確認
          </h2>
          <p className="text-sm text-gray-600 mb-6">必要な困りごとにチェックを入れ、各困りごとから1つの配慮案を選択してください</p>
          <ul className="space-y-6">
            {selectedDifficulties.map((item, idx) => {
                const category = getCategoryFromTitle(item.title, viewModel || null, reconstructedViewModel);
                const categoryStyle = category ? CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES] : null;
                const isDifficultySelected = selectedItems.difficulties.includes(item.id);
                const accommodations = getAccommodations(item.title, viewModel || null, selectedDomain, reconstructedViewModel);
              
              return (
              <li key={idx} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  {/* 困りごとの選択チェックボックス */}
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id={`difficulty-${item.id}`}
                      checked={isDifficultySelected}
                      onChange={() => toggleDifficultySelection(item.id)}
                      className="w-5 h-5 text-teal border-gray-300 rounded focus:ring-teal"
                    />
                    <label htmlFor={`difficulty-${item.id}`} className="flex-1 cursor-pointer">
                      {categoryStyle && (
                        <div 
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium"
                          style={{ backgroundColor: categoryStyle.bgColor }}
                        >
                          <span className="text-lg">{categoryStyle.icon}</span>
                          <span className="text-gray-700 text-lg font-medium">{item.title}</span>
                </div>
                      )}
                    </label>
                  </div>
                  {categoryStyle && (
                    <div className="text-sm text-gray-500 mb-3 ml-8">
                      カテゴリ: {category}
                    </div>
                  )}
                  
                  {/* 配慮案の選択（困りごとが選択されている場合のみ表示） */}
                  {isDifficultySelected && (
                    <div className="ml-8 border-l-2 border-gray-200 pl-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">配慮案から1つを選択してください</h4>
                      <ul className="space-y-3">
                        {accommodations.map((acc: any, accIdx: number) => {
                          const accommodationId = String(accIdx);
                          const isAccommodationSelected = selectedItems.accommodations[item.id]?.includes(accommodationId) || false;
                          
                          return (
                            <li key={accIdx} className="relative">
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name={`accommodation-${item.id}`}
                                  id={`accommodation-${item.id}-${accIdx}`}
                                  checked={isAccommodationSelected}
                                  onChange={() => setAccommodationSelection(item.id, accommodationId)}
                                  className="w-4 h-4 text-teal border-gray-300 focus:ring-teal mt-1"
                                />
                                <label htmlFor={`accommodation-${item.id}-${accIdx}`} className="flex-1 cursor-pointer">
                                  <div className="flex items-center">
                                    <span className="text-gray-700 font-medium flex-shrink-0 whitespace-nowrap mr-2">
                                      配慮案{ACC_LABELS[accIdx % ACC_LABELS.length]}:
                      </span>
                                    <span className="text-gray-700">{acc['配慮案タイトル'] || acc.description}</span>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openModal(`${acc['配慮案タイトル'] || acc.description}の具体的な配慮案`, acc['詳細説明'] || '');
                                      }}
                                      className="ml-3 text-teal hover:text-teal-800 text-lg transition-colors flex-shrink-0"
                                      title="具体的な配慮案を表示"
                                    >
                                      ▶
                                    </button>
                                  </div>
                                  {/* 新しいデータ構造のbulletsを箇条書きで表示 */}
                                  {acc.bullets && acc.bullets.length > 0 && (
                                    <ul className="mt-2 ml-4 space-y-1">
                                      {acc.bullets.map((bullet: string, bulletIdx: number) => (
                                        <li key={bulletIdx} className="text-sm text-gray-600 list-disc">
                                          {bullet}
                    </li>
                  ))}
                </ul>
                                  )}
                                </label>
                              </div>
              </li>
                          );
                        })}
          </ul>
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
                  <span className="text-gray-700">「持ち帰って検討します」と伝える安心ワード</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
      </div>
      <div className="mt-10 flex flex-wrap gap-4 mb-4 justify-center">
        <button
          onClick={handleDownloadPDF}
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-teal-300 bg-teal-500 text-white font-medium shadow hover:bg-teal-600 transition text-center cursor-pointer"
        >
          PDFをダウンロード
        </button>
        <button
          onClick={() => setShowPromptModal(true)}
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-teal-300 bg-teal-500 text-white font-medium shadow hover:bg-teal-600 transition"
        >
          🤖 AIプロンプト生成
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
      <StepFooter
        showBackButton={true}
        onBack={onBack}
        onNext={onRestart}
        nextButtonText="🎮 最初から"
        nextButtonDisabled={false}
        isMobile={false}
      />
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