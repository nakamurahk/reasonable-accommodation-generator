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
import { loadStore, buildViewModel, getAccommodationsFromViewModel, getDomainFromName, ViewModel } from '../../data/newDataLoader';
import { Domain as NewDomain } from '../../types/newDataStructure';

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
const getCategoryFromTitle = (title: string, viewModel: ViewModel | null | undefined) => {
  if (!viewModel) return null;
  
  const item = viewModel.find((vm: any) => vm.concern.title === title);
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
const getAccommodations = (difficultyTitle: string, viewModel: ViewModel | null | undefined, selectedDomain: Domain | null) => {
  // console.log('getAccommodations called with:', { difficultyTitle, viewModel, selectedDomain });
  if (!viewModel || !selectedDomain) {
    // console.log('getAccommodations - returning empty array due to missing data');
    return []; // データが読み込まれていない場合は空配列を返す
  }
  
  const domain = getDomainFromName(selectedDomain.name);
  const accommodations = getAccommodationsFromViewModel(viewModel, difficultyTitle, domain);
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
const AccommodationPDFDocument = ({ difficulties, base64Images, viewModel, selectedDomain }: { 
  difficulties: Difficulty[], 
  base64Images: { [key: string]: string },
  viewModel: ViewModel | null,
  selectedDomain: Domain | null
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
              {getAccommodations(item.title, viewModel, selectedDomain).map((acc: any, accIdx: number) => (
                <View key={accIdx} style={styles.accommodationItem}>
                  {base64Images[`acc${accIdx}`] && (
                    <Image src={base64Images[`acc${accIdx}`]} style={styles.icon} />
                  )}
                  <Text style={styles.accommodationLabel}>
                    配慮案{PDF_ACC_LABELS[accIdx % PDF_ACC_LABELS.length]}:
                  </Text>
                  <Text style={styles.accommodationText}>{acc['配慮案タイトル'] || acc.description}</Text>
                </View>
              ))}
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
          {dateStr} 合理的配慮ジェネレータ
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
  viewModel
}) => {
  // console.log('AccommodationDisplay - viewModel:', viewModel);
  // console.log('AccommodationDisplay - selectedDifficulties:', selectedDifficulties);
  // console.log('AccommodationDisplay - selectedDomain:', selectedDomain);
  const isMobile = useIsMobile();
  
  // ファイル名の生成（YYYYMMDD形式）
  const today = new Date();
  const dateStr = today.getFullYear() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');

  const [base64Images, setBase64Images] = useState<{ [key: string]: string }>({});
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

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


  const handleCopyToClipboard = () => {
    // モバイル版とPC版で異なるセレクターを使用
    let title, accommodationSection, pointsSection;
    
    // console.log('handleCopyToClipboard - isMobile:', isMobile);
    
    if (isMobile) {
      // モバイル版のセレクター
      title = document.querySelector('h3');
      accommodationSection = document.querySelector('.bg-white.rounded-xl.shadow.p-4.mb-6');
      pointsSection = document.querySelector('.bg-white.rounded-xl.shadow.p-4:last-of-type');
    } else {
      // PC版のセレクター
      title = document.querySelector('h3');
      accommodationSection = document.querySelector('.bg-white.rounded-xl.shadow.p-6.mb-10');
      pointsSection = document.querySelector('.bg-white.rounded-xl.shadow.p-6:last-of-type');
    }
    
    // console.log('Elements found:', { title, accommodationSection, pointsSection });

    if (title && accommodationSection && pointsSection) {
      // 配慮依頼案のテキストを整形
      const accText = accommodationSection.textContent?.trim() || '';
      // console.log('Original accText:', accText);
      const formattedAcc = accText
        .replace(/配慮依頼案/g, '') // 配慮依頼案の重複を削除
        .replace(/(⭐📝)/g, '\n\n$1')
        .replace(/(🟦|🟧|🟨)/g, '\n\n$1')
        .replace(/配慮案([A-D]):/g, '\n配慮案$1:')
        .replace(/具体的な配慮案/g, '\n\n具体的な配慮案\n')
        .replace(/困りごと:/g, '\n困りごと:')
        .replace(/カテゴリ:/g, '\nカテゴリ:')
        .replace(/(🔄[^カテゴリ]+)/g, '\n$1')
        .replace(/(💡[^カテゴリ]+)/g, '\n$1')
        .replace(/^\n+/, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      
      // console.log('Formatted accText:', formattedAcc);

      // 具体的配慮案の詳細を追加
      let detailedAccommodations = '';
      if (viewModel && selectedDifficulties && selectedDomain) {
        selectedDifficulties.forEach((difficulty: any, index: number) => {
          const accommodations = getAccommodations(difficulty.title, viewModel, selectedDomain.id as any);
          if (accommodations.length > 0) {
            detailedAccommodations += `\n【${difficulty.title}の具体的配慮案】\n`;
            accommodations.forEach((acc: any, accIndex: number) => {
              const accLabel = ['A', 'B', 'C', 'D'][accIndex] || String(accIndex + 1);
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
      }

      // 合意形成のポイントのテキストを整形
      const pointsText = pointsSection.textContent?.trim() || '';
      const formattedPoints = pointsText
        .replace(/合意形成のポイント/g, '') // 合意形成のポイントの重複を削除
        .replace(/・/g, '\n・')
        .replace(/^\n+/, '')
        .trim();

      // 日付の生成
      const today = new Date();
      const dateStr = today.getFullYear() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0');

      const text = [
        '配慮案を確認しましょう。',
        'これは、支援を進めるための調整マニュアルです。',
        `${dateStr} 合理的配慮ジェネレータ`,
        '',
        '【配慮依頼案】',
        formattedAcc,
        '',
        '【合意形成のポイント】',
        formattedPoints,
        '',
        detailedAccommodations
      ].join('\n');

      // モバイル版ではフォールバック機能も追加
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
    } else {
      console.error('要素が見つかりません:', { title, accommodationSection, pointsSection });
      alert('コピーに失敗しました。ページを再読み込みしてください。');
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
      // console.log('PDF生成開始...');
      // console.log('選択された困りごと:', selectedDifficulties);
      // console.log('画像データ:', base64Images);
      
      const pdfDoc = (
        <AccommodationPDFDocument
          difficulties={selectedDifficulties}
          base64Images={base64Images}
          viewModel={viewModel}
          selectedDomain={selectedDomain}
        />
      );
      
      // console.log('PDFドキュメント作成完了');
      
      const blob = await pdf(pdfDoc).toBlob();
      // console.log('PDF Blob生成完了:', blob);
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `合理的配慮ジェネレータ_${dateStr}.pdf`;
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

  // モバイル用UI
  if (isMobile) {
    return (
      <div className="max-w-none mx-auto p-4 space-y-6">
        {renderModal()}
        {/* 説明文 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 text-base leading-relaxed">
          <strong>配慮案を確認しましょう。</strong><br />
これは、支援を進めるための調整マニュアルです。<span className="text-indigo-600">▶</span>で詳細を確認できます。
        </p>
        </div>
        
        <div className="space-y-4">
          
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">配慮依頼案</h3>
            <ul className="space-y-6">
              {selectedDifficulties.map((item, idx) => {
                const category = getCategoryFromTitle(item.title, viewModel);
                const categoryStyle = category ? CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES] : null;
                
                return (
                  <li key={idx} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                                          {categoryStyle && (
                      <div 
                        className="flex items-center gap-3 mb-2 w-full px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: categoryStyle.bgColor }}
                      >
                        <span className="text-lg">{categoryStyle.icon}</span>
                        <span className="text-gray-700 text-lg font-medium">{item.title}</span>
                      </div>
                    )}
                    </div>
                    {categoryStyle && (
                      <div className="text-sm text-gray-500 mb-3 ml-3">
                        カテゴリ: {category}
                      </div>
                    )}
                  <ul className="space-y-4 ml-4 border-l-2 border-gray-200 pl-3">
                    {getAccommodations(item.title, viewModel, selectedDomain).map((acc: any, accIdx: number) => (
                      <li key={accIdx} className="relative">
                        <div className="flex items-start gap-2">
                          <span className="text-gray-700 font-medium flex-shrink-0 whitespace-nowrap">
                            配慮案{ACC_LABELS[accIdx % ACC_LABELS.length]}:
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="text-gray-700">{acc['配慮案タイトル'] || acc.description}</span>
                              <button
                                onClick={() => openModal(`${acc['配慮案タイトル'] || acc.description}の具体的な配慮案`, acc['詳細説明'] || '')}
                                className="ml-3 text-indigo-600 hover:text-indigo-800 text-lg transition-colors flex-shrink-0"
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
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
            </ul>

          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">合意形成のポイント</h3>
            <ul className="space-y-2">
              {points.map((point, i) => (
                <li key={i} className="text-gray-700">・{point}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleCopyToClipboard}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow hover:bg-gray-100 transition"
          >
            自分のメモに追加
          </button>
        </div>
        
        <div className="text-xs text-gray-400 mt-2 text-center">
          ※支援者に渡す前に、自分でもメモに残しておくと安心です
        </div>
        
                 <div className="flex flex-col gap-3 mt-6">
           <button
             onClick={onRestart}
             className="w-full px-8 py-4 rounded-full bg-indigo-500 text-white font-semibold text-lg shadow hover:bg-indigo-600 transition"
           >
             最初からやり直す
           </button>
           <button
             onClick={onBack}
             className="w-full px-8 py-4 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold text-lg shadow hover:bg-gray-100 transition"
           >
             前のページに戻る
           </button>
         </div>
      </div>
    );
  }

  // PC版UI（既存のまま）
  return (
    <div className="max-w-3xl mx-auto py-10">
      {renderModal()}
      {/* 説明文 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">
          <strong>配慮案を確認しましょう。</strong><br />
これは、支援を進めるための調整マニュアルです。<span className="text-indigo-600">▶</span>で詳細を確認できます。
        </p>
      </div>
      
      <div>
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4">配慮依頼案</h3>
          <ul className="space-y-6">
            {!viewModel ? (
              <li className="text-center text-gray-500 py-8">
                データを読み込み中...
              </li>
            ) : (
              selectedDifficulties.map((item, idx) => {
                const category = getCategoryFromTitle(item.title, viewModel);
                const categoryStyle = category ? CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES] : null;
              
              return (
                <li key={idx} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    {categoryStyle && (
                      <div 
                        className="flex items-center gap-3 mb-2 w-full px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: categoryStyle.bgColor }}
                      >
                        <span className="text-lg">{categoryStyle.icon}</span>
                        <span className="text-gray-700 text-lg font-medium">{item.title}</span>
                      </div>
                    )}
                  </div>
                  {categoryStyle && (
                    <div className="text-sm text-gray-500 mb-3 ml-3">
                      カテゴリ: {category}
                    </div>
                  )}
                <ul className="space-y-4 ml-6 border-l-2 border-gray-200 pl-4">
                  {getAccommodations(item.title, viewModel, selectedDomain).map((acc: any, accIdx: number) => (
                    <li key={accIdx} className="relative">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-700 font-medium flex-shrink-0 whitespace-nowrap">
                          配慮案{ACC_LABELS[accIdx % ACC_LABELS.length]}:
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-gray-700">{acc['配慮案タイトル'] || acc.description}</span>
                            <button
                              onClick={() => openModal(`${acc['配慮案タイトル'] || acc.description}の具体的な配慮案`, acc['詳細説明'] || '')}
                              className="ml-3 text-indigo-600 hover:text-indigo-800 text-lg transition-colors flex-shrink-0"
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
                        </div>

                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })
            )}
          </ul>

        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">合意形成のポイント</h3>
          <ul className="space-y-2">
            {points.map((point, i) => (
              <li key={i} className="text-gray-700">・{point}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-4 mb-4 justify-center">
        <button
          onClick={handleDownloadPDF}
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow hover:bg-gray-100 transition text-center cursor-pointer"
        >
          PDFをダウンロード
        </button>
        <button
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 bg-gray-200 text-gray-400 font-medium shadow cursor-not-allowed transition"
          disabled
        >
          メールで共有（未実装）
        </button>
        <button
          onClick={handleCopyToClipboard}
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow hover:bg-gray-100 transition"
        >
          自分のメモに追加
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-2 flex justify-end">
        ※支援者に渡す前に、自分でもメモに残しておくと安心です
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={onRestart}
          className="px-8 py-3 rounded-full bg-indigo-500 text-white font-semibold text-lg shadow hover:bg-indigo-600 transition disabled:bg-gray-300 disabled:text-gray-400"
        >
          最初からやり直す
        </button>
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold text-lg shadow hover:bg-gray-100 transition"
        >
          前のページに戻る
        </button>
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
                  <span className="text-indigo-600 mr-2 mt-1">•</span>
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