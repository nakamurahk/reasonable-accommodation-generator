import React from 'react';
import { Link } from 'react-router-dom';
import CommonHeader from '../layout/CommonHeader';
import CommonFooter from '../layout/CommonFooter';

const ConceptPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <CommonHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              コンセプト
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              「配慮を言語化する」というミッションのもと、合理的配慮の設計と合意形成を支援
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">現状の課題</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-xl">❌</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">困りごとの言語化が困難</h3>
                    <p className="text-gray-600">当事者が自分の困りごとを具体的に説明することが難しい</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-xl">❌</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">配慮案の検討が不十分</h3>
                    <p className="text-gray-600">支援者が適切な配慮案を提案・検討する仕組みが不足</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-xl">❌</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">合意形成のプロセスが不明確</h3>
                    <p className="text-gray-600">当事者と支援者間での効果的な対話と合意形成が困難</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-xl">
              <div className="text-6xl mb-4">😰</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">現状の課題</h3>
              <p className="text-gray-700 mb-4">
                合理的配慮の実現には、当事者と支援者の双方が課題を抱えています。
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 困りごとの言語化</li>
                <li>• 配慮案の検討</li>
                <li>• 合意形成のプロセス</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">InclusiBridgeの解決策</h2>
            <p className="text-xl text-gray-600">3つのステップで合理的配慮を実現</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. 困りごとを探す</h3>
              <p className="text-gray-600 mb-4">
                構造化された質問を通じて、当事者の困りごとを段階的に言語化します。
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 特性の特定</li>
                <li>• 領域の選択</li>
                <li>• 状況の整理</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. 配慮案を見つける</h3>
              <p className="text-gray-600 mb-4">
                データベース化された配慮案から、困りごとに最適な解決策を提案します。
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• データベース検索</li>
                <li>• カスタマイズ</li>
                <li>• 優先順位付け</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. 相談を準備する</h3>
              <p className="text-gray-600 mb-4">
                上司や支援者との対話に必要な情報を整理し、効果的な相談をサポートします。
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 資料の生成</li>
                <li>• 対話の準備</li>
                <li>• 合意形成の支援</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">プロセス</h2>
            <p className="text-xl text-gray-600">InclusiBridgeの利用フロー</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-teal-200 transform -translate-y-1/2"></div>
            <div className="grid md:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">特性選択</h3>
                <p className="text-sm text-gray-600">自分の特性を選択</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">領域選択</h3>
                <p className="text-sm text-gray-600">対象領域を選択</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">状況整理</h3>
                <p className="text-sm text-gray-600">具体的な状況を整理</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="font-semibold text-gray-900 mb-2">配慮案選択</h3>
                <p className="text-sm text-gray-600">適切な配慮案を選択</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">5</div>
                <h3 className="font-semibold text-gray-900 mb-2">資料生成</h3>
                <p className="text-sm text-gray-600">相談用資料を生成</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">期待される効果</h2>
            <p className="text-xl text-teal-100 mb-12">InclusiBridgeがもたらす変化</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-white mb-4">効率化</h3>
              <p className="text-teal-100">
                合理的配慮の検討時間を大幅に短縮し、より多くの人に支援を提供
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-4">精度向上</h3>
              <p className="text-teal-100">
                データに基づいた配慮案により、より適切で効果的な支援を実現
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-white mb-4">合意形成</h3>
              <p className="text-teal-100">
                当事者と支援者間の対話を促進し、双方が納得できる合意を形成
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            合理的配慮の実現を、今から始めませんか？
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            InclusiBridgeで、あなたの困りごとを整理し、必要な配慮を見つけましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/app" 
              className="bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              アプリを試す
            </Link>
            <Link 
              to="/contact" 
              className="border border-teal-600 text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>

      <CommonFooter />
    </div>
  );
};

export default ConceptPage;
