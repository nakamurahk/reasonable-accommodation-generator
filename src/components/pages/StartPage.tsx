import React, { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface StartPageProps {
  onStart: () => void;
}

const StartPage: React.FC<StartPageProps> = ({ onStart }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const isMobile = useIsMobile();

  const handleStart = () => {
    if (isAgreed) {
      onStart();
    }
  };

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-4">
      <div className={`${isMobile ? 'w-full max-w-md' : 'w-full max-w-2xl'} bg-white rounded-2xl shadow-xl overflow-hidden`}>
        {/* ヘッダー */}
        <div className="bg-teal-500 text-white p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">合理的配慮ジェネレーター</h1>
          <p className="text-teal-100 text-sm">あなたの困りごとから配慮案を生成するツール</p>
        </div>

        {/* メインコンテンツ */}
        <div className="p-6 space-y-6">
          {/* プロダクトの目的 */}
          <div className="bg-light-sand border border-teal-500 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">🎯 このツールの目的</h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p>このツールは、あなたの困りごとを整理し、職場や学校で必要な配慮を具体的に提案することを目的としています。</p>
              <p>以下のステップで進めていきます：</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>🎯 特性・環境・シチュエーションを選択</li>
                <li>🔍 困りごとを具体的に特定</li>
                <li>✨ 重要な困りごとを選別</li>
                <li>🛠️ 配慮案を生成</li>
                <li>🤖 AIプロンプトで依頼文を作成</li>
              </ul>
            </div>
          </div>

               {/* 利用規約・プライバシーポリシー */}
               <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                 <div className="space-y-2">
                   <a
                     href="#"
                     className="block text-teal-500 hover:text-teal-600 text-sm underline"
                     onClick={(e) => {
                       e.preventDefault();
                       setShowTermsModal(true);
                     }}
                   >
                     利用規約を確認する →
                   </a>
                   <a
                     href="#"
                     className="block text-teal-500 hover:text-teal-600 text-sm underline"
                     onClick={(e) => {
                       e.preventDefault();
                       setShowPrivacyModal(true);
                     }}
                   >
                     プライバシーポリシーを確認する →
                   </a>
                 </div>
               </div>

          {/* 同意チェックボックス */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreement"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="agreement" className="text-sm text-gray-700">
              利用規約とプライバシーポリシーに同意し、このツールを利用することを承諾します
            </label>
          </div>

          {/* PLAYボタン */}
          <div className="pt-4">
            <button
              onClick={handleStart}
              disabled={!isAgreed}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                isAgreed
                  ? 'bg-teal-500 text-white hover:bg-teal-600 hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAgreed ? '🎮 スタート' : '同意にチェックを入れてください'}
            </button>
          </div>

          {/* 注意事項 */}
          <div className="text-xs text-gray-500 text-center">
            <p>⚠️ このツールで生成される配慮案は参考情報です。</p>
            <p>実際の配慮については、専門家や関係者とご相談ください。</p>
          </div>
        </div>
      </div>

      {/* 利用規約モーダル */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* モーダルヘッダー */}
            <div className="bg-teal-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">利用規約</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-white hover:text-teal-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* モーダルコンテンツ */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6 text-sm">
                <p>
                  この利用規約（以下「本規約」）は、合理的配慮ジェネレータ（以下「本ツール」）の利用条件を定めるものです。利用者は、本ツールを利用することにより、本規約に同意したものとみなします。
                </p>

                <div>
                  <h3 className="font-bold text-base mb-2">第1条（適用）</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>本規約は、利用者と本ツール提供者との間の一切の関係に適用されます。</li>
                    <li>本規約に同意いただけない場合、本ツールを利用することはできません。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第2条（利用環境）</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>利用者は、自らの責任と費用で本ツールを利用するために必要な通信機器・環境を整備するものとします。</li>
                    <li>通信費等の費用はすべて利用者が負担するものとします。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第3条（禁止事項）</h3>
                  <p className="mb-2">利用者は、本ツールの利用にあたり、以下の行為をしてはなりません。</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>法令または公序良俗に違反する行為</li>
                    <li>他者の権利を侵害する行為</li>
                    <li>本ツールの運営を妨害する行為</li>
                    <li>不正アクセスや不正利用を試みる行為</li>
                    <li>本ツールを商業目的で無断利用する行為</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第4条（免責事項）</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>本ツールは、合理的配慮に関する理解や調整の補助を目的とするものであり、<span className="font-bold">医学的助言、法律的助言、労務上の正式判断を提供するものではありません。</span></li>
                    <li>本ツールの内容はあくまで参考情報であり、企業・学校・支援機関等における合意形成や法的効力を保証するものではありません。</li>
                    <li>本ツールの利用によって生じた一切の損害（精神的・身体的・経済的損害を含むがこれに限らない）について、提供者は責任を負いません。</li>
                    <li>提供者は、本ツールの内容や提供方法を予告なく変更・中止する場合があり、それに伴って利用者に損害が生じても責任を負いません。</li>
                    <li>利用者は、本ツールを利用するにあたり、<span className="font-bold">最終的な判断や責任は自己にあることを承諾するものとします。</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第5条（収集データの取り扱い）</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>本ツールは、利用者の入力データや選択内容を匿名化して収集・分析する場合があります。</li>
                    <li>任意で回答いただくアンケート情報は、機能改善や研究開発の目的で利用されます。</li>
                    <li>収集データの詳細については、別途定める「プライバシーポリシー」に従うものとします。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第6条（知的財産権）</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>本ツールに関する著作権、商標権その他の知的財産権は、提供者に帰属します。</li>
                    <li>利用者は、本ツールを私的利用の範囲内で使用することができます。無断での複製、転載、配布は禁止します。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第7条（規約の変更）</h3>
                  <p>提供者は、必要と判断した場合、利用者に通知することなく本規約を変更できるものとします。変更後の規約は、本ツール上に掲示された時点で効力を生じます。</p>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第8条（準拠法）</h3>
                  <p>本規約は、日本法に準拠し解釈されるものとします。</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-right">制定日：2025年10月2日</p>
                </div>
              </div>
            </div>
            
            {/* モーダルフッター */}
            <div className="bg-gray-50 p-4 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* プライバシーポリシーモーダル */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* モーダルヘッダー */}
            <div className="bg-teal-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">プライバシーポリシー</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-white hover:text-teal-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* モーダルコンテンツ */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6 text-sm">
                <p>
                  本プライバシーポリシーは、合理的配慮ジェネレータ（以下「本ツール」）における利用者の情報の取り扱いについて定めるものです。利用者は、本ツールを利用することで、本ポリシーに同意したものとみなします。
                </p>

                <div>
                  <h3 className="font-bold text-base mb-2">第1条（収集する情報）</h3>
                  <p className="mb-2">本ツールは、以下の情報を収集する場合があります。</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>利用時に入力された「困りごと」や「選択内容」等のデータ（匿名化された形で保存・分析されます）</li>
                    <li>任意で回答いただくアンケート情報（操作評価・改善要望等）</li>
                  </ul>
                  <p className="mt-2 text-gray-600">※本ツールは、氏名・住所・連絡先などの直接的な個人情報を収集しません。</p>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第2条（利用目的）</h3>
                  <p className="mb-2">収集した情報は、以下の目的で利用します。</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>本ツールの機能改善および利用状況の分析</li>
                    <li>匿名統計データの作成（個人を特定できない形式で利用）</li>
                    <li>本ツールの品質向上に必要な研究・開発目的</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第3条（アンケートに関する補足）</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>アンケートは任意回答であり、未回答による不利益はありません。</li>
                    <li>アンケートにはGoogleフォームを利用する場合があり、その際はGoogleのプライバシーポリシーも適用されます。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第4条（第三者提供）</h3>
                  <p className="mb-2">利用者の同意なく、収集した情報を第三者に提供することはありません。</p>
                  <p>ただし、法令に基づく場合、または人の生命・身体・財産の保護のために必要な場合はこの限りではありません。</p>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第5条（データの管理）</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>収集した情報は、適切なセキュリティ対策を講じて管理します。</li>
                    <li>利用者を特定できる形式で保存することはありません。</li>
                    <li>保存期間は目的達成に必要な範囲内とし、不要になった情報は速やかに削除します。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第6条（Cookie等の利用）</h3>
                  <p>本ツールは、利用状況の把握や利便性向上のため、Cookieや類似技術を利用する場合があります。</p>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第7条（ポリシーの変更）</h3>
                  <p>本ポリシーの内容は、利用者に通知することなく変更される場合があります。変更後のポリシーは、本ツール上に掲示された時点で効力を生じるものとします。</p>
                </div>

                <div>
                  <h3 className="font-bold text-base mb-2">第8条（お問い合わせ）</h3>
                  <p>本ポリシーに関するお問い合わせは、本ツール提供者までご連絡ください。</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-right">制定日：2025年10月2日</p>
                </div>
              </div>
            </div>
            
            {/* モーダルフッター */}
            <div className="bg-gray-50 p-4 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartPage;
