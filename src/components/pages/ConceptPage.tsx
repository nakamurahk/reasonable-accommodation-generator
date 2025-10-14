import React from 'react';
import { Link } from 'react-router-dom';
import CommonHeader from '../layout/CommonHeader';
import CommonFooter from '../layout/CommonFooter';

const ConceptPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <CommonHeader />

      {/* Concept Banner */}
      <section className="py-20" style={{ backgroundColor: '#14b8a6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Concept - InclusiBridgeが目指すもの
          </h1>
          <p className="text-xl text-white">
            配慮を言語化できる社会をつくる
          </p>
        </div>
      </section>

      {/* Main Value Proposition */}
      <section className="py-20 bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#14b8a6' }}>
            配慮を「<span className="text-teal-700">属人的対応</span>」から「<span className="text-teal-700">構造的知識</span>」に転換する
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-700">
            <p className="text-lg">
              InclusiBridge は、困りごと+配慮を構造化・可視化するプラットフォームです。
            </p>
            <p className="text-lg">
              障害や特性のある人が「自分の困りごと」を言語化できず、支援者が「何をすべきか」を判断できない―――この問題を解決します。
            </p>
            <p className="text-lg">
              データベース + AI の力で、配慮を「共通言語」に。当事者と支援者が対等に、必要なサポートを作り上げることができる社会を目指しています。
            </p>
          </div>
        </div>
      </section>

      {/* Challenges and Solutions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">課題と解決</h2>
          
          {/* Current Challenges */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <span className="text-2xl mr-2">🚫</span>
              <h3 className="text-xl" style={{ color: '#f56565' }}>現在の課題</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-red-300 p-6 rounded-lg">
                <h4 className="text-lg font-bold mb-3" style={{ color: '#f56565' }}>困りごとが可視化されない</h4>
                <p className="text-gray-700">
                  当事者が「何に困っているのか」を明確に言語化できず、企業や学校は対応すべき配慮が不明確。
                </p>
              </div>
              <div className="border-2 border-red-300 p-6 rounded-lg">
                <h4 className="text-lg font-bold mb-3" style={{ color: '#f56565' }}>配慮が属人的になる</h4>
                <p className="text-gray-700">
                  支援者の経験や「勘」に依存。一貫性がなく、転職・転校で配慮がリセットされることも。
                </p>
              </div>
              <div className="border-2 border-red-300 p-6 rounded-lg">
                <h4 className="text-lg font-bold mb-3" style={{ color: '#f56565' }}>対等な合意が難しい</h4>
                <p className="text-gray-700">
                  「提供してもらう」という受動的関係になりやすく、当事者の主体性が失われることがある。
                </p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-16">
            <div className="text-4xl" style={{ color: '#14b8a6' }}>⬇️</div>
          </div>

          {/* InclusiBridge Solutions */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <span className="text-2xl mr-2">✅</span>
              <h3 className="text-xl" style={{ color: '#14b8a6' }}>InclusiBridge の解決策</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-green-300 p-6 rounded-lg">
                <h4 className="text-lg font-bold mb-3" style={{ color: '#14b8a6' }}>困りごとを構造化</h4>
                <p className="text-gray-700">
                  2万近いデータセルで、当事者の困りごとを整理・可視化。「自分の課題が何か」が明確になります。
                </p>
              </div>
              <div className="border-2 border-green-300 p-6 rounded-lg">
                <h4 className="text-lg font-bold mb-3" style={{ color: '#14b8a6' }}>配慮を共通言語に</h4>
                <p className="text-gray-700">
                  困りごと×配慮のマトリックスで、誰でも一貫した対応ができるように。転職・転校後も情報が引き継がれます。
                </p>
              </div>
              <div className="border-2 border-green-300 p-6 rounded-lg">
                <h4 className="text-lg font-bold mb-3" style={{ color: '#14b8a6' }}>当事者が主体的に選択</h4>
                <p className="text-gray-700">
                  当事者がアプリで自分に必要な配慮を探し、企業や支援者と「対等に合意」できる仕組みを実現します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Core Values</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">当事者ファースト</h3>
              <p className="text-gray-700">
                当事者向けのサービスは完全無料。全ての当事者に等しく価値を提供します。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">インクルーシブ性</h3>
              <p className="text-gray-700">
                身体・知的・精神・発達などすべての障害に対応。誰一人取り残さない社会を。（現在は、精神・発達に特化）
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20" style={{ backgroundColor: '#14b8a6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            一緒に「配慮を言語化できる社会」をつくりませんか？
          </h2>
          <p className="text-xl text-white mb-8">
            当事者からの声、フィードバック、いつでもお待ちしています。
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            お問い合わせ
          </Link>
        </div>
      </section>

      <CommonFooter />
    </div>
  );
};

export default ConceptPage;