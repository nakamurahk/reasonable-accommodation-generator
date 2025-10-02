import React, { useState } from 'react';
import HelpModal from './HelpModal';

interface MobileHeaderProps {
  currentStep: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ currentStep }) => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const helpContent = {
    'step1-1': {
      title: '特性を選ぶ',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              あなたの特性を選択することで、より適切なサポートを見つけることができます。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 複数の特性を選択できます</li>
              <li>• 当てはまる特性をすべて選択してください</li>
              <li>• 選択後、「次のステップへ」ボタンで進みます</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <p className="text-gray-600 text-sm">
              迷った場合は、現在の状況で最も当てはまる特性を選んでください。後から変更することも可能です。
            </p>
          </div>
        </div>
      )
    },
    'step1-2': {
      title: '環境を選ぶ',
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
      title: 'シチュエーションを選ぶ',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              困りごとが発生する具体的なシチュエーションを選択します。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 複数のシチュエーションを選択できます</li>
              <li>• 「全部選択する」ボタンで一括選択も可能</li>
              <li>• 当てはまるシチュエーションをすべて選択してください</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <p className="text-gray-600 text-sm">
              選択したシチュエーションが多いほど、より具体的なサポート案が生成されます。
            </p>
          </div>
        </div>
      )
    },
    'thinking': {
      title: '困りごとカードを集める',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 このステップの目的</h4>
            <p className="text-gray-600 text-sm">
              あなたの困りごとに関連するカードを集めて、困りごとの地図を作成します。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 使い方</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 関連するカードをタップして選択</li>
              <li>• 選択したカードはコレクションに追加</li>
              <li>• グラフビューで関連性を確認できます</li>
              <li>• コレクションから不要なカードを削除可能</li>
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
      title: '困りごとを絞り込む',
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
              環境において困る頻度が高いものを優先して選択してください。
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
        return 'ステップ①：特性を選ぶ';
      case 'step1-2':
        return 'ステップ①：環境を選ぶ';
      case 'step1-3':
        return 'ステップ①：シチュエーションを選ぶ';
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
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <p className="text-base font-medium text-gray-700">
            {getPageTitle(currentStep)}
          </p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="ml-4 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-lg hover:bg-teal-600 transition-colors"
          title="ヘルプ"
        >
          ?
        </button>
        </div>
        
        {/* プログレスインジケーター */}
        <div className="flex items-center justify-center space-x-1 mt-3">
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
            
            return (
              <React.Fragment key={step}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                  isCompleted 
                    ? 'bg-teal-500 border-teal-500 text-white' 
                    : isCurrent 
                    ? 'bg-teal-100 border-teal-500 text-teal-700'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-4 h-0.5 ${
                    isCompleted ? 'bg-teal-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
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
