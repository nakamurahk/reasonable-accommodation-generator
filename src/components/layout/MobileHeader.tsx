import React, { useState } from 'react';
import HelpModal from './HelpModal';

interface MobileHeaderProps {
  currentStep: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ currentStep }) => {
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
  const getPageTitle = (step: string) => {
    switch (step) {
      case 'step1-1':
        return '旅の準備';
      case 'step1-2':
        return '旅の舞台';
      case 'step1-3':
        return '旅の場面';
      case 'thinking':
        return 'ステップ②：探索（困りごとカードを集める）';
      case 'deckbuilding':
        return 'ステップ③：選抜（困りごとを絞り込む）';
      case 'finalselection':
        return 'ステップ④：決定（最重要の困りごとを決める）';
      case 'display':
        return 'ステップ⑤：確認（配慮案を見る）';
      default:
        return '';
    }
  };

  const getHelpContent = () => {
    return helpContent[currentStep as keyof typeof helpContent] || {
      title: 'ヘルプ',
      content: <p className="text-gray-600 text-sm">この画面のヘルプ情報は準備中です。</p>
    };
  };

  return (
    <div className="bg-sand border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-center relative">
        {/* プログレスインジケーター */}
        <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((step) => {
              // ステップ1の進捗状況を判定（ステップ②のロジックを参考）
              const isStep1Completed = 
                (currentStep === 'thinking' && step === 1) ||
                (currentStep === 'deckbuilding' && step === 1) ||
                (currentStep === 'finalselection' && step === 1) ||
                (currentStep === 'display' && step === 1);
              
              const isStep1Current = 
                (currentStep === 'step1-1' && step === 1) ||
                (currentStep === 'step1-2' && step === 1) ||
                (currentStep === 'step1-3' && step === 1);
              
              // 他のステップの進捗状況
              const isOtherStepCompleted = 
                (currentStep === 'deckbuilding' && step <= 2) ||
                (currentStep === 'finalselection' && step <= 3) ||
                (currentStep === 'display' && step <= 4);
              
              const isOtherStepCurrent = 
                (currentStep === 'thinking' && step === 2) ||
                (currentStep === 'deckbuilding' && step === 3) ||
                (currentStep === 'finalselection' && step === 4) ||
                (currentStep === 'display' && step === 5);
              
              const isCompleted = isStep1Completed || isOtherStepCompleted;
              const isCurrent = isStep1Current || isOtherStepCurrent;
              
              const titles = ['出発', '探索', '選抜', '決定', '確認'];
              
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center space-y-1">
                    {/* タイトル */}
                    <div className="text-xs font-medium text-gray-600 w-7 text-center">
                      {titles[step - 1]}
                    </div>
                    {/* 数字 */}
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 border-teal-500 text-white shadow-lg' 
                        : isCurrent 
                        ? 'bg-gradient-to-br from-teal-100 to-teal-200 border-teal-500 text-teal-700 shadow-md'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? '✓' : step}
                    </div>
                  </div>
                  {step < 5 && (
                    <div className={`w-4 h-1 rounded-full transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-teal-500 to-teal-400 shadow-sm' 
                        : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* ヘルプボタン */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="absolute right-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-lg hover:bg-teal-600 transition-colors"
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
      </div>
  );
};

export default MobileHeader;
