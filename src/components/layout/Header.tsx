import React, { useState } from 'react';
import HelpModal from './HelpModal';

interface HeaderProps {
  currentStep?: string;
}

const Header: React.FC<HeaderProps> = ({ currentStep = 'initial' }) => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const helpContent = {
    'step1-1': {
      title: 'あなたの特性を選ぶ',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              あなたの特性を選択することで、よくある困りごとをリストアップできます。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 当てはまる特性をすべて選択してください</li>
              <li>• 選択後、「次のステップへ」ボタンで進みます</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <p className="text-gray-600 text-sm">
              迷った場合は、現在の状況で当てはまる特性をすべて選んでください。
            </p>
          </div>
        </div>
      )
    },
    'step1-2': {
      title: 'サポートが必要な『環境』は？',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              あなたが合理的配慮を調整したい環境を選択することで、具体的なシチュエーションが表示されます。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 1つの環境のみ選択できます</li>
              <li>• 合理的配慮を調整したい環境を選んでください</li>
              <li>• 選択後、「次のステップへ」ボタンで進みます</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <p className="text-gray-600 text-sm">
              環境調整（クローズでそれとなく周囲に伝える）したい環境を選んでも大丈夫です。
            </p>
          </div>
        </div>
      )
    },
    'step1-3': {
      title: '困りごとが起きやすい状況は？',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              困りごとが発生する具体的なシーンを選択します。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 複数のシーンを選択できます</li>
              <li>• 「すべて選択する」ボタンで一括選択も可能</li>
              <li>• 当てはまるシーンをすべて選択してください</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <p className="text-gray-600 text-sm">
              選択したシーンが多いほど、多くの困りごとリストが生成されます。
            </p>
          </div>
        </div>
      )
    },
    'thinking': {
      title: 'あなたの困りごとを探そう',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              あなたの困りごとに関連するカードを集めて、困りごとをざっくり把握します。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• キーワードかカテゴリから、困りごとカードを選択</li>
              <li>• 選択したカードは右下のカードの束から確認可能</li>
              <li>• グラフ表示で関連性を確認できます</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <p className="text-gray-600 text-sm">
              迷った場合、最初は多めに選んでOKです。次のステップで重要なものに絞り込みます。
            </p>
          </div>
        </div>
      )
    },
    'deckbuilding': {
      title: '大事な困りごとを選ぼう',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              集めたカードから、重要な困りごとを最大10個に選別します。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• カードプールから重要なカードを選択</li>
              <li>• 選択したカードは下側のデッキに移動</li>
              <li>• デッキからカードプールに戻すことも可能</li>
              <li>• 最終的に最大10枚までに絞り込む</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <p className="text-gray-600 text-sm">
              環境において困る頻度が高いものや、自分では対処が難しいものを優先して選択してください。
            </p>
          </div>
        </div>
      )
    },
    'finalselection': {
      title: '最重要の困りごとを決める',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              選別した困りごとの中から、最も重要な3つを決定します。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 最も重要だと思う困りごとを3つ選択</li>
              <li>• 選択後、「次のステップへ」ボタンで進みます</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <p className="text-gray-600 text-sm">
              自分の努力ではどうしようもないため、合理的配慮を調整したい困りごとを選んで下さい。
            </p>
          </div>
        </div>
      )
    },
    'display': {
      title: '配慮案を確認する',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              選択した困りごとに基づいて生成された配慮案を確認し、必要に応じてAIプロンプトを作成します。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 各配慮案（A、B、C）から最適なものを選択</li>
              <li>• 「AIプロンプト生成」で依頼文を作成</li>
              <li>• 「自分のメモに追加」でメモアプリに保存</li>
              <li>• PDFダウンロードで資料として保存</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <p className="text-gray-600 text-sm">
              複数の配慮案を組み合わせて使用することも可能です。上司や先生に相談する際は、AIプロンプトで作成した依頼文を参考にしてください。
            </p>
          </div>
        </div>
      )
    }
  };
       const steps = [
         { id: 'step1-1', title: '旅の準備', short: '①' },
         { id: 'step1-2', title: '旅の舞台', short: '①' },
         { id: 'step1-3', title: '旅の場面', short: '①' },
         { id: 'thinking', title: '探索', short: '②' },
         { id: 'deckbuilding', title: '選抜', short: '③' },
         { id: 'finalselection', title: '決定', short: '④' },
         { id: 'display', title: '確認', short: '⑤' },
       ];

  // ステップ1の進捗状況を判定（ステップ②のロジックを参考）
  const isStep1Completed = 
    currentStep === 'thinking' ||
    currentStep === 'deckbuilding' ||
    currentStep === 'finalselection' ||
    currentStep === 'display';
  
  const isStep1Current = 
    currentStep === 'step1-1' ||
    currentStep === 'step1-2' ||
    currentStep === 'step1-3';

  const getHelpContent = () => {
    return helpContent[currentStep as keyof typeof helpContent] || {
      title: 'ヘルプ',
      content: <p className="text-gray-600 text-sm">この画面のヘルプ情報は準備中です。</p>
    };
  };

  return (
    <header className="w-full bg-sand shadow flex items-center justify-between px-4 py-3 relative z-10">
      <div className="flex items-center space-x-3">
        {/* ロゴ部分 */}
        <div className="flex flex-col items-center">
          {/* ブリッジグラフィック */}
          <div className="relative w-12 h-8">
            <svg viewBox="0 0 60 30" className="w-full h-full">
              {/* メインアーチ */}
              <path d="M10 20 Q30 5 50 20" stroke="url(#bridgeGradient)" strokeWidth="2" fill="none"/>
              {/* 垂直サポート */}
              <line x1="15" y1="20" x2="15" y2="15" stroke="url(#bridgeGradient)" strokeWidth="1.5"/>
              <line x1="25" y1="20" x2="25" y2="12" stroke="url(#bridgeGradient)" strokeWidth="1.5"/>
              <line x1="35" y1="20" x2="35" y2="12" stroke="url(#bridgeGradient)" strokeWidth="1.5"/>
              <line x1="45" y1="20" x2="45" y2="15" stroke="url(#bridgeGradient)" strokeWidth="1.5"/>
              {/* サポートの上部円 */}
              <circle cx="15" cy="15" r="1.5" fill="url(#bridgeGradient)"/>
              <circle cx="25" cy="12" r="1.5" fill="url(#bridgeGradient)"/>
              <circle cx="35" cy="12" r="1.5" fill="url(#bridgeGradient)"/>
              <circle cx="45" cy="15" r="1.5" fill="url(#bridgeGradient)"/>
              {/* 波線 */}
              <path d="M5 25 Q15 22 25 25 T45 25" stroke="url(#bridgeGradient)" strokeWidth="1" fill="none" opacity="0.6"/>
              <path d="M8 27 Q18 24 28 27 T48 27" stroke="url(#bridgeGradient)" strokeWidth="1" fill="none" opacity="0.4"/>
              <defs>
                <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6"/>
                  <stop offset="50%" stopColor="#14B8A6"/>
                  <stop offset="100%" stopColor="#10B981"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* テキスト */}
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-800 hidden sm:block">
              <span className="text-gray-800">Inclus</span>
              <span className="text-blue-500 relative">
                i
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full"></span>
              </span>
              <span className="text-gray-800">Bridge</span>
            </span>
            <span className="text-lg font-bold text-gray-800 sm:hidden">
              <span className="text-gray-800">Inclus</span>
              <span className="text-blue-500 relative">
                i
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full"></span>
              </span>
              <span className="text-gray-800">Bridge</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* ヘルプボタンのみ */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowHelpModal(true)}
          className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-lg hover:bg-teal-600 transition-colors"
          title="ヘルプ"
        >
          ?
        </button>
      </div>
      
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title={getHelpContent().title}
        content={getHelpContent().content}
      />
    </header>
  );
};

export default Header; 